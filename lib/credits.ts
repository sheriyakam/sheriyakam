import prisma from './prisma';

export type ActionType = 'tailor' | 'ats_check' | 'cover_letter' | 'refinement';
export type PackType = 'free' | 'lite' | 'active_search';

export interface ActionQuotaConfig {
  limit: number;
  windowMs: number; // 5 hours for tailor/ats_check/cover_letter, 24 hours for refinement
}

export const QUOTA_CONFIGS: Record<ActionType, ActionQuotaConfig> = {
  tailor: { limit: 3, windowMs: 5 * 60 * 60 * 1000 },
  ats_check: { limit: 5, windowMs: 5 * 60 * 60 * 1000 },
  cover_letter: { limit: 5, windowMs: 5 * 60 * 60 * 1000 },
  refinement: { limit: 15, windowMs: 24 * 60 * 60 * 1000 },
};

export const PACK_CREDITS: Record<'lite' | 'active_search', { credits: number; daysValid: number; priceUsd: number; priceInr: number }> = {
  lite: { credits: 25, daysValid: 30, priceUsd: 2, priceInr: 165 },
  active_search: { credits: 75, daysValid: 30, priceUsd: 5, priceInr: 415 },
};

// In-memory sliding window store for offline / dev / tests
interface MemoryUsageLog {
  userId: string;
  actionType: ActionType;
  packType: PackType;
  consumedAt: number;
}

interface MemoryPaidPack {
  id: string;
  userId: string;
  packType: 'lite' | 'active_search';
  creditsLeft: number;
  expiresAt: number;
}

const memoryUsageLogs: MemoryUsageLog[] = [];
const memoryPaidPacks: MemoryPaidPack[] = [];

/**
 * Format milliseconds into human-readable duration e.g. "3h 42m" or "14m"
 */
export function formatDuration(ms: number): string {
  if (ms <= 0) return 'now';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${Math.max(1, minutes)}m`;
}

/**
 * Get comprehensive credit and quota status for a user
 */
export async function getCreditStatus(userId = 'anon_guest') {
  const now = Date.now();

  let paidPacks: { id: string; packType: string; creditsLeft: number; expiresAt: Date }[] = [];
  let usageLogs: { actionType: string; packType: string; consumedAt: Date }[] = [];

  try {
    if (prisma && prisma.creditBalance) {
      paidPacks = await prisma.creditBalance.findMany({
        where: {
          userId,
          creditsLeft: { gt: 0 },
          expiresAt: { gt: new Date(now) }
        },
        orderBy: { expiresAt: 'asc' }
      }) as any;

      const oldestWindow = new Date(now - 24 * 60 * 60 * 1000);
      usageLogs = await prisma.creditUsage.findMany({
        where: {
          userId,
          packType: 'free',
          consumedAt: { gt: oldestWindow }
        }
      }) as any;
    }
  } catch (err: any) {
    // Fall back to memory store
    paidPacks = memoryPaidPacks
      .filter((p) => p.userId === userId && p.creditsLeft > 0 && p.expiresAt > now)
      .sort((a, b) => a.expiresAt - b.expiresAt)
      .map((p) => ({
        id: p.id,
        packType: p.packType,
        creditsLeft: p.creditsLeft,
        expiresAt: new Date(p.expiresAt)
      }));

    usageLogs = memoryUsageLogs
      .filter((l) => l.userId === userId && l.packType === 'free' && l.consumedAt > now - 24 * 60 * 60 * 1000)
      .map((l) => ({
        actionType: l.actionType,
        packType: l.packType,
        consumedAt: new Date(l.consumedAt)
      }));
  }

  // Calculate free tier remaining and next unlock timestamps
  const freeStatus: Record<ActionType, { remaining: number; limit: number; nextUnlockMs: number; nextUnlockFormatted: string }> = {
    tailor: { remaining: 3, limit: 3, nextUnlockMs: 0, nextUnlockFormatted: 'now' },
    ats_check: { remaining: 5, limit: 5, nextUnlockMs: 0, nextUnlockFormatted: 'now' },
    cover_letter: { remaining: 5, limit: 5, nextUnlockMs: 0, nextUnlockFormatted: 'now' },
    refinement: { remaining: 15, limit: 15, nextUnlockMs: 0, nextUnlockFormatted: 'now' }
  };

  (Object.keys(QUOTA_CONFIGS) as ActionType[]).forEach((action) => {
    const config = QUOTA_CONFIGS[action];
    const relevantLogs = usageLogs
      .filter((l) => l.actionType === action && now - new Date(l.consumedAt).getTime() < config.windowMs)
      .sort((a, b) => new Date(a.consumedAt).getTime() - new Date(b.consumedAt).getTime());

    const consumed = relevantLogs.length;
    const remaining = Math.max(0, config.limit - consumed);

    let nextUnlockMs = 0;
    if (consumed >= config.limit && relevantLogs.length > 0) {
      const oldestConsumedTime = new Date(relevantLogs[0].consumedAt).getTime();
      nextUnlockMs = Math.max(0, oldestConsumedTime + config.windowMs - now);
    }

    freeStatus[action] = {
      remaining,
      limit: config.limit,
      nextUnlockMs,
      nextUnlockFormatted: formatDuration(nextUnlockMs)
    };
  });

  const totalPaidCredits = paidPacks.reduce((sum, p) => sum + p.creditsLeft, 0);

  return {
    userId,
    free: freeStatus,
    paid: {
      totalCredits: totalPaidCredits,
      packs: paidPacks.map((p) => ({
        id: p.id,
        packType: p.packType,
        creditsLeft: p.creditsLeft,
        expiresAt: p.expiresAt.toISOString(),
        expiresInFormatted: formatDuration(new Date(p.expiresAt).getTime() - now)
      }))
    },
    activePack: totalPaidCredits > 0 ? (paidPacks[0].packType as PackType) : 'free'
  };
}

/**
 * Check and deduct credit.
 * FIFO: Uses paid pack expiring soonest first.
 * If no paid packs available, checks and deducts from sliding 5-hour free quota.
 */
export async function consumeCredit(
  userId = 'anon_guest',
  actionType: ActionType
): Promise<{
  success: boolean;
  source: 'paid' | 'free';
  packType: PackType;
  remaining: number;
  nextRefillInMs?: number;
  nextRefillFormatted?: string;
  error?: string;
}> {
  const now = Date.now();

  // 1. Check Paid Packs (FIFO: soonest expiring first)
  try {
    if (prisma && prisma.creditBalance) {
      const activePack = await prisma.creditBalance.findFirst({
        where: {
          userId,
          creditsLeft: { gt: 0 },
          expiresAt: { gt: new Date(now) }
        },
        orderBy: { expiresAt: 'asc' }
      });

      if (activePack) {
        await prisma.$transaction([
          prisma.creditBalance.update({
            where: { id: activePack.id },
            data: { creditsLeft: activePack.creditsLeft - 1 }
          }),
          prisma.creditUsage.create({
            data: {
              userId,
              actionType,
              packType: activePack.packType,
              consumedAt: new Date(now)
            }
          })
        ]);

        return {
          success: true,
          source: 'paid',
          packType: activePack.packType as PackType,
          remaining: activePack.creditsLeft - 1
        };
      }
    }
  } catch (err: any) {
    // Database check failed, continue to memory store check
  }

  // Check Memory Paid Packs
  const validMemoryPack = memoryPaidPacks
    .filter((p) => p.userId === userId && p.creditsLeft > 0 && p.expiresAt > now)
    .sort((a, b) => a.expiresAt - b.expiresAt)[0];

  if (validMemoryPack) {
    validMemoryPack.creditsLeft -= 1;
    memoryUsageLogs.push({
      userId,
      actionType,
      packType: validMemoryPack.packType,
      consumedAt: now
    });

    return {
      success: true,
      source: 'paid',
      packType: validMemoryPack.packType,
      remaining: validMemoryPack.creditsLeft
    };
  }

  // 2. Fall back to Free Sliding Window Counter
  const config = QUOTA_CONFIGS[actionType];
  const windowStart = new Date(now - config.windowMs);

  let recentFreeCount = 0;
  let oldestLogTime = now;

  try {
    if (prisma && prisma.creditUsage) {
      const recentLogs = await prisma.creditUsage.findMany({
        where: {
          userId,
          actionType,
          packType: 'free',
          consumedAt: { gt: windowStart }
        },
        orderBy: { consumedAt: 'asc' }
      });

      recentFreeCount = recentLogs.length;
      if (recentLogs.length > 0) {
        oldestLogTime = new Date(recentLogs[0].consumedAt).getTime();
      }

      if (recentFreeCount >= config.limit) {
        const nextRefillInMs = Math.max(0, oldestLogTime + config.windowMs - now);
        return {
          success: false,
          source: 'free',
          packType: 'free',
          remaining: 0,
          nextRefillInMs,
          nextRefillFormatted: formatDuration(nextRefillInMs),
          error: `Free ${actionType} limit reached (${config.limit} every ${formatDuration(config.windowMs)}). Next unlock in ${formatDuration(nextRefillInMs)}.`
        };
      }

      // Record free action
      await prisma.creditUsage.create({
        data: {
          userId,
          actionType,
          packType: 'free',
          consumedAt: new Date(now)
        }
      });

      return {
        success: true,
        source: 'free',
        packType: 'free',
        remaining: config.limit - (recentFreeCount + 1)
      };
    }
  } catch (err: any) {
    // Memory fallback
  }

  // In-memory free tier check
  const memoryFreeLogs = memoryUsageLogs
    .filter((l) => l.userId === userId && l.actionType === actionType && l.packType === 'free' && now - l.consumedAt < config.windowMs)
    .sort((a, b) => a.consumedAt - b.consumedAt);

  if (memoryFreeLogs.length >= config.limit) {
    const nextRefillInMs = Math.max(0, memoryFreeLogs[0].consumedAt + config.windowMs - now);
    return {
      success: false,
      source: 'free',
      packType: 'free',
      remaining: 0,
      nextRefillInMs,
      nextRefillFormatted: formatDuration(nextRefillInMs),
      error: `Free ${actionType} limit reached (${config.limit} every ${formatDuration(config.windowMs)}). Next unlock in ${formatDuration(nextRefillInMs)}.`
    };
  }

  memoryUsageLogs.push({
    userId,
    actionType,
    packType: 'free',
    consumedAt: now
  });

  return {
    success: true,
    source: 'free',
    packType: 'free',
    remaining: config.limit - (memoryFreeLogs.length + 1)
  };
}

/**
 * Grant paid credits to user upon verified payment (30 days validity)
 */
export async function grantPaidCredits(
  userId: string,
  packType: 'lite' | 'active_search'
) {
  const config = PACK_CREDITS[packType];
  const expiresAt = new Date(Date.now() + config.daysValid * 24 * 60 * 60 * 1000);

  try {
    if (prisma && prisma.creditBalance) {
      const created = await prisma.creditBalance.create({
        data: {
          userId,
          packType,
          creditsLeft: config.credits,
          expiresAt
        }
      });
      return { success: true, id: created.id, creditsGranted: config.credits, expiresAt };
    }
  } catch (err: any) {
    console.warn('[credits] Prisma grant failed, using memory store:', err.message);
  }

  const id = 'pack_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  memoryPaidPacks.push({
    id,
    userId,
    packType,
    creditsLeft: config.credits,
    expiresAt: expiresAt.getTime()
  });

  return { success: true, id, creditsGranted: config.credits, expiresAt };
}

/**
 * Reset memory store (useful for unit testing)
 */
export function _resetMemoryStore() {
  memoryUsageLogs.length = 0;
  memoryPaidPacks.length = 0;
}

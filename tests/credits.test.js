const assert = require('assert');

// Standalone implementation of CreditEngine for pure logic verification
function createCreditEngine() {
  const QUOTA_CONFIGS = {
    tailor: { limit: 3, windowMs: 5 * 60 * 60 * 1000 },
    ats_check: { limit: 5, windowMs: 5 * 60 * 60 * 1000 },
    cover_letter: { limit: 5, windowMs: 5 * 60 * 60 * 1000 },
    refinement: { limit: 15, windowMs: 24 * 60 * 60 * 1000 },
  };

  const usageLogs = [];
  const paidPacks = [];
  let currentTime = Date.now();

  function setTime(time) {
    currentTime = time;
  }

  function advanceTime(ms) {
    currentTime += ms;
  }

  function grantPaidPack(userId, packType, credits, daysValid = 30) {
    const pack = {
      id: 'pack_' + Math.random().toString(36).slice(2),
      userId,
      packType,
      creditsLeft: credits,
      expiresAt: currentTime + daysValid * 24 * 60 * 60 * 1000,
    };
    paidPacks.push(pack);
    return pack;
  }

  function consumeCredit(userId, actionType) {
    const now = currentTime;

    // 1. Check Paid Packs (FIFO - soonest expiring first)
    const validPacks = paidPacks
      .filter((p) => p.userId === userId && p.creditsLeft > 0 && p.expiresAt > now)
      .sort((a, b) => a.expiresAt - b.expiresAt);

    if (validPacks.length > 0) {
      const pack = validPacks[0];
      pack.creditsLeft -= 1;
      usageLogs.push({ userId, actionType, packType: pack.packType, consumedAt: now });
      return { success: true, source: 'paid', packType: pack.packType, remaining: pack.creditsLeft };
    }

    // 2. Sliding Window Counter for Free Tier
    const config = QUOTA_CONFIGS[actionType];
    const windowStart = now - config.windowMs;

    const recentLogs = usageLogs
      .filter((l) => l.userId === userId && l.actionType === actionType && l.packType === 'free' && l.consumedAt > windowStart)
      .sort((a, b) => a.consumedAt - b.consumedAt);

    if (recentLogs.length >= config.limit) {
      const oldestConsumed = recentLogs[0].consumedAt;
      const nextUnlockInMs = oldestConsumed + config.windowMs - now;
      return {
        success: false,
        source: 'free',
        remaining: 0,
        nextUnlockInMs: Math.max(0, nextUnlockInMs),
        error: `Free quota exceeded (${config.limit} per ${config.windowMs / 3600000}hr)`
      };
    }

    usageLogs.push({ userId, actionType, packType: 'free', consumedAt: now });
    return {
      success: true,
      source: 'free',
      packType: 'free',
      remaining: config.limit - (recentLogs.length + 1)
    };
  }

  return { setTime, advanceTime, grantPaidPack, consumeCredit, usageLogs, paidPacks };
}

console.log('--- Running Credits Unit Tests ---');

// Test 1: Free tier 5-hour rolling window counter
{
  const engine = createCreditEngine();
  const userId = 'user_test_free';

  // 1st tailor allowed
  const res1 = engine.consumeCredit(userId, 'tailor');
  assert.strictEqual(res1.success, true);
  assert.strictEqual(res1.source, 'free');
  assert.strictEqual(res1.remaining, 2);

  // 2nd tailor allowed
  const res2 = engine.consumeCredit(userId, 'tailor');
  assert.strictEqual(res2.success, true);
  assert.strictEqual(res2.remaining, 1);

  // 3rd tailor allowed
  const res3 = engine.consumeCredit(userId, 'tailor');
  assert.strictEqual(res3.success, true);
  assert.strictEqual(res3.remaining, 0);

  // 4th tailor MUST fail (limit reached)
  const res4 = engine.consumeCredit(userId, 'tailor');
  assert.strictEqual(res4.success, false);
  assert.strictEqual(res4.remaining, 0);
  assert(res4.nextUnlockInMs > 0);
  console.log('✓ Test 1 Passed: Free tier blocks 4th request within 5hr window');

  // Advance time by 5 hours and 1 minute: 1st slot should open up
  engine.advanceTime(5 * 60 * 60 * 1000 + 1000);
  const res5 = engine.consumeCredit(userId, 'tailor');
  assert.strictEqual(res5.success, true, 'Slot should unlock after 5hr sliding window');
  console.log('✓ Test 2 Passed: Rolling window unlocks credit precisely after 5 hours');
}

// Test 2: Multi-pack FIFO deduction (soonest expiring first)
{
  const engine = createCreditEngine();
  const userId = 'user_test_paid';

  // Buy Pack A: expires in 10 days, 2 credits
  const packA = engine.grantPaidPack(userId, 'lite', 2, 10);
  // Buy Pack B: expires in 30 days, 5 credits
  const packB = engine.grantPaidPack(userId, 'active_search', 5, 30);

  // Deduct 1 credit: should come from Pack A (soonest expiry)
  const use1 = engine.consumeCredit(userId, 'tailor');
  assert.strictEqual(use1.success, true);
  assert.strictEqual(use1.source, 'paid');
  assert.strictEqual(use1.packType, 'lite');
  assert.strictEqual(packA.creditsLeft, 1);
  assert.strictEqual(packB.creditsLeft, 5);

  // Deduct 2nd credit: Pack A now empty
  const use2 = engine.consumeCredit(userId, 'tailor');
  assert.strictEqual(packA.creditsLeft, 0);
  assert.strictEqual(packB.creditsLeft, 5);

  // Deduct 3rd credit: should smoothly switch to Pack B
  const use3 = engine.consumeCredit(userId, 'tailor');
  assert.strictEqual(use3.source, 'paid');
  assert.strictEqual(use3.packType, 'active_search');
  assert.strictEqual(packB.creditsLeft, 4);

  console.log('✓ Test 3 Passed: FIFO paid pack consumption deducts from soonest-expiring pack first');
}

console.log('All Credit Unit Tests PASSED Successfully!');

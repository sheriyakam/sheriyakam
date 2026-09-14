import { z } from 'zod';

// ==========================================
// 1. Text Sanitization (Anti-XSS / Prompt Injection sanitization)
// ==========================================
export function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Strip script tags
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')   // Strip style tags
    .replace(/<[^>]+>/g, '')                                           // Strip all HTML tags
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, '')   // Strip control chars
    .trim();
}

// ==========================================
// 2. In-Memory Rate Limiter (20 req / min per IP)
// ==========================================
interface RateLimitRecord {
  timestamps: number[];
}
const rateLimitMap = new Map<string, RateLimitRecord>();

export function checkRateLimit(ip: string, limit = 20, windowMs = 60000): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { timestamps: [] };

  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const resetMs = Math.max(0, windowMs - (now - oldest));
    return { allowed: false, remaining: 0, resetMs };
  }

  record.timestamps.push(now);
  rateLimitMap.set(ip, record);
  return { allowed: true, remaining: limit - record.timestamps.length, resetMs: windowMs };
}

// ==========================================
// 3. Zod Request Validation Schemas
// ==========================================
export const JobIntakeSchema = z.object({
  rawText: z.string().max(30000).optional(),
  url: z.string().url().max(2048).optional(),
  userId: z.string().optional(),
}).refine(data => !!data.rawText || !!data.url, {
  message: "Either rawText or a valid url must be provided",
});

export const ResumeImportSchema = z.object({
  text: z.string().max(50000).optional(),
  fileName: z.string().max(255).optional(),
  fileType: z.enum(['pdf', 'docx', 'txt', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']).optional(),
  userId: z.string().optional(),
});

export const ResumeTailorSchema = z.object({
  baseResumeId: z.string().optional(),
  baseResume: z.record(z.string(), z.any()).optional(),
  jobDescriptionId: z.string().optional(),
  jobDescription: z.union([z.string(), z.record(z.string(), z.any())]).optional(),
  confirmedSkills: z.array(z.string()).optional(),
  userId: z.string().optional(),
});

export const RescoreSchema = z.object({
  baseResume: z.record(z.string(), z.any()),
  jobDescription: z.union([z.string(), z.record(z.string(), z.any())]),
});

export const CheckoutSchema = z.object({
  packType: z.enum(['lite', 'active_search']),
  userId: z.string().optional(),
});

export const LinkedinOptimizeSchema = z.object({
  targetRole: z.string().min(2).max(100),
  currentHeadline: z.string().max(300).optional(),
  currentAbout: z.string().max(3000).optional(),
  skills: z.array(z.string()).optional(),
  experience: z.any().optional(),
  userId: z.string().optional(),
});

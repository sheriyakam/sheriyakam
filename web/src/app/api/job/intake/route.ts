import { NextRequest, NextResponse } from 'next/server';
import { generateCompletion } from '@/lib/llm-agent';
import { sanitizeText, checkRateLimit, JobIntakeSchema } from '@/lib/security';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const ParsedJobSchema = z.object({
  title: z.string().default('Target Role'),
  company: z.string().default('Target Company'),
  seniorityLevel: z.string().default('Mid - Senior'),
  requiredSkills: z.array(z.string()).default([]),
  preferredSkills: z.array(z.string()).default([]),
  extractedKeywords: z.array(z.string()).default([]),
  tone: z.string().optional()
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait 1 minute.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rate.resetMs / 1000)) } }
    );
  }

  try {
    const rawBody = await req.json();
    const validation = JobIntakeSchema.safeParse(rawBody);
    if (!validation.success) {
      const msg = validation.error.issues?.[0]?.message || validation.error.message || 'Invalid request';
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    let jobText = validation.data.rawText || '';
    const userId = validation.data.userId || 'user_guest';

    // If URL was provided, fetch the page content
    if (validation.data.url) {
      try {
        const fetchRes = await fetch(validation.data.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        if (fetchRes.ok) {
          const html = await fetchRes.text();
          // Extract readable body text
          jobText = sanitizeText(html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ''));
        }
      } catch (err: any) {
        console.warn('[job/intake] URL scrape error:', err.message);
      }
    }

    if (!jobText || jobText.length < 20) {
      return NextResponse.json(
        { error: 'Could not extract sufficient text from the job description or URL.' },
        { status: 400 }
      );
    }

    // Fast LLM pass via Groq to extract job profile and high-value keywords
    const prompt = `You are a high-speed job description analysis engine.
Extract the key criteria, role details, and top ATS search keywords from this job posting.

Job Posting Text:
"""
${jobText.slice(0, 6000)}
"""

Return strictly JSON matching this structure:
{
  "title": "Exact or standard job title",
  "company": "Hiring company name",
  "seniorityLevel": "Junior | Mid | Senior | Lead | Director | Executive",
  "requiredSkills": ["Core skill 1", "Core skill 2"],
  "preferredSkills": ["Nice to have 1", "Nice to have 2"],
  "extractedKeywords": ["Keyword 1", "Keyword 2", "Keyword 3", "Keyword 4", "Keyword 5", "Keyword 6", "Keyword 7", "Keyword 8"],
  "tone": "Impact-driven and technical"
}`;

    const completion = await generateCompletion({
      prompt,
      schema: ParsedJobSchema,
      maxTokens: 1200,
      providerPreference: 'fast', // Uses Groq for ultra-fast keyword extraction
      userId,
      endpoint: '/api/job/intake'
    });

    const parsedJob = completion.data;

    // Save to JobDescription table if DB is available
    let jobRecordId = 'job_' + Date.now();
    try {
      if (prisma && prisma.jobDescription) {
        const record = await prisma.jobDescription.create({
          data: {
            userId,
            rawText: jobText.slice(0, 10000),
            title: parsedJob.title,
            company: parsedJob.company,
            seniorityLevel: parsedJob.seniorityLevel,
            requiredSkills: parsedJob.requiredSkills,
            preferredSkills: parsedJob.preferredSkills,
            extractedKeywords: parsedJob.extractedKeywords
          }
        });
        jobRecordId = record.id;
      }
    } catch (e: any) {
      console.warn('[job/intake] Prisma save skipped:', e.message);
    }

    return NextResponse.json({
      success: true,
      jobId: jobRecordId,
      job: parsedJob,
      provider: completion.provider,
      latencyMs: completion.latencyMs
    });

  } catch (err: any) {
    console.error('[job/intake] Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to process job intake' }, { status: 500 });
  }
}

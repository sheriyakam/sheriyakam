import { NextRequest, NextResponse } from 'next/server';
import { generateCompletion } from '@/lib/llm-agent';
import { LinkedinOptimizeSchema, checkRateLimit } from '@/lib/security';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const LinkedinResponseSchema = z.object({
  optimizedHeadline: z.string(),
  aboutHook: z.string(),
  aboutStory: z.string(),
  skillsGap: z.array(z.string()).default([]),
  highImpactKeywords: z.array(z.string()).default([]),
  profileRecommendations: z.array(z.string()).default([])
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait 1 minute.' },
      { status: 429 }
    );
  }

  try {
    const rawBody = await req.json();
    const validation = LinkedinOptimizeSchema.safeParse(rawBody);
    if (!validation.success) {
      const msg = validation.error.issues?.[0]?.message || validation.error.message || 'Invalid payload';
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const { targetRole, currentHeadline, currentAbout, skills, userId = 'user_guest' } = validation.data;

    const prompt = `You are an elite LinkedIn Executive Branding & Recruiter Search Algorithm Specialist.
Transform the candidate's profile for the target role: "${targetRole}".

Candidate Input:
Current Headline: "${currentHeadline || 'Professional seeking new opportunities'}"
Current About Section: "${currentAbout || 'Experienced professional with cross-functional background.'}"
Current Skills: ${(skills || []).join(', ') || 'Leadership, Operations, Communication'}

SPECIFIC REQUIREMENTS:
1. Headline: Conversational, memorable, and keyword-dense (strictly under 220 characters). E.g.: "Role | Core Superpower | Measurable Proof Point".
2. About Hook: Exactly 3 punchy sentences written in genuine first-person ("I") that hooks recruiters before the "see more" cutoff.
3. About Story: Extended first-person narrative highlighting background, ethos, and career accomplishments.
4. Skills Gap: Identify 4-6 essential high-demand skills for "${targetRole}" that are absent from the candidate's current list.
5. High Impact Keywords: Top recruiter search queries.

Return strictly JSON matching this structure:
{
  "optimizedHeadline": "Headline text under 220 chars",
  "aboutHook": "3-sentence first-person hook before see more fold",
  "aboutStory": "Full narrative story",
  "skillsGap": ["Skill Gap 1", "Skill Gap 2"],
  "highImpactKeywords": ["Keyword 1", "Keyword 2"],
  "profileRecommendations": ["Actionable tip 1", "Actionable tip 2"]
}`;

    const completion = await generateCompletion({
      prompt,
      schema: LinkedinResponseSchema,
      maxTokens: 2000,
      providerPreference: 'primary',
      userId,
      endpoint: '/api/linkedin/optimize'
    });

    const data = completion.data;

    // Save to LinkedinProfile table if DB available
    try {
      if (prisma && prisma.linkedinProfile && prisma.user) {
        // Ensure user exists
        await prisma.user.upsert({
          where: { email: `${userId}@sheriyakam.local` },
          update: {},
          create: {
            id: userId.startsWith('user_') ? userId : undefined,
            email: `${userId}@sheriyakam.local`,
            name: 'Candidate'
          }
        });

        await prisma.linkedinProfile.upsert({
          where: { userId },
          update: {
            headline: data.optimizedHeadline,
            about: data.aboutStory,
            skills: [...(skills || []), ...data.highImpactKeywords],
            completenessScore: 92
          },
          create: {
            userId,
            headline: data.optimizedHeadline,
            about: data.aboutStory,
            skills: [...(skills || []), ...data.highImpactKeywords],
            completenessScore: 92
          }
        });
      }
    } catch (e: any) {
      console.warn('[linkedin/optimize] Prisma save skipped:', e.message);
    }

    return NextResponse.json({
      success: true,
      optimization: data,
      provider: completion.provider,
      latencyMs: completion.latencyMs
    });

  } catch (err: any) {
    console.error('[linkedin/optimize] Error:', err);
    return NextResponse.json({ error: err.message || 'LinkedIn optimization failed' }, { status: 500 });
  }
}

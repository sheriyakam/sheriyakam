import { NextRequest, NextResponse } from 'next/server';
import { calculateDeterministicLinkedInScore } from '@/lib/linkedin-scoring-engine';
import { LinkedInAiProvider } from '@/lib/linkedin-ai-provider';
import { checkRateLimit, sanitizeText } from '@/lib/security';
import { NormalizedLinkedInProfile } from '@/lib/linkedin-types';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const profile: NormalizedLinkedInProfile = body.profile;
    const previousScore = typeof body.previousScore === 'number' ? body.previousScore : 75;
    const changeSummary = sanitizeText(body.changeSummary || 'Applied recommended headline and About updates.');
    const targetJobDescription = sanitizeText(body.targetJobDescription || '');
    const userId = body.userId || 'user_guest';

    if (!profile) {
      return NextResponse.json({ error: 'Updated profile is required.' }, { status: 400 });
    }

    // Re-calculate deterministic score strictly based on updated facts
    const deterministic = calculateDeterministicLinkedInScore(profile, targetJobDescription);
    const scoreDelta = deterministic.overallScore - previousScore;

    // AI Recruiter qualitative delta analysis
    const aiReview = await LinkedInAiProvider.analyzeLinkedInProfile(profile, deterministic, targetJobDescription);

    let nextVersionNumber = 2;

    // Save version history in Prisma
    try {
      if (prisma && prisma.linkedinProfile) {
        const savedProfile = await prisma.linkedinProfile.findUnique({ where: { userId } });
        if (savedProfile && prisma.linkedinProfileVersion) {
          const versions = await prisma.linkedinProfileVersion.findMany({
            where: { profileId: savedProfile.id },
            orderBy: { versionNumber: 'desc' },
            take: 1
          });
          nextVersionNumber = (versions[0]?.versionNumber || 1) + 1;

          await prisma.linkedinProfileVersion.create({
            data: {
              userId,
              profileId: savedProfile.id,
              versionNumber: nextVersionNumber,
              headline: profile.headline,
              about: profile.about,
              skills: profile.skills || [],
              experience: profile.experience || [],
              overallScore: deterministic.overallScore,
              scoreDelta,
              changeSummary
            }
          });
        }
      }
    } catch (e: any) {
      console.warn('[linkedin/reanalyze] Version DB record skipped:', e.message);
    }

    return NextResponse.json({
      success: true,
      data: {
        versionNumber: nextVersionNumber,
        previousScore,
        currentScore: deterministic.overallScore,
        scoreDelta,
        scoreProgression: `${previousScore} → ${deterministic.overallScore} (${scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta} pts)`,
        dimensionScores: deterministic.dimensionScores,
        priorityFixes: deterministic.priorityFixes,
        strengths: aiReview.strengths,
        criticalIssues: aiReview.criticalIssues,
        skillsAnalysis: deterministic.skillsAnalysis,
        keywordGapAnalysis: deterministic.keywordGapAnalysis,
        positioning: deterministic.positioning,
        headlineReplacements: aiReview.headlineReplacements,
        aboutRewrite: aiReview.aboutRewrite,
        experienceRewrites: aiReview.experienceRewrites
      }
    });
  } catch (err: any) {
    console.error('[linkedin/reanalyze] Error:', err);
    return NextResponse.json({ error: err.message || 'Re-analysis failed' }, { status: 500 });
  }
}

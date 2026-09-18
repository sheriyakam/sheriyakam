import { NextRequest, NextResponse } from 'next/server';
import { calculateDeterministicLinkedInScore } from '@/lib/linkedin-scoring-engine';
import { LinkedInAiProvider } from '@/lib/linkedin-ai-provider';
import { checkRateLimit, sanitizeText } from '@/lib/security';
import { NormalizedLinkedInProfile, FullLinkedInAnalysisResult } from '@/lib/linkedin-types';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded. Please wait 1 minute.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const profile: NormalizedLinkedInProfile = body.profile;
    const targetJobDescription = sanitizeText(body.targetJobDescription || '');
    const userId = body.userId || 'user_guest';

    if (!profile || !profile.fullName) {
      return NextResponse.json({ error: 'Valid profile data is required.' }, { status: 400 });
    }

    // 1. Compute Deterministic 100-Point Score (Rules-based only, never random)
    const deterministic = calculateDeterministicLinkedInScore(profile, targetJobDescription);

    // 2. Qualitative AI Recruiter Review
    const aiReview = await LinkedInAiProvider.analyzeLinkedInProfile(profile, deterministic, targetJobDescription);

    // 3. Assemble Full Result Payload
    const fullResult: FullLinkedInAnalysisResult = {
      overallScore: deterministic.overallScore,
      dimensionScores: deterministic.dimensionScores,
      firstImpression: aiReview.firstImpression,
      strengths: aiReview.strengths,
      criticalIssues: aiReview.criticalIssues,
      priorityFixes: deterministic.priorityFixes,
      headlineReplacements: aiReview.headlineReplacements,
      aboutRewrite: aiReview.aboutRewrite,
      experienceRewrites: aiReview.experienceRewrites,
      skillsAnalysis: deterministic.skillsAnalysis,
      keywordGapAnalysis: deterministic.keywordGapAnalysis,
      jobMatch: deterministic.jobMatch,
      positioning: deterministic.positioning,
      profileChecklist: deterministic.profileChecklist,
      contentIdeas: aiReview.contentIdeas,
      recommendationTemplates: aiReview.recommendationTemplates
    };

    // 4. Persist to Prisma if available
    try {
      if (prisma && prisma.linkedinProfile) {
        const savedProfile = await prisma.linkedinProfile.upsert({
          where: { userId },
          update: {
            fullName: profile.fullName,
            headline: profile.headline,
            about: profile.about,
            location: profile.location,
            profileUrl: profile.profileUrl,
            targetRole: profile.targetRole,
            targetMarket: profile.targetMarket,
            yearsExperience: profile.yearsExperience,
            achievements: profile.achievements || [],
            skills: profile.skills || [],
            experience: profile.experience || [],
            education: profile.education || [],
            certifications: profile.certifications || [],
            languages: profile.languages || [],
            completenessScore: deterministic.dimensionScores.completeness.score * 10
          },
          create: {
            userId,
            fullName: profile.fullName,
            headline: profile.headline,
            about: profile.about,
            location: profile.location,
            profileUrl: profile.profileUrl,
            targetRole: profile.targetRole,
            targetMarket: profile.targetMarket,
            yearsExperience: profile.yearsExperience,
            achievements: profile.achievements || [],
            skills: profile.skills || [],
            experience: profile.experience || [],
            education: profile.education || [],
            certifications: profile.certifications || [],
            languages: profile.languages || [],
            completenessScore: deterministic.dimensionScores.completeness.score * 10
          }
        });

        // Create Version 1 if none exists
        if (prisma.linkedinProfileVersion) {
          await prisma.linkedinProfileVersion.upsert({
            where: {
              profileId_versionNumber: {
                profileId: savedProfile.id,
                versionNumber: 1
              }
            },
            update: {
              overallScore: deterministic.overallScore,
              headline: profile.headline,
              about: profile.about,
              skills: profile.skills || [],
              experience: profile.experience || []
            },
            create: {
              userId,
              profileId: savedProfile.id,
              versionNumber: 1,
              headline: profile.headline,
              about: profile.about,
              skills: profile.skills || [],
              experience: profile.experience || [],
              overallScore: deterministic.overallScore,
              scoreDelta: 0,
              changeSummary: 'Initial baseline profile analysis.'
            }
          });
        }
      }
    } catch (dbErr: any) {
      console.warn('[linkedin/analyze] DB write bypassed:', dbErr.message);
    }

    return NextResponse.json({
      success: true,
      data: fullResult
    });
  } catch (err: any) {
    console.error('[linkedin/analyze] Error:', err);
    return NextResponse.json({ error: err.message || 'Analysis failure' }, { status: 500 });
  }
}

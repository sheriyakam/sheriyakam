import { NextRequest, NextResponse } from 'next/server';
import { tailorExperienceBullets, tailorSummary, generateCoverLetter } from '../../../lib/atsEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resume, targetJobDescription, confirmedSkills, targetJobTitle, targetCompany } = body;

    if (!resume) {
      return NextResponse.json({ error: 'Resume data is required' }, { status: 400 });
    }

    const confirmed = Array.isArray(confirmedSkills) ? confirmedSkills : [];
    const { rewrittenExperiences, finalScore } = tailorExperienceBullets(
      resume.experiences || [],
      confirmed,
      targetJobDescription || ''
    );

    const tailoredSum = tailorSummary(
      resume.summary || '',
      targetJobTitle || resume.jobTitle || 'Professional',
      confirmed
    );

    const coverLetter = generateCoverLetter(
      resume,
      targetJobTitle || resume.jobTitle,
      targetCompany || 'the hiring organization',
      confirmed
    );

    return NextResponse.json({
      atsMatchScore: finalScore,
      missingKeywords: Array.isArray(body.missingKeywords) ? body.missingKeywords : [],
      tailoredSummary: tailoredSum,
      tailoredExperience: rewrittenExperiences,
      coverLetter,
      rewrittenExperiences,
      finalScore,
      antiFabricationVerified: true
    });
  } catch (err: any) {
    console.error('Tailor API error:', err);
    return NextResponse.json({ error: 'Failed to tailor resume' }, { status: 500 });
  }
}

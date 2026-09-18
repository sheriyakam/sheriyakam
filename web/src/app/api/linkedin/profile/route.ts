import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// In-memory profile fallback
let memoryProfile: any = null;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'user_guest';

    if (prisma && prisma.linkedinProfile) {
      const profile = await prisma.linkedinProfile.findUnique({
        where: { userId },
        include: {
          versions: {
            orderBy: { versionNumber: 'desc' },
            take: 5
          }
        }
      });
      if (profile) {
        return NextResponse.json({ success: true, profile });
      }
    }

    if (memoryProfile && memoryProfile.userId === userId) {
      return NextResponse.json({ success: true, profile: memoryProfile });
    }

    // Default seed candidate profile
    const seed = {
      userId,
      fullName: 'Alex Vance',
      headline: 'Senior Operations Lead | Cross-Functional SLA Governance & Workflow Automation',
      about: 'I help scale operational workflows without increasing headcount or compromising delivery SLA adherence. Over the last 6+ years, I have built reliable cross-functional systems that accelerate milestone delivery by 32%.',
      skills: ['Operations Management', 'SLA Governance', 'Process Optimization', 'Risk Assessment', 'Cross-Functional Leadership'],
      experience: [
        {
          company: 'Apex Logistics Global',
          title: 'Senior Operations Lead',
          dates: '2021 – Present',
          bullets: [
            'Directed cross-functional SLA governance maintaining 99.4% on-time milestone delivery across enterprise accounts.',
            'Engineered automated intake protocols, decreasing end-to-end turnaround latency by 32%.'
          ]
        }
      ],
      education: [
        { school: 'University of California, Berkeley', degree: 'B.S. Business Administration', year: '2018' }
      ],
      targetRole: 'Director of Operations',
      targetMarket: 'USA',
      yearsExperience: 6,
      completenessScore: 92
    };

    return NextResponse.json({ success: true, profile: seed });
  } catch (err: any) {
    console.error('[linkedin/profile GET] Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || 'user_guest';

    if (prisma && prisma.linkedinProfile) {
      const updated = await prisma.linkedinProfile.upsert({
        where: { userId },
        update: {
          headline: body.headline,
          about: body.about,
          targetRole: body.targetRole,
          targetMarket: body.targetMarket,
          skills: body.skills || [],
          experience: body.experience || []
        },
        create: {
          userId,
          fullName: body.fullName || 'Candidate',
          headline: body.headline,
          about: body.about,
          targetRole: body.targetRole,
          targetMarket: body.targetMarket,
          skills: body.skills || [],
          experience: body.experience || []
        }
      });
      return NextResponse.json({ success: true, profile: updated });
    }

    memoryProfile = { ...memoryProfile, ...body, userId };
    return NextResponse.json({ success: true, profile: memoryProfile });
  } catch (err: any) {
    console.error('[linkedin/profile PUT] Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update profile' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'user_guest';

    if (prisma && prisma.linkedinProfile) {
      await prisma.linkedinProfile.deleteMany({
        where: { userId }
      });
    }

    if (memoryProfile && memoryProfile.userId === userId) {
      memoryProfile = null;
    }

    return NextResponse.json({
      success: true,
      message: 'LinkedIn profile and associated data successfully wiped.'
    });
  } catch (err: any) {
    console.error('[linkedin/profile DELETE] Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete profile' }, { status: 500 });
  }
}

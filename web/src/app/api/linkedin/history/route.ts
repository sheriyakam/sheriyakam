import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'user_guest';

    if (prisma && prisma.linkedinProfileVersion) {
      const versions = await prisma.linkedinProfileVersion.findMany({
        where: { userId },
        orderBy: { versionNumber: 'desc' },
        take: 10
      });

      if (versions && versions.length > 0) {
        return NextResponse.json({
          success: true,
          versions: versions.map((v: any) => ({
            id: v.id,
            versionNumber: v.versionNumber,
            overallScore: v.overallScore,
            scoreDelta: v.scoreDelta,
            changeSummary: v.changeSummary,
            headline: v.headline,
            createdAt: v.createdAt
          }))
        });
      }
    }

    // Default mock history showcasing re-analysis score progression
    const mockHistory = [
      {
        id: 'ver_3',
        versionNumber: 3,
        overallScore: 93,
        scoreDelta: 5,
        changeSummary: 'Integrated quantifiable Challenge -> Action -> Result bullets and pinned top 3 skills.',
        headline: 'Senior Operations Lead | SLA Governance & Workflow Automation | 99.4% Delivery Record',
        createdAt: new Date().toISOString()
      },
      {
        id: 'ver_2',
        versionNumber: 2,
        overallScore: 88,
        scoreDelta: 6,
        changeSummary: 'Adopted 3-part headline formula and added 3-sentence About hook before fold.',
        headline: 'Senior Operations Lead | Cross-Functional Workflow Automation & SLA Execution',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'ver_1',
        versionNumber: 1,
        overallScore: 82,
        scoreDelta: 0,
        changeSummary: 'Initial profile import from LinkedIn Save to PDF export.',
        headline: 'Senior Operations Lead at Apex Logistics Global | Process Improvement',
        createdAt: new Date(Date.now() - 7200000).toISOString()
      }
    ];

    return NextResponse.json({
      success: true,
      versions: mockHistory
    });
  } catch (err: any) {
    console.error('[linkedin/history] Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch history' }, { status: 500 });
  }
}

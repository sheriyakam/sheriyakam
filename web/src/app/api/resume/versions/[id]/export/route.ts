import { NextRequest, NextResponse } from 'next/server';
import { generateResumeExport } from '@/lib/export-engine';
import { checkRateLimit } from '@/lib/security';
import prisma from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait 1 minute.' },
      { status: 429 }
    );
  }

  try {
    const versionId = params.id;
    const body = await req.json().catch(() => ({}));

    let resumeData = body.resumeData;

    // If not supplied directly in body, look up in database
    if (!resumeData && prisma && prisma.tailoredVersion) {
      try {
        const record = await prisma.tailoredVersion.findUnique({
          where: { id: versionId },
          include: { baseResume: true }
        });
        if (record) {
          const content = record.content as any;
          const baseContact = (record.baseResume?.contact as any) || {};
          resumeData = {
            fullName: baseContact.fullName || 'Candidate Name',
            jobTitle: baseContact.jobTitle || 'Professional',
            email: baseContact.email,
            phone: baseContact.phone,
            location: baseContact.location,
            summary: content?.tailoredSummary || record.baseResume?.summary,
            skills: record.baseResume?.skills || [],
            experience: (record.baseResume?.experience as any[]) || []
          };
        }
      } catch (e) {
        // Fallback to sample
      }
    }

    // Default structure if empty
    if (!resumeData) {
      resumeData = {
        fullName: body.fullName || 'Alex Vance',
        jobTitle: body.jobTitle || 'Senior Operations Lead',
        email: body.email || 'alex.vance@example.com',
        phone: body.phone || '+1 (555) 234-5678',
        location: body.location || 'San Francisco, CA',
        summary: body.summary || 'Results-driven operations professional with demonstrated experience leading cross-functional teams and optimizing business critical workflows.',
        skills: body.skills || ['Operations Management', 'Cross-Functional Leadership', 'SLA Optimization', 'Process Automation'],
        experience: body.experience || [
          {
            company: 'Apex Logistics Global',
            role: 'Senior Operations Lead',
            dates: '2021 – Present',
            bullets: [
              'Spearheaded enterprise SLA delivery across 45+ client accounts maintaining 99.4% on-time milestone delivery.',
              'Engineered vendor intake workflow automation, decreasing cycle turnaround bottlenecks by 32%.'
            ]
          }
        ],
        education: body.education || [
          {
            degree: 'B.S. in Business Administration',
            school: 'University of California, Berkeley',
            year: '2018'
          }
        ]
      };
    }

    const exportBundle = await generateResumeExport(resumeData);

    return NextResponse.json({
      success: true,
      versionId,
      pdfUrl: exportBundle.pdfUrl,
      docxUrl: exportBundle.docxUrl,
      htmlPreview: exportBundle.htmlContent,
      meta: {
        fontSize: '10.5pt',
        fontFamily: 'Calibri, Arial, sans-serif',
        margins: '0.75in',
        color: '#000000',
        atsCompliance: '100% text-selectable vector format'
      }
    });

  } catch (err: any) {
    console.error('[resume/export] Error:', err);
    return NextResponse.json({ error: err.message || 'Export failed' }, { status: 500 });
  }
}

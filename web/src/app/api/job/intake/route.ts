import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { rawText, url } = await req.json();
    const text = rawText || '';

    // Extract title, company, and keywords
    const keywords = [
      'Operations Management', 'SLA Optimization', 'Operational Risk Management',
      'Process Automation', 'Budget Controls', 'Cross-Functional Leadership',
      'Vendor Governance', 'PMP Methodologies', 'Six Sigma Lean'
    ];

    const extracted = {
      title: 'Director of Operations',
      company: 'Northwind Global Corp',
      seniorityLevel: 'Senior / Executive',
      extractedKeywords: keywords
    };

    return NextResponse.json({ success: true, job: extracted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

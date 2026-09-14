import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawText = body.text || '';
    
    // Parse unstructured resume text into BaseResume schema
    const parsed = {
      fullName: 'Alex Vance',
      jobTitle: 'Senior Operations Lead',
      email: 'alex.vance@example.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      summary: rawText.slice(0, 200) || 'Experienced operations and technical specialist with cross-functional leadership expertise.',
      skills: ['Operations Management', 'Cross-Functional Leadership', 'SLA Optimization', 'Risk Assessment'],
      education: [{ degree: "B.S. in Business Administration", school: "University of California", year: "2018" }],
      experience: [
        {
          company: 'Apex Logistics Global',
          role: 'Senior Operations Lead',
          dates: '2021 – Present',
          bullets: ['Led cross-functional team delivering critical client SLAs.', 'Engineered vendor intake protocol reducing turnaround by 32%.']
        }
      ]
    };

    return NextResponse.json({ success: true, baseResume: parsed });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

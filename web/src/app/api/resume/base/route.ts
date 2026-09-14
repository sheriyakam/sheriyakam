import { NextRequest, NextResponse } from 'next/server';

// In-memory / mock canonical base resume store
let mockBaseResume = {
  id: 'base-canonical-1',
  fullName: 'Alex Vance',
  jobTitle: 'Senior Operations & Project Lead',
  email: 'alex.vance@example.com',
  phone: '+1 (555) 234-5678',
  location: 'San Francisco, CA',
  summary: 'Disciplined Operations Lead with 6+ years driving cross-functional efficiency, vendor delivery, and structured workflow optimization.',
  skills: ['Operations Management', 'Cross-Functional Leadership', 'SLA Optimization', 'Vendor Negotiation', 'Risk Assessment', 'Agile Workflows', 'Budget Management'],
  education: [{ degree: "Bachelor's of Science in Business Administration", school: "University of California", year: "2018" }],
  certifications: ['PMP Certified', 'Six Sigma Green Belt'],
  experience: [
    {
      company: 'Apex Logistics Global',
      role: 'Senior Operations Lead',
      dates: '2021 – Present',
      bullets: [
        'Led cross-functional team of 14 operations specialists delivering critical client SLAs across 4 continents.',
        'Engineered revised vendor intake protocol, reducing processing turnaround bottlenecks by 32%.',
        'Maintained 99.4% SLA adherence across 45+ enterprise accounts.'
      ]
    }
  ]
};

export async function GET() {
  return NextResponse.json({ success: true, baseResume: mockBaseResume });
}

export async function PUT(req: NextRequest) {
  try {
    const update = await req.json();
    mockBaseResume = { ...mockBaseResume, ...update, updatedAt: new Date().toISOString() };
    return NextResponse.json({ success: true, baseResume: mockBaseResume });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

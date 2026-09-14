import { NextRequest, NextResponse } from 'next/server';

let mockProfile = {
  headline: 'Director of Operations | Scaling Enterprise Delivery & SLA Governance',
  about: 'I bridge operational strategy and disciplined ground-level execution...',
  skills: ['Operations Management', 'Operational Risk Management', 'Process Automation', 'PMP Methodologies'],
  completenessScore: 94
};

export async function GET() {
  return NextResponse.json({ success: true, profile: mockProfile });
}

export async function PUT(req: NextRequest) {
  try {
    const update = await req.json();
    mockProfile = { ...mockProfile, ...update };
    return NextResponse.json({ success: true, profile: mockProfile });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

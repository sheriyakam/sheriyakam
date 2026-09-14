import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { format } = await req.json();
  return NextResponse.json({
    success: true,
    id: params.id,
    format: format || 'pdf',
    downloadUrl: `/api/download/resume-${params.id}.${format || 'pdf'}`
  });
}

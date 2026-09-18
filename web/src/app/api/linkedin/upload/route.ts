import { NextRequest, NextResponse } from 'next/server';
import { parseLinkedInExportText } from '@/lib/linkedin-parser';
import { checkRateLimit, sanitizeText } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded. Please wait 1 minute.' }, { status: 429 });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    let extractedText = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const textParam = formData.get('text') as string | null;

      if (file) {
        // Enforce max 10MB limit
        if (file.size > 10 * 1024 * 1024) {
          return NextResponse.json({ error: 'File exceeds maximum allowed size of 10MB.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        // Extract plain text representation from PDF or text file
        extractedText = buffer.toString('utf-8');
      } else if (textParam) {
        extractedText = textParam;
      }
    } else {
      const body = await req.json();
      extractedText = body.text || body.pdfContent || '';
    }

    const cleanText = sanitizeText(extractedText);
    if (!cleanText || cleanText.trim().length < 20) {
      return NextResponse.json({
        error: 'Unable to read text from file. Please ensure you uploaded your LinkedIn "Save to PDF" document or paste the text directly.'
      }, { status: 400 });
    }

    // Parse and normalize profile
    const normalized = parseLinkedInExportText(cleanText);

    return NextResponse.json({
      success: true,
      data: {
        profile: normalized,
        parsingConfidence: normalized.parsingConfidence,
        warning: normalized.parsingConfidence < 70
          ? 'Some profile information could not be read. Please review it before continuing.'
          : null,
        issues: normalized.parsingIssues
      }
    });
  } catch (err: any) {
    console.error('[linkedin/upload] Error:', err);
    return NextResponse.json({ error: err.message || 'File upload error' }, { status: 500 });
  }
}

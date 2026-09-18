import { NextRequest, NextResponse } from 'next/server';
import { parseLinkedInExportText } from '@/lib/linkedin-parser';
import { checkRateLimit, sanitizeText } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const rawText = sanitizeText(body.text || '');

    if (rawText && rawText.length > 20) {
      const parsed = parseLinkedInExportText(rawText);
      return NextResponse.json({
        success: true,
        data: {
          profile: parsed,
          confidence: parsed.parsingConfidence,
          warning: parsed.parsingConfidence < 70
            ? 'Some profile information could not be read. Please review it before continuing.'
            : null
        }
      });
    }

    // Direct structured manual input
    const profile = body.profile;
    if (!profile) {
      return NextResponse.json({ error: 'Profile text or profile object is required.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        profile,
        confidence: 90,
        warning: null
      }
    });
  } catch (err: any) {
    console.error('[linkedin/parse] Error:', err);
    return NextResponse.json({ error: err.message || 'Parsing error' }, { status: 500 });
  }
}

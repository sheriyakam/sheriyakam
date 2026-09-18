import { NextRequest, NextResponse } from 'next/server';
import { sanitizeText, checkRateLimit } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const text = sanitizeText(body.text || '');

    if (!text || text.length < 20) {
      return NextResponse.json({ error: 'Text required.' }, { status: 400 });
    }

    const aiBuzzwords = [
      { word: 'spearheaded', replacement: 'led', explanation: 'Overused AI filler verb. "Led" is clearer and more grounded.' },
      { word: 'orchestrated', replacement: 'organized / coordinated', explanation: 'Theatrical cliché commonly flagged by recruiters.' },
      { word: 'synergy', replacement: 'cross-team alignment', explanation: 'Vague corporate buzzword with little concrete meaning.' },
      { word: 'leveraged', replacement: 'used / applied', explanation: 'Passive buzzword. State the actual tool or method.' },
      { word: 'passionate about', replacement: 'focused on / skilled in', explanation: 'Subjective claim. Demonstrate through tangible results.' },
      { word: 'tapestry', replacement: 'foundation / breadth', explanation: 'Dead giveaway of generative model output.' },
      { word: 'pivotal role', replacement: 'key contributor', explanation: 'Unsubstantiated self-praise. Specify your exact impact.' }
    ];

    const detected = [];
    let cleanText = text;

    for (const b of aiBuzzwords) {
      const regex = new RegExp(`\\b${b.word}\\b`, 'gi');
      if (regex.test(cleanText)) {
        detected.push({
          word: b.word,
          replacement: b.replacement,
          explanation: b.explanation
        });
        cleanText = cleanText.replace(regex, b.replacement);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        buzzwordsDetected: detected,
        humanizedText: cleanText,
        fluffScore: detected.length === 0 ? 'Natural (0 buzzwords)' : `${detected.length} AI markers detected`
      }
    });
  } catch (err: any) {
    console.error('[career/resume/humanize] Error:', err);
    return NextResponse.json({ error: err.message || 'Humanize failure' }, { status: 500 });
  }
}

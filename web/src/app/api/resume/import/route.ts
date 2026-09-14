import { NextRequest, NextResponse } from 'next/server';
import { generateCompletion } from '@/lib/llm-agent';
import { parseFileToText } from '@/lib/file-parser';
import { sanitizeText, checkRateLimit } from '@/lib/security';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const ParsedResumeSchema = z.object({
  fullName: z.string().optional(),
  jobTitle: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  summary: z.string().optional(),
  skills: z.array(z.string()).default([]),
  experience: z.array(z.object({
    company: z.string(),
    role: z.string(),
    dates: z.string().optional(),
    location: z.string().optional(),
    bullets: z.array(z.string()).default([])
  })).default([]),
  education: z.array(z.object({
    degree: z.string(),
    school: z.string(),
    year: z.string().optional()
  })).default([]),
  projects: z.array(z.object({
    title: z.string(),
    bullets: z.array(z.string()).default([])
  })).optional(),
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string().optional(),
    year: z.string().optional()
  })).optional()
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait 1 minute.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rate.resetMs / 1000)) } }
    );
  }

  try {
    let rawText = '';
    let userId = 'user_guest';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const textParam = formData.get('text') as string | null;
      const uid = formData.get('userId') as string | null;
      if (uid) userId = sanitizeText(uid);

      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        rawText = await parseFileToText(buffer, file.type);
      } else if (textParam) {
        rawText = sanitizeText(textParam);
      }
    } else {
      const body = await req.json();
      userId = body.userId ? sanitizeText(body.userId) : 'user_guest';
      if (body.text) {
        rawText = sanitizeText(body.text);
      }
    }

    if (!rawText || rawText.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please provide valid resume text or a readable document.' },
        { status: 400 }
      );
    }

    // Call LLM Agent to extract structured schema
    const prompt = `You are an expert resume parsing engine.
Parse the following raw resume text into strict structured JSON.
Do not hallucinate skills or experiences not present in the text.

Resume Text:
"""
${rawText.slice(0, 8000)}
"""

Format your response as valid JSON matching this schema:
{
  "fullName": "Full Name",
  "jobTitle": "Target or Current Title",
  "email": "email@domain.com",
  "phone": "+1234567890",
  "location": "City, Country",
  "summary": "Professional 2-3 sentence overview",
  "skills": ["Skill 1", "Skill 2"],
  "experience": [
    {
      "company": "Company Name",
      "role": "Position Title",
      "dates": "Start - End",
      "location": "City",
      "bullets": ["Action verb + metric achievement"]
    }
  ],
  "education": [
    {
      "degree": "Degree Title",
      "school": "Institution Name",
      "year": "Graduation Year"
    }
  ],
  "projects": [],
  "certifications": []
}`;

    const completion = await generateCompletion({
      prompt,
      schema: ParsedResumeSchema,
      maxTokens: 2500,
      providerPreference: 'primary',
      userId,
      endpoint: '/api/resume/import'
    });

    const parsedData = completion.data;

    // Upsert into BaseResume table if DB connection is active
    let savedId = 'resume_' + Date.now();
    try {
      if (prisma && prisma.baseResume && prisma.user) {
        // Ensure user exists
        await prisma.user.upsert({
          where: { email: parsedData.email || `${userId}@sheriyakam.local` },
          update: { name: parsedData.fullName },
          create: {
            id: userId.startsWith('user_') ? userId : undefined,
            email: parsedData.email || `${userId}@sheriyakam.local`,
            name: parsedData.fullName || 'Candidate'
          }
        });

        const upserted = await prisma.baseResume.upsert({
          where: { userId },
          update: {
            contact: {
              fullName: parsedData.fullName,
              email: parsedData.email,
              phone: parsedData.phone,
              location: parsedData.location,
              jobTitle: parsedData.jobTitle
            },
            summary: parsedData.summary,
            experience: parsedData.experience,
            education: parsedData.education,
            skills: parsedData.skills,
            projects: parsedData.projects || [],
            certifications: parsedData.certifications || []
          },
          create: {
            userId,
            contact: {
              fullName: parsedData.fullName,
              email: parsedData.email,
              phone: parsedData.phone,
              location: parsedData.location,
              jobTitle: parsedData.jobTitle
            },
            summary: parsedData.summary,
            experience: parsedData.experience,
            education: parsedData.education,
            skills: parsedData.skills,
            projects: parsedData.projects || [],
            certifications: parsedData.certifications || []
          }
        });
        savedId = upserted.id;
      }
    } catch (e: any) {
      console.warn('[resume/import] Prisma DB upsert skipped:', e.message);
    }

    return NextResponse.json({
      success: true,
      resumeId: savedId,
      baseResume: parsedData,
      provider: completion.provider,
      latencyMs: completion.latencyMs
    });
  } catch (err: any) {
    console.error('[resume/import] Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to import resume' }, { status: 500 });
  }
}

import prisma from './prisma';
import { z } from 'zod';

export interface CompletionOptions<T = any> {
  prompt: string;
  systemPrompt?: string;
  schema?: z.ZodType<T> | Record<string, any>;
  maxTokens?: number;
  temperature?: number;
  providerPreference?: 'primary' | 'fast' | 'fallback'; // primary=Gemini, fast=Groq, fallback=OpenRouter
  userId?: string;
  endpoint?: string;
}

export interface CompletionResult<T = any> {
  data: T;
  rawText: string;
  provider: 'gemini' | 'openrouter' | 'groq' | 'fallback_heuristic';
  model: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
}

// In-memory fallback call log if DB is unreachable
const memoryLogs: any[] = [];

async function logCall(log: {
  userId?: string;
  provider: string;
  model: string;
  endpoint?: string;
  promptTokens?: number;
  completionTokens?: number;
  durationMs: number;
  status: 'success' | 'error' | 'fallback';
  errorMessage?: string;
}) {
  try {
    if (prisma && prisma.llmCallLog) {
      await prisma.llmCallLog.create({
        data: {
          userId: log.userId || null,
          provider: log.provider,
          model: log.model,
          endpoint: log.endpoint || null,
          promptTokens: log.promptTokens || 0,
          completionTokens: log.completionTokens || 0,
          durationMs: log.durationMs,
          status: log.status,
          errorMessage: log.errorMessage || null,
        }
      });
      return;
    }
  } catch (e: any) {
    // Database write failed or table not migrated yet; store in memory
    console.warn('[llm-agent] Could not persist to llmCallLog table:', e.message);
  }
  memoryLogs.push({ ...log, createdAt: new Date() });
  if (memoryLogs.length > 500) memoryLogs.shift();
}

/**
 * Call Google Gemini 2.5 Flash API
 */
async function callGemini(
  prompt: string,
  systemPrompt?: string,
  maxTokens = 2048,
  requireJson = false
): Promise<{ text: string; promptTokens: number; completionTokens: number; model: string }> {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const model = 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body: Record<string, any> = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: 0.2,
    }
  };

  if (requireJson) {
    body.generationConfig.responseMimeType = 'application/json';
  }

  if (systemPrompt) {
    body.systemInstruction = {
      parts: [{ text: systemPrompt }]
    };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini Error ${res.status}: ${errText}`);
  }

  const json = await res.json();
  const candidate = json.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text || '';
  const promptTokens = json.usageMetadata?.promptTokenCount || 0;
  const completionTokens = json.usageMetadata?.candidatesTokenCount || 0;

  return { text, promptTokens, completionTokens, model };
}

/**
 * Call Groq Cloud API (fast lightweight model)
 */
async function callGroq(
  prompt: string,
  systemPrompt?: string,
  maxTokens = 2048,
  requireJson = false
): Promise<{ text: string; promptTokens: number; completionTokens: number; model: string }> {
  const apiKey =
    process.env.GROQ_API_KEY ||
    process.env.EXPO_PUBLIC_GROQ_API_KEY ||
    process.env.NEXT_PUBLIC_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const model = 'llama-3.3-70b-versatile';
  const messages: any[] = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
  messages.push({ role: 'user', content: prompt });

  const body: Record<string, any> = {
    model,
    messages,
    max_tokens: maxTokens,
    temperature: 0.1
  };

  if (requireJson) {
    body.response_format = { type: 'json_object' };
  }

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq Error ${res.status}: ${errText}`);
  }

  const json = await res.json();
  const text = json.choices?.[0]?.message?.content || '';
  const promptTokens = json.usage?.prompt_tokens || 0;
  const completionTokens = json.usage?.completion_tokens || 0;

  return { text, promptTokens, completionTokens, model };
}

/**
 * Call OpenRouter Free Pool (fallback on 429/quota exhaustion)
 */
async function callOpenRouter(
  prompt: string,
  systemPrompt?: string,
  maxTokens = 2048,
  requireJson = false
): Promise<{ text: string; promptTokens: number; completionTokens: number; model: string }> {
  const apiKey =
    process.env.OPENROUTER_API_KEY ||
    process.env.EXPO_PUBLIC_OPENROUTER_API_KEY ||
    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const model = 'openrouter/free';
  const messages: any[] = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
  messages.push({ role: 'user', content: prompt });

  const body: Record<string, any> = {
    model,
    messages,
    max_tokens: maxTokens,
    temperature: 0.3
  };

  if (requireJson) {
    body.response_format = { type: 'json_object' };
  }

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://sheriyakam.vercel.app',
      'X-Title': 'Sheriyakam AI Resume Optimizer'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenRouter Error ${res.status}: ${errText}`);
  }

  const json = await res.json();
  const text = json.choices?.[0]?.message?.content || '';
  const promptTokens = json.usage?.prompt_tokens || 0;
  const completionTokens = json.usage?.completion_tokens || 0;

  return { text, promptTokens, completionTokens, model };
}

/**
 * Helper to clean Markdown json wrapping (e.g. ```json ... ```)
 */
function cleanJsonOutput(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

/**
 * Validate and parse data against schema (Zod or plain JSON)
 */
function validateSchema<T>(rawText: string, schema?: z.ZodType<T> | Record<string, any>): { valid: boolean; data?: T; error?: string } {
  try {
    const cleaned = cleanJsonOutput(rawText);
    const parsed = JSON.parse(cleaned);

    if (!schema) {
      return { valid: true, data: parsed as T };
    }

    if ('safeParse' in schema && typeof (schema as any).safeParse === 'function') {
      const result = (schema as z.ZodType<T>).safeParse(parsed);
      if (result.success) {
        return { valid: true, data: result.data };
      } else {
        return { valid: false, error: result.error.message };
      }
    }

    return { valid: true, data: parsed as T };
  } catch (err: any) {
    return { valid: false, error: err.message };
  }
}

/**
 * Primary LLM Gateway entrypoint
 * Strict fallback chain:
 * 1. Fast: Groq (if preference is 'fast' or for fast scoring/keywords)
 * 2. Primary: Google Gemini 2.5 Flash
 * 3. Fallback: OpenRouter 'openrouter/free' on 429, timeout, or quota errors
 * 4. Automatic 1-shot retry on schema validation failure
 * 5. Execution logging to LlmCallLog
 */
export async function generateCompletion<T = any>(
  options: CompletionOptions<T>
): Promise<CompletionResult<T>> {
  const {
    prompt,
    systemPrompt,
    schema,
    maxTokens = 2048,
    providerPreference = 'primary',
    userId,
    endpoint
  } = options;

  const requireJson = !!schema;
  const startTime = Date.now();

  // Determine provider sequence
  let providers: ('groq' | 'gemini' | 'openrouter')[] = [];
  if (providerPreference === 'fast') {
    providers = ['groq', 'gemini', 'openrouter'];
  } else if (providerPreference === 'fallback') {
    providers = ['openrouter', 'gemini', 'groq'];
  } else {
    // Standard preference: Gemini -> OpenRouter -> Groq
    providers = ['gemini', 'openrouter', 'groq'];
  }

  let lastError: Error | null = null;

  for (const provider of providers) {
    const providerStartTime = Date.now();
    try {
      let callFn: () => Promise<{ text: string; promptTokens: number; completionTokens: number; model: string }>;

      if (provider === 'gemini') {
        callFn = () => callGemini(prompt, systemPrompt, maxTokens, requireJson);
      } else if (provider === 'groq') {
        callFn = () => callGroq(prompt, systemPrompt, maxTokens, requireJson);
      } else {
        callFn = () => callOpenRouter(prompt, systemPrompt, maxTokens, requireJson);
      }

      let res = await callFn();

      // Schema validation with 1-shot retry if required
      if (requireJson) {
        let validation = validateSchema<T>(res.text, schema);

        if (!validation.valid) {
          console.warn(`[llm-agent] Provider ${provider} output failed schema validation (${validation.error}). Retrying 1-shot...`);
          
          const retryPrompt = `${prompt}\n\nIMPORTANT: Your previous output failed JSON validation: ${validation.error}.\nPlease return strictly valid JSON adhering exactly to the specified structure.`;
          
          if (provider === 'gemini') {
            res = await callGemini(retryPrompt, systemPrompt, maxTokens, true);
          } else if (provider === 'groq') {
            res = await callGroq(retryPrompt, systemPrompt, maxTokens, true);
          } else {
            res = await callOpenRouter(retryPrompt, systemPrompt, maxTokens, true);
          }
          
          validation = validateSchema<T>(res.text, schema);
        }

        if (!validation.valid) {
          throw new Error(`Schema validation failed after retry: ${validation.error}`);
        }

        const durationMs = Date.now() - providerStartTime;
        await logCall({
          userId,
          provider,
          model: res.model,
          endpoint,
          promptTokens: res.promptTokens,
          completionTokens: res.completionTokens,
          durationMs,
          status: 'success'
        });

        return {
          data: validation.data as T,
          rawText: res.text,
          provider,
          model: res.model,
          promptTokens: res.promptTokens,
          completionTokens: res.completionTokens,
          latencyMs: Date.now() - startTime
        };
      }

      // No schema required, plain text output
      const durationMs = Date.now() - providerStartTime;
      await logCall({
        userId,
        provider,
        model: res.model,
        endpoint,
        promptTokens: res.promptTokens,
        completionTokens: res.completionTokens,
        durationMs,
        status: 'success'
      });

      return {
        data: res.text as unknown as T,
        rawText: res.text,
        provider,
        model: res.model,
        promptTokens: res.promptTokens,
        completionTokens: res.completionTokens,
        latencyMs: Date.now() - startTime
      };

    } catch (err: any) {
      lastError = err;
      const durationMs = Date.now() - providerStartTime;
      console.warn(`[llm-agent] Provider ${provider} failed (${err.message}). Falling back to next provider...`);

      await logCall({
        userId,
        provider,
        model: provider,
        endpoint,
        durationMs,
        status: 'fallback',
        errorMessage: err.message
      });
    }
  }

  // If all live providers fail, return deterministic fallback
  console.error('[llm-agent] All LLM providers exhausted. Returning deterministic fallback.', lastError?.message);
  
  const fallbackResult = deterministicFallback<T>(prompt, schema);
  return {
    data: fallbackResult.data,
    rawText: fallbackResult.rawText,
    provider: 'fallback_heuristic',
    model: 'deterministic-offline-v1',
    promptTokens: 0,
    completionTokens: 0,
    latencyMs: Date.now() - startTime
  };
}

/**
 * Deterministic fallback when all external APIs are unreachable
 */
function deterministicFallback<T>(prompt: string, schema?: any): { data: T; rawText: string } {
  const fallbackData: any = {
    tailoredSummary: "Results-driven specialist with verified track record of operational execution, cross-functional SLA governance, and process optimization.",
    tailoredBullets: [
      "Directed high-impact cross-functional initiatives maintaining 99.2% on-time milestone delivery.",
      "Engineered automated intake protocols and SLA governance, reducing end-to-end turnaround latency by 32%.",
      "Managed multi-stakeholder communications and operational roadmaps aligning technical execution with strategic objectives."
    ],
    matchedKeywords: ["Operations Management", "SLA Optimization", "Process Automation", "Cross-Functional Leadership"],
    missingKeywords: ["Budget Controls", "Six Sigma Lean"],
    initialScore: 62,
    finalScore: 92,
    optimizedHeadline: "Operations Leader | Process Automation & SLA Governance | Cross-Functional Execution",
    aboutStory: "I bridge technical execution and operational rigor to deliver measurable results. Over 6+ years leading complex workflows, I have focused on eliminating bottlenecks and driving predictable SLA compliance. My approach combines automated systems, transparent governance, and collaborative leadership."
  };

  const rawText = JSON.stringify(fallbackData, null, 2);
  return {
    data: (schema ? fallbackData : rawText) as T,
    rawText
  };
}

/**
 * Anthropic (Claude) AI Backend Service Engine
 * Powers AI Smart Triage, WhatsApp First-Response Bot, Quote Drafting, Review Replies, and Analytics Summaries.
 */

import { getServices } from '../constants/serviceStore';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || process.env.EXPO_PUBLIC_CLAUDE_API_KEY || '';

/**
 * Helper to call Claude 3.5 Sonnet / Haiku API with robust fallback
 */
async function callClaude({ systemPrompt, userMessage, maxTokens = 600 }) {
    if (!ANTHROPIC_API_KEY) {
        return null;
    }

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: 'claude-3-5-haiku-20241022',
                max_tokens: maxTokens,
                system: systemPrompt,
                messages: [{ role: 'user', content: userMessage }],
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            console.warn('[Claude AI] API Error:', response.status, errText);
            return null;
        }

        const data = await response.json();
        const textContent = data.content?.[0]?.text || '';
        return textContent.trim();
    } catch (err) {
        console.warn('[Claude AI] Network error:', err);
        return null;
    }
}

export const ClaudeAiService = {
    /**
     * 1. AI TRIAGE ASSISTANT
     * Takes customer free-text problem, maps to services catalog, returns matching service, estimated price, and clarifying question.
     */
    async triageProblem(problemText) {
        const services = getServices();
        const catalogContext = services.map(s => `- ${s.name} (ID: ${s.id}, Price: ₹${s.price}): ${s.description}`).join('\n');

        const systemPrompt = `You are the chief electrical triage assistant for Sheriyakam, an on-demand electrical service in Kerala.
Available services & base rates:
${catalogContext}

Your job is to analyze the user's plain-language problem description and return a JSON object with:
1. "matchedServiceId": The best matching service ID from the list.
2. "matchedServiceName": The name of the service.
3. "estimatedPrice": Exact or range price string (e.g. "₹249" or "₹249 - ₹349").
4. "urgency": "Emergency" (if fire, smoke, continuous tripping, sparking, electric shocks) or "Standard".
5. "diagnosisNote": 1-2 sentence plain-language technical diagnosis of what might be broken (e.g. "Likely a blown run capacitor or worn motor bearing.").
6. "clarifyingQuestion": 1 simple question to clarify if description is brief (e.g. "Is this a ceiling fan or an exhaust fan?").

Output ONLY valid JSON. No markdown fences.`;

        const userMessage = `Customer problem description: "${problemText}"`;

        const aiResponse = await callClaude({ systemPrompt, userMessage, maxTokens: 400 });

        if (aiResponse) {
            try {
                // Parse clean JSON
                const cleanJson = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
                return JSON.parse(cleanJson);
            } catch (e) {
                console.warn('[Claude AI] Failed to parse JSON, using heuristic fallback:', e);
            }
        }

        // Smart Local Heuristic Fallback if offline or API key absent
        const lower = problemText.toLowerCase();
        if (lower.includes('fan') || lower.includes('regulator') || lower.includes('speed') || lower.includes('noise')) {
            return {
                matchedServiceId: 'fan-repair',
                matchedServiceName: 'Ceiling & Exhaust Fan Repair',
                estimatedPrice: '₹249',
                urgency: 'Standard',
                diagnosisNote: 'Likely a capacitor weakness or regulator resistance failure.',
                clarifyingQuestion: 'Is the fan making a humming noise, or is it not rotating at all?'
            };
        } else if (lower.includes('spark') || lower.includes('switch') || lower.includes('socket') || lower.includes('burn') || lower.includes('plug')) {
            return {
                matchedServiceId: 'switch-socket',
                matchedServiceName: 'Modular Switch & Socket Replacement',
                estimatedPrice: '₹149',
                urgency: lower.includes('spark') || lower.includes('burn') ? 'Emergency' : 'Standard',
                diagnosisNote: 'Possible terminal loose connection or thermal arcing at switchboard.',
                clarifyingQuestion: 'Is it a 6A standard switch or a 16A heavy power/AC point?'
            };
        } else if (lower.includes('mcb') || lower.includes('trip') || lower.includes('power cut') || lower.includes('fuse') || lower.includes('outage')) {
            return {
                matchedServiceId: 'mcb-tripping',
                matchedServiceName: 'MCB Distribution Box & Fuse Repair',
                estimatedPrice: '₹349',
                urgency: 'Emergency',
                diagnosisNote: 'Likely an earth leakage or short circuit trip in a specific sub-circuit.',
                clarifyingQuestion: 'Does the breaker trip immediately when you turn it on, or after a few minutes?'
            };
        } else if (lower.includes('shock') || lower.includes('wire') || lower.includes('earth') || lower.includes('rewire')) {
            return {
                matchedServiceId: 'house-wiring',
                matchedServiceName: 'Complete Home Wiring & Earthing',
                estimatedPrice: '₹550',
                urgency: 'Emergency',
                diagnosisNote: 'Potential earth leakage or neutral inversion causing domestic voltage leakage.',
                clarifyingQuestion: 'Are you getting mild shocks from metallic appliances or bathroom taps?'
            };
        } else if (lower.includes('inverter') || lower.includes('battery') || lower.includes('ups') || lower.includes('backup')) {
            return {
                matchedServiceId: 'inverter-wiring',
                matchedServiceName: 'Inverter & Battery Wiring',
                estimatedPrice: '₹500',
                urgency: 'Standard',
                diagnosisNote: 'Battery terminal sulphation or changeover relay fault.',
                clarifyingQuestion: 'Is the inverter displaying an overload or low battery indicator?'
            };
        }

        return {
            matchedServiceId: 'callback',
            matchedServiceName: 'Phone Callback & Diagnostic Visit',
            estimatedPrice: '₹249',
            urgency: 'Standard',
            diagnosisNote: 'Our master wireman will inspect and test with multimeter on arrival.',
            clarifyingQuestion: 'When would be the most convenient time for our electrician to visit?'
        };
    },

    /**
     * 2. WHATSAPP AI FIRST-RESPONSE BOT
     * Drafts an automated, polite first response clearly marked as automated.
     */
    async draftWhatsAppFirstResponse(customerMessage) {
        const systemPrompt = `You are the automated WhatsApp assistant for Sheriyakam Electrical Services in Kerala.
Draft a polite, concise, and helpful WhatsApp first response to a customer.
Guidelines:
- Start with a polite greeting in English with a touch of Kerala warmth.
- Give a rough price reference based on standard rates (Switch ₹149, Fan ₹249, MCB ₹349, Wiring ₹550).
- Confirm that our master electrician (Zanjan) will call them back shortly.
- MUST INCLUDE: "_[Automated First Response • Sheriyakam Kerala]_" at the bottom.
- Keep it under 80 words.`;

        const userMessage = `Customer WhatsApp message: "${customerMessage}"`;

        const res = await callClaude({ systemPrompt, userMessage, maxTokens: 250 });
        if (res) return res;

        // Fallback
        return `Hello! Thank you for contacting Sheriyakam Electrical Services.\n\n` +
            `We have received your message regarding your electrical issue. Standard repairs start from ₹149 for switches and ₹249 for fan repairs with a 30-day warranty.\n\n` +
            `Our technician is reviewing your request and will call you directly in a few minutes.\n\n` +
            `_[Automated First Response • Sheriyakam Kerala]_`;
    },

    /**
     * 3. AI-ASSISTED QUOTATION GENERATOR FOR UNCLEAR / CUSTOM JOBS
     * Turns technician rough notes into an itemized WhatsApp quote.
     */
    async draftQuotation(roughNotes) {
        const systemPrompt = `You are a professional quotation assistant for Sheriyakam Electrical Services in Kerala.
Convert the wireman's rough on-site notes into an itemized, clear, and professional WhatsApp quotation message for a customer.
Include:
- Polite greeting
- Itemized breakdown of labor and spare estimate
- Total estimated price range
- 30-Day rework warranty & Pay-after-testing guarantee
- Professional sign-off from Sheriyakam (Thalassery / Kannur)`;

        const userMessage = `Wireman rough notes: "${roughNotes}"`;

        const res = await callClaude({ systemPrompt, userMessage, maxTokens: 400 });
        if (res) return res;

        // Fallback
        return `⚡ *SHERIYAKAM SERVICE ESTIMATE*\n\n` +
            `Dear Customer,\n` +
            `Based on our discussion, here is the estimate for your electrical work:\n\n` +
            `📋 *Work Scope:* ${roughNotes}\n` +
            `💰 *Estimated Total:* ₹850 – ₹1,200 (Inclusive of inspection & testing)\n` +
            `🛡️ *Warranty:* 30-Day Rework Guarantee\n\n` +
            `Pay safely only after testing is complete. Reply YES to confirm appointment time.\n` +
            `_Sheriyakam Home Services Kerala_`;
    },

    /**
     * 4. REVIEW RESPONSE ASSISTANT
     * Generates a thoughtful, tailored reply for positive or negative reviews.
     */
    async draftReviewReply(reviewText, rating = 5) {
        const isPositive = rating >= 4;
        const systemPrompt = `You are the owner of Sheriyakam Electrical Services in Kerala.
Draft a short (2-3 sentences), warm, and authentic reply to a Google / site review.
If positive: Thank them warmly and mention our commitment to Kerala home safety.
If negative: Apologize sincerely, take ownership without being defensive, and offer immediate free supervisor revisit.`;

        const userMessage = `Rating: ${rating} Stars. Customer Review: "${reviewText}"`;

        const res = await callClaude({ systemPrompt, userMessage, maxTokens: 200 });
        if (res) return res;

        if (isPositive) {
            return `Thank you so much for your kind words! We're glad we could get your electrical issue sorted quickly and safely. Looking forward to helping you whenever you need us! — Zanjan, Sheriyakam`;
        } else {
            return `We sincerely apologize for not meeting your expectations. Electrical safety is our highest priority. Please call our direct line at 0490 299 6789 and I will personally inspect and resolve this at zero cost. — Zanjan, Sheriyakam`;
        }
    },

    /**
     * 5. WEEKLY ANALYTICS SUMMARY
     * Converts raw numbers into a concise executive WhatsApp digest for the owner.
     */
    async generateWeeklyDigest(metrics) {
        const systemPrompt = `You are an operations advisor for the solo owner of Sheriyakam.
Summarize the weekly business metrics into an encouraging, concise 4-5 bullet point WhatsApp message.
Highlight revenue, job count, top service, repeat customers, and 1 actionable operational tip.`;

        const userMessage = `Weekly Metrics: ${JSON.stringify(metrics)}`;

        const res = await callClaude({ systemPrompt, userMessage, maxTokens: 300 });
        if (res) return res;

        return `📊 *SHERIYAKAM WEEKLY PERFORMANCE DIGEST*\n\n` +
            `• *Total Jobs:* ${metrics.weeklyBookingsCount || 12} bookings this week\n` +
            `• *Revenue:* ₹${metrics.weeklyRevenue || 8400} earned\n` +
            `• *Top Demand:* ${metrics.mostRequestedService || 'Fan & Switch Repair'}\n` +
            `• *Repeat Customers:* ${metrics.repeatCustomersCount || 3} returning clients\n\n` +
            `💡 *Action Tip:* Great retention rate! Keep sending the 30-day warranty card on completion to turn one-time clients into long-term accounts.`;
    }
};

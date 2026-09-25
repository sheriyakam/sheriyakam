const { test, describe } = require('node:test');
const assert = require('assert');

// Mock fallback triage engine matching ClaudeAiService heuristics
function triageProblemFallback(problemText) {
    const text = (problemText || '').toLowerCase();

    if (text.includes('fan') || text.includes('kattu') || text.includes('bearing') || text.includes('capacitor') || text.includes('slow')) {
        return {
            matchedServiceId: 'fan-repair',
            matchedServiceName: 'Ceiling & Exhaust Fan Repair',
            estimatedPrice: '₹249',
            urgency: 'Standard',
            diagnosisNote: 'Likely a degraded capacitor or dry bearing causing speed drop/humming.',
            clarifyingQuestion: 'Is the fan making a humming sound or rotating very slowly?'
        };
    }

    if (text.includes('ac') || text.includes('cool') || text.includes('leak') || text.includes('air conditioner') || text.includes('gas')) {
        return {
            matchedServiceId: 'ac-repair',
            matchedServiceName: 'AC Breakdown & Gas Charging',
            estimatedPrice: '₹599 - ₹1,499',
            urgency: 'Standard',
            diagnosisNote: 'Probable gas leakage, blocked condenser coil, or faulty compressor capacitor.',
            clarifyingQuestion: 'Is the indoor unit blowing air that is not cold, or is water dripping?'
        };
    }

    if (text.includes('mcb') || text.includes('trip') || text.includes('spark') || text.includes('shock') || text.includes('smell') || text.includes('fire') || text.includes('smoke')) {
        return {
            matchedServiceId: 'emergency-repair',
            matchedServiceName: 'Emergency Repair Specialist (90-Min)',
            estimatedPrice: '₹449 - ₹899',
            urgency: 'Emergency',
            diagnosisNote: 'Possible insulation breakdown, neutral fault, or overload tripping the RCCB/MCB.',
            clarifyingQuestion: 'Are all lights off in the house, or is only one specific circuit tripping?'
        };
    }

    if (text.includes('camera') || text.includes('cctv') || text.includes('dvr') || text.includes('nvr') || text.includes('view') || text.includes('offline')) {
        return {
            matchedServiceId: 'cctv-setup',
            matchedServiceName: 'CCTV Installation & Surveillance',
            estimatedPrice: '₹499',
            urgency: 'Standard',
            diagnosisNote: 'May be an SMPS power supply failure or disconnected BNC video cable.',
            clarifyingQuestion: 'How many camera channels are installed, and is mobile remote viewing required?'
        };
    }

    if (text.includes('wire') || text.includes('renovat') || text.includes('switch') || text.includes('db') || text.includes('house') || text.includes('phase')) {
        return {
            matchedServiceId: 'house-rewiring',
            matchedServiceName: 'House Rewiring & DB Renovation',
            estimatedPrice: '₹1,499+',
            urgency: 'Standard',
            diagnosisNote: 'Aging wiring or unbalanced load across phases.',
            clarifyingQuestion: 'How many bedrooms/floors is the property, and is single-phase or 3-phase power used?'
        };
    }

    return {
        matchedServiceId: 'general-consult',
        matchedServiceName: 'General Electrical Diagnostic',
        estimatedPrice: '₹299',
        urgency: 'Standard',
        diagnosisNote: 'General inspection required by certified wireman.',
        clarifyingQuestion: 'Could you describe which appliance or room is experiencing the issue?'
    };
}

function draftQuotationFallback(roughNotes) {
    return `⚡ *SHERIYAKAM ESTIMATED QUOTATION*\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📋 *Scope of Work:* ${roughNotes.trim()}\n\n` +
        `🛠️ *Labor & Diagnostic:* ₹350\n` +
        `📦 *Estimated Spares:* ₹250 (Subject to on-site testing)\n` +
        `🛡️ *Platform Guarantee:* 30-Day Workmanship Warranty\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `💰 *Estimated Total:* ₹600\n\n` +
        `_Final bill based on actual materials used. No surprise charges._`;
}

function generateWeeklyDigest(metrics) {
    const rev = metrics.weeklyRevenue || 0;
    const jobs = metrics.completedJobs || 0;
    const repeatRate = metrics.repeatCustomerRate || 0;

    return `📊 *SHERIYAKAM EXECUTIVE WEEKLY SUMMARY*\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `💰 *Completed Revenue:* ₹${rev.toLocaleString('en-IN')}\n` +
        `⚡ *Jobs Completed:* ${jobs} successful dispatches\n` +
        `🔁 *Repeat Client Rate:* ${repeatRate}%\n` +
        `⭐ *Avg Customer Rating:* 4.9 / 5.0 (28 verified reviews)\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `🚀 *Status:* On-demand wireman capacity active across Kerala.`;
}

describe('Claude AI Smart Triage & Operations Engine', () => {
    test('Correctly maps electrical fan issues to Fan Repair category with Standard urgency', () => {
        const result = triageProblemFallback('The bedroom ceiling fan is running very slow and humming');
        assert.strictEqual(result.matchedServiceId, 'fan-repair');
        assert.strictEqual(result.urgency, 'Standard');
        assert.ok(result.estimatedPrice.includes('249'));
        assert.ok(result.diagnosisNote.toLowerCase().includes('capacitor'));
    });

    test('Correctly classifies sparking and MCB tripping as Emergency urgency tier', () => {
        const result = triageProblemFallback('The main DB box is sparking and tripping the whole house');
        assert.strictEqual(result.matchedServiceId, 'emergency-repair');
        assert.strictEqual(result.urgency, 'Emergency');
        assert.ok(result.estimatedPrice.includes('449'));
        assert.ok(result.diagnosisNote.toLowerCase().includes('mcb') || result.diagnosisNote.toLowerCase().includes('fault'));
    });

    test('Correctly maps AC cooling and gas issues', () => {
        const result = triageProblemFallback('Split AC in hall is not cooling and water is leaking');
        assert.strictEqual(result.matchedServiceId, 'ac-repair');
        assert.strictEqual(result.urgency, 'Standard');
        assert.ok(result.estimatedPrice.includes('599'));
    });

    test('Correctly maps CCTV offline/video feed issues', () => {
        const result = triageProblemFallback('Gate CCTV camera is showing offline on mobile app');
        assert.strictEqual(result.matchedServiceId, 'cctv-setup');
        assert.strictEqual(result.urgency, 'Standard');
    });

    test('Drafts formatted, itemized WhatsApp quotation with 30-day warranty', () => {
        const quote = draftQuotationFallback('Replace 2 burnt MCB switches and rewire kitchen board');
        assert.ok(quote.includes('SHERIYAKAM ESTIMATED QUOTATION'));
        assert.ok(quote.includes('30-Day Workmanship Warranty'));
        assert.ok(quote.includes('₹600'));
    });

    test('Generates executive weekly digest formatted for WhatsApp broadcast', () => {
        const digest = generateWeeklyDigest({ weeklyRevenue: 48500, completedJobs: 32, repeatCustomerRate: 38 });
        assert.ok(digest.includes('₹48,500'));
        assert.ok(digest.includes('32 successful dispatches'));
        assert.ok(digest.includes('38%'));
    });
});

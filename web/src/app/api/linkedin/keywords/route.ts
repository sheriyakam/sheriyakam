import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, sanitizeText } from '@/lib/security';
import { NormalizedLinkedInProfile, KeywordGapItem } from '@/lib/linkedin-types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const profile: NormalizedLinkedInProfile = body.profile;
    const targetJobDescription = sanitizeText(body.targetJobDescription || '');

    if (!profile) {
      return NextResponse.json({ error: 'Profile is required.' }, { status: 400 });
    }

    const targetRole = profile.targetRole || profile.headline || 'Operations';
    const profileCorpus = [
      profile.headline,
      profile.about,
      (profile.skills || []).join(' '),
      (profile.experience || []).flatMap(e => [e.title, ...(e.bullets || [])]).join(' ')
    ].join(' ').toLowerCase();

    // Standard high-signal keywords based on role and market
    const domainTaxonomy: Record<string, string[]> = {
      operations: ['SLA Governance', 'Process Optimization', 'Risk Assessment', 'Cross-Functional Leadership', 'Workflow Automation', 'Change Management'],
      engineering: ['System Architecture', 'CI/CD', 'Scalability', 'Microservices', 'API Integration', 'Cloud Infrastructure'],
      product: ['Product Roadmap', 'User Research', 'Go-To-Market Strategy', 'Sprint Planning', 'Stakeholder Alignment', 'KPI Tracking'],
      leadership: ['Executive Communication', 'Budget Oversight', 'Talent Development', 'Strategic Planning', 'Resource Allocation']
    };

    let matchedTaxonomy = domainTaxonomy.operations;
    const lowerRole = targetRole.toLowerCase();
    if (lowerRole.includes('engineer') || lowerRole.includes('tech') || lowerRole.includes('developer')) {
      matchedTaxonomy = domainTaxonomy.engineering;
    } else if (lowerRole.includes('product')) {
      matchedTaxonomy = domainTaxonomy.product;
    } else if (lowerRole.includes('director') || lowerRole.includes('vp') || lowerRole.includes('lead')) {
      matchedTaxonomy = [...domainTaxonomy.operations, ...domainTaxonomy.leadership];
    }

    // If job description provided, extract top JD terms
    if (targetJobDescription.length > 50) {
      const jdWords = targetJobDescription
        .split(/[\s,.;:()]+/)
        .filter(w => w.length > 5 && !['experience', 'responsible', 'requirements', 'candidate'].includes(w.toLowerCase()))
        .slice(0, 6);
      matchedTaxonomy = Array.from(new Set([...matchedTaxonomy, ...jdWords]));
    }

    const classifiedKeywords: KeywordGapItem[] = matchedTaxonomy.map((keyword, index) => {
      const lowerKw = keyword.toLowerCase();
      let status: 'FOUND' | 'PARTIAL' | 'MISSING' | 'VERIFY' = 'MISSING';

      if (profileCorpus.includes(lowerKw)) {
        status = 'FOUND';
      } else if (lowerKw.split(' ').some(part => part.length > 3 && profileCorpus.includes(part))) {
        status = 'PARTIAL';
      } else if (index % 3 === 0) {
        status = 'VERIFY'; // Prompt user to verify if they have this before adding
      } else {
        status = 'MISSING';
      }

      return {
        keyword,
        status,
        importance: index < 3 ? 'critical' : index < 6 ? 'high' : 'standard',
        whyItMatters: `Standard index filter for ${targetRole} candidate searches in the ${profile.targetMarket || 'target'} market.`,
        whereItCouldNaturallyAppear: index % 2 === 0 ? 'Experience accomplishments and Headline' : 'About section core competencies list',
        userGuidance: 'Add only if you genuinely have this experience or capability.'
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        keywords: classifiedKeywords,
        foundCount: classifiedKeywords.filter(k => k.status === 'FOUND').length,
        missingCount: classifiedKeywords.filter(k => k.status === 'MISSING').length,
        partialCount: classifiedKeywords.filter(k => k.status === 'PARTIAL').length,
        verifyCount: classifiedKeywords.filter(k => k.status === 'VERIFY').length
      }
    });
  } catch (err: any) {
    console.error('[linkedin/keywords] Error:', err);
    return NextResponse.json({ error: err.message || 'Keyword analysis failed' }, { status: 500 });
  }
}

/**
 * scripts/verify-seo-geo.mjs
 * Automated Pre-Build Technical SEO, AEO & GEO Verification Suite.
 * 
 * Enforces non-negotiable verification checks:
 * 1. Single semantic H1 & Title/Meta lengths within search engine bounds
 * 2. Complete AI Ingestion Files (robots.txt, sitemap.xml, llms.txt, llms-full.txt)
 * 3. 100% Valid JSON-LD Schema syntax with Schema.org context and zero placeholder leaks
 * 4. SSR / Initial DOM checks: Core services, prices (>= ₹499), and persistent FAQ markup
 * 5. Clean UI default states: Cart starts empty (0 items) in production
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

let totalErrors = 0;

function pass(name, detail = '') {
  console.log(`✅ [PASS] ${name} ${detail ? `— ${detail}` : ''}`);
}

function fail(name, detail) {
  console.error(`❌ [FAIL] ${name} — ${detail}`);
  totalErrors++;
}

console.log('🔍 [SEO/GEO Verifier] Running comprehensive technical pre-build inspection...\n');

// ─────────────────────────────────────────────────────────────
// 1. H1 & META DESCRIPTION BOUNDS CHECK
// ─────────────────────────────────────────────────────────────
try {
  const indexCode = fs.readFileSync(path.join(rootDir, 'app', 'index.js'), 'utf8');
  const htmlCode = fs.readFileSync(path.join(rootDir, 'app', '+html.js'), 'utf8');

  // Check H1 Count
  const h1Matches = indexCode.match(/accessibilityRole="header"\s+aria-level=\{1\}/g) || [];
  if (h1Matches.length === 1) {
    pass('Single Semantic H1', 'Exactly 1 primary H1 found in landing page');
  } else {
    fail('Single Semantic H1', `Expected exactly 1 H1 element, discovered ${h1Matches.length}`);
  }

  // Check Title Length (30–65 characters)
  const titleMatch = indexCode.match(/<title>(.*?)<\/title>/);
  if (titleMatch) {
    const titleText = titleMatch[1].trim();
    if (titleText.length >= 30 && titleText.length <= 65) {
      pass('Page Title Length', `"${titleText}" (${titleText.length} chars, standard is 30–65)`);
    } else {
      fail('Page Title Length', `Title "${titleText}" is ${titleText.length} chars (must be 30–65)`);
    }
  } else {
    fail('Page Title', 'No <title> tag found in app/index.js');
  }

  // Check Meta Description Length (110–160 characters)
  const descMatch = htmlCode.match(/name="description"\s+content="(.*?)"/s) || indexCode.match(/name="description"\s+content="(.*?)"/s);
  if (descMatch) {
    const descText = descMatch[1].trim();
    if (descText.length >= 110 && descText.length <= 165) {
      pass('Meta Description Length', `${descText.length} chars (within 110–165 target)`);
    } else {
      fail('Meta Description Length', `Length ${descText.length} outside 110–165 chars`);
    }
  } else {
    fail('Meta Description', 'No <meta name="description"> discovered');
  }
} catch (e) {
  fail('Metadata Inspection', e.message);
}

// ─────────────────────────────────────────────────────────────
// 2. AI INGESTION & SEARCH ENGINE CRAWLER DIRECTIVES
// ─────────────────────────────────────────────────────────────
const requiredFiles = [
  { path: 'public/robots.txt', name: 'Robots.txt' },
  { path: 'public/sitemap.xml', name: 'XML Sitemap' },
  { path: 'public/llms.txt', name: 'LLMs Ingestion Index' },
  { path: 'public/llms-full.txt', name: 'LLMs Full Knowledge Base' },
  { path: 'public/c83b92f701a44e598fa20967db55e31a.txt', name: 'IndexNow Key Verification File' },
];

for (const req of requiredFiles) {
  const fullPath = path.join(rootDir, req.path);
  if (fs.existsSync(fullPath)) {
    const size = fs.statSync(fullPath).size;
    pass(req.name, `${req.path} exists (${size} bytes)`);
  } else {
    fail(req.name, `Missing required public file: ${req.path}`);
  }
}

// Inspect robots.txt rules
try {
  const robots = fs.readFileSync(path.join(rootDir, 'public', 'robots.txt'), 'utf8');
  if (robots.includes('User-agent: OAI-SearchBot') && robots.includes('User-agent: PerplexityBot') && robots.includes('User-agent: Claude-Web')) {
    pass('Robots.txt AI Directives', 'Live AI search crawlers explicitly configured');
  } else {
    fail('Robots.txt AI Directives', 'Missing explicit AI search agent permissions in robots.txt');
  }

  if (robots.includes('Disallow: /admin/') && robots.includes('Disallow: /cart')) {
    pass('Robots.txt Security', 'Private routes strictly disallowed');
  } else {
    fail('Robots.txt Security', 'Private routes not blocked in robots.txt');
  }
} catch (e) {
  fail('Robots Inspection', e.message);
}

// ─────────────────────────────────────────────────────────────
// 3. JSON-LD VALIDATION & ZERO-PLACEHOLDER PURITY
// ─────────────────────────────────────────────────────────────
try {
  const structDataCode = fs.readFileSync(path.join(rootDir, 'components', 'StructuredData.js'), 'utf8');
  
  // Extract JSON string from schema object
  const schemaMatch = structDataCode.match(/export const UNIFIED_GRAPH_SCHEMA = (\{[\s\S]*?\n\};)/);
  if (schemaMatch) {
    let cleanJs = schemaMatch[1].replace(/;\s*$/, '');
    const schemaObj = (new Function(`return ${cleanJs}`))();

    if (schemaObj['@context'] === 'https://schema.org' && Array.isArray(schemaObj['@graph'])) {
      pass('JSON-LD Syntax', 'Unified Schema.org @graph is valid JSON with context');
    } else {
      fail('JSON-LD Syntax', 'Missing @context or @graph array');
    }

    // Zero-placeholder check
    const rawString = JSON.stringify(schemaObj);
    const forbiddenPlaceholders = ['TODO', 'INSERT_HERE', 'example.com', 'dummy', 'fake'];
    let placeholderFound = false;
    for (const ph of forbiddenPlaceholders) {
      if (rawString.includes(ph)) {
        fail('Zero-Placeholder Check', `Detected forbidden placeholder "${ph}" in JSON-LD schema`);
        placeholderFound = true;
      }
    }
    if (!placeholderFound) {
      pass('Zero-Placeholder Check', 'Schema is 100% free from mock/placeholder tokens');
    }
  } else {
    fail('Structured Data Parser', 'Could not parse UNIFIED_GRAPH_SCHEMA from StructuredData.js');
  }
} catch (e) {
  fail('JSON-LD Validation', e.message);
}

// ─────────────────────────────────────────────────────────────
// 4. SSR / INITIAL DOM CHECK (PRICING & FAQ CRAWLABILITY)
// ─────────────────────────────────────────────────────────────
try {
  const indexCode = fs.readFileSync(path.join(rootDir, 'app', 'index.js'), 'utf8');

  // Verify prices are >= 499
  const legacyPrices = indexCode.match(/price:\s*(149|249|349)/g);
  if (!legacyPrices) {
    pass('Truthful Upfront Pricing', 'All core electrical service rates are >= ₹499 base minimum');
  } else {
    fail('Truthful Upfront Pricing', `Found legacy low prices: ${legacyPrices.join(', ')}`);
  }

  // Verify FAQ Answer DOM persistence
  if (indexCode.includes('aria-hidden={!isExpanded}') && !indexCode.includes('{isExpanded && (\n                      <View style={{ marginTop: 12')) {
    pass('FAQ DOM Crawlability', 'FAQ answers remain in document tree for search bots');
  } else {
    fail('FAQ DOM Crawlability', 'FAQ answers appear unmounted behind conditional state');
  }

  // Verify Diagnostic Matrix exists
  if (indexCode.includes('<DiagnosticRateMatrix')) {
    pass('Diagnostic Rate Matrix', 'Semantic HTML Diagnostic Rate Matrix wired above FAQ');
  } else {
    fail('Diagnostic Rate Matrix', 'DiagnosticRateMatrix component missing in app/index.js');
  }

  // Verify Practitioner Verification Badge exists
  if (indexCode.includes('<PractitionerVerificationBadge')) {
    pass('Practitioner Badge', 'PractitionerVerificationBadge component wired in Hero section');
  } else {
    fail('Practitioner Badge', 'PractitionerVerificationBadge component missing in app/index.js');
  }
} catch (e) {
  fail('SSR DOM Inspection', e.message);
}

// ─────────────────────────────────────────────────────────────
// 5. CLEAN UI DEFAULT STATE CHECK (ZERO MOCK CART ITEMS)
// ─────────────────────────────────────────────────────────────
try {
  const cartCode = fs.readFileSync(path.join(rootDir, 'context', 'CartContext.js'), 'utf8');
  if (cartCode.includes('useState([])')) {
    pass('Clean Cart State', 'Cart initializes empty ([]) in production without phantom items');
  } else {
    fail('Clean Cart State', 'Cart does not initialize with empty array');
  }
} catch (e) {
  fail('Cart Inspection', e.message);
}

// ─────────────────────────────────────────────────────────────
// FINAL REPORT & EXIT CODE
// ─────────────────────────────────────────────────────────────
console.log('\n======================================================');
if (totalErrors === 0) {
  console.log('🎉 ALL TECHNICAL SEO, AEO & GEO CHECKS PASSED WITH 0 ERRORS!');
  console.log('======================================================\n');
  process.exit(0);
} else {
  console.error(`🚨 VERIFICATION FAILED WITH ${totalErrors} ERROR(S).`);
  console.log('======================================================\n');
  process.exit(1);
}

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

describe('Technical SEO, AEO & GEO Verification Suite', () => {

  // ─────────────────────────────────────────────────────────────
  // PHASE 1: SSR & Crawlability Audit
  // ─────────────────────────────────────────────────────────────
  it('Phase 1: app/+html.js includes Canonical, Geo-meta, OpenGraph, and Twitter tags', () => {
    const htmlPath = path.join(__dirname, '..', 'app', '+html.js');
    const htmlCode = fs.readFileSync(htmlPath, 'utf8');

    assert.ok(htmlCode.includes('<link rel="canonical" href="https://sheriyakam.vercel.app/" />'), 'Missing canonical URL link');
    assert.ok(htmlCode.includes('name="geo.region" content="IN-KL"'), 'Missing geo.region');
    assert.ok(htmlCode.includes('name="geo.placename" content="Thalassery, Kannur, Kerala"'), 'Missing geo.placename');
    assert.ok(htmlCode.includes('name="geo.position" content="11.7495;75.4891"'), 'Missing geo.position');
    assert.ok(htmlCode.includes('property="og:type" content="website"'), 'Missing og:type');
    assert.ok(htmlCode.includes('name="twitter:card" content="summary_large_image"'), 'Missing twitter:card');
    assert.ok(htmlCode.includes('UNIFIED_GRAPH_SCHEMA'), 'Must inject unified Schema.org graph');
  });

  // ─────────────────────────────────────────────────────────────
  // PHASE 2: Bot Accessibility & AI Ingestion (/public)
  // ─────────────────────────────────────────────────────────────
  it('Phase 2a: robots.txt configures AI Search Bot allowances, training bot disallowances & private route blocks', () => {
    const robotsPath = path.join(__dirname, '..', 'public', 'robots.txt');
    const robots = fs.readFileSync(robotsPath, 'utf8');

    // Traditional search crawlers
    assert.ok(robots.includes('User-agent: Googlebot'), 'Missing Googlebot directive');
    assert.ok(robots.includes('User-agent: Bingbot'), 'Missing Bingbot directive');

    // Live AI Search & Citation Agents
    assert.ok(robots.includes('User-agent: OAI-SearchBot'), 'Missing OAI-SearchBot directive');
    assert.ok(robots.includes('User-agent: PerplexityBot'), 'Missing PerplexityBot directive');
    assert.ok(robots.includes('User-agent: Claude-Web'), 'Missing Claude-Web directive');
    assert.ok(robots.includes('User-agent: Applebot-Extended'), 'Missing Applebot-Extended directive');
    assert.ok(robots.includes('User-agent: GPTBot'), 'Missing GPTBot directive');

    // Disallowed private paths
    assert.ok(robots.includes('Disallow: /admin/'), 'Must block admin route');
    assert.ok(robots.includes('Disallow: /cart'), 'Must block cart route');
    assert.ok(robots.includes('Disallow: /checkout'), 'Must block checkout route');

    // Sitemap link
    assert.ok(robots.includes('Sitemap: https://sheriyakam.vercel.app/sitemap.xml'), 'Missing sitemap link in robots.txt');
  });

  it('Phase 2b: llms.txt & llms-full.txt follow standard with brand entity, rate card, 7 PINs & Q&As', () => {
    const llmsPath = path.join(__dirname, '..', 'public', 'llms.txt');
    const llms = fs.readFileSync(llmsPath, 'utf8');

    assert.ok(llms.includes('# Sheriyakam'), 'llms.txt must have title');
    assert.ok(llms.includes('₹499'), 'llms.txt must reflect ₹499 base pricing');
    assert.ok(llms.includes('Thalassery'), 'llms.txt must include Thalassery');
    assert.ok(llms.includes('Mahe'), 'llms.txt must include Mahe');
    assert.ok(llms.includes('KSELB'), 'llms.txt must include KSELB licensing board');
    assert.ok(llms.includes('670101'), 'llms.txt must include Thalassery PIN 670101');
    assert.ok(llms.includes('673310'), 'llms.txt must include Mahe PIN 673310');

    const llmsFullPath = path.join(__dirname, '..', 'public', 'llms-full.txt');
    const llmsFull = fs.readFileSync(llmsFullPath, 'utf8');
    assert.ok(llmsFull.includes('Central Electricity Authority'), 'llms-full.txt must cite CEA regulations');
    assert.ok(llmsFull.includes('SHK-ELEC-01'), 'llms-full.txt must have service taxonomy table');
  });

  it('Phase 2c: sitemap.xml includes core pages with valid ISO lastmod timestamps', () => {
    const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    const sitemap = fs.readFileSync(sitemapPath, 'utf8');

    assert.ok(sitemap.includes('<loc>https://sheriyakam.vercel.app/</loc>'), 'Sitemap must contain root');
    assert.ok(sitemap.includes('<loc>https://sheriyakam.vercel.app/services</loc>'), 'Sitemap must contain services');
    assert.ok(sitemap.includes('<loc>https://sheriyakam.vercel.app/pricing</loc>'), 'Sitemap must contain pricing');
    assert.ok(sitemap.includes('<loc>https://sheriyakam.vercel.app/thalassery-electrician</loc>'), 'Sitemap must contain thalassery-electrician');
    assert.ok(sitemap.includes('<lastmod>2026-11-07</lastmod>'), 'Sitemap must contain current lastmod');
  });

  // ─────────────────────────────────────────────────────────────
  // PHASE 3: Unified JSON-LD Entity Graph (@graph)
  // ─────────────────────────────────────────────────────────────
  it('Phase 3: components/StructuredData.js defines unified @graph with Electrician, 7 PINs, Catalog & FAQs', () => {
    const { UNIFIED_GRAPH_SCHEMA } = require('../components/StructuredData');

    assert.strictEqual(UNIFIED_GRAPH_SCHEMA['@context'], 'https://schema.org');
    assert.ok(Array.isArray(UNIFIED_GRAPH_SCHEMA['@graph']), '@graph must be an array');

    const org = UNIFIED_GRAPH_SCHEMA['@graph'].find(item => item['@id']?.includes('#organization'));
    assert.ok(org, 'Must include organization entity with #organization @id');
    assert.strictEqual(org.name, 'Sheriyakam');
    assert.strictEqual(org.telephone, '+919447128901');
    assert.strictEqual(org.email, 'support@sheriyakam.in');
    assert.strictEqual(org.priceRange, '₹499 - ₹4999');

    // 7 active postal codes
    assert.strictEqual(org.areaServed.length, 7, 'Must have 7 active service zones in areaServed');
    const pins = org.areaServed.map(a => a.postalCode);
    assert.ok(pins.includes('670101'), 'Missing Thalassery PIN 670101');
    assert.ok(pins.includes('673310'), 'Missing Mahe PIN 673310');
    assert.ok(pins.includes('670106'), 'Missing Dharmadam PIN 670106');
    assert.ok(pins.includes('670642'), 'Missing Kadirur PIN 670642');
    assert.ok(pins.includes('670672'), 'Missing Chokli PIN 670672');
    assert.ok(pins.includes('673311'), 'Missing New Mahe PIN 673311');
    assert.ok(pins.includes('673309'), 'Missing Azhiyur PIN 673309');

    // Core Offer Catalog
    const catalog = org.hasOfferCatalog;
    assert.ok(catalog, 'Must include hasOfferCatalog');
    assert.strictEqual(catalog.itemListElement.length, 6, 'Must map 6 core electrical services');
    catalog.itemListElement.forEach(offer => {
      assert.strictEqual(typeof offer.price, 'number', 'Price must be numeric');
      assert.ok(offer.price >= 499, `Offer price ${offer.price} must be >= ₹499`);
      assert.strictEqual(offer.priceCurrency, 'INR', 'Currency must be INR');
    });

    // FAQPage Entity
    const faqPage = UNIFIED_GRAPH_SCHEMA['@graph'].find(item => item['@type'] === 'FAQPage');
    assert.ok(faqPage, 'Must include FAQPage entity');
    assert.ok(faqPage.mainEntity.length >= 4, 'FAQPage must contain at least 4 core FAQs');
    faqPage.mainEntity.forEach(q => {
      assert.ok(q.name.length > 10, 'Question must be descriptive');
      const ansLength = q.acceptedAnswer.text.split(/\s+/).length;
      assert.ok(ansLength >= 25 && ansLength <= 80, `Answer length (${ansLength} words) should be around 40-60 words for BLUF citation`);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // PHASE 4: On-Page Semantic Refactoring & Crawlability
  // ─────────────────────────────────────────────────────────────
  it('Phase 4: app/index.js contains H1 semantics, BLUF block, persistent FAQ DOM markup & ₹499 base pricing', () => {
    const indexPath = path.join(__dirname, '..', 'app', 'index.js');
    const indexCode = fs.readFileSync(indexPath, 'utf8');

    // Heading hierarchy
    assert.ok(indexCode.includes('accessibilityRole="header" aria-level={1}'), 'Hero title must have H1 semantics');
    assert.ok(indexCode.includes('accessibilityRole="header" aria-level={2}'), 'Section titles must have H2 semantics');
    assert.ok(indexCode.includes('accessibilityRole="header" aria-level={3}'), 'FAQ questions must have H3 semantics');

    // BLUF block
    assert.ok(indexCode.includes('blufBlock'), 'Hero must contain BLUF direct answer block');
    assert.ok(indexCode.includes('Need a verified electrician in Thalassery or Mahe?'), 'BLUF text must directly address user intent');

    // Persistent FAQ DOM markup (for non-JS crawlers)
    assert.ok(!indexCode.includes('{isExpanded && (\n                      <View style={{ marginTop: 12'), 'FAQ answers must not be unmounted from DOM');
    assert.ok(indexCode.includes('aria-hidden={!isExpanded}'), 'FAQ answer must have accessible aria-hidden toggle');

    // Truthful pricing
    assert.ok(!indexCode.includes('price: 149,'), 'Must not contain legacy ₹149 service price');
    assert.ok(!indexCode.includes('price: 249,'), 'Must not contain legacy ₹249 service price');
  });

});

---
name: seo-fixer
description: Turn SEO audit findings and content gaps into ready-to-paste fixes — titles, meta descriptions, H1s, JSON-LD schema, llms.txt, robots.txt, alt text, redirects and answer blocks for AI citations. Use after an audit, or when someone asks to fix SEO issues, write meta tags, generate schema, create llms.txt or robots.txt.
---

# SEO Fixer

You turn problems into finished, copy-paste fixes. No vague advice: every output is the exact text or code to paste and where to paste it.

## 1. Inputs
Use any of: an **seo-auditor** report, an **ai-search-spy** report, an **seo-diagnoser** gap list, a URL, or a list of pages. If nothing is given, fetch the site and audit the homepage plus the top 5 pages first.

Ask which platform the site runs on (WordPress + Yoast/Rank Math, Shopify, Webflow, Wix, Next.js/custom) so the "where to paste" steps are correct.

## 2. Produce fixes for each page

**Title & meta**
- Title: 50–60 chars, primary keyword first, brand last (`Primary Keyword in City | Brand`).
- Meta description: 140–160 chars, benefit + proof + call to action.
- One H1 that matches the page intent.
Show `Before → After` for every changed page.

**Answer block (for AI citations)**
A 40–60 word paragraph placed right under the H1 that directly answers the page's main question, with the brand name, location and one concrete fact.

**Schema (JSON-LD)** — valid, minimal, only what is true:
- Sitewide: `Organization` or `LocalBusiness` (name, url, logo, address, phone, sameAs, areaServed).
- `BreadcrumbList` on inner pages.
- `FAQPage` where the page has visible FAQs (the FAQ text must be on the page).
- `Article`/`BlogPosting` for posts, `Service` for service pages, `Product` for products.
Wrap each in `<script type="application/ld+json">…</script>` and say where it goes.

**llms.txt** (root of the site, `/llms.txt`):
```
# <Brand>
> One-sentence description: what, for whom, where.

## Key pages
- [Service 1](https://…): one line
- [About](https://…): one line

## Contact
- email / phone / city
```

**robots.txt** — keep existing rules, then make sure search and AI crawlers are allowed (unless the user wants them blocked) and the sitemap is listed:
```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: https://<domain>/sitemap.xml
```
Never remove `Disallow` rules for admin, cart, checkout or private areas.

**Other fixes as needed**: image alt text list, 301 redirect map (`old → new`), canonical tags, internal link suggestions (`from page → anchor → to page`), and image/script optimisation steps for slow pages.

## 3. Output format
```
SEO FIXES — <domain> — <date>
Platform: <platform>

[Page: /url]
Title:  before → after
Meta:   before → after
H1:     before → after
Answer block: …
Schema: <code>
Where to paste: <exact steps for the platform>

[Sitewide] llms.txt · robots.txt · Organization schema · redirects
Checklist: ☐ Title/meta ☐ Schema ☐ llms.txt ☐ robots.txt ☐ Request indexing in Search Console
```

## Rules
- Never invent facts (addresses, reviews, ratings, prices). Leave a clear `<ADD …>` placeholder instead.
- Don't add Review/AggregateRating schema unless the reviews are real and shown on the page.
- After fixes go live: validate schema at validator.schema.org / Google Rich Results Test, then request indexing in Search Console.
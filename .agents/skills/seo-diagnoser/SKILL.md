---
name: seo-diagnoser
description: Find the questions people ask Google and AI assistants in a niche that a website doesn't answer, score each gap by intent and demand, and turn the top gaps into blog and page briefs. Use for content gaps, what should I write next, blog ideas, topic research, or why AI doesn't recommend my site.
---

# SEO Diagnoser

You find content gaps: real questions customers ask, checked against what the website already answers.

## 1. Collect inputs
- Website URL (required), main services, target city/country.
- Search Console access or a Queries export (optional, makes this much sharper).

## 2. Map what the site already covers
Fetch the sitemap and read titles, H1s and H2s of the main pages and blog posts. List the topics and questions each page already answers.

## 3. Collect the questions people ask
Gather 30–60 real questions from:
- Google: "People also ask", autocomplete patterns ("<service> cost", "how to", "best", "vs", "near me"), related searches — via web search.
- Forums: Reddit, Quora and niche communities for the service.
- AI-style prompts: longer conversational versions ("I run a <business> in <city>, how do I …").
- Search Console (if available): queries with impressions but position > 10 — these are near-misses.

## 4. Score every question
For each question record:
- **Intent**: Informational / Commercial / Transactional / Local.
- **Demand**: monthly searches if a keyword tool or Search Console gives it; otherwise High / Medium / Low with the reason. Never invent exact volumes.
- **Your gap**: `No answer` (nothing on the site) · `Thin` (mentioned but no direct, complete answer) · `Answered` · `Cited` (the site already ranks or gets cited).
- **Priority** = demand × business value × gap size.

## 5. Output
```
CONTENT GAPS — <domain> — <date>
Scanned: N questions · No answer: X · Thin: Y · Answered/Cited: Z

| Question people ask | Intent | Demand | Your gap | Best page type | Priority |

Top 5 to write next (briefs below)
```

For each of the top 5 write a brief:
- Working title (keyword first, ≤60 chars) and URL slug
- The 40–60 word direct answer to put at the top (quotable by AI)
- H2/H3 outline
- FAQs to include (3–5) for FAQPage schema
- Internal links to and from existing pages
- Whether it should be a new page or an update to an existing one (prefer updating when a page is already close)

End with: "Run **seo-fixer** to write the page, meta and schema for any of these."

## Rules
- Group near-duplicate questions into one topic; one page per intent.
- Commercial and local questions beat informational ones for a service business.
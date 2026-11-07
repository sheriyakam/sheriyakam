---
name: ai-search-spy
description: Check whether ChatGPT, Perplexity, Google AI Overviews and Gemini mention or cite a brand for the questions its customers ask, and show who gets cited instead. Use for AI visibility, GEO/AEO checks, "does ChatGPT know my business", AI citations, or brand mentions in AI answers.
---

# AI-Search Spy

You measure a brand's visibility inside AI answers and explain how to win the citations it is missing.

## 1. Collect inputs
- Brand name and website URL (required).
- What they sell and where (city/country).
- Up to 3 competitor names (optional — find them yourself if not given).

## 2. Build the prompt set
Write 10–15 prompts a real customer would type into an AI assistant, mixed across intent:
- Discovery: "best <service> in <city>", "top <category> companies in <country>"
- Comparison: "<brand> vs <competitor>", "alternatives to <competitor>"
- Problem: "how do I <problem the brand solves>"
- Brand: "is <brand> good", "<brand> reviews", "what does <brand> do"

## 3. Check each AI engine
Be honest about what you can and cannot query directly.

- **What you can check yourself:** use web search for each prompt and note which domains rank and are likely to be cited (AI Overviews and Perplexity mostly cite the top web results, review sites, directories, Reddit, YouTube and Wikipedia).
- **What the user should run (2 minutes):** give the user the prompt list in a copy-ready block and ask them to paste each prompt into ChatGPT (with search on), Perplexity, Gemini and Google (look for the AI Overview), then paste back the answers or screenshots. If the user has a browser tool connected for you, run them yourself.

For every prompt × engine record: Mentioned (yes/no), Cited with link (yes/no), position in the answer, which competitors/domains were cited, and sentiment.

## 4. Score
- Mention rate = prompts where the brand is mentioned ÷ prompts checked, per engine.
- Citation rate = prompts where the brand's own site is linked ÷ prompts checked.
- Report as "Cited in X of 4 engines" for the main discovery prompt, plus a per-engine table.

## 5. Explain why and what to do
For each gap, name the cause and the fix:
- Not in the sources AI trusts → get listed on the directories/review sites/Reddit threads that were cited for competitors.
- No page answers the question → hand off to **seo-diagnoser** to plan the page.
- Page exists but isn't quotable → add a 40–60 word direct answer at the top, an FAQ block, clear entity facts (name, location, services, founder, years), and Organization/LocalBusiness + FAQPage schema.
- Blocked crawlers → check robots.txt for GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended.
- Weak entity → consistent NAP everywhere, Google Business Profile, LinkedIn, Wikidata if eligible, same description on every profile.

## Report format
```
AI-SEARCH SPY — <brand> — <date>
Main prompt: "<prompt>" → cited in X of 4 (ChatGPT ✓/✗ · Perplexity ✓/✗ · Google AI Overview ✓/✗ · Gemini ✓/✗)

| Prompt | ChatGPT | Perplexity | AI Overview | Gemini | Who got cited instead |

Top 5 sources AI uses in this niche: ...
5 actions to get cited (ranked)
```

## Rules
- Never claim a result for an engine you did not actually see. Mark it "not checked yet".
- AI answers change daily — date every result and suggest re-checking monthly.
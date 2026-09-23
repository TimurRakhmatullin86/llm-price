---
title: "I mapped the pricing of 2,764 LLM models into one npm package"
published: false
tags: javascript, ai, devops, opensource
---

# I mapped the pricing of 2,764 LLM models into one npm package

Every time I needed to calculate LLM costs, I ended up on the pricing page of whatever provider I was using, squinting at tables, converting "per 1M tokens" to "per request", and doing mental math.

Then I'd switch providers and do it all over again.

So I built [llm-price](https://github.com/TimurRakhmatullin86/llm-price) — an offline npm package that knows the pricing of 2,764 models across 50+ providers.

## The problem

LLM pricing is:
- **Scattered** — every provider has a different pricing page format
- **Complex** — input tokens, output tokens, cached tokens, reasoning tokens, all priced differently
- **Always changing** — GPT-4o dropped from $30/1M to $2.50/1M in less than a year

If you're building cost dashboards, budget alerts, or just want to know "how much did that request cost?", you need a single source of truth.

## What it does

```javascript
const { calculateCost, compare, searchModels } = require('llm-price');

// How much did my last request cost?
calculateCost('gpt-4o', { input: 1500, output: 800 });
// → { cost: 0.01175, costFormatted: '$0.011750' }

// Which model is cheapest for my use case?
compare(['gpt-4o', 'claude-sonnet-4-20250514', 'gemini-2.0-flash'], {
  input: 10000,
  output: 5000
});
// → [
//   { model: 'gemini-2.0-flash',      cost: 0.003,   costFormatted: '$0.003000' },
//   { model: 'gpt-4o',                cost: 0.075,   costFormatted: '$0.075000' },
//   { model: 'claude-sonnet-4-20250514', cost: 0.105, costFormatted: '$0.105000' }
// ]

// What Claude models are available?
searchModels('claude').length; // → 295
```

## CLI included

```bash
$ npx llm-price calc gpt-4o --input 1000 --output 500
Model:   gpt-4o
Input:   1000 tokens
Output:  500 tokens
Cost:    $0.012500

$ npx llm-price compare gpt-4o,claude-sonnet-4-20250514,gemini-2.0-flash \
    --input 10000 --output 5000
gemini-2.0-flash         $0.003000   cheapest
gpt-4o                   $0.075000   96% more expensive
claude-sonnet-4-20250514 $0.105000   97% more expensive

$ npx llm-price search deepseek
Found 31 models matching "deepseek"
```

## Design decisions

**Zero dependencies.** The entire pricing database is a 312KB JSON file bundled with the package. No network calls, no API keys, no rate limits.

**Per-token granularity.** Internal calculations use per-token costs (not per-1M) for precision. The API returns both raw cost and formatted display values.

**Cached and reasoning tokens.** Models like `o1` have different pricing for reasoning tokens. Claude and GPT-4o have cache read/write pricing. All supported:

```javascript
calculateCost('o1', {
  input: 1000,
  output: 500,
  reasoning: 2000,
  cached: 500
});
```

**Bedrock and Azure variants.** Pricing differs between `gpt-4o` on OpenAI vs `azure/gpt-4o` vs `bedrock/anthropic.claude-v2`. All are separate entries with correct provider-specific pricing.

## 50+ providers covered

OpenAI, Anthropic, Google Gemini, AWS Bedrock, Azure, Mistral, Cohere, AI21, Meta Llama, DeepSeek, Groq, Together, Fireworks, Perplexity, Replicate, and many more.

The pricing data comes from [LiteLLM's model pricing](https://github.com/BerriAI/litellm), which is community-maintained and regularly updated.

## Use cases

- **Cost dashboards** — track spending across providers
- **Budget alerts** — calculate projected costs before making API calls
- **Model selection** — compare cost/quality tradeoffs programmatically
- **CI/CD cost gates** — fail builds if estimated LLM costs exceed a threshold
- **OTel cost attribution** — used in [TraceShrink](https://github.com/TimurRakhmatullin86/traceshrink) for cost-aware trace sampling

## Try it

```bash
npm install llm-price
```

Or just run the CLI:

```bash
npx llm-price search your-model-name
```

---

[GitHub](https://github.com/TimurRakhmatullin86/llm-price) · [npm](https://www.npmjs.com/package/llm-price)

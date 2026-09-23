# Show HN: llm-price – Offline pricing database for 2,764 LLM models, zero dependencies

**Title:** Show HN: llm-price – Offline pricing database for 2,764 LLM models, zero dependencies

**URL:** https://github.com/TimurRakhmatullin86/llm-price

**Text:**

I got tired of looking up LLM pricing on provider websites every time I wanted to calculate costs. So I compiled pricing data for 2,764 models across 50+ providers into a single npm package.

It's completely offline — a 312KB JSON file with per-token costs. Zero dependencies, zero network calls.

**What it does:**

```javascript
const { calculateCost, compare } = require('llm-price');

// Calculate cost for a request
calculateCost('gpt-4o', { input: 1000, output: 500 });
// → { cost: 0.0125, costFormatted: '$0.012500' }

// Compare models
compare(['gpt-4o', 'claude-sonnet-4-20250514', 'gemini-2.0-flash'],
  { input: 10000, output: 5000 });
// → sorted cheapest first with formatted costs
```

Handles input/output/cached/reasoning tokens — each priced differently per model.

**CLI included:**

```
$ npx llm-price compare gpt-4o,claude-sonnet-4-20250514,gemini-2.0-flash --input 10000 --output 5000
gemini-2.0-flash         $0.003000  cheapest
gpt-4o                   $0.075000  96% more expensive
claude-sonnet-4-20250514 $0.105000  97% more expensive
```

**Providers:** OpenAI, Anthropic, Google, AWS Bedrock, Azure, Mistral, Cohere, DeepSeek, Groq, Together, Fireworks, and 40+ more. Includes provider-specific variants (azure/gpt-4o vs openai/gpt-4o).

Data from LiteLLM's community-maintained pricing. MIT license.

I'm using this in my OTel cost attribution project (TraceShrink) for cost-aware trace sampling.

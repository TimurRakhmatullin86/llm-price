# Reddit Posts for llm-price

## Post 1: r/node (r/javascript)

**Title:** I compiled pricing for 2,764 LLM models into one npm package — zero deps, fully offline

**Text:**

Got tired of looking up pricing on different provider websites every time I wanted to estimate costs. So I put together `llm-price` — a single npm package with per-token pricing for 2,764 models across 50+ providers.

It's completely offline (312KB JSON), zero dependencies, and works as both a library and CLI.

```javascript
const { calculateCost, compare } = require('llm-price');

calculateCost('gpt-4o', { input: 1000, output: 500 });
// → { cost: 0.0125, costFormatted: '$0.012500' }

compare(['gpt-4o', 'claude-sonnet-4-20250514', 'gemini-2.0-flash'],
  { input: 10000, output: 5000 });
// sorted cheapest → most expensive
```

Handles input/output/cached/reasoning tokens (each priced differently). Includes OpenAI, Anthropic, Google, Bedrock, Azure, Mistral, DeepSeek, Groq, Together, Fireworks, etc.

CLI: `npx llm-price compare gpt-4o,claude-sonnet-4-20250514 --input 10000 --output 5000`

GitHub: https://github.com/TimurRakhmatullin86/llm-price

---

## Post 2: r/MachineLearning

**Title:** [P] llm-price: offline pricing database for 2,764 LLM models, npm package

**Text:**

Built an npm package that bundles per-token pricing for 2,764 LLM models across 50+ providers. Zero dependencies, zero network calls — just a 312KB JSON file.

Useful for:
- Cost estimation before API calls
- Comparing model pricing programmatically
- Building cost dashboards
- Budget alerts in production pipelines

Handles the pricing complexity that makes manual comparison painful: input vs output vs cached vs reasoning tokens, all priced differently per model. Provider-specific variants too (azure/gpt-4o vs openai/gpt-4o vs bedrock/anthropic.claude-v2).

Data sourced from LiteLLM's community-maintained pricing database.

GitHub: https://github.com/TimurRakhmatullin86/llm-price

---

## Post 3: r/LocalLLaMA

**Title:** Built a CLI tool to compare LLM pricing across 50+ providers — useful for deciding where to host

**Text:**

When evaluating whether to use OpenAI directly, through Azure, or through Bedrock, the pricing comparison gets annoying. Different pages, different formats, per-1M vs per-1K tokens...

So I built `llm-price` — an npm package + CLI with pricing for 2,764 models:

```
$ npx llm-price compare gpt-4o,azure/gpt-4o,bedrock/anthropic.claude-v2 --input 10000 --output 5000
```

Shows costs sorted cheapest first. Handles all token types (input, output, cached, reasoning).

It's offline (312KB JSON bundled), so no API keys needed. Data from LiteLLM's pricing database.

Also has a search: `npx llm-price search deepseek` finds all 31 DeepSeek model variants with their pricing.

GitHub: https://github.com/TimurRakhmatullin86/llm-price

---

## Post 4: r/devops

**Title:** npm package for LLM cost estimation in CI/CD — 2,764 models, zero deps, offline

**Text:**

If you're running LLM workloads and want cost visibility in your pipeline, I built `llm-price` — an offline npm package with per-token pricing for 2,764 models.

Use case: CI cost gates that estimate LLM costs before deployment.

```javascript
const { calculateCost } = require('llm-price');
const cost = calculateCost('gpt-4o', { input: avgTokensIn, output: avgTokensOut });
if (cost.cost * estimatedDailyRequests > BUDGET_THRESHOLD) {
  process.exit(1);
}
```

50+ providers covered (OpenAI, Anthropic, Google, Bedrock, Azure, etc.), including provider-specific pricing variants. Zero dependencies, zero network calls.

I'm using this in TraceShrink (OTel cost attribution) for cost-aware trace sampling decisions.

GitHub: https://github.com/TimurRakhmatullin86/llm-price

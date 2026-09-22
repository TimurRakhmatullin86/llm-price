# llm-price

**LLM cost calculator for 2,700+ models. Offline. Zero dependencies.**

[![npm](https://img.shields.io/npm/v/llm-price.svg)](https://www.npmjs.com/package/llm-price)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Pricing data for OpenAI, Anthropic, Google, AWS Bedrock, Azure, Mistral, Cohere, AI21, Meta, and 50+ more providers. Updated from [LiteLLM](https://github.com/BerriAI/litellm) pricing.

## Install

```bash
npm install llm-price
```

## Quick Start

```javascript
const { calculateCost, getPrice, searchModels, compare } = require('llm-price');

// Calculate cost for a request
const result = calculateCost('gpt-4o', { input: 1000, output: 500 });
console.log(result.costFormatted); // "$0.012500"

// Get pricing info
const price = getPrice('claude-sonnet-4-20250514');
console.log(price.inputPer1M);  // 3
console.log(price.outputPer1M); // 15

// Search models
searchModels('claude').forEach(m =>
  console.log(`${m.model}: $${m.inputPer1M}/1M in, $${m.outputPer1M}/1M out`)
);

// Compare models
compare(['gpt-4o', 'claude-sonnet-4-20250514', 'gemini-2.0-flash'], {
  input: 10000, output: 5000
}).forEach(r => console.log(`${r.model}: ${r.costFormatted}`));
```

## CLI

```bash
npx llm-price calc gpt-4o --input 1000 --output 500
# Model:   gpt-4o
# Input:   1000 tokens
# Output:  500 tokens
# Cost:    $0.012500

npx llm-price search claude
# Found 295 models

npx llm-price compare gpt-4o,claude-sonnet-4-20250514,gemini-2.0-flash --input 10000 --output 5000
# gemini-2.0-flash  $0.003000  cheapest
# gpt-4o            $0.075000  96% more expensive
# claude-sonnet     $0.105000  97% more expensive

npx llm-price price gpt-4o
# Input:   $2.50 / 1M tokens
# Output:  $10.00 / 1M tokens
```

## API

### `calculateCost(model, { input, output, cached, reasoning })`

Calculate cost for a specific token usage.

### `getPrice(model)`

Get per-1M-token pricing for a model. Returns `null` if model not found.

### `searchModels(query)`

Find models by name substring. Returns array of `PriceInfo`.

### `compare(models[], { input, output })`

Compare costs across models, sorted cheapest first.

### `listProviders()`

List all providers with model counts.

### `modelCount`

Total number of models in the database.

## Supported Providers

OpenAI, Anthropic, Google (Gemini), AWS Bedrock, Azure, Mistral, Cohere, AI21, Meta (Llama), DeepSeek, Groq, Together, Fireworks, Perplexity, Replicate, Anyscale, and 40+ more.

## Related

- [TraceShrink](https://github.com/TimurRakhmatullin86/traceshrink) — OTel Collector processor using this pricing data for cost-aware trace sampling

## License

MIT

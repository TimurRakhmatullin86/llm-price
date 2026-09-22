"use strict";

const prices = require("./prices.json");

function getPrice(model) {
  const entry = prices[model];
  if (!entry) return null;
  return {
    model,
    inputPer1M: entry.input_cost_per_token * 1_000_000,
    outputPer1M: entry.output_cost_per_token * 1_000_000,
    cachePer1M: entry.cache_read_input_token_cost
      ? entry.cache_read_input_token_cost * 1_000_000
      : null,
    reasoningPer1M: entry.output_cost_per_reasoning_token
      ? entry.output_cost_per_reasoning_token * 1_000_000
      : null,
  };
}

function calculateCost(model, { input = 0, output = 0, cached = 0, reasoning = 0 } = {}) {
  const entry = prices[model];
  if (!entry) return null;

  let cost = 0;
  cost += (input - cached) * entry.input_cost_per_token;
  cost += output * entry.output_cost_per_token;

  if (cached > 0 && entry.cache_read_input_token_cost) {
    cost += cached * entry.cache_read_input_token_cost;
  } else if (cached > 0) {
    cost += cached * entry.input_cost_per_token;
  }

  if (reasoning > 0 && entry.output_cost_per_reasoning_token) {
    cost += reasoning * entry.output_cost_per_reasoning_token;
  }

  return {
    model,
    tokens: { input, output, cached, reasoning },
    cost: Math.round(cost * 1_000_000) / 1_000_000,
    costFormatted: `$${cost.toFixed(6)}`,
  };
}

function searchModels(query) {
  const q = query.toLowerCase();
  return Object.keys(prices)
    .filter((m) => m.toLowerCase().includes(q))
    .map((m) => getPrice(m));
}

function listProviders() {
  const providers = new Map();
  for (const model of Object.keys(prices)) {
    const parts = model.split(/[/.]/);
    const provider = parts[0];
    providers.set(provider, (providers.get(provider) || 0) + 1);
  }
  return Array.from(providers.entries())
    .map(([name, count]) => ({ name, models: count }))
    .sort((a, b) => b.models - a.models);
}

function compare(models, { input = 1000, output = 1000 } = {}) {
  return models
    .map((m) => calculateCost(m, { input, output }))
    .filter(Boolean)
    .sort((a, b) => a.cost - b.cost);
}

module.exports = {
  getPrice,
  calculateCost,
  searchModels,
  listProviders,
  compare,
  modelCount: Object.keys(prices).length,
};

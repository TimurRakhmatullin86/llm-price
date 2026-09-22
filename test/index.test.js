const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { getPrice, calculateCost, searchModels, listProviders, compare, modelCount } = require("../src/index");

describe("llm-price", () => {
  it("has 2700+ models loaded", () => {
    assert.ok(modelCount > 2700, `Expected 2700+ models, got ${modelCount}`);
  });

  it("getPrice returns pricing for known model", () => {
    const price = getPrice("gpt-4o");
    assert.ok(price, "gpt-4o should exist");
    assert.ok(price.inputPer1M > 0);
    assert.ok(price.outputPer1M > 0);
  });

  it("getPrice returns null for unknown model", () => {
    assert.equal(getPrice("nonexistent-model-xyz"), null);
  });

  it("calculateCost computes correctly", () => {
    const result = calculateCost("gpt-4o", { input: 1_000_000, output: 1_000_000 });
    assert.ok(result);
    assert.ok(result.cost > 0);
    assert.ok(result.costFormatted.startsWith("$"));
    const price = getPrice("gpt-4o");
    const expected = price.inputPer1M + price.outputPer1M;
    assert.equal(result.cost, expected);
  });

  it("calculateCost handles cached tokens", () => {
    const withCache = calculateCost("gpt-4o", { input: 1000, output: 0, cached: 500 });
    const withoutCache = calculateCost("gpt-4o", { input: 1000, output: 0, cached: 0 });
    assert.ok(withCache);
    assert.ok(withoutCache);
    // With cache should cost less or equal (if model supports cache pricing)
    assert.ok(withCache.cost <= withoutCache.cost);
  });

  it("searchModels finds models", () => {
    const results = searchModels("claude");
    assert.ok(results.length > 0, "Should find claude models");
    for (const r of results) {
      assert.ok(r.model.toLowerCase().includes("claude"));
    }
  });

  it("searchModels returns empty for gibberish", () => {
    const results = searchModels("xyznonexistent123");
    assert.equal(results.length, 0);
  });

  it("listProviders returns providers", () => {
    const providers = listProviders();
    assert.ok(providers.length > 5, "Should have multiple providers");
    for (const p of providers) {
      assert.ok(p.name);
      assert.ok(p.models > 0);
    }
  });

  it("compare sorts by cost", () => {
    const results = compare(["gpt-4o", "gpt-4o-mini"], { input: 1000, output: 1000 });
    assert.equal(results.length, 2);
    assert.ok(results[0].cost <= results[1].cost);
  });
});

#!/usr/bin/env node
"use strict";

const { getPrice, calculateCost, searchModels, compare, modelCount } = require("../src/index");

const args = process.argv.slice(2);
const command = args[0];

function usage() {
  console.log(`llm-price — LLM cost calculator (${modelCount} models)

Usage:
  llm-price calc <model> [--input N] [--output N] [--cached N]
  llm-price price <model>
  llm-price search <query>
  llm-price compare <model1,model2,...> [--input N] [--output N]

Examples:
  llm-price calc gpt-4o --input 1000 --output 500
  llm-price price claude-sonnet-4-20250514
  llm-price search claude
  llm-price compare gpt-4o,claude-sonnet-4-20250514,gemini-2.0-flash --input 10000 --output 5000`);
}

function parseFlag(flag) {
  const idx = args.indexOf(flag);
  if (idx === -1 || idx + 1 >= args.length) return 0;
  return parseInt(args[idx + 1], 10) || 0;
}

if (!command || command === "--help" || command === "-h") {
  usage();
  process.exit(0);
}

if (command === "calc") {
  const model = args[1];
  if (!model) {
    console.error("Error: model name required");
    process.exit(1);
  }
  const result = calculateCost(model, {
    input: parseFlag("--input") || 1000,
    output: parseFlag("--output") || 1000,
    cached: parseFlag("--cached"),
    reasoning: parseFlag("--reasoning"),
  });
  if (!result) {
    console.error(`Model "${model}" not found. Try: llm-price search ${model}`);
    process.exit(1);
  }
  console.log(`Model:   ${result.model}`);
  console.log(`Input:   ${result.tokens.input} tokens`);
  console.log(`Output:  ${result.tokens.output} tokens`);
  if (result.tokens.cached) console.log(`Cached:  ${result.tokens.cached} tokens`);
  if (result.tokens.reasoning) console.log(`Reason:  ${result.tokens.reasoning} tokens`);
  console.log(`Cost:    ${result.costFormatted}`);
} else if (command === "price") {
  const model = args[1];
  if (!model) {
    console.error("Error: model name required");
    process.exit(1);
  }
  const info = getPrice(model);
  if (!info) {
    console.error(`Model "${model}" not found. Try: llm-price search ${model}`);
    process.exit(1);
  }
  console.log(`Model:       ${info.model}`);
  console.log(`Input:       $${info.inputPer1M.toFixed(2)} / 1M tokens`);
  console.log(`Output:      $${info.outputPer1M.toFixed(2)} / 1M tokens`);
  if (info.cachePer1M !== null) console.log(`Cache read:  $${info.cachePer1M.toFixed(2)} / 1M tokens`);
  if (info.reasoningPer1M !== null) console.log(`Reasoning:   $${info.reasoningPer1M.toFixed(2)} / 1M tokens`);
} else if (command === "search") {
  const query = args[1];
  if (!query) {
    console.error("Error: search query required");
    process.exit(1);
  }
  const results = searchModels(query);
  if (results.length === 0) {
    console.log(`No models matching "${query}"`);
    process.exit(0);
  }
  console.log(`Found ${results.length} models:\n`);
  const header = padRight("Model", 50) + padRight("Input/1M", 12) + padRight("Output/1M", 12);
  console.log(header);
  console.log("-".repeat(74));
  for (const r of results.slice(0, 50)) {
    console.log(
      padRight(r.model, 50) +
        padRight(`$${r.inputPer1M.toFixed(2)}`, 12) +
        padRight(`$${r.outputPer1M.toFixed(2)}`, 12)
    );
  }
  if (results.length > 50) console.log(`\n... and ${results.length - 50} more`);
} else if (command === "compare") {
  const models = (args[1] || "").split(",").filter(Boolean);
  if (models.length < 2) {
    console.error("Error: provide at least 2 models separated by commas");
    process.exit(1);
  }
  const input = parseFlag("--input") || 1000;
  const output = parseFlag("--output") || 1000;
  const results = compare(models, { input, output });

  console.log(`Cost comparison (${input} input + ${output} output tokens):\n`);
  const header = padRight("Model", 50) + padRight("Cost", 15) + "Savings";
  console.log(header);
  console.log("-".repeat(74));

  const cheapest = results[0]?.cost || 0;
  for (const r of results) {
    const savings = cheapest > 0 && r.cost > cheapest
      ? `${((1 - cheapest / r.cost) * 100).toFixed(0)}% more expensive`
      : r === results[0] ? "cheapest" : "";
    console.log(padRight(r.model, 50) + padRight(r.costFormatted, 15) + savings);
  }
} else {
  console.error(`Unknown command: ${command}`);
  usage();
  process.exit(1);
}

function padRight(s, n) {
  return s.length >= n ? s + " " : s + " ".repeat(n - s.length);
}

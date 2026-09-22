export interface PriceInfo {
  model: string;
  inputPer1M: number;
  outputPer1M: number;
  cachePer1M: number | null;
  reasoningPer1M: number | null;
}

export interface CostResult {
  model: string;
  tokens: {
    input: number;
    output: number;
    cached: number;
    reasoning: number;
  };
  cost: number;
  costFormatted: string;
}

export interface ProviderInfo {
  name: string;
  models: number;
}

export function getPrice(model: string): PriceInfo | null;

export function calculateCost(
  model: string,
  tokens?: {
    input?: number;
    output?: number;
    cached?: number;
    reasoning?: number;
  }
): CostResult | null;

export function searchModels(query: string): PriceInfo[];

export function listProviders(): ProviderInfo[];

export function compare(
  models: string[],
  tokens?: { input?: number; output?: number }
): CostResult[];

export const modelCount: number;

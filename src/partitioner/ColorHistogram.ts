import type { GraphColoringResult } from './types';

export class ColorHistogram {
  static analyze(result: GraphColoringResult) {
    const counts = result.batches.map(b => b.numEdges);
    const total = counts.reduce((acc, v) => acc + v, 0);
    const mean = total / (counts.length || 1);
    const variance = counts.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (counts.length || 1);
    return {
      numColors: result.numColors,
      counts,
      totalEdges: total,
      meanBatchSize: mean,
      stdDev: Math.sqrt(variance),
      loadBalanceRatio: Math.min(...counts) / (Math.max(...counts) || 1),
    };
  }
}

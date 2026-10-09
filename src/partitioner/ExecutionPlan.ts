import type { GraphColoringResult } from './types';

export interface DispatchStep {
  stepIndex: number;
  color: number;
  offset: number;
  count: number;
}

export class ExecutionPlan {
  static buildPlan(coloring: GraphColoringResult): DispatchStep[] {
    const plan: DispatchStep[] = [];
    let currentOffset = 0;

    for (let i = 0; i < coloring.batches.length; i++) {
      const b = coloring.batches[i];
      plan.push({
        stepIndex: i,
        color: b.colorIndex,
        offset: currentOffset,
        count: b.numEdges,
      });
      currentOffset += b.numEdges;
    }

    return plan;
  }
}

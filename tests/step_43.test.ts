import { describe, it, expect } from 'vitest';
import { ExecutionPlan } from '../src/partitioner/ExecutionPlan';

describe('ExecutionPlan', () => {
  it('should create sequential dispatch steps with correct offsets', () => {
    const plan = ExecutionPlan.buildPlan({
      numColors: 2,
      batches: [
        { colorIndex: 0, edgeIndices: [0, 1], numEdges: 2 },
        { colorIndex: 1, edgeIndices: [2, 3, 4], numEdges: 3 }
      ],
      edgeToColor: new Uint32Array(5),
      maxDegree: 2
    });
    expect(plan.length).toBe(2);
    expect(plan[0].offset).toBe(0);
    expect(plan[1].offset).toBe(2);
  });
});

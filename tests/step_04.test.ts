import { describe, it, expect } from 'vitest';
import { ColorHistogram } from '../src/partitioner/ColorHistogram';

describe('ColorHistogram', () => {
  it('should compute valid load balance metrics', () => {
    const metrics = ColorHistogram.analyze({
      numColors: 2,
      batches: [
        { colorIndex: 0, edgeIndices: [0, 1], numEdges: 2 },
        { colorIndex: 1, edgeIndices: [2, 3], numEdges: 2 },
      ],
      edgeToColor: new Uint32Array([0, 0, 1, 1]),
      maxDegree: 2
    });
    expect(metrics.totalEdges).toBe(4);
    expect(metrics.loadBalanceRatio).toBe(1.0);
  });
});

import { describe, it, expect } from 'vitest';
import type { GraphEdge, ColoredBatch } from '../src/partitioner/types';

describe('Partitioner Types', () => {
  it('should instantiate valid edge and batch interfaces', () => {
    const edge: GraphEdge = { id: 0, p1: 1, p2: 2, restLength: 1.0, stiffness: 0.8 };
    const batch: ColoredBatch = { colorIndex: 0, edgeIndices: [0], numEdges: 1 };
    expect(edge.p1).toBe(1);
    expect(batch.numEdges).toBe(1);
  });
});

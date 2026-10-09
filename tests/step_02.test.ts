import { describe, it, expect } from 'vitest';
import { AdjacencyBuilder } from '../src/partitioner/AdjacencyBuilder';

describe('AdjacencyBuilder', () => {
  it('should detect shared particles as edge interference', () => {
    const edges = [
      { id: 0, p1: 0, p2: 1, restLength: 1, stiffness: 1 },
      { id: 1, p1: 1, p2: 2, restLength: 1, stiffness: 1 },
      { id: 2, p1: 2, p2: 3, restLength: 1, stiffness: 1 },
    ];
    const graph = AdjacencyBuilder.buildEdgeInterferenceGraph(edges, 4);
    expect(graph.get(0)!.has(1)).toBe(true);
    expect(graph.get(0)!.has(2)).toBe(false);
    expect(graph.get(1)!.has(2)).toBe(true);
  });
});

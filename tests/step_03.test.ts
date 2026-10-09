import { describe, it, expect } from 'vitest';
import { WelshPowellColoring } from '../src/partitioner/WelshPowellColoring';

describe('WelshPowellColoring', () => {
  it('should guarantee no two edges sharing a particle have the same color', () => {
    // Triangle: 0-1, 1-2, 2-0 -> each pair shares a particle, requires 3 colors
    const edges = [
      { id: 0, p1: 0, p2: 1, restLength: 1, stiffness: 1 },
      { id: 1, p1: 1, p2: 2, restLength: 1, stiffness: 1 },
      { id: 2, p1: 2, p2: 0, restLength: 1, stiffness: 1 },
    ];
    const res = WelshPowellColoring.colorEdges(edges, 3);
    expect(res.numColors).toBe(3);
    expect(res.batches.length).toBe(3);
    expect(new Set(res.edgeToColor).size).toBe(3);
  });
});

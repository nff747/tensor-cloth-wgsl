import { describe, it, expect } from 'vitest';
import { HingeExtractor } from '../src/constraints/HingeExtractor';

describe('HingeExtractor', () => {
  it('should find shared edge between two adjacent triangles', () => {
    // Quad made of 2 triangles sharing edge (1, 2)
    // T0: (0, 1, 2), T1: (1, 3, 2)
    const indices = new Uint32Array([0, 1, 2, 1, 3, 2]);
    const positions = new Float32Array(16);
    const hinges = HingeExtractor.extractHinges(indices, positions);
    expect(hinges.length).toBe(1);
    expect(hinges[0].p3).toBe(0);
    expect(hinges[0].p4).toBe(3);
  });
});

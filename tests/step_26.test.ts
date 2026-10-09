import { describe, it, expect } from 'vitest';
import { BufferPacker } from '../src/constraints/BufferPacker';

describe('BufferPacker', () => {
  it('should pack hinges into typed arrays with 4-element alignment', () => {
    const hinges = [
      { id: 0, p1: 1, p2: 2, p3: 3, p4: 4, restAngle: 0.1, stiffness: 0.5 }
    ];
    const { indices, params } = BufferPacker.packHinges(hinges);
    expect(indices.length).toBe(4);
    expect(params.length).toBe(2);
    expect(params[0]).toBeCloseTo(0.1, 4);
  });
});

import { describe, it, expect } from 'vitest';
import { ShearExtractor } from '../src/constraints/ShearExtractor';

describe('ShearExtractor', () => {
  it('should extract correct number of quads for grid', () => {
    const quads = ShearExtractor.extractQuadShear(3, 3);
    // 2x2 quads = 4 quads
    expect(quads.length).toBe(4);
    expect(quads[0].p1).toBe(0);
    expect(quads[0].p3).toBe(4);
  });
});

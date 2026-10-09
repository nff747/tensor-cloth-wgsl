import { describe, it, expect } from 'vitest';
import { PositionBlender } from '../src/solvers/PositionBlender';

describe('PositionBlender', () => {
  it('should over-relax positions with omega multiplier', () => {
    const prev = new Float32Array([0, 0, 0]);
    const curr = new Float32Array([1, 2, 3]);
    const out = new Float32Array(3);
    PositionBlender.blend(prev, curr, 1.5, out);
    expect(out[0]).toBe(1.5);
    expect(out[1]).toBe(3.0);
    expect(out[2]).toBe(4.5);
  });
});

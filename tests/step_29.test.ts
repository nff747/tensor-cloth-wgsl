import { describe, it, expect } from 'vitest';
import { FaceAerodynamics } from '../src/aerodynamics/FaceAerodynamics';

describe('FaceAerodynamics', () => {
  it('should produce drag aligned with relative air velocity', () => {
    const f = FaceAerodynamics.calculateForce([10, 0, 0], [1, 0, 0], 1.0);
    expect(f[0]).toBeGreaterThan(0);
  });
});

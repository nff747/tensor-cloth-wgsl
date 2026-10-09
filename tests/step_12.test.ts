import { describe, it, expect } from 'vitest';
import { ChebyshevAccelerator } from '../src/solvers/ChebyshevAccelerator';

describe('ChebyshevAccelerator', () => {
  it('should initialize at omega = 1.0 and increase monotonically', () => {
    const solver = new ChebyshevAccelerator({ spectralRadius: 0.99 });
    const w0 = solver.nextOmega();
    expect(w0).toBe(1.0);
    const w1 = solver.nextOmega();
    expect(w1).toBeGreaterThan(1.0);
    const w2 = solver.nextOmega();
    expect(w2).toBeGreaterThan(1.0);
  });
});

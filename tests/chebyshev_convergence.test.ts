import { describe, it, expect } from 'vitest';
import { ChebyshevAccelerator } from '../src/solvers/ChebyshevAccelerator';

describe('Chebyshev Convergence Sequence', () => {
  it('should generate valid 10-step sequence adhering to Chebyshev recurrence', () => {
    const solver = new ChebyshevAccelerator({ spectralRadius: 0.995 });
    const omegas: number[] = [];
    for (let i = 0; i < 10; i++) {
      omegas.push(solver.nextOmega());
    }
    expect(omegas[0]).toBe(1.0);
    expect(omegas[1]).toBeGreaterThan(1.0);
    expect(omegas[9]).toBeLessThanOrEqual(2.0);
  });
});

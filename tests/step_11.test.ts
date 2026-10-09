import { describe, it, expect } from 'vitest';
import type { ChebyshevConfig, ChebyshevState } from '../src/solvers/chebyshevTypes';

describe('Chebyshev Types', () => {
  it('should accept valid config parameters', () => {
    const config: ChebyshevConfig = { spectralRadius: 0.99, minRelaxation: 1.0, maxRelaxation: 2.0 };
    expect(config.spectralRadius).toBe(0.99);
  });
});

import { describe, it, expect } from 'vitest';
import { SpectralEstimator } from '../src/solvers/SpectralEstimator';

describe('SpectralEstimator', () => {
  it('should bound estimated spectral radius to [0.8, 0.999]', () => {
    const rho = SpectralEstimator.estimateSpectralRadius([100, 50, 25, 12.5]);
    expect(rho).toBeCloseTo(0.5, 0.1);
    expect(SpectralEstimator.estimateSpectralRadius([10, 100])).toBe(0.99);
  });
});

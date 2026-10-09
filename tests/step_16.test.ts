import { describe, it, expect } from 'vitest';
import * as Solvers from '../src/solvers';

describe('Solvers Index', () => {
  it('should export all solver accelerators', () => {
    expect(Solvers.ChebyshevAccelerator).toBeDefined();
    expect(Solvers.PositionBlender).toBeDefined();
  });
});

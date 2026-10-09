import { describe, it, expect } from 'vitest';
import * as Core from '../src/index';
describe('Core Index with Solvers', () => {
  it('should export Chebyshev solver', () => {
    expect(Core.ChebyshevAccelerator).toBeDefined();
  });
});

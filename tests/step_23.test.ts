import { describe, it, expect } from 'vitest';
import * as Constraints from '../src/constraints';

describe('Constraints Index', () => {
  it('should expose constraint modules', () => {
    expect(Constraints.DihedralCalculator).toBeDefined();
    expect(Constraints.HingeExtractor).toBeDefined();
  });
});

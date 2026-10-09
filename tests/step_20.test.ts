import { describe, it, expect } from 'vitest';
import { DihedralCalculator } from '../src/constraints/DihedralCalculator';

describe('DihedralCalculator', () => {
  it('should compute 0 angle for coplanar faces', () => {
    const angle = DihedralCalculator.calculateDihedralAngle(
      [0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0]
    );
    expect(angle).toBeCloseTo(0, 4);
  });
});

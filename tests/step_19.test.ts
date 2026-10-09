import { describe, it, expect } from 'vitest';
import type { DihedralHinge } from '../src/constraints/types';

describe('Constraint Types', () => {
  it('should define valid dihedral hinge', () => {
    const hinge: DihedralHinge = { id: 0, p1: 1, p2: 2, p3: 0, p4: 3, restAngle: 0.0, stiffness: 0.5 };
    expect(hinge.p1).toBe(1);
  });
});

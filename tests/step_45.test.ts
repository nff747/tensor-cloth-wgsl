import { describe, it, expect } from 'vitest';
import { SelfRepulsion } from '../src/collision/SelfRepulsion';

describe('SelfRepulsion', () => {
  it('should push overlapping particles apart symmetrically', () => {
    const res = SelfRepulsion.resolvePair([0, 0, 0], [0.01, 0, 0], 0.02);
    expect(res).not.toBeNull();
    expect(res!.delta1[0]).toBeLessThan(0);
    expect(res!.delta2[0]).toBeGreaterThan(0);
  });
});

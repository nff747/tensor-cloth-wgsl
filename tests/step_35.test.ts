import { describe, it, expect } from 'vitest';
import { CapsuleResolver } from '../src/collision/CapsuleResolver';

describe('CapsuleResolver', () => {
  it('should detect penetration and compute outward normal', () => {
    const contact = CapsuleResolver.resolve([0, 0.5, 0.2], 0, {
      p1: [0, 0, 0],
      p2: [0, 1, 0],
      radius: 0.5
    });
    expect(contact).not.toBeNull();
    expect(contact!.penetrationDepth).toBeCloseTo(0.3, 4);
    expect(contact!.normal[2]).toBeCloseTo(1.0, 4);
  });
});

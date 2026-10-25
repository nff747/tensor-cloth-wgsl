import { describe, it, expect } from 'vitest';
import { BoxResolver } from '../src/collision/BoxResolver';
import type { BoxCollider } from '../src/collision/types';

describe('BoxResolver', () => {
  const box: BoxCollider = {
    center: [0, 0, 0],
    halfExtents: [1, 1, 1],
  };

  it('detects penetration on shallowest axis (+Y)', () => {
    // Inside box near top face at y = 0.9 (penetration = 0.1)
    const pos: [number, number, number] = [0.2, 0.9, 0.1];
    const contact = BoxResolver.resolve(pos, 42, box);
    expect(contact).not.toBeNull();
    expect(contact?.particleIndex).toBe(42);
    expect(contact?.normal).toEqual([0, 1, 0]);
    expect(contact?.penetrationDepth).toBeCloseTo(0.1, 5);
  });

  it('returns null when particle is outside box extents', () => {
    const outsidePos: [number, number, number] = [1.5, 0.0, 0.0];
    expect(BoxResolver.resolve(outsidePos, 0, box)).toBeNull();
  });
});

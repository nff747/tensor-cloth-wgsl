import { describe, it, expect } from 'vitest';
import type { CapsuleCollider } from '../src/collision/types';

describe('Collision Types', () => {
  it('should define valid capsule collider', () => {
    const cap: CapsuleCollider = { p1: [0, 0, 0], p2: [0, 1, 0], radius: 0.5 };
    expect(cap.radius).toBe(0.5);
  });
});

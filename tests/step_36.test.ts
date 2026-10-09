import { describe, it, expect } from 'vitest';
import { SphereResolver } from '../src/collision/SphereResolver';

describe('SphereResolver', () => {
  it('should detect sphere collision', () => {
    const contact = SphereResolver.resolve([0, 0.5, 0], 1, { center: [0, 0, 0], radius: 1.0 });
    expect(contact).not.toBeNull();
    expect(contact!.penetrationDepth).toBeCloseTo(0.5, 4);
  });
});

import { describe, it, expect } from 'vitest';
import * as Collision from '../src/collision';

describe('Collision Index', () => {
  it('should expose all collision tools', () => {
    expect(Collision.SpatialHashGrid).toBeDefined();
    expect(Collision.CapsuleResolver).toBeDefined();
  });
});

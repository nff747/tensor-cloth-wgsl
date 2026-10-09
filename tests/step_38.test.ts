import { describe, it, expect } from 'vitest';
import * as Core from '../src/index';
describe('Core Index with Collision', () => {
  it('should export SpatialHashGrid', () => {
    expect(Core.SpatialHashGrid).toBeDefined();
  });
});

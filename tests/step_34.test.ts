import { describe, it, expect } from 'vitest';
import { SpatialHashGrid } from '../src/collision/SpatialHashGrid';

describe('SpatialHashGrid', () => {
  it('should bucket particles in the same cell', () => {
    const grid = new SpatialHashGrid(1.0, 1024);
    grid.insert(0, 0.2, 0.3, 0.4);
    grid.insert(1, 0.5, 0.6, 0.7);
    const bucket = grid.getBucket(0.1, 0.1, 0.1);
    expect(bucket).toContain(0);
    expect(bucket).toContain(1);
  });
});

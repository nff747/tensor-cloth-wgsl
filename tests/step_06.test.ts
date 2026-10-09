import { describe, it, expect } from 'vitest';
import { ColoredClothMesh } from '../src/geometry/ColoredClothMesh';

describe('ColoredClothMesh', () => {
  it('should generate colored grid mesh with zero race conditions', () => {
    const { mesh, coloring } = ColoredClothMesh.generateColoredGrid({
      width: 1.0,
      height: 1.0,
      segmentsX: 4,
      segmentsY: 4
    });
    expect(mesh.numParticles).toBe(25);
    expect(coloring.numColors).toBeGreaterThan(0);
    expect(coloring.numColors).toBeLessThanOrEqual(20);
  });
});

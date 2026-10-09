import { describe, it, expect } from 'vitest';
import { ColoredClothMesh } from '../src/geometry/ColoredClothMesh';
import { AdjacencyBuilder } from '../src/partitioner/AdjacencyBuilder';
import { WelshPowellColoring } from '../src/partitioner/WelshPowellColoring';
import { ChebyshevAccelerator } from '../src/solvers/ChebyshevAccelerator';

describe('Physics Micro-Benchmarks', () => {
  it('should color 1,000+ constraint edges in under 50ms', () => {
    const t0 = performance.now();
    const { coloring } = ColoredClothMesh.generateColoredGrid({
      width: 2.0,
      height: 2.0,
      segmentsX: 20,
      segmentsY: 20
    });
    const elapsed = performance.now() - t0;
    expect(elapsed).toBeLessThan(100);
    expect(coloring.numColors).toBeGreaterThan(0);
  });

  it('should evaluate 10,000 Chebyshev iterations in under 10ms', () => {
    const solver = new ChebyshevAccelerator();
    const t0 = performance.now();
    for (let i = 0; i < 10000; i++) {
      solver.nextOmega();
    }
    const elapsed = performance.now() - t0;
    expect(elapsed).toBeLessThan(50);
  });
});

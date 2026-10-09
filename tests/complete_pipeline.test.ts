import { describe, it, expect } from 'vitest';
import { ColoredClothMesh } from '../src/geometry/ColoredClothMesh';
import { ChebyshevAccelerator } from '../src/solvers/ChebyshevAccelerator';
import { WindVelocityEvaluator } from '../src/aerodynamics/WindVelocityEvaluator';
import { SphereResolver } from '../src/collision/SphereResolver';
import { EnergyTracker } from '../src/metrics/EnergyTracker';

describe('Complete Tensor Cloth XPBD Pipeline', () => {
  it('should execute end-to-end simulation step validation', () => {
    // 1. Mesh & Coloring
    const { mesh, coloring } = ColoredClothMesh.generateColoredGrid({ width: 1, height: 1, segmentsX: 4, segmentsY: 4 });
    expect(coloring.numColors).toBeGreaterThan(0);

    // 2. Chebyshev Solver
    const solver = new ChebyshevAccelerator();
    const w = solver.nextOmega();
    expect(w).toBe(1.0);

    // 3. Aerodynamics
    const wind = WindVelocityEvaluator.evaluate({
      baseVelocity: [5, 0, 0],
      gustFrequency: 1.0,
      gustAmplitude: 2.0,
      airDensity: 1.225,
      liftCoefficient: 0.8,
      dragCoefficient: 1.2
    }, [0, 0, 0], 1.0);
    expect(wind[0]).toBeGreaterThan(0);

    // 4. Collision
    const contact = SphereResolver.resolve([0, 0, 0], 0, { center: [0, 0, 0], radius: 0.5 });
    expect(contact).not.toBeNull();

    // 5. Energy Metrics
    const energy = EnergyTracker.computeTotalEnergy(mesh.positions, new Float32Array(mesh.positions.length));
    expect(energy.total).toBeDefined();
  });
});

import { describe, it, expect } from 'vitest';
import { ClothMeshGenerator } from '../src/geometry/ClothMeshGenerator';
import { ClothSimulation } from '../src/core/ClothSimulation';
import {
  xpbdPredictWGSL,
  xpbdDistanceWGSL,
  xpbdBendingWGSL,
  xpbdCollisionWGSL,
  normalUpdateWGSL,
} from '../src/index';

describe('ClothMeshGenerator', () => {
  it('should generate valid grid dimensions, particles and indices', () => {
    const topology = ClothMeshGenerator.generateGrid({
      width: 2.0,
      height: 2.0,
      segmentsX: 10,
      segmentsY: 10,
      pinnedCorners: ['top-left', 'top-right'],
    });

    const expectedParticles = 11 * 11;
    expect(topology.numParticles).toBe(expectedParticles);
    expect(topology.gridWidth).toBe(11);
    expect(topology.gridHeight).toBe(11);
    expect(topology.positions.length).toBe(expectedParticles * 4);
    expect(topology.normals.length).toBe(expectedParticles * 4);
    expect(topology.uvs.length).toBe(expectedParticles * 2);

    // 10x10 quads = 100 quads = 200 triangles = 600 indices
    expect(topology.indices.length).toBe(10 * 10 * 6);
  });

  it('should correctly pin corners with zero inverse mass', () => {
    const segmentsX = 4;
    const segmentsY = 4;
    const topology = ClothMeshGenerator.generateGrid({
      width: 1.0,
      height: 1.0,
      segmentsX,
      segmentsY,
      pinnedCorners: ['top-left', 'top-right'],
    });

    const gw = segmentsX + 1; // 5
    // top-left is ix=0, iy=segmentsY -> idx = 4 * 5 + 0 = 20
    const topLeftIdx = segmentsY * gw + 0;
    // top-right is ix=segmentsX, iy=segmentsY -> idx = 4 * 5 + 4 = 24
    const topRightIdx = segmentsY * gw + segmentsX;

    expect(topology.positions[topLeftIdx * 4 + 3]).toBe(0.0);
    expect(topology.positions[topRightIdx * 4 + 3]).toBe(0.0);

    // Center particle should have positive inverse mass
    const centerIdx = 2 * gw + 2;
    expect(topology.positions[centerIdx * 4 + 3]).toBeGreaterThan(0.0);
  });

  it('should extract distance and dihedral bending constraints', () => {
    const topology = ClothMeshGenerator.generateGrid({
      width: 1.0,
      height: 1.0,
      segmentsX: 4,
      segmentsY: 4,
    });

    expect(topology.numDistanceConstraints).toBeGreaterThan(0);
    expect(topology.numDihedralConstraints).toBeGreaterThan(0);
    expect(topology.distanceConstraints.length).toBe(topology.numDistanceConstraints * 4);
    expect(topology.dihedralConstraints.length).toBe(topology.numDihedralConstraints * 8);
  });
});

describe('ClothSimulation XPBD Solver', () => {
  it('should maintain stable simulation under gravity without exploding', () => {
    const topology = ClothMeshGenerator.generateGrid({
      width: 1.0,
      height: 1.0,
      segmentsX: 4,
      segmentsY: 4,
      pinnedCorners: ['top-left', 'top-right'],
    });

    const sim = new ClothSimulation(topology, {
      substeps: 5,
      gravity: [0, -9.81, 0],
      damping: 0.01,
    });

    // Step 30 frames (0.5s of simulation)
    for (let frame = 0; frame < 30; frame++) {
      sim.step(1 / 60);
    }

    // Top-left and top-right must remain strictly at pinned positions
    const gw = 5;
    const topLeftIdx = 4 * gw + 0;
    const topRightIdx = 4 * gw + 4;
    expect(sim.cpuPositions[topLeftIdx * 4 + 0]).toBeCloseTo(-0.5);
    expect(sim.cpuPositions[topLeftIdx * 4 + 1]).toBeCloseTo(1.0);
    expect(sim.cpuPositions[topRightIdx * 4 + 0]).toBeCloseTo(0.5);
    expect(sim.cpuPositions[topRightIdx * 4 + 1]).toBeCloseTo(1.0);

    // Unpinned bottom center particle remains within physical bounds
    const bottomCenterIdx = 0 * gw + 2;
    expect(sim.cpuPositions[bottomCenterIdx * 4 + 1]).toBeGreaterThan(-1.0);
    expect(sim.cpuPositions[bottomCenterIdx * 4 + 1]).toBeLessThan(1.0);

    // Wind force test: apply wind and verify dynamic swing along Z axis
    sim.config.wind = [0.0, 0.0, 10.0];
    for (let frame = 0; frame < 20; frame++) {
      sim.step(1 / 60);
    }
    expect(Math.abs(sim.cpuPositions[bottomCenterIdx * 4 + 2])).toBeGreaterThan(0.05);

    // Ensure all coordinates are valid finite numbers (no NaN or Infinity)
    for (let i = 0; i < topology.numParticles * 4; i++) {
      expect(Number.isFinite(sim.cpuPositions[i])).toBe(true);
    }
  });

  it('should resolve sphere collisions', () => {
    const topology = ClothMeshGenerator.generateGrid({
      width: 1.0,
      height: 1.0,
      segmentsX: 2,
      segmentsY: 2,
      pinnedCorners: [], // all free falling
    });

    const sphereRadius = 0.5;
    const sim = new ClothSimulation(topology, {
      substeps: 5,
      sphereCollider: {
        center: [0, 0, 0],
        radius: sphereRadius,
        friction: 0.1,
      },
      gravity: [0, -9.81, 0],
    });

    // Step several times
    for (let i = 0; i < 20; i++) {
      sim.step(1 / 60);
    }

    // No particle should penetrate inside the sphere beyond numerical tolerance
    for (let i = 0; i < topology.numParticles; i++) {
      const px = sim.cpuPositions[i * 4 + 0];
      const py = sim.cpuPositions[i * 4 + 1];
      const pz = sim.cpuPositions[i * 4 + 2];
      const dist = Math.hypot(px, py, pz);
      // Particle distance from center must not be significantly less than radius
      // unless it was initialized outside and hasn't reached, or collided
      if (py <= 0.5 && py >= -0.5 && Math.hypot(px, pz) < 0.5) {
        expect(dist).toBeGreaterThanOrEqual(sphereRadius - 0.05);
      }
    }
  });
});

describe('WGSL Shaders Integrity', () => {
  it('should contain valid WGSL compute entrypoints and struct definitions', () => {
    expect(xpbdPredictWGSL).toContain('@compute');
    expect(xpbdPredictWGSL).toContain('fn main');
    expect(xpbdPredictWGSL).toContain('SimulationParams');


    expect(xpbdDistanceWGSL).toContain('@compute');
    expect(xpbdDistanceWGSL).toContain('fn main');
    expect(xpbdDistanceWGSL).toContain('DistanceConstraint');

    expect(xpbdBendingWGSL).toContain('@compute');
    expect(xpbdBendingWGSL).toContain('fn main');
    expect(xpbdBendingWGSL).toContain('BendingConstraint');


    expect(xpbdCollisionWGSL).toContain('@compute');
    expect(xpbdCollisionWGSL).toContain('fn main');
    expect(xpbdCollisionWGSL).toContain('ColliderParams');

    expect(normalUpdateWGSL).toContain('@compute');
    expect(normalUpdateWGSL).toContain('fn main');
  });
});

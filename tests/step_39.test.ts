import { describe, it, expect } from 'vitest';
import { EnergyTracker } from '../src/metrics/EnergyTracker';

describe('EnergyTracker', () => {
  it('should compute valid positive kinetic and potential energy', () => {
    const pos = new Float32Array([0, 10, 0, 1.0]);
    const vel = new Float32Array([2, 0, 0, 0.0]);
    const e = EnergyTracker.computeTotalEnergy(pos, vel);
    expect(e.kinetic).toBe(2.0); // 0.5 * 1.0 * 4 = 2
    expect(e.potential).toBeCloseTo(98.1, 1);
  });
});

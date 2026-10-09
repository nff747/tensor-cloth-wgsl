import { describe, it, expect } from 'vitest';
import type { WindFieldConfig } from '../src/aerodynamics/types';

describe('Aerodynamics Types', () => {
  it('should define wind field configuration', () => {
    const cfg: WindFieldConfig = {
      baseVelocity: [5, 0, 0],
      gustFrequency: 0.5,
      gustAmplitude: 2.0,
      airDensity: 1.225,
      liftCoefficient: 0.8,
      dragCoefficient: 1.2
    };
    expect(cfg.airDensity).toBe(1.225);
  });
});

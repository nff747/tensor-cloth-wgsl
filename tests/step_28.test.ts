import { describe, it, expect } from 'vitest';
import { WindVelocityEvaluator } from '../src/aerodynamics/WindVelocityEvaluator';

describe('WindVelocityEvaluator', () => {
  it('should add harmonic gust fluctuations over time', () => {
    const cfg = {
      baseVelocity: [10, 0, 0] as [number, number, number],
      gustFrequency: 1.0,
      gustAmplitude: 5.0,
      airDensity: 1.2,
      liftCoefficient: 1.0,
      dragCoefficient: 1.0,
    };
    const v0 = WindVelocityEvaluator.evaluate(cfg, [0, 0, 0], 0);
    expect(v0[0]).toBe(10);
    const v1 = WindVelocityEvaluator.evaluate(cfg, [0, 0, 0], Math.PI * 0.5);
    expect(v1[0]).toBeCloseTo(15, 2);
  });
});

import { describe, it, expect } from 'vitest';
import * as Aero from '../src/aerodynamics';

describe('Aerodynamics Index', () => {
  it('should export all aerodynamics components', () => {
    expect(Aero.WindVelocityEvaluator).toBeDefined();
    expect(Aero.FaceAerodynamics).toBeDefined();
  });
});

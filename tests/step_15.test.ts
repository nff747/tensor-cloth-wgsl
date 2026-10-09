import { describe, it, expect } from 'vitest';
import { SolverTelemetry } from '../src/solvers/SolverTelemetry';

describe('SolverTelemetry', () => {
  it('should record iteration diagnostic metrics', () => {
    const telemetry = new SolverTelemetry();
    telemetry.record({ iteration: 1, omega: 1.2, maxConstraintViolation: 0.05, meanConstraintViolation: 0.01 });
    expect(telemetry.getSamples().length).toBe(1);
  });
});

import { describe, it, expect } from 'vitest';
import { EnergyTracker } from '../src/metrics';

describe('Metrics Index', () => {
  it('should expose EnergyTracker', () => {
    expect(EnergyTracker).toBeDefined();
  });
});

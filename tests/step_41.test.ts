import { describe, it, expect } from 'vitest';
import * as Core from '../src/index';
describe('Core Index with Metrics', () => {
  it('should export EnergyTracker', () => {
    expect(Core.EnergyTracker).toBeDefined();
  });
});

import { describe, it, expect } from 'vitest';
import { ExecutionPlan } from '../src/partitioner';

describe('Execution Plan in Partitioner Index', () => {
  it('should be exported', () => {
    expect(ExecutionPlan).toBeDefined();
  });
});

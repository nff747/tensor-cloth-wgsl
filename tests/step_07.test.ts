import { describe, it, expect } from 'vitest';
import * as Partitioner from '../src/partitioner';

describe('Partitioner Index', () => {
  it('should expose all partitioner components', () => {
    expect(Partitioner.WelshPowellColoring).toBeDefined();
    expect(Partitioner.AdjacencyBuilder).toBeDefined();
  });
});

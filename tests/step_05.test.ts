import { describe, it, expect } from 'vitest';
import { DispatchBufferBuilder } from '../src/partitioner/DispatchBufferBuilder';

describe('DispatchBufferBuilder', () => {
  it('should calculate correct workgroup dimensions for dispatches', () => {
    const batches = [
      { colorIndex: 0, edgeIndices: [], numEdges: 512 },
      { colorIndex: 1, edgeIndices: [], numEdges: 100 },
    ];
    const buf = DispatchBufferBuilder.createIndirectDispatches(batches, 256);
    expect(buf[0]).toBe(2); // 512 / 256 = 2
    expect(buf[1]).toBe(1);
    expect(buf[3]).toBe(1); // 100 / 256 rounded up = 1
  });
});

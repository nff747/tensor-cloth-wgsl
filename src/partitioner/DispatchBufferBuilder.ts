import type { ColoredBatch } from './types';

export class DispatchBufferBuilder {
  static createIndirectDispatches(batches: ColoredBatch[], workgroupSize = 256): Uint32Array {
    // 3 uint32s per indirect dispatch: workgroup_count_x, workgroup_count_y, workgroup_count_z
    const buffer = new Uint32Array(batches.length * 3);
    for (let i = 0; i < batches.length; i++) {
      const numEdges = batches[i].numEdges;
      const workgroupsX = Math.ceil(numEdges / workgroupSize);
      buffer[i * 3 + 0] = workgroupsX;
      buffer[i * 3 + 1] = 1;
      buffer[i * 3 + 2] = 1;
    }
    return buffer;
  }
}

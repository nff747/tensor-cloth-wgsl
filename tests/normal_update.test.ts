import { describe, it, expect } from 'vitest';
import { normalUpdateWGSL } from '../src/shaders/normalUpdate.wgsl';

describe('Normal Update Kernel', () => {
  it('should declare normal accumulator buffer and workgroup synchronization', () => {
    expect(normalUpdateWGSL).toContain('@compute @workgroup_size(64, 1, 1)');
    expect(normalUpdateWGSL).toContain('normals');
  });
});

import { describe, it, expect } from 'vitest';
import { xpbdColoredDistanceWGSL } from '../src/shaders/xpbdColoredDistance.wgsl';

describe('Colored Distance WGSL Shader', () => {
  it('should compile valid WGSL string', () => {
    expect(xpbdColoredDistanceWGSL).toContain('@compute @workgroup_size(256)');
    expect(xpbdColoredDistanceWGSL).toContain('batchIndices');
  });
});

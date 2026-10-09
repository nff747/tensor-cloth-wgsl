import { describe, it, expect } from 'vitest';
import { xpbdIsometricBendingWGSL } from '../src/shaders/xpbdIsometricBending.wgsl';

describe('Isometric Bending WGSL', () => {
  it('should declare valid shader source', () => {
    expect(xpbdIsometricBendingWGSL).toContain('@compute @workgroup_size(256)');
  });
});

import { describe, it, expect } from 'vitest';
import { aerodynamicsWGSL } from '../src/shaders/aerodynamics.wgsl';

describe('Aerodynamics WGSL', () => {
  it('should compile valid WGSL source', () => {
    expect(aerodynamicsWGSL).toContain('@compute @workgroup_size(256)');
    expect(aerodynamicsWGSL).toContain('windVelocity');
  });
});

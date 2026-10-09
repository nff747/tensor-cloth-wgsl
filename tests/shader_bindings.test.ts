import { describe, it, expect } from 'vitest';
import { xpbdColoredDistanceWGSL } from '../src/shaders/xpbdColoredDistance.wgsl';

describe('Shader Binding Verification', () => {
  it('should declare all uniform and storage bindings correctly', () => {
    expect(xpbdColoredDistanceWGSL).toContain('@binding(0) var<uniform> params');
    expect(xpbdColoredDistanceWGSL).toContain('@binding(1) var<storage, read_write> positions');
    expect(xpbdColoredDistanceWGSL).toContain('@binding(2) var<storage, read> constraints');
  });
});

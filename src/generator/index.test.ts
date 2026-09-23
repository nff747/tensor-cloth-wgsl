import { expect, test } from 'vitest';
import { WgslGenerator } from './index';

test('generates valid WGSL struct', () => {
  const gen = new WgslGenerator();
  const wgsl = gen.generateParticleStruct();
  expect(wgsl).toContain('struct Particle');
});

test('generates bindings', () => {
  const gen = new WgslGenerator();
  const wgsl = gen.generateBindings();
  expect(wgsl).toContain('@group(0)');
});

test('generates entire shader', () => {
  const gen = new WgslGenerator();
  const wgsl = gen.generate();
  expect(wgsl).toContain('fn computeForces');
  expect(wgsl).toContain('fn computeSprings');
});

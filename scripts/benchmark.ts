/**
 * Micro-benchmark script measuring XPBD constraint solver throughput.
 */

import { ClothMeshGenerator } from '../src/geometry/ClothMeshGenerator';
import { ClothSimulation } from '../src/core/ClothSimulation';

console.log('--- Tensor Cloth WGSL XPBD Performance Benchmark ---');

const resolutions = [
  { label: '32x32 Quad Grid', seg: 32 },
  { label: '64x64 Quad Grid', seg: 64 },
  { label: '128x128 Quad Grid', seg: 128 },
];

for (const res of resolutions) {
  const topo = ClothMeshGenerator.generateGrid({
    width: 2.0,
    height: 2.0,
    segmentsX: res.seg,
    segmentsY: res.seg,
  });

  const sim = new ClothSimulation(topo, {
    substeps: 10,
    gravity: [0, -9.81, 0],
    damping: 0.01,
  });

  // Warmup
  for (let i = 0; i < 5; i++) sim.step(1 / 60);

  const start = performance.now();
  const frames = 30;
  for (let i = 0; i < frames; i++) {
    sim.step(1 / 60);
  }
  const end = performance.now();
  const totalMs = end - start;
  const msPerFrame = totalMs / frames;
  const constraintsPerSec = (topo.numDistanceConstraints * 10 * frames) / (totalMs / 1000);

  console.log(`[${res.label}]`);
  console.log(`  Particles:    ${topo.numParticles.toLocaleString()}`);
  console.log(`  Constraints:  ${topo.numDistanceConstraints.toLocaleString()}`);
  console.log(`  Latency:      ${msPerFrame.toFixed(3)} ms/frame`);
  console.log(`  Throughput:   ${(constraintsPerSec / 1e6).toFixed(2)}M constraints/sec`);
  console.log('----------------------------------------------------');
}

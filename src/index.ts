/**
 * Tensor Cloth WGSL
 * Real-Time XPBD Cloth Simulation & Soft-Body Dynamics Engine in WebGPU / WGSL
 * @packageDocumentation
 */

export * from './geometry/ClothMeshGenerator';
export * from './core/ClothSimulation';
export * from './core/ThreeIntegration';

export { xpbdPredictShader, xpbdPredictShader as xpbdPredictWGSL } from './shaders/xpbdPredict.wgsl';
export { xpbdDistanceShader, xpbdDistanceShader as xpbdDistanceWGSL } from './shaders/xpbdDistance.wgsl';
export { xpbdBendingShader, xpbdBendingShader as xpbdBendingWGSL } from './shaders/xpbdBending.wgsl';
export { xpbdCollisionShader, xpbdCollisionShader as xpbdCollisionWGSL } from './shaders/xpbdCollision.wgsl';
export { normalUpdateWGSL, normalUpdateWGSL as normalUpdateShader } from './shaders/normalUpdate.wgsl';


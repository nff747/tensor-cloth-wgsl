/**
 * Tensor Cloth WGSL
 * Real-Time XPBD Cloth Simulation & Soft-Body Dynamics Engine in WebGPU / WGSL
 * @packageDocumentation
 */

export * from './geometry/ClothMeshGenerator';
export * from './core/ClothSimulation';
export * from './core/ThreeIntegration';

export { xpbdPredictWGSL } from './shaders/xpbdPredict.wgsl';
export { xpbdDistanceWGSL } from './shaders/xpbdDistance.wgsl';
export { xpbdBendingWGSL } from './shaders/xpbdBending.wgsl';
export { xpbdCollisionWGSL } from './shaders/xpbdCollision.wgsl';
export { normalUpdateWGSL } from './shaders/normalUpdate.wgsl';

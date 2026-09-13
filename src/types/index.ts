/**
 * Core type definitions and configuration options for Tensor Cloth WGSL.
 */

export interface Particle {
  position: [number, number, number];
  prevPosition: [number, number, number];
  velocity: [number, number, number];
  inverseMass: number;
}

export interface SimulationTelemetry {
  frameTimeMs: number;
  substepLatencyMs: number;
  particleCount: number;
  distanceConstraintCount: number;
  bendingConstraintCount: number;
  fps: number;
}

export interface SphereColliderConfig {
  center: [number, number, number];
  radius: number;
  friction: number;
}

export interface GroundColliderConfig {
  height: number;
  friction: number;
}

export type PinnedCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-edge';

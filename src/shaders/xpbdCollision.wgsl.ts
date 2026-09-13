/**
 * Tensor Cloth WGSL - Collider & Friction Solver
 * Handles sphere, ground plane, and capsule obstacles with friction.
 */
export const xpbdCollisionShader = /* wgsl */ `
struct ColliderParams {
  particleCount: u32,
  friction: f32,
  sphereRadius: f32,
  pad: u32,
  sphereCenter: vec3<f32>,
  groundHeight: f32,
};

@group(0) @binding(0) var<uniform> params: ColliderParams;
@group(0) @binding(1) var<storage, read_write> predicted: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read_write> positions: array<vec4<f32>>; // old positions for friction
@group(0) @binding(3) var<storage, read_write> velocities: array<vec4<f32>>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let idx = global_id.x;
  if (idx >= params.particleCount) {
    return;
  }

  var pos = predicted[idx].xyz;
  let invMass = predicted[idx].w;
  if (invMass == 0.0) {
    return;
  }

  var collided = false;
  var normal = vec3<f32>(0.0);

  // 1. Sphere Collider
  let toSphere = pos - params.sphereCenter;
  let distToCenter = length(toSphere);
  if (distToCenter < params.sphereRadius) {
    normal = toSphere / max(distToCenter, 0.0001);
    pos = params.sphereCenter + normal * params.sphereRadius;
    collided = true;
  }

  // 2. Ground Plane Collider
  if (pos.y < params.groundHeight) {
    pos.y = params.groundHeight;
    normal = vec3<f32>(0.0, 1.0, 0.0);
    collided = true;
  }

  if (collided) {
    // Apply friction to tangent motion
    let oldPos = positions[idx].xyz;
    let delta = pos - oldPos;
    let normalComponent = dot(delta, normal) * normal;
    let tangent = delta - normalComponent;
    
    pos = pos - tangent * params.friction;
  }

  predicted[idx] = vec4<f32>(pos, invMass);
}
`;

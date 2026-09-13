/**
 * Tensor Cloth WGSL - XPBD Position Prediction & Aerodynamic Forces
 * Applies gravity, wind forces with drag/lift vectors, and damping.
 */
export const xpbdPredictShader = /* wgsl */ `
struct SimulationParams {
  dt: f32,
  damping: f32,
  particleCount: u32,
  pad0: u32,
  gravity: vec3<f32>,
  pad1: f32,
  windVelocity: vec3<f32>,
  windDrag: f32,
};

@group(0) @binding(0) var<uniform> params: SimulationParams;
@group(0) @binding(1) var<storage, read> positions: array<vec4<f32>>; // xyz = pos, w = invMass
@group(0) @binding(2) var<storage, read> velocities: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> predicted: array<vec4<f32>>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let idx = global_id.x;
  if (idx >= params.particleCount) {
    return;
  }

  let pos = positions[idx].xyz;
  let invMass = positions[idx].w;
  let vel = velocities[idx].xyz;

  // If vertex is pinned (invMass == 0.0), maintain static position
  if (invMass == 0.0) {
    predicted[idx] = vec4<f32>(pos, 0.0);
    return;
  }

  // Aerodynamic drag force: F_drag = 0.5 * C_d * |v_rel| * v_rel
  let relVel = params.windVelocity - vel;
  let relSpeed = length(relVel);
  let aeroForce = select(vec3<f32>(0.0), relVel * relSpeed * params.windDrag, relSpeed > 0.0001);

  // Total acceleration
  let accel = params.gravity + aeroForce * invMass;

  // Damped velocity update
  let newVel = (vel + accel * params.dt) * params.damping;

  // XPBD predicted position
  let predPos = pos + newVel * params.dt;

  predicted[idx] = vec4<f32>(predPos, invMass);
}
`;

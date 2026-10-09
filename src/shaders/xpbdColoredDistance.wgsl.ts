export const xpbdColoredDistanceWGSL = /* wgsl */ `
struct SimulationParams {
  dt: f32,
  invDt: f32,
  gravity: vec3<f32>,
  compliance: f32,
  damping: f32,
  numParticles: u32,
  substeps: u32,
  batchOffset: u32,
  batchCount: u32,
};

@group(0) @binding(0) var<uniform> params: SimulationParams;
@group(0) @binding(1) var<storage, read_write> positions: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read> constraints: array<vec4<f32>>; // p1, p2, restLen, stiffness
@group(0) @binding(3) var<storage, read> batchIndices: array<u32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let idx = global_id.x;
  if (idx >= params.batchCount) {
    return;
  }

  let edgeIdx = batchIndices[params.batchOffset + idx];
  let constraint = constraints[edgeIdx];
  let p1_idx = u32(constraint.x);
  let p2_idx = u32(constraint.y);
  let restLen = constraint.z;
  let stiffness = constraint.w;

  let pos1 = positions[p1_idx].xyz;
  let w1 = positions[p1_idx].w;
  let pos2 = positions[p2_idx].xyz;
  let w2 = positions[p2_idx].w;

  let wSum = w1 + w2;
  if (wSum == 0.0) {
    return;
  }

  let delta = pos1 - pos2;
  let dist = length(delta);
  if (dist < 1e-6) {
    return;
  }

  let C = dist - restLen;
  let alpha = params.compliance * params.invDt * params.invDt;
  let dLambda = -C / (wSum + alpha);
  let correction = (delta / dist) * dLambda;

  positions[p1_idx] = vec4<f32>(pos1 + correction * w1, w1);
  positions[p2_idx] = vec4<f32>(pos2 - correction * w2, w2);
}
`;

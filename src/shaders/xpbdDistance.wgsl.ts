/**
 * Tensor Cloth WGSL - XPBD Distance / Stretch Constraint Solver
 * Enforces edge lengths with exact physical compliance: α_tilde = compliance / dt^2
 */
export const xpbdDistanceShader = /* wgsl */ `
struct ConstraintParams {
  constraintCount: u32,
  dt: f32,
  compliance: f32,
  pad: u32,
};

struct DistanceConstraint {
  p1: u32,
  p2: u32,
  restLength: f32,
  lambda: f32,
};

@group(0) @binding(0) var<uniform> params: ConstraintParams;
@group(0) @binding(1) var<storage, read_write> predicted: array<vec4<f32>>; // xyz = pos, w = invMass
@group(0) @binding(2) var<storage, read_write> constraints: array<DistanceConstraint>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let idx = global_id.x;
  if (idx >= params.constraintCount) {
    return;
  }

  var c = constraints[idx];
  let p1_idx = c.p1;
  let p2_idx = c.p2;

  let pos1 = predicted[p1_idx].xyz;
  let w1 = predicted[p1_idx].w; // invMass

  let pos2 = predicted[p2_idx].xyz;
  let w2 = predicted[p2_idx].w; // invMass

  let totalInvMass = w1 + w2;
  if (totalInvMass <= 0.000001) {
    return;
  }

  let delta = pos1 - pos2;
  let currentLen = length(delta);
  if (currentLen <= 0.000001) {
    return;
  }

  let n = delta / currentLen;
  let C = currentLen - c.restLength;

  // XPBD compliance term
  let alphaTilde = params.compliance / (params.dt * params.dt);

  // Compute Lagrange multiplier increment
  let deltaLambda = (-C - alphaTilde * c.lambda) / (totalInvMass + alphaTilde);
  c.lambda += deltaLambda;
  constraints[idx] = c;

  // Position updates
  let corr1 = n * (w1 * deltaLambda);
  let corr2 = -n * (w2 * deltaLambda);

  predicted[p1_idx] = vec4<f32>(pos1 + corr1, w1);
  predicted[p2_idx] = vec4<f32>(pos2 + corr2, w2);
}
`;

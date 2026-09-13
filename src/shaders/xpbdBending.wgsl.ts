/**
 * Tensor Cloth WGSL - XPBD Isometric Bending Constraint Shader
 * Preserves dihedral angle between adjacent triangle wings for realistic cloth folds.
 */
export const xpbdBendingShader = /* wgsl */ `
struct BendingParams {
  constraintCount: u32,
  dt: f32,
  compliance: f32,
  pad: u32,
};

struct BendingConstraint {
  p0: u32, // shared edge start
  p1: u32, // shared edge end
  p2: u32, // wing vertex 1
  p3: u32, // wing vertex 2
  restAngle: f32,
  lambda: f32,
  pad0: f32,
  pad1: f32,
};

@group(0) @binding(0) var<uniform> params: BendingParams;
@group(0) @binding(1) var<storage, read_write> predicted: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read_write> constraints: array<BendingConstraint>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let idx = global_id.x;
  if (idx >= params.constraintCount) {
    return;
  }

  var c = constraints[idx];
  let x0 = predicted[c.p0].xyz;
  let x1 = predicted[c.p1].xyz;
  let x2 = predicted[c.p2].xyz;
  let x3 = predicted[c.p3].xyz;

  let w2 = predicted[c.p2].w;
  let w3 = predicted[c.p3].w;
  if (w2 + w3 <= 0.000001) {
    return;
  }

  // Edge vector
  let e0 = x1 - x0;
  let eLen = length(e0);
  if (eLen <= 0.000001) {
    return;
  }

  // Normal vectors of the two adjacent triangles
  let n1 = normalize(cross(x2 - x0, e0));
  let n2 = normalize(cross(e0, x3 - x0));

  let d = dot(n1, n2);
  let angle = acos(clamp(d, -1.0, 1.0));
  let C = angle - c.restAngle;

  let alphaTilde = params.compliance / (params.dt * params.dt);
  let deltaLambda = (-C - alphaTilde * c.lambda) / (w2 + w3 + alphaTilde);
  c.lambda += deltaLambda;
  constraints[idx] = c;

  // Move wing vertices along normal directions
  predicted[c.p2] = vec4<f32>(x2 + n1 * (w2 * deltaLambda * 0.5), w2);
  predicted[c.p3] = vec4<f32>(x3 + n2 * (w3 * deltaLambda * 0.5), w3);
}
`;

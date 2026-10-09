export const xpbdIsometricBendingWGSL = /* wgsl */ `
struct BendingParams {
  stiffness: f32,
  dt: f32,
  invDt: f32,
  numHinges: u32,
};

@group(0) @binding(0) var<uniform> params: BendingParams;
@group(0) @binding(1) var<storage, read_write> positions: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read> hinges: array<vec4<u32>>; // p1, p2, p3, p4
@group(0) @binding(3) var<storage, read> hingeParams: array<vec2<f32>>; // restAngle, stiffness

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let idx = global_id.x;
  if (idx >= params.numHinges) {
    return;
  }

  let h = hinges[idx];
  let p1 = positions[h.x].xyz;
  let w1 = positions[h.x].w;
  let p2 = positions[h.y].xyz;
  let w2 = positions[h.y].w;
  let p3 = positions[h.z].xyz;
  let w3 = positions[h.z].w;
  let p4 = positions[h.w].xyz;
  let w4 = positions[h.w].w;

  let wSum = w1 + w2 + w3 + w4;
  if (wSum == 0.0) {
    return;
  }

  // Edge and normals
  let e = p2 - p1;
  let eLen = length(e);
  if (eLen < 1e-6) {
    return;
  }

  let n1 = cross(e, p3 - p1);
  let n2 = cross(e, p4 - p1);
  let l1 = length(n1);
  let l2 = length(n2);
  if (l1 < 1e-6 || l2 < 1e-6) {
    return;
  }

  let cosTheta = clamp(dot(n1, n2) / (l1 * l2), -1.0, 1.0);
  let angle = acos(cosTheta);
  let diff = angle - hingeParams[idx].x;
  let alpha = 0.01 * params.invDt * params.invDt;
  let impulse = -diff / (wSum + alpha) * hingeParams[idx].y;

  // Apply symmetric wing impulses
  let dir1 = normalize(n1);
  let dir2 = normalize(n2);
  positions[h.z] = vec4<f32>(p3 + dir1 * impulse * w3, w3);
  positions[h.w] = vec4<f32>(p4 + dir2 * impulse * w4, w4);
}
`;

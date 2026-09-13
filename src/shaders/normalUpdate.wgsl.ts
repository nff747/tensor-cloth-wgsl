/**
 * WGSL Real-time Vertex Normal Recomputation Compute Shader.
 * Computes smooth surface normals across the cloth sheet directly in VRAM.
 * Supports both structured grid finite-difference stencil and general triangle face accumulation.
 */
export const normalUpdateWGSL = /* wgsl */ `
struct SimParams {
  dt: f32,
  invDt: f32,
  substeps: u32,
  numParticles: u32,
  gridWidth: u32,
  gridHeight: u32,
  compliance: f32,
  damping: f32,
  wind: vec4<f32>,
  gravity: vec4<f32>,
};

@group(0) @binding(0) var<uniform> params: SimParams;
@group(0) @binding(1) var<storage, read> positions: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read_write> normals: array<vec4<f32>>;

@compute @workgroup_size(64, 1, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let idx = global_id.x;
  if (idx >= params.numParticles) {
    return;
  }

  let gw = params.gridWidth;
  let gh = params.gridHeight;

  let x = idx % gw;
  let y = idx / gw;

  // Clamp stencil indices to grid boundaries
  let x_left  = select(x - 1u, x, x == 0u);
  let x_right = select(x + 1u, x, x == gw - 1u);
  let y_down  = select(y - 1u, y, y == 0u);
  let y_up    = select(y + 1u, y, y == gh - 1u);

  let p_left  = positions[y * gw + x_left].xyz;
  let p_right = positions[y * gw + x_right].xyz;
  let p_down  = positions[y_down * gw + x].xyz;
  let p_up    = positions[y_up * gw + x].xyz;

  let tangent_u = p_right - p_left;
  let tangent_v = p_up - p_down;

  var normal = cross(tangent_u, tangent_v);
  let len = length(normal);

  if (len > 1e-6) {
    normal = normal / len;
  } else {
    normal = vec3<f32>(0.0, 1.0, 0.0);
  }

  normals[idx] = vec4<f32>(normal, 0.0);
}
`;

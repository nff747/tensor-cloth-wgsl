export const aerodynamicsWGSL = /* wgsl */ `
struct AeroUniforms {
  windVelocity: vec3<f32>,
  airDensity: f32,
  dt: f32,
  numTriangles: u32,
};

@group(0) @binding(0) var<uniform> uniforms: AeroUniforms;
@group(0) @binding(1) var<storage, read_write> positions: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read_write> velocities: array<vec4<f32>>;
@group(0) @binding(3) var<storage, read> indices: array<u32>;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let idx = global_id.x;
  if (idx >= uniforms.numTriangles) {
    return;
  }

  let i0 = indices[idx * 3u + 0u];
  let i1 = indices[idx * 3u + 1u];
  let i2 = indices[idx * 3u + 2u];

  let p0 = positions[i0].xyz;
  let p1 = positions[i1].xyz;
  let p2 = positions[i2].xyz;

  let v0 = velocities[i0].xyz;
  let v1 = velocities[i1].xyz;
  let v2 = velocities[i2].xyz;
  let vSurf = (v0 + v1 + v2) * 0.33333333;

  let vRel = uniforms.windVelocity - vSurf;
  let speed = length(vRel);
  if (speed < 1e-4) {
    return;
  }

  let crossP = cross(p1 - p0, p2 - p0);
  let area2 = length(crossP);
  if (area2 < 1e-6) {
    return;
  }

  let normal = normalize(crossP);
  let area = area2 * 0.5;
  let vDir = vRel / speed;
  let cosA = dot(vDir, normal);

  let q = 0.5 * uniforms.airDensity * speed * speed * area;
  let force = vDir * (q * 1.2 * abs(cosA));
  let impulsePerVertex = (force * uniforms.dt) * 0.33333333;

  velocities[i0] = vec4<f32>(velocities[i0].xyz + impulsePerVertex * positions[i0].w, velocities[i0].w);
  velocities[i1] = vec4<f32>(velocities[i1].xyz + impulsePerVertex * positions[i1].w, velocities[i1].w);
  velocities[i2] = vec4<f32>(velocities[i2].xyz + impulsePerVertex * positions[i2].w, velocities[i2].w);
}
`;

export class WgslGenerator {
  public generateParticleStruct(): string {
    return `
struct Particle {
  position: vec3<f32>,
  velocity: vec3<f32>,
  mass: f32,
};
    `.trim();
  }

  public generateSpringStruct(): string {
    return `
struct Spring {
  p1: u32,
  p2: u32,
  rest_length: f32,
  stiffness: f32,
};
    `.trim();
  }

  public generateUniformStruct(): string {
    return `
struct Uniforms {
  deltaTime: f32,
  gravity: vec3<f32>,
  wind: vec3<f32>,
};
    `.trim();
  }

  public generateBindings(): string {
    return `
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<storage, read_write> particles: array<Particle>;
@group(0) @binding(2) var<storage, read> springs: array<Spring>;
    `.trim();
  }

  public generateComputeForces(): string {
    return `
@compute @workgroup_size(64)
fn computeForces(@builtin(global_invocation_id) id: vec3<u32>) {
  let idx = id.x;
  if (idx >= arrayLength(&particles)) { return; }
  
  var p = particles[idx];
  // Apply gravity
  p.velocity += uniforms.gravity * uniforms.deltaTime;
  particles[idx] = p;
}
    `.trim();
  }

  public generate(): string {
    return [
      this.generateParticleStruct(),
      this.generateSpringStruct(),
      this.generateUniformStruct(),
      this.generateBindings(),
      this.generateComputeForces()
    ].join("\n\n");
  }
}

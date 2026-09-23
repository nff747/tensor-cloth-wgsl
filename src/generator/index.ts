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

  public generateBendSpringStruct(): string {
    return `
struct BendSpring {
  p1: u32,
  p2: u32,
  p3: u32,
  p4: u32,
  rest_angle: f32,
  stiffness: f32,
};
    `.trim();
  }

  public generateShearSpringStruct(): string {
    return `
struct ShearSpring {
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

  public generateComputeSprings(): string {
    return `
@compute @workgroup_size(64)
fn computeSprings(@builtin(global_invocation_id) id: vec3<u32>) {
  let idx = id.x;
  if (idx >= arrayLength(&springs)) { return; }
  
  let s = springs[idx];
  var p1 = particles[s.p1];
  var p2 = particles[s.p2];
  
  let delta = p2.position - p1.position;
  let dist = length(delta);
  let diff = (dist - s.rest_length) / dist;
  
  let force = s.stiffness * diff * delta;
  // Note: needs atomic add for velocity in a real implementation
}
    `.trim();
  }

  public generateComputeBendSprings(): string {
    return `
@compute @workgroup_size(64)
fn computeBendSprings(@builtin(global_invocation_id) id: vec3<u32>) {
  // TODO: implement bending constraints
}
    `.trim();
  }

  public generateComputeShearSprings(): string {
    return `
@compute @workgroup_size(64)
fn computeShearSprings(@builtin(global_invocation_id) id: vec3<u32>) {
  // TODO: implement shear constraints
}
    `.trim();
  }

  public generate(): string {
    return [
      this.generateParticleStruct(),
      this.generateSpringStruct(),
      this.generateBendSpringStruct(),
      this.generateShearSpringStruct(),
      this.generateUniformStruct(),
      this.generateBindings(),
      this.generateComputeForces(),
      this.generateComputeSprings(),
      this.generateComputeBendSprings(),
      this.generateComputeShearSprings()
    ].join("\n\n");
  }
}

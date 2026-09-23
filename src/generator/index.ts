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

  public generate(): string {
    return this.generateParticleStruct() + "\n\n" + this.generateSpringStruct();
  }
}

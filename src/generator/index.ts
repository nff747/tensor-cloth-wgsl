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

  public generate(): string {
    return this.generateParticleStruct();
  }
}

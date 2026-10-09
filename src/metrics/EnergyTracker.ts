export class EnergyTracker {
  static computeTotalEnergy(
    positions: Float32Array,
    velocities: Float32Array,
    gravity = [0, -9.81, 0]
  ) {
    const numParticles = positions.length / 4;
    let kinetic = 0;
    let potential = 0;

    for (let i = 0; i < numParticles; i++) {
      const invM = positions[i * 4 + 3];
      if (invM === 0) continue;
      const m = 1.0 / invM;

      const vx = velocities[i * 4 + 0];
      const vy = velocities[i * 4 + 1];
      const vz = velocities[i * 4 + 2];
      const vSq = vx * vx + vy * vy + vz * vz;
      kinetic += 0.5 * m * vSq;

      const y = positions[i * 4 + 1];
      potential += m * (-gravity[1]) * y;
    }

    return { kinetic, potential, total: kinetic + potential };
  }
}

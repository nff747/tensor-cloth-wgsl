/**
 * Zero-allocation math utilities for vector and matrix calculations in XPBD.
 */

export class MathUtils {
  /**
   * Computes XPBD time-step scaled compliance: alpha_tilde = compliance / (dt^2)
   */
  public static computeAlphaTilde(compliance: number, dt: number): number {
    if (dt <= 1e-9) return 0.0;
    return compliance / (dt * dt);
  }

  /**
   * Computes Euclidean distance between two 3D points.
   */
  public static distance3D(
    x1: number, y1: number, z1: number,
    x2: number, y2: number, z2: number
  ): number {
    const dx = x1 - x2;
    const dy = y1 - y2;
    const dz = z1 - z2;
    return Math.hypot(dx, dy, dz);
  }

  /**
   * Computes normalized normal vector from 3 triangle vertices.
   */
  public static computeFaceNormal(
    p0: [number, number, number],
    p1: [number, number, number],
    p2: [number, number, number]
  ): [number, number, number] {
    const ux = p1[0] - p0[0];
    const uy = p1[1] - p0[1];
    const uz = p1[2] - p0[2];

    const vx = p2[0] - p0[0];
    const vy = p2[1] - p0[1];
    const vz = p2[2] - p0[2];

    const nx = uy * vz - uz * vy;
    const ny = uz * vx - ux * vz;
    const nz = ux * vy - uy * vx;

    const len = Math.hypot(nx, ny, nz);
    if (len < 1e-7) return [0, 1, 0];
    return [nx / len, ny / len, nz / len];
  }
}

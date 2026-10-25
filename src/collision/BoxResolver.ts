import type { BoxCollider, CollisionContact } from './types';

export class BoxResolver {
  /**
   * Resolves collision between particle and an oriented or axis-aligned BoxCollider.
   * If particle penetrates box boundary, computes normal pointing to nearest face and depth.
   */
  static resolve(
    pos: [number, number, number],
    particleIndex: number,
    box: BoxCollider
  ): CollisionContact | null {
    const dx = pos[0] - box.center[0];
    const dy = pos[1] - box.center[1];
    const dz = pos[2] - box.center[2];

    const ox = box.halfExtents[0] - Math.abs(dx);
    const oy = box.halfExtents[1] - Math.abs(dy);
    const oz = box.halfExtents[2] - Math.abs(dz);

    // If inside all three extents, particle has penetrated the box
    if (ox > 0 && oy > 0 && oz > 0) {
      // Find shallowest axis of penetration
      if (ox <= oy && ox <= oz) {
        return {
          particleIndex,
          normal: [dx >= 0 ? 1 : -1, 0, 0],
          penetrationDepth: ox,
        };
      } else if (oy <= ox && oy <= oz) {
        return {
          particleIndex,
          normal: [0, dy >= 0 ? 1 : -1, 0],
          penetrationDepth: oy,
        };
      } else {
        return {
          particleIndex,
          normal: [0, 0, dz >= 0 ? 1 : -1],
          penetrationDepth: oz,
        };
      }
    }

    return null;
  }
}

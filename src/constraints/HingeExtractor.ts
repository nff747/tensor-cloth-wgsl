import type { DihedralHinge } from './types';

export class HingeExtractor {
  static extractHinges(indices: Uint32Array, positions: Float32Array, stiffness = 0.5): DihedralHinge[] {
    const numTriangles = indices.length / 3;
    const edgeMap = new Map<string, { tIndex: number; wingVertex: number }>();
    const hinges: DihedralHinge[] = [];

    const makeKey = (a: number, b: number) => a < b ? `${a}_${b}` : `${b}_${a}`;

    for (let t = 0; t < numTriangles; t++) {
      const v0 = indices[t * 3 + 0];
      const v1 = indices[t * 3 + 1];
      const v2 = indices[t * 3 + 2];

      const edges = [
        { p1: v0, p2: v1, wing: v2 },
        { p1: v1, p2: v2, wing: v0 },
        { p1: v2, p2: v0, wing: v1 },
      ];

      for (const e of edges) {
        const key = makeKey(e.p1, e.p2);
        if (edgeMap.has(key)) {
          const neighbor = edgeMap.get(key)!;
          hinges.push({
            id: hinges.length,
            p1: e.p1,
            p2: e.p2,
            p3: neighbor.wingVertex,
            p4: e.wing,
            restAngle: 0.0,
            stiffness,
          });
        } else {
          edgeMap.set(key, { tIndex: t, wingVertex: e.wing });
        }
      }
    }

    return hinges;
  }
}

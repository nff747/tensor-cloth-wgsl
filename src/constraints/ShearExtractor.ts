import type { ShearQuad } from './types';

export class ShearExtractor {
  static extractQuadShear(gridWidth: number, gridHeight: number, stiffness = 0.8): ShearQuad[] {
    const quads: ShearQuad[] = [];
    let id = 0;

    for (let y = 0; y < gridHeight - 1; y++) {
      for (let x = 0; x < gridWidth - 1; x++) {
        const p1 = y * gridWidth + x;
        const p2 = y * gridWidth + (x + 1);
        const p3 = (y + 1) * gridWidth + (x + 1);
        const p4 = (y + 1) * gridWidth + x;

        quads.push({
          id: id++,
          p1,
          p2,
          p3,
          p4,
          diag1Length: 1.414,
          diag2Length: 1.414,
          stiffness,
        });
      }
    }

    return quads;
  }
}

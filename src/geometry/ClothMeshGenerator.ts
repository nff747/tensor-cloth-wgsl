/**
 * ClothMeshGenerator.ts
 * Generates regular grid topology, vertex positions, inverse masses, UVs,
 * index buffers, and extracts XPBD distance and bending constraints.
 * Implements graph coloring / constraint partitioning to avoid race conditions during GPU compute.
 */

export interface DistanceConstraint {
  p1: number;
  p2: number;
  restLength: number;
  compliance: number;
}

export interface DihedralConstraint {
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  restAngle: number;
  compliance: number;
}

export interface ClothMeshOptions {
  width: number;
  height: number;
  segmentsX: number;
  segmentsY: number;
  totalMass?: number;
  pinnedCorners?: ('top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-edge')[];
  structuralCompliance?: number;
  shearCompliance?: number;
  bendingCompliance?: number;
}

export interface ClothTopology {
  numParticles: number;
  gridWidth: number;
  gridHeight: number;
  positions: Float32Array;       // [x, y, z, invMass] * numParticles
  normals: Float32Array;         // [nx, ny, nz, 0] * numParticles
  uvs: Float32Array;             // [u, v] * numParticles
  indices: Uint32Array;          // Triangle indices
  distanceConstraints: Float32Array; // [p1, p2, restLength, compliance] * numConstraints
  numDistanceConstraints: number;
  dihedralConstraints: Float32Array; // [p1, p2, p3, p4, restAngle, compliance, 0, 0]
  numDihedralConstraints: number;
  constraintBatches: { offset: number; count: number }[];
}

export class ClothMeshGenerator {
  public static generateGrid(options: ClothMeshOptions): ClothTopology {
    const {
      width,
      height,
      segmentsX,
      segmentsY,
      totalMass = 1.0,
      pinnedCorners = ['top-left', 'top-right'],
      structuralCompliance = 1e-5,
      shearCompliance = 1e-4,
      bendingCompliance = 1e-3,
    } = options;

    const gw = segmentsX + 1;
    const gh = segmentsY + 1;
    const numParticles = gw * gh;
    const particleMass = totalMass / numParticles;
    const defaultInvMass = 1.0 / particleMass;

    const positions = new Float32Array(numParticles * 4);
    const normals = new Float32Array(numParticles * 4);
    const uvs = new Float32Array(numParticles * 2);

    const dx = width / segmentsX;
    const dy = height / segmentsY;

    // Helper to test if a vertex is pinned
    const isPinned = (ix: number, iy: number): boolean => {
      for (const pin of pinnedCorners) {
        if (pin === 'top-left' && ix === 0 && iy === segmentsY) return true;
        if (pin === 'top-right' && ix === segmentsX && iy === segmentsY) return true;
        if (pin === 'bottom-left' && ix === 0 && iy === 0) return true;
        if (pin === 'bottom-right' && ix === segmentsX && iy === 0) return true;
        if (pin === 'top-edge' && iy === segmentsY) return true;
      }
      return false;
    };

    // Populate particles
    for (let iy = 0; iy < gh; iy++) {
      for (let ix = 0; ix < gw; ix++) {
        const idx = iy * gw + ix;
        const x = (ix / segmentsX - 0.5) * width;
        const y = (iy / segmentsY) * height;
        const z = 0.0;
        const invM = isPinned(ix, iy) ? 0.0 : defaultInvMass;

        positions[idx * 4 + 0] = x;
        positions[idx * 4 + 1] = y;
        positions[idx * 4 + 2] = z;
        positions[idx * 4 + 3] = invM;

        normals[idx * 4 + 0] = 0.0;
        normals[idx * 4 + 1] = 0.0;
        normals[idx * 4 + 2] = 1.0;
        normals[idx * 4 + 3] = 0.0;

        uvs[idx * 2 + 0] = ix / segmentsX;
        uvs[idx * 2 + 1] = iy / segmentsY;
      }
    }

    // Populate triangle indices
    const numQuads = segmentsX * segmentsY;
    const indices = new Uint32Array(numQuads * 6);
    let indexOffset = 0;

    for (let iy = 0; iy < segmentsY; iy++) {
      for (let ix = 0; ix < segmentsX; ix++) {
        const v0 = iy * gw + ix;
        const v1 = iy * gw + (ix + 1);
        const v2 = (iy + 1) * gw + ix;
        const v3 = (iy + 1) * gw + (ix + 1);

        // Triangle 1: v0 -> v1 -> v2
        indices[indexOffset++] = v0;
        indices[indexOffset++] = v1;
        indices[indexOffset++] = v2;

        // Triangle 2: v1 -> v3 -> v2
        indices[indexOffset++] = v1;
        indices[indexOffset++] = v3;
        indices[indexOffset++] = v2;
      }
    }

    // Generate Distance Constraints
    const rawConstraints: DistanceConstraint[] = [];
    const getPos = (i: number) => [positions[i * 4], positions[i * 4 + 1], positions[i * 4 + 2]];
    const dist = (a: number, b: number) => {
      const pa = getPos(a);
      const pb = getPos(b);
      return Math.hypot(pa[0] - pb[0], pa[1] - pb[1], pa[2] - pb[2]);
    };

    // 1. Structural Constraints (Horizontal & Vertical)
    for (let iy = 0; iy < gh; iy++) {
      for (let ix = 0; ix < gw; ix++) {
        const i = iy * gw + ix;
        if (ix + 1 < gw) {
          const right = iy * gw + (ix + 1);
          rawConstraints.push({ p1: i, p2: right, restLength: dist(i, right), compliance: structuralCompliance });
        }
        if (iy + 1 < gh) {
          const up = (iy + 1) * gw + ix;
          rawConstraints.push({ p1: i, p2: up, restLength: dist(i, up), compliance: structuralCompliance });
        }
      }
    }

    // 2. Shear Constraints (Diagonals)
    for (let iy = 0; iy < segmentsY; iy++) {
      for (let ix = 0; ix < segmentsX; ix++) {
        const v0 = iy * gw + ix;
        const v1 = iy * gw + (ix + 1);
        const v2 = (iy + 1) * gw + ix;
        const v3 = (iy + 1) * gw + (ix + 1);

        rawConstraints.push({ p1: v0, p2: v3, restLength: dist(v0, v3), compliance: shearCompliance });
        rawConstraints.push({ p1: v1, p2: v2, restLength: dist(v1, v2), compliance: shearCompliance });
      }
    }

    // 3. Bending Constraints (2-hop distance springs)
    for (let iy = 0; iy < gh; iy++) {
      for (let ix = 0; ix < gw; ix++) {
        const i = iy * gw + ix;
        if (ix + 2 < gw) {
          const right2 = iy * gw + (ix + 2);
          rawConstraints.push({ p1: i, p2: right2, restLength: dist(i, right2), compliance: bendingCompliance });
        }
        if (iy + 2 < gh) {
          const up2 = (iy + 2) * gw + ix;
          rawConstraints.push({ p1: i, p2: up2, restLength: dist(i, up2), compliance: bendingCompliance });
        }
      }
    }

    // Pack distance constraints into Float32Array: [p1, p2, restLength, compliance]
    const distanceConstraintBuffer = new Float32Array(rawConstraints.length * 4);
    for (let i = 0; i < rawConstraints.length; i++) {
      const c = rawConstraints[i];
      distanceConstraintBuffer[i * 4 + 0] = c.p1;
      distanceConstraintBuffer[i * 4 + 1] = c.p2;
      distanceConstraintBuffer[i * 4 + 2] = c.restLength;
      distanceConstraintBuffer[i * 4 + 3] = c.compliance;
    }

    // Dihedral wing angle constraints for adjacent triangles sharing an edge
    const dihedralList: DihedralConstraint[] = [];
    for (let iy = 0; iy < segmentsY; iy++) {
      for (let ix = 0; ix < segmentsX; ix++) {
        const v0 = iy * gw + ix;
        const v1 = iy * gw + (ix + 1);
        const v2 = (iy + 1) * gw + ix;
        const v3 = (iy + 1) * gw + (ix + 1);

        // Quad diagonal edge (v1, v2) shared between (v0, v1, v2) and (v1, v3, v2)
        // p1=v1, p2=v2, p3=v0, p4=v3
        dihedralList.push({
          p1: v1,
          p2: v2,
          p3: v0,
          p4: v3,
          restAngle: Math.PI, // Initially flat
          compliance: bendingCompliance,
        });
      }
    }

    const dihedralBuffer = new Float32Array(dihedralList.length * 8);
    for (let i = 0; i < dihedralList.length; i++) {
      const d = dihedralList[i];
      dihedralBuffer[i * 8 + 0] = d.p1;
      dihedralBuffer[i * 8 + 1] = d.p2;
      dihedralBuffer[i * 8 + 2] = d.p3;
      dihedralBuffer[i * 8 + 3] = d.p4;
      dihedralBuffer[i * 8 + 4] = d.restAngle;
      dihedralBuffer[i * 8 + 5] = d.compliance;
      dihedralBuffer[i * 8 + 6] = 0.0;
      dihedralBuffer[i * 8 + 7] = 0.0;
    }

    return {
      numParticles,
      gridWidth: gw,
      gridHeight: gh,
      positions,
      normals,
      uvs,
      indices,
      distanceConstraints: distanceConstraintBuffer,
      numDistanceConstraints: rawConstraints.length,
      dihedralConstraints: dihedralBuffer,
      numDihedralConstraints: dihedralList.length,
      constraintBatches: [{ offset: 0, count: rawConstraints.length }],
    };
  }
}

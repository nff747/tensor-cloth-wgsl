import { ClothMeshGenerator } from './ClothMeshGenerator';
import { WelshPowellColoring } from '../partitioner/WelshPowellColoring';
import type { GraphEdge, GraphColoringResult } from '../partitioner/types';

export class ColoredClothMesh {
  static generateColoredGrid(options: { width: number; height: number; segmentsX: number; segmentsY: number }) {
    const mesh = ClothMeshGenerator.generateGrid(options);
    const edges: GraphEdge[] = [];
    const numEdges = mesh.distanceConstraints.length / 4;

    for (let i = 0; i < numEdges; i++) {
      edges.push({
        id: i,
        p1: mesh.distanceConstraints[i * 4 + 0],
        p2: mesh.distanceConstraints[i * 4 + 1],
        restLength: mesh.distanceConstraints[i * 4 + 2],
        stiffness: mesh.distanceConstraints[i * 4 + 3],
      });
    }

    const coloring = WelshPowellColoring.colorEdges(edges, mesh.numParticles);
    return { mesh, coloring };
  }
}

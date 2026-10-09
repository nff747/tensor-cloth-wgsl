import type { GraphEdge } from './types';

export class AdjacencyBuilder {
  static buildEdgeInterferenceGraph(edges: GraphEdge[], numParticles: number): Map<number, Set<number>> {
    // Map particle to all incident edges
    const particleToEdges: number[][] = Array.from({ length: numParticles }, () => []);
    for (const edge of edges) {
      particleToEdges[edge.p1].push(edge.id);
      particleToEdges[edge.p2].push(edge.id);
    }

    // Interfere if edges share a particle
    const interference = new Map<number, Set<number>>();
    for (let e = 0; e < edges.length; e++) {
      interference.set(e, new Set<number>());
    }

    for (let p = 0; p < numParticles; p++) {
      const incident = particleToEdges[p];
      for (let i = 0; i < incident.length; i++) {
        for (let j = i + 1; j < incident.length; j++) {
          const e1 = incident[i];
          const e2 = incident[j];
          interference.get(e1)!.add(e2);
          interference.get(e2)!.add(e1);
        }
      }
    }

    return interference;
  }
}

import type { GraphEdge, GraphColoringResult, ColoredBatch } from './types';
import { AdjacencyBuilder } from './AdjacencyBuilder';

export class WelshPowellColoring {
  static colorEdges(edges: GraphEdge[], numParticles: number): GraphColoringResult {
    const interference = AdjacencyBuilder.buildEdgeInterferenceGraph(edges, numParticles);
    const numEdges = edges.length;
    if (numEdges === 0) {
      return { numColors: 0, batches: [], edgeToColor: new Uint32Array(0), maxDegree: 0 };
    }

    // Sort edges by descending degree
    const degrees = edges.map(e => ({ id: e.id, degree: interference.get(e.id)!.size }));
    degrees.sort((a, b) => b.degree - a.degree);
    const maxDegree = degrees[0].degree;

    const colors = new Int32Array(numEdges).fill(-1);
    let currentColor = 0;
    let coloredCount = 0;

    while (coloredCount < numEdges) {
      const currentBatchEdges: number[] = [];
      const forbiddenNeighbors = new Set<number>();

      for (const item of degrees) {
        const edgeId = item.id;
        if (colors[edgeId] !== -1) continue;

        if (!forbiddenNeighbors.has(edgeId)) {
          colors[edgeId] = currentColor;
          currentBatchEdges.push(edgeId);
          coloredCount++;

          // Mark all its interfering neighbors as forbidden for this color
          const neighbors = interference.get(edgeId)!;
          for (const n of neighbors) {
            forbiddenNeighbors.add(n);
          }
        }
      }
      currentColor++;
    }

    const batches: ColoredBatch[] = [];
    for (let c = 0; c < currentColor; c++) {
      const batchEdges = edges.filter(e => colors[e.id] === c).map(e => e.id);
      batches.push({
        colorIndex: c,
        edgeIndices: batchEdges,
        numEdges: batchEdges.length
      });
    }

    return {
      numColors: currentColor,
      batches,
      edgeToColor: new Uint32Array(colors),
      maxDegree
    };
  }
}

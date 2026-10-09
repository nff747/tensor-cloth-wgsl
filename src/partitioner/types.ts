export interface GraphEdge {
  id: number;
  p1: number;
  p2: number;
  restLength: number;
  stiffness: number;
}

export interface ColoredBatch {
  colorIndex: number;
  edgeIndices: number[];
  numEdges: number;
}

export interface GraphColoringResult {
  numColors: number;
  batches: ColoredBatch[];
  edgeToColor: Uint32Array;
  maxDegree: number;
}

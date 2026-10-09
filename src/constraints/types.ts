export interface DihedralHinge {
  id: number;
  p1: number; // Shared edge vertex 1
  p2: number; // Shared edge vertex 2
  p3: number; // Wing vertex 1
  p4: number; // Wing vertex 2
  restAngle: number;
  stiffness: number;
}

export interface ShearQuad {
  id: number;
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  diag1Length: number;
  diag2Length: number;
  stiffness: number;
}

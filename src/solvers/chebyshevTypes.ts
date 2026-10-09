export interface ChebyshevConfig {
  spectralRadius: number; // Estimated spectral radius rho (e.g. 0.995)
  minRelaxation: number;
  maxRelaxation: number;
}

export interface ChebyshevState {
  iteration: number;
  omega: number;
  prevOmega: number;
}

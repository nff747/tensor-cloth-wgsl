import type { ChebyshevConfig, ChebyshevState } from './chebyshevTypes';

export class ChebyshevAccelerator {
  private config: ChebyshevConfig;
  private state: ChebyshevState;

  constructor(config: Partial<ChebyshevConfig> = {}) {
    this.config = {
      spectralRadius: config.spectralRadius ?? 0.993,
      minRelaxation: config.minRelaxation ?? 1.0,
      maxRelaxation: config.maxRelaxation ?? 1.98,
    };
    this.state = { iteration: 0, omega: 1.0, prevOmega: 1.0 };
  }

  reset() {
    this.state = { iteration: 0, omega: 1.0, prevOmega: 1.0 };
  }

  nextOmega(): number {
    const k = this.state.iteration;
    let nextW = 1.0;

    if (k === 0) {
      nextW = 1.0;
    } else if (k === 1) {
      const rho = this.config.spectralRadius;
      nextW = 1.0 / (1.0 - 0.5 * rho * rho);
    } else {
      const rho = this.config.spectralRadius;
      nextW = 1.0 / (1.0 - 0.25 * rho * rho * this.state.omega);
    }

    // Clamp to stability window
    nextW = Math.max(this.config.minRelaxation, Math.min(this.config.maxRelaxation, nextW));

    this.state.prevOmega = this.state.omega;
    this.state.omega = nextW;
    this.state.iteration++;
    return nextW;
  }

  getCurrentState(): ChebyshevState {
    return { ...this.state };
  }
}

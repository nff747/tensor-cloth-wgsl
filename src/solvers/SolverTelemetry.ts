export interface IterationSample {
  iteration: number;
  omega: number;
  maxConstraintViolation: number;
  meanConstraintViolation: number;
}

export class SolverTelemetry {
  private samples: IterationSample[] = [];

  record(sample: IterationSample) {
    this.samples.push(sample);
  }

  clear() {
    this.samples = [];
  }

  getSamples(): IterationSample[] {
    return [...this.samples];
  }
}

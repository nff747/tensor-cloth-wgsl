export class SpectralEstimator {
  static estimateSpectralRadius(residuals: number[]): number {
    if (residuals.length < 3) return 0.99;
    const rLast = residuals[residuals.length - 1];
    const rPrev = residuals[residuals.length - 2];
    if (rPrev === 0) return 0.99;
    const ratio = Math.abs(rLast / rPrev);
    return Math.max(0.8, Math.min(0.999, ratio));
  }
}

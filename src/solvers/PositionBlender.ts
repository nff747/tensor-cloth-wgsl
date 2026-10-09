export class PositionBlender {
  static blend(prevPos: Float32Array, newPos: Float32Array, omega: number, out: Float32Array): void {
    const len = prevPos.length;
    for (let i = 0; i < len; i++) {
      out[i] = prevPos[i] + omega * (newPos[i] - prevPos[i]);
    }
  }
}

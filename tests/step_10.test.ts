import { describe, it, expect } from 'vitest';
import * as Core from '../src/index';
describe('Root Package Exports', () => {
  it('should export colored cloth mesh', () => {
    expect(Core.ColoredClothMesh).toBeDefined();
  });
});

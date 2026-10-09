import { describe, it, expect } from 'vitest';
import * as Core from '../src/index';
describe('Core Index with Constraints', () => {
  it('should export HingeExtractor', () => {
    expect(Core.HingeExtractor).toBeDefined();
  });
});

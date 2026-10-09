import { describe, it, expect } from 'vitest';
import * as Core from '../src/index';
describe('Core Index with Aerodynamics', () => {
  it('should export aerodynamicsWGSL', () => {
    expect(Core.aerodynamicsWGSL).toBeDefined();
  });
});

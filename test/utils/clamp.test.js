import clamp from '../../src/focus-tree/utils/clamp';

describe('clamp()', () => {
  it('correctly clamps', () => {
    expect(clamp(5, 5, 5)).toBe(5);
    expect(clamp(3, 5, 10)).toBe(5);
    expect(clamp(12, 5, 10)).toBe(10);
  });

  it('throws for invalid inputs', () => {
    expect(() => {
      clamp(5, 10, 0);
    }).toThrow();
  });
});

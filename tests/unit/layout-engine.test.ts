import { describe, it, expect } from 'vitest';
import { calculateGridBounds } from '../../src/main/layout-engine';

describe('calculateGridBounds', () => {
  it('returns correct number of panels for 2x2 grid', () => {
    const bounds = calculateGridBounds(1200, 800, 40, 2, 2, 2);
    expect(bounds).toHaveLength(4);
  });

  it('positions panels below chrome height', () => {
    const bounds = calculateGridBounds(1200, 800, 40, 2, 2, 2);
    for (const b of bounds) {
      expect(b.y).toBeGreaterThanOrEqual(40);
    }
  });

  it('panels do not overlap horizontally', () => {
    const bounds = calculateGridBounds(1200, 800, 40, 2, 2, 2);
    // First row: panel 0 and panel 1
    const left = bounds[0];
    const right = bounds[1];
    expect(right.x).toBeGreaterThanOrEqual(left.x + left.width);
  });

  it('panels do not overlap vertically', () => {
    const bounds = calculateGridBounds(1200, 800, 40, 2, 2, 2);
    // Column 0: panel 0 (top) and panel 2 (bottom)
    const top = bounds[0];
    const bottom = bounds[2];
    expect(bottom.y).toBeGreaterThanOrEqual(top.y + top.height);
  });

  it('panels fill available space (minus gaps)', () => {
    const width = 1200;
    const height = 800;
    const chrome = 40;
    const gap = 2;
    const bounds = calculateGridBounds(width, height, chrome, 2, 2, gap);

    const panelWidth = bounds[0].width;
    const panelHeight = bounds[0].height;

    // Two panels + one gap should approximate the total width
    expect(panelWidth * 2 + gap).toBeLessThanOrEqual(width);
    expect(panelHeight * 2 + gap + chrome).toBeLessThanOrEqual(height);
  });

  it('handles 1x1 grid (single panel)', () => {
    const bounds = calculateGridBounds(800, 600, 40, 1, 1, 0);
    expect(bounds).toHaveLength(1);
    expect(bounds[0]).toEqual({ x: 0, y: 40, width: 800, height: 560 });
  });

  it('handles 3x3 grid', () => {
    const bounds = calculateGridBounds(900, 900, 0, 3, 3, 0);
    expect(bounds).toHaveLength(9);
    expect(bounds[0].width).toBe(300);
    expect(bounds[0].height).toBe(300);
  });

  it('accounts for gap between panels', () => {
    const bounds = calculateGridBounds(1202, 842, 40, 2, 2, 2);
    // Available: 1200 wide (minus 2 gap = 1200), each panel = 600
    expect(bounds[0].width).toBe(600);
    expect(bounds[1].x).toBe(602); // 600 + 2 gap
  });
});

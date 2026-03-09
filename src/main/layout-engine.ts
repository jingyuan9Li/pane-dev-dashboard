import { PanelBounds } from '../shared/types';

export function calculateGridBounds(
  contentWidth: number,
  contentHeight: number,
  chromeHeight: number,
  rows: number,
  cols: number,
  gap: number
): PanelBounds[] {
  const availableWidth = contentWidth - gap * (cols - 1);
  const availableHeight = contentHeight - chromeHeight - gap * (rows - 1);

  const panelWidth = Math.floor(availableWidth / cols);
  const panelHeight = Math.floor(availableHeight / rows);

  const bounds: PanelBounds[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      bounds.push({
        x: col * (panelWidth + gap),
        y: chromeHeight + row * (panelHeight + gap),
        width: panelWidth,
        height: panelHeight,
      });
    }
  }

  return bounds;
}

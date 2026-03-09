export interface PanelBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PanelConfig {
  url: string;
  bounds: PanelBounds;
}

export interface GridLayout {
  rows: number;
  cols: number;
  gap: number;
  chromeHeight: number;
}

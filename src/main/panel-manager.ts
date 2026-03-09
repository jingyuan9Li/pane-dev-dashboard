import { BaseWindow, WebContentsView } from 'electron';
import { calculateGridBounds } from './layout-engine';
const CHROME_HEIGHT = 40;
const GRID_GAP = 2;
const GRID_ROWS = 2;
const GRID_COLS = 2;
const RESIZE_DEBOUNCE_MS = 16;

const DEFAULT_URLS = [
  'https://github.com',
  'https://news.ycombinator.com',
  'https://developer.mozilla.org',
  'https://www.electronjs.org',
];

const panels: WebContentsView[] = [];
let resizeTimer: ReturnType<typeof setTimeout> | null = null;

export function createPanels(win: BaseWindow): void {
  for (const url of DEFAULT_URLS) {
    const view = new WebContentsView();
    win.contentView.addChildView(view);
    view.webContents.loadURL(url);
    panels.push(view);
  }

  layoutPanels(win);
}

export function layoutPanels(win: BaseWindow): void {
  const { width, height } = win.getContentBounds();
  const bounds = calculateGridBounds(
    width,
    height,
    CHROME_HEIGHT,
    GRID_ROWS,
    GRID_COLS,
    GRID_GAP
  );

  panels.forEach((view, i) => {
    if (bounds[i]) {
      view.setBounds(bounds[i]);
    }
  });
}

export function setupResizeHandler(win: BaseWindow): void {
  win.on('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => layoutPanels(win), RESIZE_DEBOUNCE_MS);
  });
}

export function getPanels(): WebContentsView[] {
  return panels;
}

import { app, BaseWindow, WebContentsView } from 'electron';
import { createPanels, setupResizeHandler } from './panel-manager';

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  const win = new BaseWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#111111',
  });

  // Chrome UI view (title bar)
  const chromeView = new WebContentsView({
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });
  win.contentView.addChildView(chromeView);
  chromeView.webContents.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Position chrome view at top
  const { width } = win.getContentBounds();
  chromeView.setBounds({ x: 0, y: 0, width, height: 40 });

  // Update chrome width on resize
  win.on('resize', () => {
    const { width } = win.getContentBounds();
    chromeView.setBounds({ x: 0, y: 0, width, height: 40 });
  });

  // Create and layout the 2x2 panel grid
  createPanels(win);
  setupResizeHandler(win);
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BaseWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

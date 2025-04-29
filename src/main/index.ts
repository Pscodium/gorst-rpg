import { app, shell, BrowserWindow, screen, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/favicon.png?asset';

function createWindow(): void {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    const mainWindow = new BrowserWindow({
        width,
        height,
        show: false,
        autoHideMenuBar: true,
        fullscreen: true,
        resizable: true, // change this for false when release the game
        frame: true,
        fullscreenable: true,
        icon,
        webPreferences: {
            contextIsolation: true,
            navigateOnDragDrop: true,
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false,
        },
    });

    ipcMain.on('close-window', () => {
        mainWindow.close();
      });

    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: 'deny' };
    });

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
    }
}

app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.electron');

    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });

    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

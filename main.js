const { app, BrowserWindow } = require("electron");
const chokidar = require("chokidar");
const path = require("path")

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
  });

  mainWindow.loadFile("index.html");
  // mainWindow.webContents.openDevTools();
};
const watcher = chokidar.watch(path.join(__dirname, 'flashcards.Json'));

  watcher.on('change', () => {
    mainWindow.webContents.send('reload-cards');
  });

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

const { app, BrowserWindow, ipcMain, dialog, screen } = require("electron");
const path = require("path");
const fs = require("fs");

const dataDir = path.join(app.getPath("userData"), "dados");
const mediaDir = path.join(dataDir, "media");
const dbFile = path.join(dataDir, "playlist.json");

function ensureData() {
  fs.mkdirSync(mediaDir, { recursive: true });
  if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify({ settings: { photoSeconds: 10 }, items: [] }, null, 2));
  }
}

function readDb() {
  ensureData();
  try { return JSON.parse(fs.readFileSync(dbFile, "utf8")); }
  catch { return { settings: { photoSeconds: 10 }, items: [] }; }
}

function writeDb(db) {
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 650,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.loadFile("index.html");
}

function createPlayer() {
  const displays = screen.getAllDisplays();
  const primary = screen.getPrimaryDisplay();
  const target = displays.length > 1 ? displays[1] : primary;
  const { x, y, width, height } = target.bounds;

  const win = new BrowserWindow({
    x, y, width, height,
    fullscreen: true,
    kiosk: true,
    frame: false,
    alwaysOnTop: true,
    backgroundColor: "#000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile("player.html");
  return win;
}

app.whenReady().then(() => {
  ensureData();

  ipcMain.handle("get-db", () => readDb());

  ipcMain.handle("save-settings", (_, settings) => {
    const db = readDb();
    db.settings.photoSeconds = Math.max(1, Number(settings.photoSeconds) || 10);
    writeDb(db);
    return db;
  });

  ipcMain.handle("import-media", async () => {
    const result = await dialog.showOpenDialog({
      title: "Adicionar fotos e vídeos",
      properties: ["openFile", "multiSelections"],
      filters: [
        { name: "Mídias", extensions: ["jpg","jpeg","png","webp","gif","mp4","webm","mov","m4v"] }
      ]
    });
    if (result.canceled) return readDb();

    const db = readDb();
    for (const source of result.filePaths) {
      const ext = path.extname(source).toLowerCase();
      const type = [".mp4",".webm",".mov",".m4v"].includes(ext) ? "video" : "image";
      const safeName = Date.now() + "_" + Math.random().toString(36).slice(2, 8) + ext;
      const dest = path.join(mediaDir, safeName);
      fs.copyFileSync(source, dest);
      db.items.push({
        id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
        name: path.basename(source),
        file: safeName,
        type,
        active: true
      });
    }
    writeDb(db);
    return db;
  });

  ipcMain.handle("delete-media", (_, id) => {
    const db = readDb();
    const item = db.items.find(x => x.id === id);
    if (item) {
      const file = path.join(mediaDir, item.file);
      if (fs.existsSync(file)) fs.unlinkSync(file);
      db.items = db.items.filter(x => x.id !== id);
      writeDb(db);
    }
    return db;
  });

  ipcMain.handle("toggle-media", (_, id) => {
    const db = readDb();
    const item = db.items.find(x => x.id === id);
    if (item) item.active = !item.active;
    writeDb(db);
    return db;
  });

  ipcMain.handle("move-media", (_, { id, direction }) => {
    const db = readDb();
    const index = db.items.findIndex(x => x.id === id);
    const target = direction === "up" ? index - 1 : index + 1;
    if (index >= 0 && target >= 0 && target < db.items.length) {
      [db.items[index], db.items[target]] = [db.items[target], db.items[index]];
      writeDb(db);
    }
    return db;
  });

  ipcMain.handle("media-url", (_, file) => {
    return "file://" + path.join(mediaDir, file).replace(/\\/g, "/");
  });

  ipcMain.handle("open-player", () => {
    createPlayer();
    return true;
  });

  ipcMain.handle("close-app", () => app.quit());

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getDb: () => ipcRenderer.invoke("get-db"),
  saveSettings: (settings) => ipcRenderer.invoke("save-settings", settings),
  importMedia: () => ipcRenderer.invoke("import-media"),
  deleteMedia: (id) => ipcRenderer.invoke("delete-media", id),
  toggleMedia: (id) => ipcRenderer.invoke("toggle-media", id),
  moveMedia: (id, direction) => ipcRenderer.invoke("move-media", { id, direction }),
  mediaUrl: (file) => ipcRenderer.invoke("media-url", file),
  openPlayer: () => ipcRenderer.invoke("open-player"),
  closeApp: () => ipcRenderer.invoke("close-app")
});
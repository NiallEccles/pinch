// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const WCAG = require("./utils/calcWCAG");
const { calcTextColour } = require("./utils/calcTextColour");

let win;

const getColour = require("./getColour");

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 389,
    minHeight: 70,
    maximizable: false,
    alwaysOnTop: true,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
      contextIsolation: true,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      preload: path.join(__dirname, "preload.js"), // use a preload script
    },
  });

  // and load the index.html of the app.
  win.loadFile("index.html");

  // Open the DevTools.
  win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("pickColour", (event, args) => {
  if (args.type === "picker1") {
    getColour().then((colour) => {
      win.webContents.send("sendColour", { for: "picker1", colour });
    });
  } else if (args.type === "picker2") {
    getColour().then((colour) => {
      win.webContents.send("sendColour", { for: "picker2", colour });
    });
  }
  // win.webContents.send("fromMain", "yo");
  // fs.readFile("path/to/file", (error, data) => {
  // });
});

ipcMain.on("requestWCAG", (event, args) => {
  const results = {
    ...WCAG.calcWCAG(args.colours.colour1, args.colours.colour2),
    textColour: calcTextColour(args.colours.colour1),
  };
  win.webContents.send("WCAGresults", { results });
});

ipcMain.on("requestClose", () => {
  app.quit();
});

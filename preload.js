// preload.js

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  console.log("locked and loaded");
  document.documentElement.style.setProperty("--bg-colour", "#fffa66");
  document.querySelector(`.picker1`).value = "#fffa66";
  document.documentElement.style.setProperty("--text-colour", "#142842");
  document.querySelector(`.picker2`).value = "#142842";
});

const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    // whitelist channels
    let validChannels = ["pickColour", "requestWCAG"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = ["sendColour", "WCAGresults"];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});

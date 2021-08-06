// preload.js
const getProp = (propName) =>
  document.documentElement.style.getPropertyValue(propName);

const setProp = (propName, value) =>
  document.documentElement.style.setProperty(propName, value);

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  console.log("locked and loaded");
  setProp("--bg-colour", "#fffa66");
  document.querySelector(`.picker1`).value = "#fffa66";
  setProp("--text-colour", "#142842");
  document.querySelector(`.picker2`).value = "#142842";
  setProp("--controls-colour", "black");

  document.querySelector(".rating").innerHTML = "AAA";
  document.querySelector("#multiple").style.display = "initial";
  document.querySelector("#single").style.display = "none";
});

const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    // whitelist channels
    let validChannels = [
      "pickColour",
      "requestWCAG",
      "requestClose",
      "requestLayerToggle",
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = ["sendColour", "WCAGresults", "layerToggle"];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});

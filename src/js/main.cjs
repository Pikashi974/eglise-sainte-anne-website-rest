const { BrowserWindow, Notification } = require("electron");
const { MongoClient } = require("mongodb");
const path = require("path");
const globals = require("./globals.cjs");
const ObjectID = require("mongodb").ObjectId;

let window;

function NewWindow() {
    window = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "../screens/main/mainPreload.cjs"),
        },
    });

    window.once("ready-to-show", () => {
        window.show();
    });

    window.loadFile("./src/ui/index.html");
}

module.exports = {
    NewWindow
}
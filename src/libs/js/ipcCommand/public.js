const {
    ipcMain,
} = require("electron");
let userName = ''
let password = '';
const path = require("path");
const fs = require("fs");
const fsWebpackPlugin = require('../fsWebpackPlugin.js');
module.exports = app => {
    //打开URL
    ipcMain.on('open-web-url', (event, url) => {
        var command = process.platform == "darwin" ? "open" : "explorer";
        var cmd = `${command} "${url}"`;
        require("child_process").exec(cmd);
        event.returnValue = true;
    })
    ipcMain.on("getUserAccount", (event) => {
        event.sender.send("getUserAccount", userName,password);
    })
    ipcMain.on("setUserAccount", (event, name,pwd) => {
        userName = name;
        password = pwd;
    })
    //监听退出
    ipcMain.on("quit", (event, path) => {
        app.quit(1);
    })
}

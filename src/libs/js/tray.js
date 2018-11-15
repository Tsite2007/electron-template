const {
    BrowserWindow,
    Tray,
    Menu,
    app,
    ipcRenderer
} = require("electron");
let tray = null;
const path = require("path");
const fs = require('fs');
const process = require("process");
var out = path.dirname(process.execPath)
var FsWebpackPlugin = require("./fsWebpackPlugin.js");
var fsWebpackPlugin = new FsWebpackPlugin();
let mainWindow = null;
let timmer = null;
module.exports=app=>{
    app.on('ready', () => {
        //用一个 Tray 来表示一个图标,这个图标处于正在运行的系统的通知区 ，通常被添加到一个 context menu 上.
        tray = new Tray(path.join(__dirname, require('@images/favicon/favicon.png')));
        // let tray = new Tray(path.join(__dirname,'./assets/favicon.ico'));
        const contextMenu = Menu.buildFromTemplate([
            {
                label: '退出',
                click:()=>{
                    app.exit(1);
                }
            },
        ])
        //托盘click打开客户端
        tray.on('click',()=>{
            var mainWindow = BrowserWindow.getAllWindows()[0];
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
            mainWindow.setSkipTaskbar(false);
        })
        tray.on('double-click',()=>{

        })
        tray.setToolTip('退出计算机测试客户端');
        tray.setContextMenu(contextMenu);
    });
}

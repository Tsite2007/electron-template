const {
    app,
    ipcMain,
    BrowserWindow,
    dialog
} = require("electron");
const path = require('path');
const process = require("process"); //进程信息
const fs = require('fs');
const devMode = process.env.NODE_ENV === "development"; //是否开发模式
require("./libs/js/runCheck.js")(app); //禁止打开多份
// require("./libs/js/tray.js")(app); //设置托盘
require("./libs/js/ipcCommand/public.js")(app); //公共ipc处理模块
var login = require("./main/login.js");//登录
var index = require("./main/index.js");//首页
app.on('ready', () => {
    login.create();
});
//所有窗口都关闭
app.on('window-all-closed', function() {
    app.quit();
})
//小化
ipcMain.on('hide-window', () => {
    mainWindow.minimize();
});
//最大化
ipcMain.on('show-window', () => {
    mainWindow.maximize();
});
//还原
ipcMain.on('orignal-window', () => {
    mainWindow.unmaximize();
});

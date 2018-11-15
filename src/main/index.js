const electron = require('electron')
const {app,BrowserWindow,ipcMain} = electron;

const process = require("process");
const devMode = process.env.NODE_ENV === "development";
const path = require('path');
const filePath = "file://"+path.join(__dirname, '/views/index.html');
const indexUrl = "http://localhost:8080/index.html";
let mainWindow = null;
let windowWidth = 0;
let windowHeight = 0;
ipcMain.on('create-index-item', (event, url) => {
    if(mainWindow && !mainWindow.isDestroyed()){
        mainWindow.unmaximize();
        mainWindow.focus();
    }else{
        module.exports.create();
    }
    event.returnValue = mainWindow;
})
app.on('ready', () => {
    const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
    windowWidth = width;
    windowHeight = height;
})
//创建窗口
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 960,
        minWidth:1024,
        minHeight:768,
        title: "计算机测试题",
        offscreen:true,
        show: true,
        center:true,
        frame: false,  //去掉窗口边框
        autoHideMenuBar:true, //隐藏菜单栏
        titleBarStyle:"hidden",
        resizable: true, //可否调整大小
        movable: true, //可否移动
        minimizable: false, //可否最小化
        maximizable: false, //可否最大化
        fullscreen: false, //MAC下是否可以全屏
        skipTaskbar: false, //在任务栏中显示窗口
        acceptFirstMouse: true, //是否允许单击页面来激活窗口
        transparent: true, //允许透明
        closable:false,
        allowRunningInsecureContent:true,//允许一个 https 页面运行 http url 里的资源
        //icon:path.join(__dirname, './src/assets/icon/logo.icns'),
        webPreferences: {
            devTools: devMode, //是否打开调试模式
            webSecurity:false,//禁用安全策略
            allowDisplayingInsecureContent:true,//允许一个使用 https的界面来展示由 http URLs 传过来的资源
            allowRunningInsecureContent: true, //允许一个 https 页面运行 http url 里的资源
        }
    })
    // 启动调试工具,如果是开发环境下则不需要开启
    mainWindow.setMovable(true);
    mainWindow.loadURL(devMode ? indexUrl : filePath);
    //windows注入方法
    mainWindow.webContents.on('dom-ready',function(event){
        mainWindow.webContents.executeJavaScript(`
            var runYunServerClient=true;
        `);
    })
    mainWindow.webContents.on('did-finish-load',function(event){
        mainWindow.webContents.executeJavaScript(`
            var runYunServerClient=true;
        `);
    })
    //监听关闭
    mainWindow.on('closed', function() {
        mainWindow = null
    })
    return mainWindow;
}

module.exports={
    create(){
        if(mainWindow && !mainWindow.isDestroyed()){
            mainWindow.destroy();
        }
        mainWindow=null;
        return createWindow();
    }
}

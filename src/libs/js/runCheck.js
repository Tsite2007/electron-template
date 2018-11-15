const {
    app,
    BrowserWindow
} = require("electron");
let myWindow = null;
module.exports=app=>{
    const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
        myWindow = BrowserWindow.getAllWindows()[0];
        if(myWindow){
            if (myWindow.isMinimized()) myWindow.restore();
            myWindow.focus();
        }
    });
    if (shouldQuit) {
        app.exit(1);
        return;
    }
}

<template lang="html">
    <div class="main">
        <div class="opatorWin">
            <p class="iconImg" @click="minimizeWebEvent($event)">
                <span class="reduceIcon"></span>
            </p>
            <p class="iconImg" @click="fullWebScreenEvent($event)">
                <span class="fullscreenIcon"></span>
            </p>
            <p class="iconImg" @click="closeWebPageEvent($event)">
                <span class="closeIcon"></span>
            </p>
        </div>
        <div :class="['mainBox',{'fullScreen':setWindow.isFullScreen}]"></div>
    </div>
</template>

<script>
const {
    ipcRenderer,
    remote
} = require('electron');
const self = remote.getCurrentWindow();
import {mapState,mapMutations} from "vuex";
export default {
    data(){
       return {
           //记录窗口大小
           windowConfig:{
               clientWidth: 0,
               clientHeight: 0,
           },
           setWindow:{
               isFullScreen:true, //是否全屏模式
           }
       }
    },
    methods:{
        onWindowResize() {
            if(!this.windowConfig.clientWidth && !this.windowConfig.clientHeight){
                this.windowConfig.clientWidth = document.documentElement.clientWidth;
                this.windowConfig.clientHeight = document.documentElement.clientHeight;
            }
            if((this.windowConfig.clientWidth == document.documentElement.clientWidth) && (this.windowConfig.clientHeight == document.documentElement.clientHeight)){
                this.setWindow.isFullScreen = false;
            }else{
                this.setWindow.isFullScreen = true;
            }
        },
        //最小化
        minimizeWebEvent() {
            self.minimize();
        },
        //全屏
        fullWebScreenEvent() {
            if(!this.setWindow.isFullScreen){
                self.unmaximize(); //恢复窗口
                this.setWindow.isFullScreen = true;
            }else{
                self.maximize(); //最大化窗口
                this.setWindow.isFullScreen = false;
            }
        },
        //关闭
        closeWebPageEvent() {
            self.minimize();
            self.destroy();
        }
    }
}
</script>
<style lang="less" scoped>
@import "~@/libs/css/theme/theme.less";
.mainBox {
    position: absolute;
    left: 0px;
    top: 0px;
    right: 200px;
    height: 75px;
    line-height: 30px;
    //background-color: rgb(247, 250, 255);
    text-align: center;
    z-index: 0;
    -webkit-app-region: drag;
}
.fullScreen {
    -webkit-app-region: drag;
}
.opatorWin {
    -webkit-app-region: no-drag;
    position: absolute;
    width: 100px;
    z-index: 1001;
    height: 30px;
    line-height: 30px;
    top: 20px;
    right: 10px;
    text-align: right;
    overflow: hidden;
}
.iconImg {
    -webkit-app-region: no-drag;
    display: inline-block;
    height: 30px;
    text-align: center;
    cursor: pointer;
    &:hover {
        background-color: rgba(0,0,0,0.15);
        cursor: pointer;
    }
    .reduceIcon,.fullscreenIcon,.closeIcon{
        cursor: pointer;
        display: inline-block;
        width: 30px;
        height: 30px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: inherit;
    }
    .reduceIcon{
        background-image: url("~@images/operate/reduceIcon.png");
    }
    .fullscreenIcon{
        background-image: url("~@images/operate/fullscreenIcon.png");
    }
    .closeIcon{
        background-image: url("~@images/operate/closeIcon.png");
    }
}
</style>

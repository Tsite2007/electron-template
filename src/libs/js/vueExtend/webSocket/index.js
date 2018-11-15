/**
* author：王焕丽 2018-02-03
* webscoket
*/

import Vue from 'vue';
var webSocket=null;
var callbackArr={};
function createWebscocket(){
    webSocket=new WebSocket("ws://101.200.199.97:8870/datacenter/sendMessages");
    webSocket.onopen=function(){
        vue.$emit("onOpenEvent");
        // sendMessage("callback",{count:0},function(){
        //     //console.log("回调函数");
        // });
        // webSocket.send(JSON.stringify({
        //     type:"",
        //     data:{
        //         count:0,
        //     }
        // }));
    };
    webSocket.onmessage=function(msgJson){
        var msg=JSON.parse(msgJson.data);
        if(msg.type=="callback"){
            var action=msg.action;
            var callback=callbackArr[action];
            if(typeof callback ==="function"){
                delete callbackArr[action];
                callback(msg);
            }
            return;
        }
        vue.$emit("onMessageEvent",msg.data);
    };
    webSocket.onerror=function(){
        executeCallback("websocket连接出错！");
        webSocket.close();
    };
    webSocket.onclose=function(){
        vue.$emit("onCloseEvent");
        executeCallback("websocket连接关闭！");
        setTimeout(function(){
            createWebscocket();
        },5000);
    };
}
function executeCallback(_message){
    for(var key in callbackArr){
        var callback=callbackArr[key];
        if(typeof callback==="function"){
            callback({status:"error",message:_message});
        }
        delete callbackArr[key];
    }
}
var vue=new Vue({
    computed:{
        status:{
            get:function(){
                return webSocket?webSocket.readyState:-1;
            }
        }
    },
    methods:{
        createWebscocket(){
            createWebscocket();
        }
    }
});

function sendMessage(command,data,callback){
    var action=String(Math.random()).substr(2)+new Date().getTime();
    callbackArr[action]=callback;
    if(!webSocket)return;
    webSocket.send(JSON.stringify({
        type:command,
        data:data,
        action:action
    }));
}
//监听接收消息
vue.$on("sendMessage",sendMessage);

//createWebscocket();

var install={
    install(Vue) {
        Vue.mixin({
            beforeCreate() {
                this.$webSocket = vue;
            }
        })
    }
}
export default install;

var axios =require('axios');
var qs = require('qs');

var ajax = (function() {
    var content=this;
    var ajax = axios.create({
        baseURL: "",
        timeout: 1000*60*10,
        withCredentials: false,
        responsetype: 'json',
        headers: {
            'Cache-Control': 'no-cache'
        },
        validateStatus: function(status) {
            return true; //错误码交给ajaxCheck去验证
        },
        transformResponse: [function(data) {
            return data;
        }]
    });
    ajax.interceptors.request.use((config) => {
        if (!config.params) config.params = {};
        if (config.method === 'post') {
            if (!config.data) config.data = {};
            if (typeof(FormData) != "undefined" && config.data instanceof FormData) {
            } else if(config.qs===undefined || config.qs){
                config.data = qs.stringify(config.data);
            }
        } else {
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    })
    return ajax;
});
ajax.cancelToken = axios.CancelToken;

function CheckFun(json) {
    this.json = json;
}
CheckFun.prototype = {
    autoRun: function() {
        var arg = Array.prototype.slice.call(arguments, 0);
        for (var i = 0; i < arg.length; i++) {
            var command = String(arg[i] ? arg[i] : "").replace(/^\s*$/g, '');
            if (this != window && typeof this["then" + command.substr(0, 1).toUpperCase() + command.substr(1)] === "function") {
                this["then" + command.substr(0, 1).toUpperCase() + command.substr(1)]();
            } else {
                if (window.loadingView && window.loadingView.hide) {
                    window.loadingView.hide(command);
                }
            }
        }
        return this;
    },
    thenError: function(fun) {
        if (this.json.status == "error" || this.json.status == "fail") {
            if (typeof fun == "function") {
                this.json.status = "error";
                fun(this.json);
            } else {
                //默认错误处理函数
                if (window.WebSiteApp) {
                    window.WebSiteApp.$Message.error(this.json.message);
                } else if (console && console.log) {
                    console.log(this.json.message);
                    // alert("用户名或密码错误")
                } else {
                    alert(this.json.message);
                }
            }
        }
        return this;
    },
    thenLocation: function(fun) {
        if (this.json.status == "location") {
            if (typeof fun == "function") {
                if (fun(this.json) === false) return;
            };
            window.location = this.json.location ? this.json.location : "/"; //跳转到这个地址
        }
        return this;
    },
    thenSuccess: function(fun) {
        if (this.json.status == "success") {
            if (typeof fun == "function") fun(this.json);
        }
        return this;
    },
    thenComplete: function(fun) {
        if (typeof fun == "function") fun(this.json);
        return this;
    },
    thenLogin: function(fun) {
        if (this.json.status == "login") {
            if (typeof fun == "function") {
                if (fun(this.json) === false) {
                    return this;
                }
                window.WebSiteApp.$router.push("/login.html");
            } else {
                window.WebSiteApp.$router.push("/login.html");
            }
        }
        return this;
    }
}

const ajaxCheck = function(res) {
    var jsonData = {},
        errStatus = {
            300: "资源已被转移至其他位置",
            301: "请求的资源已被永久移动到新URI",
            302: "请求的资源已被临时移动到新URI",
            305: "请求的资源必须通过代理访问",
            400: "错误资源访问请求",
            401: "资源访问未授权",
            403: "资源禁止访问",
            404: "未找到要访问的资源",
            405: "请更换请求方法",
            406: "无法访问",
            408: "请求超时",
            413: "请求实体过大",
            414: "请求URI过长",
            500: "内部服务器错误",
            501: "未实现",
            503: "服务无法获得",
            504: "接口访问超时"
        }
    if (res.status >= 300 && res.status < 600) {
        var errorMessage = "未知的访问错误，状态吗：" + String(res.status);
        if (errStatus[String(res.status)]) {
            errorMessage = errStatus[String(res.status)];
        }
        jsonData.status = "error";
        jsonData.message = errorMessage;
        jsonData.data = res.data;
    } else if (res.config.responsetype !== "json") {
        jsonData.status = "error";
        jsonData.message = "无法解析服务器端数据格式。"
        jsonData.data = res.data;
    } else if (typeof res.data === "string") {
        try {
            jsonData = JSON.parse(res.data);
        } catch (e) {
            jsonData.status = "error";
            jsonData.message = "无法解析服务器端数据格式。"
            jsonData.data = res.data;
        }
    }
    if (jsonData.status === undefined) {
        jsonData.status = "error";
        jsonData.message = "无法解析服务器端数据格式。"
        jsonData.data = res.data;
    }
    return new CheckFun(jsonData);
}
const ajaxError = function(error, errorMessage) {
    //默认错误处理函数
    if (console && console.error) {
        console.error(error);
    }
    var errorMsg = errorMessage ? errorMessage : "Ajax处理函数发生错误";
    if (window.WebSiteApp) {
        window.WebSiteApp.$Message.error(errorMsg);
    } else if (console && console.log) {
        console.log(errorMsg);
    } else {
        alert(errorMsg);
    }
    return {
        autoRun: CheckFun.prototype.autoRun
    };
}

var install = {
    install(Vue) {
        Vue.mixin({
            beforeCreate() {
                this.$ajax = ajax.bind(this)();
                this.$ajaxCheck = ajaxCheck.bind(this);
                this.$ajaxError = ajaxError.bind(this);
            }
        })
    }
}
export {ajax,ajaxCheck,ajaxError};
export default install;

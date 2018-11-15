import 'babel-polyfill';
import Vue from 'vue';
import 'vuex';
import store from './store/index.js';
import index from "./views/index.vue";
import VueRouter from 'vue-router';
import routers from "./views/router.js";
import iView from 'iview';
import "./libs/css/public.less";
import 'iview/dist/styles/iview.css';
import ajax from "./libs/js/vueExtend/ajax.js";
import routePlugin from "./libs/js/vueExtend/routePlugin.js";
import loadingView from "./libs/js/vueExtend/loadingView.js";
import publicjs from './libs/js/public.js'; //公共函数挂载
import log from "./libs/js/vueExtend/log.js";
import eventBus from "./libs/js/vueExtend/eventBus.js";
import scoped from "./libs/js/vueExtend/directive/scoped.js";
import webSocket from './libs/js/vueExtend/webSocket';
const devMode = process.env.NODE_ENV === "development"; //是否开发模式

Vue.use(VueRouter);
Vue.use(iView);
Vue.use(ajax);
Vue.use(scoped);
Vue.use(routePlugin);
Vue.use(loadingView);
Vue.use(eventBus);
Vue.use(webSocket);
Vue.use(log); //输出console；生产环境会自动屏蔽

var firstRouter = null;
var router = new VueRouter({
  routes: routers,
  mode: "history" //history
});

router.beforeEach((to, from, next) => {
    if (!firstRouter) {
        firstRouter = to;
        document.title="加载中...";
        next(false);
    }else{
        document.title=(to.meta && to.meta.title)?to.meta.title:"-";
        window.author=to.meta.author;
        next();
    }
});

var mainVue = new Vue({
  el: '#app',
  router: router,
  store: store,
  render: (h) => {
      return h(index,{
          props: {
              firstRouter: firstRouter
          }
      });
  }
});

if (devMode) {
  if (mainVue.$route.path == "/" || mainVue.$route.matched.length == 0) {
    mainVue.$router.push("/login.html");
  } else {
    mainVue.$router.push({
      path: mainVue.$route.path,
      query: mainVue.$route.query
    });
  }
} else {
  var routerPath = devMode ? mainVue.$route.path : (function() {
    var router = decodeURI(String(mainVue.$route.path)).replace("/","\\").substr(process.platform=="win32"?1:0);
    return router.substr(String(global.__dirname).length - router.length);
  })()
  var pauuu=routerPath.replace("\\","/");
  mainVue.$router.push(pauuu);
}

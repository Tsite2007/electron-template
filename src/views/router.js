module.exports = [
    {
        path: '/login.html',
        name: '/login.html',
        meta: {
            title: '登录',
            author:"--"
        },
        component: resolve=>resolve(require('./pages/login.vue'))
    }
];

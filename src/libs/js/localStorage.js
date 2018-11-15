const crypto_js = require('crypto-js');
const CryptoJSAES = crypto_js.AES;
const encutf8 = crypto_js.enc.Utf8;
const passKey = 'PmsEK1XZdmsILoqe';  //秘钥
/* 储存localStorage */
const setStore = (name, value) => {
    if (!name) return;
    if (typeof value !== 'string') {
        value = JSON.stringify(value);
    }
    let string_value = CryptoJSAES.encrypt(value, passKey);//加密
    window.localStorage.setItem(name, string_value);
}
/*获取指定的localstorage */
const getStore = (name) => {
    if (!name) return;
    try {
        if (window.localStorage.getItem(name) && window.localStorage.getItem(name).length > 1) {
            let return_string = CryptoJSAES.decrypt(window.localStorage.getItem(name), passKey);//解密
                return_string = return_string.toString(encutf8);
            try{
                return JSON.parse(return_string);
            }catch (error) {
                return return_string;
            }
        }
    }catch(error) {
        console.log(error);
    }
    return false;
}
/* 删除指定的localStorage */
const removeStore = (name) => {
    if (!name || !window.localStorage.getItem(name)) return false;
    window.localStorage.removeItem(name);
}
var install = {
    install(Vue) {
        Vue.mixin({
            beforeCreate() {
                this.$setStore = setStore.bind(this);
                this.$getStore = getStore.bind(this);
                this.$removeStore = removeStore.bind(this);
            }
        })
    }
}
export default install;

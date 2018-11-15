<template lang="html">
    <div class="main">
        <router-view></router-view>
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
          
       }
    },
    props: {
        firstRouter: {
            type: Object
        }
    },
    mounted() {
        //路由跳转
        this.$router.replace(Object.assign({}, this.firstRouter));
        
    }
}
</script>
<style lang="less" scoped>
@import "~@/libs/css/theme/theme.less";

</style>

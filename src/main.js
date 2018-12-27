import Vue from 'vue';
import App from './App';
import router from './router';
import VueResource from 'vue-resource';
// 引入ant-design-vue及样式
import AntDesignVue from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
// 注册并引入Vuex
import store from './store/store';
// 引入axios封装方法
import apiAxios from './assets/js/http'


Vue.use(VueResource);
// 全局引用ant-design-vue组件
Vue.use(AntDesignVue);
Vue.config.productionTip = false
// 将axios封装方法绑定到全局
Vue.prototype.$apiAxios = apiAxios

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})

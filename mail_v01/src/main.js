import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

import './assets/css/global.css'

import store from './store'
import './mock/index.js';  // 该项目所有请求使用mockjs模拟

import Multiselect from 'vue-multiselect';// 使用的一个多选框组件
import 'vue-multiselect/dist/vue-multiselect.min.css';
import "font-awesome/css/font-awesome.css";
import vueWaves from './directive/waves';// 水波纹指令

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(vueWaves);
Vue.component('multiselect', Multiselect);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

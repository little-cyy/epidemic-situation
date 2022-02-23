import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from "@/api/index";
//引入css初始化
import  '@/assets/css/base.css'
import  '@/assets/css/conn.css'
// 引入js适配移动端
// import './assets/js/phone'

// 引入svg-icon组件，使用方式：<svg-icon icon-class="svg图标文件名" />
import '@/icons/index.js'

import  '@/plugins/index.js'

//引入时间格式化函数文件
import  './utils/datePattern'

//引入swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
Vue.use(VueAwesomeSwiper)

Vue.config.productionTip = false


new Vue({
  beforeCreate() {
    Vue.prototype.$bus =this
    Vue.prototype.$api =api
  },
  mounted() {
    // console.log(11,this)
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')

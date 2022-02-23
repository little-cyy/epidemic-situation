import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home/Home.vue'

Vue.use(VueRouter)

const routes = [
  //首页
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {keepAlive: true }// 缓存
  },
  //核酸检测
  {
    path: '/nucleicAcid',
    name: 'nucleicAcid',
    component: () => import('@/views/nucleicAcid/index.vue')
  },
  //风险地区
  {
    path: '/Area/:modifyTime',
    name: 'Area',
    component: () => import('@/views/Area/index.vue')
  },
  //城市疫情数据
  {
    path: '/City',
    name: 'City',
    meta: {keepAlive: true },// 缓存
    component: () => import('@/views/City/index.vue')
  },
  //防护指南
  {
    path: '/protectGuide',
    name: 'protectGuide',
    component: () => import('@/views/protectGuide/index.vue')
  },
  //出行政策
  {
    path: '/pneumoniaPolicy',
    name: 'pneumoniaPolicy',
    component: () => import('@/views/pneumoniaPolicy/index.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  // 实现路由跳转后页面滚动条置顶
  scrollBehavior () {
    // 滚动条滚动到哪个的位置
       return { x: 0, y: 0 }
  }

})
export default router

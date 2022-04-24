import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/Login')
  },
  {
    path: '/home',
    component: () => import('@/views/Home')
  }
]
const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从那个路径跳转过来
  // next 是一个函数，表示放行
  // next() 放行   next('/login') 强制跳转 不需要权限控制
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login') // 没有token值 强制跳转至登录页
  next()
})
export default router

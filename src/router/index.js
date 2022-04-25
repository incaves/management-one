import Vue from 'vue'
import VueRouter from 'vue-router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
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
    redirect: '/welcome',
    component: () => import('@/views/Home'),
    children: [
      {
        path: '/welcome',
        component: () => import('@/component/Welcome')
      },
      {
        path: '/users',
        component: () => import('@/component/User')
      }
    ]
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
  nprogress.start()
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login') // 没有token值 强制跳转至登录页
  next()
})
export default router
router.afterEach(() => {
  nprogress.done()
})

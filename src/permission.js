// 权限拦截 导航守卫 路由守卫 router
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex store实例
import NProgress from 'nprogress' // 引入进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '/404'] // 定义白名单(所有不受权限控制的页面)
// 路由前置守卫 beforeEach
router.beforeEach(async(to, from, next) => {
  NProgress.start() // 开启进度条
  // 判断是否存在token
  if (store.getters.token) {
    // 如果存在 继续判断是不是去登录页
    if (to.path === '/login') {
      // 表示去的是登录页
      next('/') // 跳转主页
    } else {
      // 如果没有id这个值 才会调用 vuex的获取资料的action
      if (!store.getters.userId) {
        await store.dispatch('user/getUserInfo')
        // 为什么要写await 因为我们想获取完资料再去放行
      }
      next()
    }
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 如果找到了,表示在白名单里面
      next()
    } else {
      next('/login') // 否则跳到登录页面
    }
  }
  NProgress.done() // 判断完成 关闭进度条
})

// 后置守卫
router.afterEach(() => {
  NProgress.done() // 关闭进度条
})

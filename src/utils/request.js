// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { getTimeStamp } from './auth'
import { Message } from 'element-ui'
const TimeOut = 3600 // 设置超时时间
const service = axios.create({
  // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
  // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
  baseURL: process.env.VUE_APP_BASE_API,
  // 设置axios请求的基础的基础地址
  timeout: 5000 // 设置超时时间
}) // 创建一个axios的实例
// 请求拦截器
service.interceptors.request.use(config => {
  // 在这个位置需要统一的去注入token
  if (store.getters.token) {
    // 如果token存在 注入token
    // 检查时间戳是否超时
    if (IsCheckTimeOut()) {
      // 如果它为true表示 过期了
      // token没用了 因为超时了
      store.dispatch('user/logout') // 登出操作
      // 跳转到登录页
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须返回配置 有没有数据都要返回
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use(response => {
  // aixos默认加了一层data
  const { success, message, data } = response.data
  // 根据success的城与否觉得下面的操作
  if (success) {
    return data
  } else {
    // 业务已经出现错误了 应该进catch
    message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
}, error => {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当等于10002的时候 表示 后端告诉我们token超时了
    store.dispatch('user/logout') // 退出action 删除token
    router.push('/login') // 跳转到首页
  } else {
    Message.error(error.message) // 提示错误消息
  }
  return Promise.reject(error) // 返回执行错误 让当前的指向链跳出成功 直接进入catch
  // 因为2种条件都需要所有在if执行结束再执行本行代码
})

// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
function IsCheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}

export default service // 导出axios实例


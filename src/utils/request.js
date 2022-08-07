// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
const service = axios.create({
  // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
  // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
  baseURL: process.env.VUE_APP_BASE_API,
  // 设置axios请求的基础的基础地址
  timeout: 5000 // 定义5秒超时
}) // 创建一个axios的实例
service.interceptors.request.use() // 请求拦截器
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
  /*global Message*/
  Message.error(error.message) // 提示错误消息
  return Promise.reject(error) // 返回执行错误 让当前的指向链跳出成功 直接进入catch
}) // 响应拦截器
export default service // 导出axios实例


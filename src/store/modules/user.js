import { login, getUserInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
// 状态
const state = {
  token: getToken(), // 设置token初始状态   token持久化 => 放到缓存中
  userInfo: {} // 定义一个空对象 不是null 因为后边要开发uesrInfo中的属性给别人用 在getters中 设置为null 会报错 异常
}
// 修改状态
const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token // 设置token 只是修改state的数据
    setToken() // 同步修改
  },
  // 删除缓存
  removeToken(state) {
    state.token = null // 把数据清空
    removeToken() // 执行删除
  },
  // 更新一个对象
  getUserInfo(state, result) {
    state.userInfo = result
  },
  // 删除userinfo的数据
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 处理异步
const actions = {
  // 定义login action  也需要参数 调用action时 传递过来的参数
  async login(context, data) {
    const result = await login(data)// 实际上就是一个promise  result就是执行的结果
    // axios默认给数据加了一层data

    // 表示登录接口调用成功 也就是意味着你的用户名和密码是正确的
    // 现在有用户token
    // actions 修改state 必须通过mutations
    context.commit('setToken', result)
  },
  // 获取用户资料
  async getUserInfo(context) {
    const result = await getUserInfo() // 获取返回值
    context.commit('getUserInfo', result) // 将整个的个人信息设置到用户的vuex数据里
    return result // 为后期权限做伏笔
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

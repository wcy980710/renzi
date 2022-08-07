const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token // 通过vuex的计算属性把数据共享出去
}
export default getters

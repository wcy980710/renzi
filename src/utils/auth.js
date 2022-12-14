import Cookies from 'js-cookie'

const TokenKey = 'wangchongyu-wangxinxin' // 设定一个独一无二的key
const timeKey = 'wangchongyu-shijianchuo' // 设置一个独一无二的key

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(timeKey)
}

// 设置时间戳
export function setTimeStamp() {
  Cookies.set(timeKey, Date.now())
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

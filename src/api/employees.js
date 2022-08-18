import request from '@/utils/request'

/**
 *  获取员工的简单列表
 * **/
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}

/**
 *  获取员工的总和列表数据
 * **/
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params
  })
}

/**
 *  删除员工接口
 * **/
export function delEmployeeList(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'DELETE'
  })
}

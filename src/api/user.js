import request from '@/utils/request'

export function getLoginToken(data) {
  // Backend expects credentials at the top level
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}
export function getUserInfo() {
  return request({
    url: '/sys/profile'
  })
}
export function updatePassword(data) {
  return request({
    url: '/sys/user/updatePass',
    method: 'put',
    data
  })
}

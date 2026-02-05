import request from '@/utils/request'

export function getPermissionList() {
  return request({
    url: '/sys/permission'
  })
}
export function addPermission(data) {
  return request({
    url: '/sys/permission',
    method: 'post',
    data
  })
}
export function delPermission(data) {
  return request({
    url: `/sys/permission/${data.id}`,
    method: 'delete'
  })
}
export function getDetail(data) {
  return request({
    url: `/sys/permission/${data.id}`
  })
}
export function updatePermission(data) {
  return request({
    url: `/sys/permission/${data.id}`,
    method: 'put'
  })
}

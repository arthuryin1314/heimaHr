import request from '@/utils/request'

export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params
  })
}
export function exportEmployeeData() {
  return request({
    url: '/sys/user/export',
    responseType: 'blob'
    // timeout: 20000
  })
}
export function getTemplate() {
  return request({
    url: '/sys/user/import/template',
    responseType: 'blob'
  })
}
export function importEmployeeData(data) {
  return request({
    url: '/sys/user/import',
    method: 'post',
    data
  })
}
export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}
export function addEmployee(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}
export function getEmployeeDetail(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'get'
  })
}
export function updateEmployee(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}
export function assignRoles() {
  return request({
    url: '/sys/role/list/enabled'
  })
}
export function assignRole(data) {
  return request({
    url: '/sys/user/assignRoles',
    method: 'put',
    data
  })
}

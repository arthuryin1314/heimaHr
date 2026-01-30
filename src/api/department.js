import request from '@/utils/request'
export function getDepartmentList() {
  return request({
    url: '/company/department'
  })
}
export function getManagetList() {
  return request({
    url: 'sys/user/simple'
  })
}
export function addNewDepartment(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}
export function getDepartmentDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}
export function updateDepartment(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
export function deleteDepartment(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

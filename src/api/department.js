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

import request from '@/utils/request'

export function getLoginToken(data) {
  // Backend expects credentials at the top level
  return request.post('/sys/login', data)
}

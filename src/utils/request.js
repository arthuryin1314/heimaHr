import axios from 'axios'
import store from '@/store/index'
import { Message } from 'element-ui'
import router from '@/router/index'
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' }
})
// 添加请求拦截器
request.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  if (store.getters.token) {
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function(response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  if (response.data instanceof Blob) {
    return response.data
  }
  const { message, success, data } = response.data
  if (success) {
    return data
  } else {
    Message({
      type: 'error',
      message
    })
    return Promise.reject(new Error(message))
  }
  // console.log(response)
}, async function(error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  if (!error.response) {
    Message({
      type: 'error',
      message: error.message || '网络异常，请稍后重试'
    })
    return Promise.reject(error)
  }
  if (error.response.status === 401) {
    Message({
      type: 'warning',
      message: '登录已过期，请重新登录'
    })
    await store.dispatch('user/logout')
    router.push('/login')
    return Promise.reject(error)
  }
  Message({
    type: 'error',
    message: error.message
  })
  return Promise.reject(error)
})
export default request

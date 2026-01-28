import { getToken, setToken, removeToken } from '@/utils/auth'
import { getLoginToken, getUserInfo } from '@/api/user'
const state = {
  token: getToken(),
  userInfo: {},
  password: ''
}
const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  clearToken(state) {
    removeToken(state.token)
    state.token = null
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
    // console.log(state.userInfo)
  },
  setPassword(state, password) {
    state.password = password
  }
}
const actions = {
  async login(context, obj) {
    // console.log(obj)
    context.commit('setPassword', obj.password)
    const tokenData = await getLoginToken(obj)
    // console.log(tokenData)
    const token = tokenData.token || tokenData
    context.commit('setToken', token)
  },
  async getUserInfo(context) {
    const userInfo = await getUserInfo()
    console.log(userInfo)
    context.commit('setUserInfo', userInfo)
  },
  logout(context) {
    context.commit('clearToken')
    context.commit('setUserInfo', {})
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

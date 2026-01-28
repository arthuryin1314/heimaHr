import { getToken, setToken, removeToken } from '@/utils/auth'
import { getLoginToken, getUserInfo } from '@/api/user'
const state = {
  token: getToken(),
  userInfo: {}
}
const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  clearToken(state) {
    removeToken(state.token)
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
    // console.log(state.userInfo)
  }
}
const actions = {
  async login(context, obj) {
    // console.log(obj)
    const tokenData = await getLoginToken(obj)
    // console.log(tokenData)
    const token = tokenData.token || tokenData
    context.commit('setToken', token)
  },
  async getUserInfo(context) {
    const userInfo = await getUserInfo()
    console.log(userInfo)
    context.commit('setUserInfo', userInfo)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

import { getToken, setToken, removeToken } from '@/utils/auth'
import { getLoginToken } from '@/api/user'
const state = {
  token: getToken()
}
const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  clearToken(state) {
    removeToken(state.token)
  }
}
const actions = {
  async login(context, obj) {
    const tokenData = await getLoginToken(obj)
    const token = tokenData.token || tokenData
    context.commit('setToken', token)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

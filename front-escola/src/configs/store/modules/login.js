import * as types from '../mutation-types'
import Axios from 'axios'
import MyAxios from '../../axios'

const state = {
  changePost: false
}

const getters = {
  changePost: (state) => state.changePost
}

const actions = {
  setChangePost ({commit}, value) {
    return new Promise((resolve, reject) => {
      commit(types.CHANGE_POST, value)
      resolve(true)
    })
  },
  signIn ({commit}, user) {
    return new Promise((resolve, reject) => {
      Axios.post(process.env.API_BASE_URL + '/auth', user)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          console.log('-- ERROR signIn login.js', error)
          reject(error)
        })
    })
  },
  getFonctions ({commit}) {
    return new Promise((resolve, reject) => {
      MyAxios.get(process.env.API_BASE_URL + '/fonctions')
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          console.log('-- ERROR getFonctions login.js', error)
          reject(error)
        })
    })
  }
}

const mutations = {
  [types.CHANGE_POST] (state, value) {
    state.changePost = value
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

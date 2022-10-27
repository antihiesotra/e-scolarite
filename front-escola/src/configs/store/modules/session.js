import Axios from '../../axios'

const namespaced = true

const state = {}
const getters = {}

const actions = {
  getAllSession ({commit}) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/sessions')
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  addSession ({commit}, session) {
    return new Promise((resolve, reject) => {
      Axios.post('/api/sessions', session)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  updateSession ({commit}, session) {
    return new Promise((resolve, reject) => {
      Axios.put('/api/sessions/' + session.id, session)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  deleteSession ({commit}, session) {
    return new Promise((resolve, reject) => {
      Axios.delete('/api/sessions/' + session.id)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

const mutations = {}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced
}

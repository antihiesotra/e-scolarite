import Axios from '../../axios'

const namespaced = true
const state = {}
const getters = {}

const actions = {
  getAllNiveau ({commit}) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/niveaux')
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  addNiveau ({commit}, niveau) {
    return new Promise((resolve, reject) => {
      Axios.post('/api/niveaux', niveau)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  updateNiveau ({commit}, niveau) {
    return new Promise((resolve, reject) => {
      Axios.put('/api/niveaux/' + niveau.id, niveau)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  deleteNiveau ({commit}, niveau) {
    return new Promise((resolve, reject) => {
      Axios.delete('/api/niveaux/' + niveau.id)
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
  namespaced,
  state,
  getters,
  actions,
  mutations
}

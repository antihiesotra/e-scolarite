import Axios from '../../axios'
const namespaced = true
const state = {}
const getters = {}

const actions = {
  getAllResponsable ({commit}) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/responsables')
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getAllResponsableEtablissement ({commit}) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/utilisateurs?fonction=resp_etablissement')
        .then((res) => {
          resolve(res.data)
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

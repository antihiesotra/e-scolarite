import Axios from '../../axios'
const namespaced = true
const state = {}

const getters = {}

const actions = {
  getDiplomeAttribuesByComposant ({commit}, idComposant) {
    return new Promise((resolve, reject) => {
      Axios.get(`/api/delivrance-diplomes/composant/${idComposant}`)
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

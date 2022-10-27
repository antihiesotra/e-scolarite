import Axios from '../../axios'

const namespaced = true

const state = {}
const getters = {}

const actions = {
  addHistoriqueNotes ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.post('/api/historique_notes', params)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getByFilter ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/historique_notes/criteria?idEc=' + params.idEc + '&idAnneeUniversitaire=' + params.idAnneeUniversitaire + '&idSemestre=' + params.idSemestre)
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

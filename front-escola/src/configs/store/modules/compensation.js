import Axios from '../../axios'

const namespaced = true

const state = {
}

const getters = {
}

const actions = {
  addCompensation ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.get(`/api/compensation/compenser/${params.description}/${params.id_annee_univ}/${params.id_etudiant}/${params.id_semestre}/${params.id_session}/${params.idue}`)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

const mutations = {
}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced
}

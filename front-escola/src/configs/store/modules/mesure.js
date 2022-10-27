import Axios from '../../axios'

const namespaced = true
const state = {}
const getters = {}

const actions = {
  getAllTypeMesure ({commit}) {
    console.log('mesure store')
    return new Promise((resolve, reject) => {
      Axios.get(`/api/mesures/liste`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
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

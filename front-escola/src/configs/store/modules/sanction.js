import Axios from '../../axios'

const namespaced = true
const state = {}
const getters = {}

const actions = {
  addNew ({commit}, dataSanction) {
    return new Promise((resolve, reject) => {
      Axios.post('/api/sanctions/nouvelsanction', dataSanction)
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

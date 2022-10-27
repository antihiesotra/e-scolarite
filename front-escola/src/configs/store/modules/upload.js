import Axios from '../../axios'
// const api = process.env.API_BASE_URL

const namespaced = true

const state = {
}

const getters = {
}

const actions = {
  uploadExcel ({commit}, data) {
    return new Promise((resolve, reject) => {
      Axios.post('/api/uploadexcel', data)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  uploadExcelInscription ({commit}, data) {
    return new Promise((resolve, reject) => {
      Axios.post('/api/uploadexcel/inscription', data)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  uploadPExcelInscription ({commit}, data) {
    return new Promise((resolve, reject) => {
      Axios.post('/api/uploadexcel/inscriptionPedagogique', data)
        .then((res) => {
          resolve(res.data)
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

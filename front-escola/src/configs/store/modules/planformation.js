import * as types from '../mutation-types'
import Axios from '../../axios'
const api = process.env.API_BASE_URL

const namespaced = true

const state = {
  selectedUE: []
}

const getters = {
  selectedUE: (state) => state.selectedUE
}

const actions = {
  getAllUe ({commit}) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/ues')
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getPlanDeFormation ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/ues/ueInfo?idParcours=' + params.idParcours + '&idSemestre=' + params.idSemestre + '&idAnneeUniversitaire=' + params.idAnneeUniversitaire)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getAllTypeUe ({commit}) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/typeUes')
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getAllTypeEc ({commit}) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/typeEcs')
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  addAtomePedagogique ({commit}, at) {
    return new Promise((resolve, reject) => {
      Axios.post(api + '/atome-pedagodique', at)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  updateAtomePedagogique ({commit}, at) {
    return new Promise((resolve, reject) => {
      Axios.put(api + '/atome-pedagodique' + '/' + at.id, at)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  deleteAtomePedagogique ({commit}, at) {
    return new Promise((resolve, reject) => {
      Axios.delete(api + '/atome-pedagodique' + '/' + at.id)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getAdvancedPF ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.post('/api/advanced-pf/get', params)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  saveAdvancedPF ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.post('/api/advanced-pf/save', params)
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
  [types.SET_SELECTED_UE_PF] (state, ue) {
    state.selectedUE = ue
  },
  [types.UPDATE_SELECTED_UE_PF] (state, ue) {
    state.selectedUE = ue
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced
}

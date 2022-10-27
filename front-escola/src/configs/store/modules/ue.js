import * as types from '../mutation-types'
import Axios from '../../axios'
// const api = process.env.API_BASE_URL

const namespaced = true

const state = {
  ues: [],
  allUsersInUe: []
}

const getters = {
  ues: (state) => state.ues,
  allUsersInUe: (state) => state.selectedUE
}

const actions = {
  getAllUes ({commit}) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/ues').then((res) => {
        console.log('ues: ', res.data)
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  getUeByAndAnneeSemestreMentionParcours ({commit}, params) {
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
  getAllUsersInUe ({commit}) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/utilisateurs').then((res) => {
        console.log('utilisateurs: ', res.data)
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  updateUe ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.put('/api/ues', params)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  addUe ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.post('/api/ues', params)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  setResponsableforUe ({commit}, data) {
    return new Promise((resolve, reject) => {
      Axios.put('/api/ues/responsableUe/' + data.id + '?utilisateur=' + data.utilisateur)
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          console.log('apres update et erreur :', err)
          reject(err)
        })
    })
  }
}

const mutations = {
  [types.SET_ALL_UES] (state, ues) {
    state.ues = []
    state.ues = ues
  },
  [types.SET_ALL_USER_IN_UE] (state, users) {
    state.allUsersInUe = users
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced
}

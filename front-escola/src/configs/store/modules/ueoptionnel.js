import * as types from '../mutation-types'
import Axios from '../../axios'

const namespaced = true

const state = {
  ueoptionnel: [],
  allUsersInUe: []
}

const getters = {
  ueoptionnel: (state) => state.ueoptionnel,
  allUsersInUe: (state) => state.selectedUE
}

const actions = {
  getAllUeOfUeOptionnel ({commit}, idUe) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/ueoptionnel/getByIdUe/' + idUe).then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  delete ({commit}, idUeOptionnel) {
    return new Promise((resolve, reject) => {
      Axios.delete('/api/ueoptionnel/delete/' + idUeOptionnel).then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  getInfosById ({commit}, idUeOptionnel) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/ueoptionnel/getInfosById/' + idUeOptionnel).then((res) => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  addUeOptionnel ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.post('/api/ueoptionnel', params)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getInfosByIdUe ({commit}, idUeOptionnel) {
    return new Promise((resolve, reject) => {
      Axios.post('api/ueoptionnel/getInfosByIdUe/' + idUeOptionnel)
        .then((response) => {
          console.log('DATA LABEL :' + response.data)
          resolve(response.data)
        })
        .catch((error) => {
          return reject(error)
        })
    })
  },
  getInfosByIdEc ({commit}, idEc) {
    return new Promise((resolve, reject) => {
      Axios.post('api/ueoptionnel/getInfosByIdEc/' + idEc)
        .then((response) => {
          console.log('DATA LABEL :' + response.data)
          resolve(response.data)
        })
        .catch((error) => {
          return reject(error)
        })
    })
  },
  updateUeOp ({commit}, params) {
    console.log('UEoptionnel----')
    return new Promise((resolve, reject) => {
      Axios.put('/api/ueoptionnel', params)
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
  [types.SET_ALL_UES] (state, ueoptionnel) {
    state.ueoptionnel = []
    state.ueoptionnel = ueoptionnel
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

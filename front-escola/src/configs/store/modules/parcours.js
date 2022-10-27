import Axios from '../../axios'
import * as types from '../mutation-types'

const namespaced = true

const state = {
  filteredParcours: []
}
const getters = {
  filteredParcours: state => state.filteredParcours
}

const actions = {
  getAllParcours ({commit}) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/parcours')
        .then((response) => {
          console.log('All Parcours :', response)
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getAllParcoursByComposant ({commit}, idComposant) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/parcours/composant/' + idComposant)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getParcoursByMentionByUser ({commit}, idMention) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/parcours/usermention/' + idMention)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getParcoursByMention ({commit}, idMention) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/parcours/mention/' + idMention)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getParcoursByCodeMention ({commit}, codeMention) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/parcours/mention/code/' + codeMention)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getParcoursByUser ({commit}) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/parcours/user')
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getParcoursById ({commit}, idParcours) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/parcours/' + idParcours)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  addParcours ({commit}, parcours) {
    return new Promise((resolve, reject) => {
      console.log('Champ parcours ', parcours)
      Axios.post('/api/parcours', parcours)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  updateParcours ({commit}, parcours) {
    return new Promise((resolve, reject) => {
      Axios.put('/api/parcours/' + parcours.id, parcours)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  deleteParcours ({commit}, parcours) {
    return new Promise((resolve, reject) => {
      Axios.delete('/api/parcours/' + parcours.id)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getAllParcoursByCodeMention ({commit}, codeMention) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/parcours/liste-parcours-by-code-mention/' + codeMention)
        .then(response => {
          commit('GET_ALL_FILTERED_PARCOURS', response.data)
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

const mutations = {
  [types.GET_ALL_FILTERED_PARCOURS] (state, parcours) {
    state.filteredParcours = parcours
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced
}

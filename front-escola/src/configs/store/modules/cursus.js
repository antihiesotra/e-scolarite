// import * as types from '../mutation-types'
import Axios from '../../axios'

const state = {
}

const getters = {
}

const actions = {
  getEtudiantsByPersonne ({commit}, idPersonne) {
    return new Promise((resolve, reject) => {
      Axios.get(`/api/personnes/${idPersonne}/etudiants`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getSanctionEtudiantsByPersonne ({commit}, idPersonne) {
    return new Promise((resolve, reject) => {
      Axios.get(`/api/sanctions/${idPersonne}/sanctions`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getEtudiantCursus ({commit}, idPersonne) {
    return new Promise((resolve, reject) => {
      Axios.get(`/api/etudiants/${idPersonne}/cursus`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
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
  mutations
}

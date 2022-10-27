import Axios from '../../axios'
import * as types from '../mutation-types'
import chunck from '../../../utils/chunk'

const namespaced = true

const state = {
  filteredTableaudebords: []
}
const getters = {
  filteredTableaudebords: state => state.filteredTableaudebords,
  chunckedfilteredTableaudebords: state => {
    let filteredTableaudebordsCopy = JSON.parse(JSON.stringify(state.filteredTableaudebords))
    return chunck(filteredTableaudebordsCopy, 3)
  }
}

const actions = {
  getInfosEtudiantByComposant  ({commit}, idComposant) {
    return new Promise((resolve, reject) => {
      Axios.get('api/tableaudebord/getInfosEtudiantByComposant/' + idComposant)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getAllEtudiantByComposantAnnee ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.get('api/tableaudebord/getEtudiantByAnneeComposant/' + params.anneeUnivId + '/' + params.composantId)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getAllEtudiantAnnneMention ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.get('api/tableaudebord/getEtudiantByAnneeMention/' + params.anneeUnivId + '/' + params.mentionId)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getAllEtudiantByAnneParcours ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.get('api/tableaudebord/getEtudiantByAnneeParcours/' + params.anneeUnivId + '/' + params.parcoursId)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getAllComposantByEtablissement ({commit}, idEtablissement) {
    return new Promise((resolve, reject) => {
      Axios.get('api/tableaudebord/listComposantByEtablissement/' + idEtablissement)
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
  FORCE (state, tableaudebord) {
    let compareId = (d) => { return d.id === tableaudebord.id }
    let index = state.filteredTableaudebords.findIndex(compareId)
    if (state.filteredTableaudebords[index].photo) {
      state.filteredTableaudebords[index].photo += '?' + (new Date()).setUTCDate(0, 0, 0, 0)
    }
  },
  [types.GET_ALL_COMPOSANTS] (state, tableaudebords) {
    state.filteredTableaudebords = tableaudebords
  },
  [types.ADD_COMPOSANT] (state, tableaudebord) {
    state.filteredTableaudebords.push(tableaudebord)
  },
  [types.UPDATE_COMPOSANT] (state, tableaudebord) {
    let compareId = (d) => {
      return d.id === tableaudebord.id
    }
    let index = state.filteredTableaudebords.findIndex(compareId)
    state.filteredTableaudebords.splice(index, 1, tableaudebord)
  },
  [types.UPDATE_RESP_COMPOSANT] (state, data) {
    // data[1] === codeDomaine && data[0] === respDomaine
    state.filteredTableaudebords.find(c => c.code === data[1]).responsableComposant = data[0]
  },
  [types.GET_ALL_FILTERED_COMPOSANTS] (state, filteredTableaudebords) {
    state.filteredTableaudebords = filteredTableaudebords
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}

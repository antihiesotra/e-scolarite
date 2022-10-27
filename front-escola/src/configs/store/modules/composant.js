import Axios from '../../axios'
import * as types from '../mutation-types'
import chunck from '../../../utils/chunk'

const namespaced = true

const state = {
  filteredComposants: []
}
const getters = {
  filteredComposants: state => state.filteredComposants,
  chunckedFilteredComposants: state => {
    let filteredComposantsCopy = JSON.parse(JSON.stringify(state.filteredComposants))
    return chunck(filteredComposantsCopy, 3)
  }
}

const actions = {
  getAllComposants ({commit}, auth = true) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/composants', auth)
        .then((response) => {
          commit(types.GET_ALL_COMPOSANTS, response.data)
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  setPhoto ({commit}, data) {
    return new Promise((resolve, reject) => {
      if (!data.image) {
        console.log('Pas d\'image à envoyer')
        resolve(data.composant)
        return
      }
      Axios.put('/api/composants/photo/' + data.composant.id, {photo: data.image}, true, true)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getAllComposantsByEtablissement ({commit}, idEtablissement) {
    return new Promise((resolve, reject) => {
      Axios.get('/liste-composants-by-etablissement/' + idEtablissement)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getComposantById ({commit}, idComposant) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/composants/composant-by-id/' + idComposant)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getAllComposantsByCodeEtablissement ({commit}, codeEtablissement) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/composants/liste-composants-by-code-etablissement/' + codeEtablissement)
        .then(response => {
          commit('GET_ALL_FILTERED_COMPOSANTS', response.data)
          resolve(response.data)
        })
        .catch(err => reject(err))
    })
  },
  findComposantByCode ({commit}, composantCode) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/composants/code/' + composantCode)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    })
  },
  addComposant ({commit}, composant) {
    return new Promise((resolve, reject) => {
      Axios.post('/api/composants', composant)
        .then(response => {
          resolve(response.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  updateComposant ({commit}, composant) {
    return new Promise((resolve, reject) => {
      Axios.put('/api/composants/' + composant.id, composant)
        .then(response => {
          commit(types.UPDATE_COMPOSANT, response.data)
          resolve(response.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  deleteComposant ({commit}, composant) {
    return new Promise((resolve, reject) => {
      Axios.delete('/api/composants/' + composant.id)
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
  FORCE (state, composant) {
    let compareId = (d) => { return d.id === composant.id }
    let index = state.filteredComposants.findIndex(compareId)
    if (state.filteredComposants[index].photo) {
      state.filteredComposants[index].photo += '?' + (new Date()).setUTCDate(0, 0, 0, 0)
    }
  },
  [types.GET_ALL_COMPOSANTS] (state, composants) {
    state.filteredComposants = composants
  },
  [types.ADD_COMPOSANT] (state, composant) {
    state.filteredComposants.push(composant)
  },
  [types.UPDATE_COMPOSANT] (state, composant) {
    let compareId = (d) => {
      return d.id === composant.id
    }
    let index = state.filteredComposants.findIndex(compareId)
    state.filteredComposants.splice(index, 1, composant)
  },
  [types.UPDATE_RESP_COMPOSANT] (state, data) {
    // data[1] === codeDomaine && data[0] === respDomaine
    state.filteredComposants.find(c => c.code === data[1]).responsableComposant = data[0]
  },
  [types.GET_ALL_FILTERED_COMPOSANTS] (state, filteredComposants) {
    state.filteredComposants = filteredComposants
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}

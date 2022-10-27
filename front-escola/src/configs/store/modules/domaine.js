import Axios from '../../axios'
import chunck from '../../../utils/chunk'
import * as types from '../mutation-types'

const namespaced = true
const state = {
  domaines: []
}

const getters = {
  domaines: state => state.domaines,
  chunckedDomaines: state => {
    let domainesCopy = [ ...state.domaines ]
    return chunck(domainesCopy, 3, true)
  }
}

const actions = {
  getAllDomaine ({commit}) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/domaines')
        .then((response) => {
          commit(types.GET_ALL_DOMAINES, response.data)
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  addDomaine ({commit}, domaine) {
    return new Promise((resolve, reject) => {
      Axios.post('/api/domaines', domaine)
        .then((response) => {
          commit(types.ADD_DOMAINE, response.data)
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  updateDomaine ({commit}, domaine) {
    return new Promise((resolve, reject) => {
      Axios.put('/api/domaines/' + domaine.id, domaine)
        .then(response => {
          commit(types.UPDATE_DOMAINE, response.data)
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
        resolve(data.domaine)
        return
      }
      Axios.put('/api/domaines/photo/' + data.domaine.id, {photo: data.image}, true, true)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  deleteDomaine ({commit}, domaine) {
    return new Promise((resolve, reject) => {
      Axios.delete('/api/domaines/' + domaine.id)
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
  [types.GET_ALL_DOMAINES] (state, domaines) {
    state.domaines = domaines
  },
  [types.ADD_DOMAINE] (state, domaine) {
    state.domaines.push(domaine)
  },
  [types.UPDATE_DOMAINE] (state, newDomaine) {
    let compareId = (d) => {
      return d.id === newDomaine.id
    }
    let index = state.domaines.findIndex(compareId)
    state.domaines.splice(index, 1, newDomaine)
  },
  [types.UPDATE_RESP_DOMAINE] (state, data) {
    // data[1] === codeDomaine && data[0] === respDomaine
    state.domaines.find(e => e.code === data[1]).responsableDomaine = data[0]
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}

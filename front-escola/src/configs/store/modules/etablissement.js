import * as types from '../mutation-types'
import Axios from '../../axios'
import chunck from '../../../utils/chunk'
import {LocalStorage} from 'quasar'

const namespaced = true

const state = {
  etablissements: [],
  idTsiory: null,
  adminData: (LocalStorage.get.item('ADMIN_DATA') ? JSON.parse(LocalStorage.get.item('ADMIN_DATA')) : {})
}

const getters = {
  idTsiory: state => state.idTsiory,
  adminData: state => JSON.parse(JSON.stringify(state.adminData)),
  etablissements: state => state.etablissements,
  chunkedEtablissements: state => {
    let etablissementsCopy = [ ...state.etablissements ]
    return chunck(etablissementsCopy, 3, true)
  }
}

const actions = {
  addEtablissement ({commit}, etablissement) {
    return new Promise((resolve, reject) => {
      Axios.post('api/etablissements', etablissement)
        .then((response) => {
          commit(types.ADD_ETABLISSEMENT, response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  setPhoto ({commit}, data) {
    return new Promise((resolve, reject) => {
      if (!data.image) {
        resolve(data.etablissement)
        return
      }
      Axios.put('/api/etablissements/photo/' + data.etablissement.id, {photo: data.image}, true, true)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  updateEtablissement ({commit}, etablissement) {
    return new Promise((resolve, reject) => {
      Axios.put('/api/etablissements/' + etablissement.id, etablissement)
        .then((response) => {
          commit(types.UPDATE_ETABLISSEMENT, response.data)
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getEtablissementByComposant ({commit}, composant) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/etablissements/composant/' + composant.id)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getAllEtablissement ({commit}, auth = true) {
    return new Promise((resolve, reject) => {
      Axios.get('api/etablissements', auth)
        .then((response) => {
          commit(types.GET_ALL_ETABLISSEMENTS, response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
          console.log(error)
        })
    })
  },
  deleteEtablissement ({commit}, etablissement) {
    return new Promise((resolve, reject) => {
      Axios.delete('/api/etablissements/' + etablissement.id)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getPhoto ({commit}, urlPhoto) {
    return new Promise((resolve, reject) => {
      // alert('/photos/etablissements/' + urlPhoto)
      Axios.get(urlPhoto)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getTreeData ({commit}, id) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/etablissements/tree-data/' + id)
        .then(response => {
          // console.log('TreeData: ', response.data)
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

const mutations = {
  FORCE (state, etablissement) {
    let compareId = (d) => { return d.id === etablissement.id }
    let index = state.etablissements.findIndex(compareId)
    if (state.etablissements[index].photo) {
      state.etablissements[index].photo += '?' + (new Date()).setUTCDate(0, 0, 0, 0)
    }
  },
  [types.GET_ALL_ETABLISSEMENTS] (state, etablissements) {
    state.etablissements = etablissements
  },
  [types.ADD_ETABLISSEMENT] (state, etablissement) {
    state.etablissements.push(etablissement)
  },
  [types.UPDATE_ETABLISSEMENT] (state, newEtablissement) {
    let compareId = (etab) => {
      return etab.id === newEtablissement.id
    }
    let index = state.etablissements.findIndex(compareId)
    state.etablissements.splice(index, 1, newEtablissement)
  },
  [types.UPDATE_RESP_ETABLISSEMENT] (state, data) {
    // data[1] === codeEtablissement && data[0] === respEtablissement
    state.etablissements.find(e => e.code === data[1]).responsableEtablissement = data[0]
  },
  [types.SET_ID_TSIORY] (state, idEtablissement) {
    state.idTsiory = idEtablissement
  },
  ADMIN_DATA (state, data) {
    for (let key in data) {
      state.adminData[key] = JSON.parse(JSON.stringify(data[key]))
      LocalStorage.set('ADMIN_DATA', JSON.stringify(state.adminData))
    }
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}

import * as types from '../mutation-types'
import Axios from '../../axios'

const namespaced = true

const state = {
  utilisateurs: []
}

const getters = {
  utilisateurs: (state) => state.utilisateurs
}

const actions = {
  addUser ({commit}, utilisateur) {
    return new Promise((resolve, reject) => {
      Axios.post('api/utilisateurs', utilisateur)
        .then((response) => {
          commit(types.ADD_USER, response.data)
          return resolve(response.data)
        })
        .catch((error) => {
          return reject(error)
        })
    })
  },
  editUser ({commit}, utilisateur) {
    return new Promise((resolve, reject) => {
      Axios.put('api/utilisateurs/modif/' + utilisateur.id + '/' + utilisateur.nom + '/' + utilisateur.prenom + '/' + utilisateur.tel + '/' + utilisateur.email, utilisateur)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  envoimail ({commit}, utilisateur) {
    return new Promise((resolve, reject) => {
      Axios.post('api/utilisateurs/envoimail', utilisateur)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  envoimailbymail ({commit}, email) {
    return new Promise((resolve, reject) => {
      Axios.post('api/utilisateurs/envoimailbymail', email)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getAllUsers ({commit}) {
    return new Promise((resolve, reject) => {
      Axios.get('api/utilisateurs')
        .then((response) => {
          commit(types.GET_ALL_USERS, response.data)
          var dataReturn = []
          var j = 0
          for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].isEtudiant === false) {
              dataReturn[j] = response.data[i]
              j++
            }
          }
          return resolve(dataReturn)
        })
        .catch((error) => {
          return reject(error)
        })
    })
  },
  setPhoto ({commit}, data) {
    return new Promise((resolve, reject) => {
      if (!data.image) {
        resolve(data.utilisateur)
        return
      }
      Axios.put('/api/utilisateurs/photo/' + data.utilisateur.id, {photo: data.image}, true, true)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  updateResponsable ({ commit }, responsable) {
    return new Promise((resolve, reject) => {
      Axios.put('/api/utilisateurs/updateByParcours?idUtilisateur=' + responsable.id + '&idParcours=' + responsable.parcours.id,
        {
          'idParcours': responsable.parcours.id
        }
        , function (response, jwres) {
          if (jwres.statusCode === 200) {
            return resolve(response)
          }
          else {
            return reject(response)
          }
        })
    })
  },
  updateResponsableComposant ({ commit }, pathVariables) {
    return new Promise((resolve, reject) => {
      Axios.put('/api/utilisateurs/updateByComposant?idUtilisateur=' + pathVariables[0] + '&codeComposant=' + pathVariables[1])
        .then(res => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  updateResponsableEtablissement ({ commit }, pathVariables) {
    // console.log('pathVariables: ', pathVariables)
    return new Promise((resolve, reject) => {
      Axios.put('/api/utilisateurs/updateByEtablissement?idUtilisateur=' + pathVariables[0] + '&codeEtablissement=' + pathVariables[1])
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  updateResponsableDomaine ({ commit }, pathVariables) {
    return new Promise((resolve, reject) => {
      Axios.put('/api/utilisateurs/updateByDomaine?idUtilisateur=' + pathVariables[0] + '&codeDomaine=' + pathVariables[1])
        .then(res => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  updateResponsableMention ({ commit }, pathVariables) {
    return new Promise((resolve, reject) => {
      Axios.put('/api/utilisateurs/updateByMention?idUtilisateur=' + pathVariables[0] + '&codeMention=' + pathVariables[1])
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  updateResponsableParcours ({ commit }, pathVariables) {
    return new Promise((resolve, reject) => {
      Axios.put('/api/utilisateurs/updateByParcours?idUtilisateur=' + pathVariables[0] + '&codeParcours=' + pathVariables[1])
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  filter ({commit}, responsable) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/utilisateurs?fonction=' + responsable)
        .then(response => {
          return resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getAllUtilisateurs ({commit}) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/utilisateurs?fonction=utilisateur')
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getById ({commit}, id) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/utilisateurs/' + id)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getSousResponsabiliteMention ({commit}, idMention) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/utilisateurs/sous_responsabilite/mention/' + idMention)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getSousResponsabiliteParcours ({commit}, idParcours) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/utilisateurs/sous_responsabilite/parcours/' + idParcours)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getSousResponsabiliteUe ({commit}, idUe) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/utilisateurs/sous_responsabilite/ue/' + idUe)
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
  [types.GET_ALL_USERS] (state, utilisateurs) {
    state.utilisateurs = utilisateurs
  },
  [types.ADD_USER] (state, utilisateur) {
    state.utilisateurs.push(utilisateur)
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced
}

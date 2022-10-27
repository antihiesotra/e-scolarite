import {LocalStorage} from 'quasar'

const state = {
}

const getters = {
}

const actions = {
  saveFonction ({commit}, fonction) {
    return new Promise((resolve, reject) => {
      LocalStorage.set('fonction', JSON.stringify(fonction))
      resolve(fonction)
    })
  },
  getFonction ({commit}) {
    return new Promise((resolve, reject) => {
      resolve(JSON.parse(LocalStorage.get.item('fonction')))
    })
  },
  getStorageComposant ({commit}) {
    return new Promise((resolve, reject) => {
      let credential = JSON.parse(LocalStorage.get.item('credential'))
      if (credential) {
        resolve(credential.composant)
      }
      else {
        resolve(false)
      }
    })
  },
  getStorageCredential ({commit}) {
    return new Promise((resolve, reject) => {
      let credential = JSON.parse(LocalStorage.get.item('credential'))
      if (credential) {
        resolve(credential)
      }
      else {
        resolve(false)
      }
    })
  },
  setStorageUserAndToken ({commit}, userAndToken) {
    return new Promise((resolve, reject) => {
      LocalStorage.set('auth_token', userAndToken.token)
      LocalStorage.set('user', JSON.stringify(userAndToken.user))
      resolve(userAndToken.user)
    })
  },
  getCurrentResponsableComposant ({commit}) {
    return new Promise((resolve, reject) => {
      let user = JSON.parse(LocalStorage.get.item('user'))
      user.theComposant = JSON.parse(user.extras)
      if (user) {
        resolve(user)
      }
      else {
        reject(new Error('no user found in your browser'))
      }
    })
  },
  getCurrentResponsableEtablissement () {
    return new Promise((resolve, reject) => {
      let user = JSON.parse(LocalStorage.get.item('user'))
      user.theEtablissement = JSON.parse(user.extras)
      if (user) {
        resolve(user)
      }
      else {
        reject(new Error('no user found in your browser'))
      }
    })
  },
  getCurrentResponsableParcours () {
    return new Promise((resolve, reject) => {
      let user = JSON.parse(LocalStorage.get.item('user'))
      user.parcours = JSON.parse(user.extras)
      if (user) {
        resolve(user)
      }
      else {
        reject(new Error('no user found in your browser'))
      }
    })
  },
  getCurrentResponsableDomaine () {
    return new Promise((resolve, reject) => {
      let user = JSON.parse(LocalStorage.get.item('user'))
      user.domaine = JSON.parse(user.extras)
      if (user) {
        resolve(user)
      }
      else {
        reject(new Error('no user found in your browser'))
      }
    })
  },
  getCurrentChefMention () {
    return new Promise((resolve, reject) => {
      let user = JSON.parse(LocalStorage.get.item('user'))
      user.mention = JSON.parse(user.extras)
      if (user) {
        resolve(user)
      }
      else {
        reject(new Error('no user found in your browser'))
      }
    })
  },
  getCurrentUser () {
    return new Promise((resolve, reject) => {
      let user = JSON.parse(LocalStorage.get.item('user'))
      if (user) {
        resolve(user)
      }
      else {
        resolve(false)
      }
    })
  },
  checkToken () {
    return new Promise((resolve, reject) => {
      resolve(LocalStorage.get.item('auth_token'))
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

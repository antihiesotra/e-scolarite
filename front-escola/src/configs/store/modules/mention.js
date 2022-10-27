import Axios from '../../axios'
import * as types from '../mutation-types'
import chunck from '../../../utils/chunk'

const namespaced = true

const state = {
  filteredMentions: []
}

const getters = {
  filteredMentions: state => state.filteredMentions,
  chunckedFilteredMentions: state => {
    let filteredMentionsCopy = JSON.parse(JSON.stringify(state.filteredMentions))
    return chunck(filteredMentionsCopy, 3)
  }
}

const actions = {
  getAllMention ({commit}) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/mentions')
        .then((response) => {
          commit(types.GET_ALL_MENTIONS, response.data)
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getAllMentionBymention ({commit}, codemention) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/mentions/mention/' + codemention)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getAllMentionByComposant ({commit}, idComposant) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/mentions/composant/' + idComposant)
        .then((response) => {
          commit('GET_ALL_FILTERED_MENTIONS', response.data)
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getMentionById ({commit}, idMention) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/mentions/' + idMention)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  addMention ({commit}, mention) {
    let data = []
    data.push(mention.chefMention)
    data.push(mention.code)
    mention.chefMention = null
    return new Promise((resolve, reject) => {
      Axios.post('/api/mentions', mention)
        .then((response) => {
          commit(types.ADD_MENTION, response.data)
          commit(types.UPDATE_RESP_MENTION, data)
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  updateMention ({commit}, mention) {
    return new Promise((resolve, reject) => {
      Axios.put('/api/mentions/' + mention.id, mention)
        .then((response) => {
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
        resolve(data.mention)
        return
      }
      Axios.put('/api/mentions/photo/' + data.mention.id, {photo: data.image}, true, true)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  deleteMention ({commit}, mention) {
    return new Promise((resolve, reject) => {
      Axios.delete('/api/mentions/' + mention.id)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getAllMentionsByCodeComposant ({commit}, codeComposant) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/mentions/liste-mentions-by-code-composant/' + codeComposant)
        .then((response) => {
          commit('GET_ALL_FILTERED_MENTIONS', response.data)
          resolve(response.data)
        })
        .catch((err) => {
          console.log(err)
          reject(err)
        })
    })
  }
}

const mutations = {
  FORCE (state, mention) {
    let compareId = (d) => { return d.id === mention.id }
    let index = state.filteredMentions.findIndex(compareId)
    if (state.filteredMentions[index].photo) {
      state.filteredMentions[index].photo += '?' + (new Date()).setUTCDate(0, 0, 0, 0)
    }
  },
  [types.GET_ALL_MENTIONS] (state, mentions) {
    state.filteredMentions = mentions
  },
  [types.ADD_MENTION] (state, mention) {
    state.filteredMentions.push(mention)
  },
  [types.UPDATE_MENTION] (state, mention) {
    let compareId = (c) => {
      return c.id === mention.id
    }
    let index = state.filteredMentions.findIndex(compareId)
    state.filteredMentions.splice(index, 1, mention)
  },
  [types.UPDATE_RESP_MENTION] (state, data) {
    // data[1] === codeMention && data[0] === chefMention
    state.filteredMentions.find(e => e.code === data[1]).chefMention = data[0]
  },
  [types.GET_ALL_FILTERED_MENTIONS] (state, mentions) {
    state.filteredMentions = mentions
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}

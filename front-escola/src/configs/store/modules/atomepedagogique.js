/* import * as types from '../mutation-types' */
import axios from 'axios'
const api = process.env.API_BASE_URL

const state = {
}

const getters = {
}

const actions = {
  getAllAtomePedagogique ({commit}) {
    return new Promise((resolve, reject) => {
      /* axios.get(api + '/atome-pedagodique')
     .then((response) => {
       resolve(response.data)
     })
     .catch((err) => {
       reject(err)
     }) */
      resolve([
        {
          'id': 1,
          'code': 'et',
          'libelle': 'Enseignement Théorique',
          'abreviation': 'ET'
        },
        {
          'id': 2,
          'code': 'ed',
          'libelle': 'Enseignement Doctoral',
          'abreviation': 'ED'
        },
        {
          'id': 3,
          'code': 'ep',
          'libelle': 'Enseignement Pratique',
          'abreviation': 'EPPP'
        },
        {
          'code': 'bo',
          'libelle': 'BOTABE',
          'abreviation': 'BO',
          'id': 4
        },
        {
          'code': 'sdf',
          'libelle': 'fsd',
          'abreviation': 'fsd',
          'id': 5
        },
        {
          'code': 'sdf',
          'libelle': 'fsd',
          'abreviation': 'fsd',
          'id': 6
        },
        {
          'code': 'fqs',
          'libelle': 'fqss',
          'abreviation': 'fqs',
          'id': 7
        },
        {
          'code': 'fsqd',
          'libelle': 'fqsd',
          'abreviation': 'fqsd',
          'id': 8
        },
        {
          'code': 'q',
          'libelle': 'q',
          'abreviation': 'q',
          'id': 9
        }
      ])
    })
  },
  addAtomePedagogique ({commit}, at) {
    return new Promise((resolve, reject) => {
      axios.post(api + '/atome-pedagodique', at)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  updateAtomePedagogique ({commit}, at) {
    return new Promise((resolve, reject) => {
      axios.put(api + '/atome-pedagodique' + '/' + at.id, at)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  deleteAtomePedagogique ({commit}, at) {
    return new Promise((resolve, reject) => {
      axios.delete(api + '/atome-pedagodique' + '/' + at.id)
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
}

export default {
  state,
  getters,
  actions,
  mutations
}

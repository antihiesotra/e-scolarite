import * as types from '../mutation-types'
import Axios from '../../axios'
// import * as _ from 'lodash'

const namespaced = true

const state = {
  ecs: []
}

const getters = {
  ecs: (state) => state.ecs
}

const actions = {
  getAllEcsFromUe ({commit}) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/ecs').then((response) => {
        let res = response.data
        commit(types.SET_ALL_ECS, res)
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  getAllEcOfUeOptionnel ({commit}, ueOptionnelId) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/ecs/ueoptionnel/' + ueOptionnelId).then((response) => {
        let res = response.data
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  getAllEcOfUe ({commit}, ueId) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/ecs/ue/' + ueId).then((response) => {
        let res = response.data
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  getEnseignantsFromEc ({commit}, id) {
    let enseignant = { }
    let data = []
    return new Promise((resolve, reject) => {
      Axios.get('/api/enseigners/idEc?id=' + id).then((res) => {
        let response = res.data
        let i = 0
        if (response.length === 0) {
          response.notFound = true
          resolve(response)
        }
        else {
          console.log('data:', res)
          response.forEach((val, index) => {
            Axios.get('/api/utilisateurs/' + val.enseignerPK.idUtilisateur).then((res1) => {
              enseignant = {
                PK: val.enseignerPK,
                data: res1.data
              }
              data.push(enseignant)
              i++
              if (i === response.length) {
                data.notFound = false
                resolve(data)
              }
            }).catch((err1) => {
              console.log(err1)
            })
          })
        }
      }).catch((err) => {
        reject(err)
      })
    })
  },
  setEnseignantForEc ({commit}, Primary) {
    console.log('Primary Key:', Primary)
    return new Promise((resolve, reject) => {
      Axios.post('/api/enseigners', { enseignerPK: Primary })
        .then((res) => {
          console.log('reponse :', res)
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
    })
  },
  deleteEnseignantforEc ({commit}, PK) {
    console.log('Key to delete:', PK)
    return new Promise((resolve, reject) => {
      Axios.delete('api/enseigners/enseignerPK?idEc=' + PK.idEc + '&idUtilisateur=' + PK.idUtilisateur)
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  updateEc ({commit}, ec) {
    return new Promise((resolve, reject) => {
      Axios.put('api/ecs/' + ec.id, ec)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  addEc ({commit}, ec) {
    return new Promise((resolve, reject) => {
      Axios.post('api/ecs/', ec)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getIdecOpt ({commit}, idue) {
    return new Promise((resolve, reject) => {
      Axios.post('api/ecs/getidecopt/' + idue)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getIdecOptOb ({commit}, idue) {
    return new Promise((resolve, reject) => {
      Axios.post('api/ecs/getidecoptOb/' + idue)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  updateidEcTab ({commit}, id) {
    let regex = new RegExp('/')
    let param1 = ''
    let param2 = ''
    if (id.match(regex)) {
      param1 = id.split('/')[0]
      param2 = id.split('/')[1]
      console.log('param1 EC JS OKOK')
    }
    console.log('param1 :' + param1)
    console.log('param2 :' + param2)
    return new Promise((resolve, reject) => {
      Axios.post('api/ecs/updateidectab/' + param1 + '/' + param2)
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
  [types.SET_ALL_ECS] (state, ecs) {
    state.ecs = ecs
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced
}

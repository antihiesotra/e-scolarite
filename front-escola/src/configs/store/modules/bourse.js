import Axios from '../../axios'
const namespaced = true

const state = {
}

const getters = {
}

const actions = {
  modifInscriptionAdministrative ({commit}, data) {
    return new Promise((resolve, reject) => {
      console.log(data)
      Axios.get('/api/inscriptionAdministratives/modifBourse?idEtudiant=' + data.idEtudiant + '&taux=' + data.taux + '&montant=' + data.montant + '&nature=' + data.nature)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
          console.log(err)
        })
    })
  },
  printExcelInfosMaximEtudiant ({commit}, qOptions) {
    return new Promise((resolve, reject) => {
      Axios.get('/pdf/sauvegardeEtudiant/' + qOptions.annee + '/' + qOptions.semestre + '/' + qOptions.parcours)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  printExcelInfosMinimEtudiant ({commit}, qOptions) {
    return new Promise((resolve, reject) => {
      Axios.get('/pdf/fichebourseEtudiant/' + qOptions.annee + '/' + qOptions.semestre + '/' + qOptions.parcours)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getInfosInscriptionAdministrativeByInscriptionPedagogique ({commit}, field) {
    return new Promise((resolve, reject) => {
      Axios.get('api/inscriptionAdministratives/liste?annee=' + field.annee + '&semestre=' + field.semestre + '&parcours=' + field.parcours)
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
}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced
}

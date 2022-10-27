/* eslint-disable import/namespace */
import Axios from '../../axios'
import * as types from '../mutation-types'
const namespaced = true
const state = {
  etudiants: [],
  personnes: []
}
const getters = {
  etudiants: (state) => state.etudiants,
  personnes: (state) => state.personnes
}
const actions = {
  getEtudiantById ({commit}, id) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/etudiants/' + id)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getAllEtudiantByComposant ({commit}, idComposant) {
    if (idComposant === 'undefined') {
      idComposant = 0
      console.log('idComposant ---' + idComposant)
    }
    return new Promise((resolve, reject) => {
      Axios.get('api/etudiants/' + idComposant + '/' + false)
        .then((response) => {
          commit(types.SET_ETUDIANTS_COMPOSANT, response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getAllEtudiantSupprimeByComposant ({commit}, idComposant) {
    return new Promise((resolve, reject) => {
      Axios.get('api/etudiants/' + idComposant + '/' + true)
        .then((response) => {
          console.log(response)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getAllEtudiants ({commit}) {
    return new Promise((resolve, reject) => {
      Axios.get('api/personnes/etudiants')
        .then((response) => {
          commit(types.SET_ETUDIANTS_ETABLISSEMENT, response.data)
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  deleteEtudiant ({commit}, etudiant) {
    return new Promise((resolve, reject) => {
      Axios.put('api/etudiants/' + etudiant.id, etudiant)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  updateEtudiant ({commit}, etudiant) {
    return new Promise((resolve, reject) => {
      Axios.put('api/personnes/' + etudiant.id, etudiant)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  printFichePresence ({commit}, qOptions) {
    return new Promise((resolve, reject) => {
      Axios.get('/pdf/fichedepresence/' + qOptions.annee + '/' + qOptions.semestre + '/' + qOptions.parcours)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  printResultatPourRattrapage ({commit}, qOptions) {
    return new Promise((resolve, reject) => {
      Axios.get('/pdf/resultat/' + qOptions.annee + '/' + qOptions.semestre + '/' + qOptions.parcours + '/rattrapages')
        .then((response) => {
          console.log('response from api:', response)
          console.log('response status:', response.Error)
          resolve(response.data)
        })
        .catch((err) => {
          console.log('erreur de la base :', err)
          reject(err)
        })
    })
  },
  printResultat ({commit}, qOptions) {
    return new Promise((resolve, reject) => {
      Axios.get('/pdf/resultat/' + qOptions.annee + '/' + qOptions.semestre + '/' + qOptions.parcours + '/' + qOptions.session)
        .then((response) => {
          console.log('response from api:', response)
          console.log('response status:', response.Error)
          resolve(response.data)
        })
        .catch((err) => {
          console.log('erreur de la base :', err)
          reject(err)
        })
    })
  },
  printResultatParEC ({commit}, qOptions) {
    return new Promise((resolve, reject) => {
      Axios.get('/pdf/resultat/' + qOptions.annee + '/' + qOptions.semestre + '/' + qOptions.parcours + '/' + qOptions.session + '/parec')
        .then((response) => {
          console.log('response from api:', response)
          console.log('response status:', response.Error)
          resolve(response.data)
        })
        .catch((err) => {
          console.log('erreur de la base :', err)
          reject(err)
        })
    })
  },
  printResultatAdmisDefinitif ({commit}, qOptions) {
    return new Promise((resolve, reject) => {
      Axios.get('/pdf/resultat/' + qOptions.annee + '/' + qOptions.semestre + '/' + qOptions.parcours + '/admisdefinitf')
        .then((response) => {
          console.log('response from api:', response)
          console.log('response status:', response.Error)
          resolve(response.data)
        })
        .catch((err) => {
          console.log('erreur de la base :', err)
          reject(err)
        })
    })
  },
  printResultatCompensable ({commit}, qOptions) {
    return new Promise((resolve, reject) => {
      Axios.get('/pdf/resultat/' + qOptions.annee + '/' + qOptions.semestre + '/' + qOptions.parcours + '/compensable')
        .then((response) => {
          console.log('response from api:', response)
          console.log('response status:', response.Error)
          resolve(response.data)
        })
        .catch((err) => {
          console.log('erreur de la base :', err)
          reject(err)
        })
    })
  },
  printResultatNonAdmisDefinitif ({commit}, qOptions) {
    return new Promise((resolve, reject) => {
      Axios.get('/pdf/resultat/' + qOptions.annee + '/' + qOptions.semestre + '/' + qOptions.parcours + '/nonadmisdefinitf')
        .then((response) => {
          console.log('response from api:', response)
          console.log('response status:', response.Error)
          resolve(response.data)
        })
        .catch((err) => {
          console.log('erreur de la base :', err)
          reject(err)
        })
    })
  },
  printResultatPourAdmis ({commit}, qOptions) {
    return new Promise((resolve, reject) => {
      Axios.get('/pdf/resultat/' + qOptions.annee + '/' + qOptions.semestre + '/' + qOptions.parcours + '/' + qOptions.session + '/valides')
        .then((response) => {
          console.log('response from api:', response)
          console.log('response status:', response.Error)
          resolve(response.data)
        })
        .catch((err) => {
          console.log('erreur de la base :', err)
          reject(err)
        })
    })
  },
  printResultatPourNonAdmis ({commit}, qOptions) {
    return new Promise((resolve, reject) => {
      Axios.get('/pdf/resultat/' + qOptions.annee + '/' + qOptions.semestre + '/' + qOptions.parcours + '/' + qOptions.session + '/nonvalides')
        .then((response) => {
          console.log('response from api:', response)
          console.log('response status:', response.Error)
          resolve(response.data)
        })
        .catch((err) => {
          console.log('erreur de la base :', err)
          reject(err)
        })
    })
  },
  printStudentsCard ({commit}, qOptions) {
    return new Promise((resolve, reject) => {
      Axios.get('/pdf/cartedesetudiant/' + qOptions.annee + '/' + qOptions.parcours + '/' + qOptions.semestre)
        .then((response) => {
          console.log('response from api:', response)
          console.log('response status:', response.Error)
          resolve(response.data)
        })
        .catch((err) => {
          console.log('erreur de la base :', err)
          reject(err)
        })
    })
  },
  printAttestation ({commit}, qOptions) {
    return new Promise((resolve, reject) => {
      Axios.get('/pdf/attestationreussite/' + qOptions.annee + '/' + qOptions.parcours + '/' + qOptions.semestre + '/' + qOptions.idEtudiant)
        .then((response) => {
          console.log('response from api:', response)
          console.log('response status:', response.Error)
          resolve(response.data)
        })
        .catch((err) => {
          console.log('erreur de la base :', err)
          reject(err)
        })
    })
  },
  printStudentCard ({commit}, qOptions) {
    return new Promise((resolve, reject) => {
      Axios.get('pdf/cartedetudiant/' + qOptions.annee + '/' + qOptions.parcours + '/' + qOptions.semestre + '/' + qOptions.idEtudiant)
        .then((response) => {
          console.log('response from api:', response)
          console.log('response status:', response.Error)
          resolve(response.data)
        })
        .catch((err) => {
          console.log('erreur de la base :', err)
          reject(err)
        })
    })
  },
  printPdfCertificats ({commit}, qOptions) {
    return new Promise((resolve, reject) => {
      Axios.get('/pdf/certificatdescolarite/' + qOptions.annee + '/' + qOptions.parcours + '/' + qOptions.semestre + '/' + qOptions.idEtudiant)
        .then((response) => {
          console.log('response from api:', response)
          console.log('response status:', response.Error)
          resolve(response.data)
        })
        .catch((err) => {
          console.log('erreur de la base :', err)
          reject(err)
        })
    })
  },
  releve ({commit}, qOptions) {
    return new Promise((resolve, reject) => {
      Axios.get('pdf/releve/' + qOptions.annee + '/' + qOptions.parcours + '/' + qOptions.semestre + '/' + qOptions.idEtudiant)
        .then((response) => {
          console.log('response from api:', response)
          console.log('response status:', response.Error)
          resolve(response.data)
        })
        .catch((err) => {
          console.log('erreur de la base :', err)
          reject(err)
        })
    })
  }
}
const mutations = {
  [types.SET_ETUDIANTS_COMPOSANT] (state, etudiants) {
    state.etudiants = etudiants
  },
  [types.SET_ETUDIANTS_ETABLISSEMENT] (state, personnes) {
    state.personnes = personnes
  }
}
export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}

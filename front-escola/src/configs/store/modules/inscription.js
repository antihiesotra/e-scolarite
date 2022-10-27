import Axios from '../../axios'
const namespaced = true
const state = {
}

const getters = {
}

const actions = {
  inscrireEtudiantAdministrativement ({commit}, inscription) {
    return new Promise((resolve, reject) => {
      Axios.post('/api/inscriptionAdministratives', inscription)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  deleteEtudiant ({commit}, etudiants) {
    console.log(etudiants.inscriptionPedagogiquePK.idEtudiant)
    return new Promise((resolve, reject) => {
      Axios.get('api/inscriptionPedagogiques/inscriptionPedagogiquePK?id=' + etudiants.inscriptionPedagogiquePK.idSemestre + '&idAnneeUniversitaire=' + etudiants.inscriptionPedagogiquePK.idAnneeUniversitaire + '&idParcours=' + etudiants.inscriptionPedagogiquePK.idParcours + '&idEtudiant=' + etudiants.inscriptionPedagogiquePK.idEtudiant)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  reInscrireEtudiantAdminPedagogiquement ({commit}, reInscription) {
    return new Promise((resolve, reject) => {
      Axios.post('/api/inscriptionPedagogiques/reInscrireEtudiantAdminPedagogique', reInscription)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
          console.log(err)
        })
    })
  },
  reInscrireEtudiant ({commit}, reInscription) {
    return new Promise((resolve, reject) => {
      Axios.post('/api/inscriptionPedagogiques/reInscrireEtudiant', reInscription)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
          console.log(err)
        })
    })
  },
  reInscrireEtudiantPedagogiquementUe ({commit}, reInscription) {
    console.log('value', reInscription)
    return new Promise((resolve, reject) => {
      Axios.post('/api/inscriptionPedagogiques/reInscrireEtudiantPedagogiquementUe', reInscription)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
          console.log(err)
        })
    })
  },
  reInscrireEtudiantPedagogiquementMultiple ({commit}, reInscription) {
    console.log('value', reInscription)
    return new Promise((resolve, reject) => {
      Axios.post('/api/inscriptionPedagogiques/reInscrireEtudiantPedagogiquementMultiple', reInscription)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
          console.log(err)
        })
    })
  },
  reInscrireEtudiantPedagogiquement ({commit}, reInscription) {
    return new Promise((resolve, reject) => {
      Axios.post('/api/inscriptionPedagogiques/reInscrireEtudiantPedagogiquement', reInscription)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
          console.log(err)
        })
    })
  },
  findInscriptionEtudiantAdminPedagogique ({commit}, field) {
    return new Promise((resolve, reject) => {
      Axios.post('/api/inscriptionPedagogiques/findInscriptionAdminPedagogique', field)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
          console.log(err)
        })
    })
  },
  findInscriptionEtudiantPedagogique ({commit}, field) {
    return new Promise((resolve, reject) => {
      Axios.post('/api/inscriptionPedagogiques/findInscriptionPedagogiqueMultiple', field)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
          console.log(err)
        })
    })
  },
  findInscriptionUeEtudiantPedagogique ({commit}, field) {
    return new Promise((resolve, reject) => {
      Axios.post('/api/inscriptionPedagogiques/findInscriptionPedagogiqueUes', field)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
          console.log(err)
        })
    })
  },
  inscrireEtudiant ({commit}, inscription) {
    return new Promise((resolve, reject) => {
      Axios.post('api/inscriptionAdministratives/inscrireEtudiant', inscription)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getAllEtudiants ({commit}) {
    return new Promise((resolve, reject) => {
      Axios.get('api/etudiants')
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getAllInscriptionAdministrativeByAnneeUniversitaire ({commit}, annee) {
    return new Promise((resolve, reject) => {
      Axios.get('api/inscriptionAdministratives/' + annee)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getAllIAdmisDefinitif ({commit}, field) {
    return new Promise((resolve, reject) => {
      Axios.get('api/inscriptionPedagogiques/liste?annee=' + field.annee + '&semestre=' + field.semestre + '&parcours=' + field.parcours + '&ue=' + field.ue)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getAllInscriptionPedagogique ({commit}, field) {
    return new Promise((resolve, reject) => {
      Axios.get('api/inscriptionPedagogiques/liste?annee=' + field.annee + '&semestre=' + field.semestre + '&parcours=' + field.parcours)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  isInscritAdmnistrativeEtudiant ({commit}, field) {
    return new Promise((resolve, reject) => {
      Axios.get('api/inscriptionAdministratives/inscriptionAdministrativePK?idAnneeUniversitaire=' + field.annee + '&idEtudiant=' + field.etudiant)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  findEtudiantImatricule ({commit}, matricule) {
    return new Promise((resolve, reject) => {
      Axios.get('api/etudiants/findEtudiantImatricule?matricule=' + matricule)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  findPersonneByEmail ({commit}, email) {
    return new Promise((resolve, reject) => {
      Axios.get('api/personnes/getByEmail?email=' + email)
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
  namespaced,
  state,
  getters,
  actions,
  mutations
}

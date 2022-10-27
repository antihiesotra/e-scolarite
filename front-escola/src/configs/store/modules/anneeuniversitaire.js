import Axios from '../../axios'

const namespaced = true

const actions = {
  getAllAnneeUniversitaire ({commit}) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/annee-universitaires')
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getAnneeUniversitaireById ({commit}, id) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/annee-universitaires/' + id)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  addAnneeUniversitaire ({commit}, anneeUniversitaire) {
    return new Promise((resolve, reject) => {
      Axios.post('/api/annee-universitaires', anneeUniversitaire)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  updateAnneeUniversitaire ({commit}, anneeUniversitaire) {
    return new Promise((resolve, reject) => {
      Axios.put('/api/annee-universitaires/' + anneeUniversitaire.id, anneeUniversitaire)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  deleteAnneeUniversitaire ({commit}, anneeUniversitaire) {
    return new Promise((resolve, reject) => {
      Axios.delete('/api/annee-universitaires/' + anneeUniversitaire.id)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

export default {
  actions,
  namespaced
}

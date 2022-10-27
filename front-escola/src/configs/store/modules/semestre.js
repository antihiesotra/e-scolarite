import Axios from '../../axios'

const namespaced = true

const actions = {
  getAllSemestre ({commit}) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/semestres')
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getSemestreBySemestrePk ({commit}, semestrePk) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/semestres/semestrePK?id=' + semestrePk.id + '&idAnneeUniversitaire=' + semestrePk.idAnneeUniversitaire)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getSemestreByIdAnneeUniversitaire ({commit}, annee) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/semestres/' + annee)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  addSemestre ({commit}, semestre) {
    return new Promise((resolve, reject) => {
      Axios.post('/api/semestres', semestre)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  updateSemestre ({commit}, semestre) {
    return new Promise((resolve, reject) => {
      Axios.put('/api/semestres/' + semestre.id, semestre)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  deleteSemestre ({commit}, semestre) {
    return new Promise((resolve, reject) => {
      Axios.delete('/api/semestres/' + semestre.id)
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

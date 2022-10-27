import Axios from '../../axios'

const namespaced = true

const state = {}
const getters = {}

const actions = {
  getEtudiantByFilter ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/inscriptionPedagogiques/getEtudiant?idParcours=' + params.idParcours + '&idSemestre=' + params.idSemestre + '&idAnneeUniversitaire=' + params.idAnneeUniversitaire)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getNotesByFilter ({commit}, params) {
    return new Promise((resolve, reject) => {
      console.log('params api', params)
      Axios.get('/api/presencesessions/getByFilter?idEc=' + params.idEc + '&idAnneeUniversitaire=' + params.idAnneeUniversitaire + '&idSemestre=' + params.idSemestre + '&idSession=' + params.idSession)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  printNoteEtudiants ({commit}, params) {
    return new Promise((resolve, reject) => {
      console.log('params api', params)
      Axios.get('/pdf/printNoteEtudiants/' + params.idEc + '/' + params.idAnneeUniversitaire + '/' + params.idSemestre + '/' + params.idParcours + '/' + params.idSession)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  printNoteDefEtudiants ({commit}, params) {
    return new Promise((resolve, reject) => {
      console.log('params api', params)
      Axios.get('/pdf/printNoteDefEtudiants/' + params.idEc + '/' + params.idAnneeUniversitaire + '/' + params.idSemestre + '/' + params.idParcours)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getNoteDefinitivesByParams ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.get(`/api/notedefinitives/annee/${params.idAnneeUniversitaire}/semestre/${params.idSemestre}/ec/${params.idEc}`)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  addAllNotes ({commit}, params) {
    return new Promise((resolve, reject) => {
      console.log('params api', params)
      Axios.post('/api/presencesessions/addAllNotes', params)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  updateNote ({commit}, params) {
    return new Promise((resolve, reject) => {
      console.log('params api', params)
      Axios.put('/api/presencesessions?idEc=' + params.idEc + '&idAnneeUniversitaire=' + params.idAnneeUniversitaire + '&idEtudiant=' + params.idEtudiant + '&idSemestre=' + params.idSemestre + '&idSession=' + params.idSession, {
        noteEc: params.noteEc,
        etudiant: params.idEtudiant
      })
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  compenserNote ({commit}, params) {
    return new Promise((resolve, reject) => {
      console.log('params api', params)
      Axios.get('/api/notedefinitives/compensation/' + params.noteEc + '/' + params.idEc + '/' + params.idAnneeUniversitaire + '/' + params.idEtudiant + '/' + params.idSemestre)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  deleteNote ({commit}, params) {
    return new Promise((resolve, reject) => {
      console.log('params api', params)
      Axios.delete('/api/presencesessions?idEc=' + params.idEc + '&idAnneeUniversitaire=' + params.idAnneeUniversitaire + '&idEtudiant=' + params.idEtudiant + '&idSemestre=' + params.idSemestre + '&idSession=' + params.idSession)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getAllNotesUeOptionnel ({commit}, idUeOptionnel) {
    return new Promise((resolve, reject) => {
      Axios.get(`/api/presencesessions/getAllNotesUeOptionnel/` + idUeOptionnel)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  addNoteByIdEc ({commit}, idSelectedEc) {
    return new Promise((resolve, reject) => {
      Axios.post('api/presencesessions/addNoteByIdEc/' + idSelectedEc)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          return reject(error)
        })
    })
  },
  getNoteByIdEc ({commit}, idSelectedEc) {
    return new Promise((resolve, reject) => {
      Axios.post('api/presencesessions/getNoteByIdEc/' + idSelectedEc)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          return reject(error)
        })
    })
  },
  getAllNotesForResult ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.get(`/api/presencesessions/resultat/${params.annee}/${params.parcours}/${params.semestre}/${params.session}`)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getResultatGlobalAdmis ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.get(`/api/notedefinitives/resultat/${params.annee}/${params.semestre}/${params.parcours}/admisdefinitif`)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getResultatGlobalNonAdmis ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.get(`/api/notedefinitives/resultat/${params.annee}/${params.semestre}/${params.parcours}/nonadmisdefinitif`)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getResultatGlobal ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.get(`/api/notedefinitives/resultat/${params.annee}/${params.semestre}/${params.parcours}`)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getResultatDeliberable ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.get(`/api/notedefinitives/resultat/${params.annee}/${params.semestre}/${params.parcours}/deliberable`)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }, /* GetListe Admis c pour les AFAKA 1ere session */
  getListePourAdmis ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.get(`/api/presencesessions/resultat/${params.annee}/${params.semestre}/${params.parcours}/${params.session}/valides`)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }, /* GetListe NON Admis c pour les TSY AFAKA 1ere session */
  getListePourNonAdmis ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.get(`/api/presencesessions/resultat/${params.annee}/${params.semestre}/${params.parcours}/${params.session}/nonvalides`)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }, /* Liste des etudiants en Rattrapage PAR EC */
  getListePourRattrapage ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.get(`/api/presencesessions/resultat/${params.annee}/${params.semestre}/${params.parcours}/${params.session}/rattrapages`)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }, /* Liste des etudiants en Rattrapage PAR EC */
  getListeNoteRattrapage ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.get(`/api/presencesessions/resultat/${params.annee}/${params.semestre}/${params.parcours}/${params.session}/noterattrapages`)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getListePourAdmisDelib ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.get(`/api/presencesessions/resultat/${params.annee}/${params.semestre}/${params.parcours}/${params.session}/validesDelib`)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getListePourAcheval ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.get(`/api/notedefinitives/resultat/${params.annee}/${params.semestre}/${params.parcours}/acheval`)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  /* Resultat par niveau */
  getAllNotesForResultByLevel ({commit}, params) {
    return new Promise((resolve, reject) => {
      Axios.get(`/api/notedefinitives/resultatParNiveau/${params.annee}/${params.niveau}/${params.parcours}`)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

const mutations = {}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced
}

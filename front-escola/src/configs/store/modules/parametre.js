import Axios from '../../axios'
const namespaced = true
const api = process.env.API_BASE_URL

const state = {}
const getters = {}

const actions = {
  getAllParametre ({commit}) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/parametres')
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getParametre ({commit}, field) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/parametres/parametre?codeEntite=' + field.codeEntite + '&annee=' + field.annee)
        .then((res) => {
          console.log('store return ', res.data)
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getParametreByYear ({commit}, field) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/parametres/parametreByYear?annee=' + field.annee)
        .then((res) => {
          console.log('store return ', res.data)
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  addParametre ({commit}, parametre) {
    return new Promise((resolve, reject) => {
      Axios.post('/api/parametres',
        {
          'entite': parametre.libelle,
          'codeEntite': parametre.codeEntite,
          'idAnneeUniversitaire': parametre.annee,
          'params': [
            /* {
              'clef': 'SAISIE_NOTE',
              'valeur': parametre.modeSaisie
            }, */
            /* {
              'clef': 'CONDITION_ADMISSION',
              'valeur': parametre.admission
            }, **/
            {
              'clef': 'CREDIT_SEMESTRE',
              'valeur': parametre.creditSemestre
            },
            {
              'clef': 'MOYENNE_DELIBERABLE',
              'valeur': parametre.moyenneDeliberable
            },
            {
              'clef': 'MOYENNE_G_DELIBERABLE',
              'valeur': parametre.moyenneGDeliberable
            },
            {
              'clef': 'NOTE_DEF_SEMESTRE',
              'valeur': parametre.noteDefinitive
            },
            /* {
              'clef': 'NOTE_ELIMINATOIRE',
              'valeur': parametre.noteEliminatoire
            }, */
            {
              'clef': 'NOTE_ELIMINATOIRE_EC',
              'valeur': parametre.noteEliminatoireEC
            },
            {
              'clef': 'TAUX_MIN_ADMIS',
              'valeur': parametre.pourcentage
            }
            /* {
              'clef': 'NOTE_VALIDE_CHEF_MENTION',
              'valeur': parametre.noteValideChefMention
            }, */
            /* {
              'clef': 'NOTE_SUP_NOTE_ELIM',
              'valeur': parametre.noteSupEliminatoire
            } */
          ]

        })
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },

  updateParametre ({commit}, parametre) {
    return new Promise((resolve, reject) => {
      Axios.put('/api/parametres/' + parametre.id, parametre)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  deleteParametre ({commit}, parametre) {
    return new Promise((resolve, reject) => {
      Axios.delete(api + '/api/parametres/' + parametre.id)
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

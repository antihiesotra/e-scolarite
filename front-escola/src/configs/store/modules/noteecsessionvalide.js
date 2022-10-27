import Axios from '../../axios'

const state = {}
const getters = {}

const actions = {
  checkNoteEcSessionValide ({commit}, data) {
    return new Promise((resolve, reject) => {
      Axios.get(`/api/validation-note-session/${data.idAnnee}/${data.idSemestre}/${data.idEc}/${data.idSession}`)
        .then((res) => {
          if (res.data === null || res.data === '') {
            resolve(false)
          }
          else {
            resolve(true)
          }
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
  mutations
}

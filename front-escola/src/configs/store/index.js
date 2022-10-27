import Vue from 'vue'
import Vuex from 'vuex'

// MODULES
import storage from './modules/storage'
import login from './modules/login'
import composant from './modules/composant'
import atomepedagogique from './modules/atomepedagogique'
import planformation from './modules/planformation'
import domaine from './modules/domaine'
import diplome from './modules/diplome'
import mention from './modules/mention'
import niveau from './modules/niveau'
import parametre from './modules/parametre'
import responsable from './modules/responsable'
import anneeuniversitaire from './modules/anneeuniversitaire'
import semestre from './modules/semestre'
import parcours from './modules/parcours'
import utilisateur from './modules/utilisateur'
import ec from './modules/ec'
import ue from './modules/ue'
import ueoptionnel from './modules/ueoptionnel'
import inscription from './modules/inscription'
import mesure from './modules/mesure'
import sanction from './modules/sanction'
import etablissement from './modules/etablissement'
import session from './modules/session'
import note from './modules/note'
import etudiant from './modules/etudiant'
import noteecsessionvalide from './modules/noteecsessionvalide'
import upload from './modules/upload'
import cursus from './modules/cursus'
import historiquenotes from './modules/historiquenotes'
import tableaudebord from './modules/tableaudebord'
import bourse from './modules/bourse'
import compensation from './modules/compensation'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    storage,
    login,
    composant,
    atomepedagogique,
    planformation,
    bourse,
    domaine,
    mention,
    niveau,
    mesure,
    sanction,
    parametre,
    responsable,
    inscription,
    anneeuniversitaire,
    parcours,
    semestre,
    utilisateur,
    ec,
    ue,
    ueoptionnel,
    etablissement,
    session,
    note,
    etudiant,
    noteecsessionvalide,
    upload,
    cursus,
    historiquenotes,
    diplome,
    tableaudebord,
    compensation
  },
  strict: debug
})

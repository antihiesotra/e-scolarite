import Vue from 'vue'
import VueRouter from 'vue-router'
import {Alert, LocalStorage} from 'quasar'

Vue.use(VueRouter)

function load (component) {
  // '@' is aliased to src/components
  return () => import(`@/${component}.vue`)
}

const router = new VueRouter({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),

  routes: [
    { path: '/', component: load('login/Login') },
    { path: '/mention',
      component: load('layout/LayoutMention'),
      children: [
        /* {path: 'parcours', component: load('mention/Parcours')}, */
        {path: 'parcours/:id_mention', component: load('mention/Parcours')},
        {path: 'parametres', component: load('mention/Parametres')},
        {path: 'afficheParametres', component: load('mention/afficheparametres')},
        {path: 'personne/ajout', component: load('mention/Ajout')},
        {path: 'personne/liste', component: load('mention/Liste')}
      ]
    },
    { path: '/enseignant',
      component: load('layout/LayoutEnseignant'),
      children: [
        {path: 'notes', component: load('enseignant/Notes')}
      ]
    },
    { path: '/scolarite',
      component: load('layout/layoutScolarite'),
      children: [
        {path: 'configuration', component: load('layout/configuration')},
        {path: 'profil', component: load('Profil')},

        {path: 'accueil', component: load('scolarite/Home')},
        {path: 'etudiant', component: load('scolarite/etudiant/Liste')},
        {path: 'etudiant/supprime', component: load('scolarite/etudiant/ListeSupprime')},
        {path: 'etudiant/ajout', component: load('scolarite/etudiant/Ajout')},
        {path: 'etudiant/personnes', component: load('scolarite/etudiant/ListePersonne')},
        {path: 'inscription', component: load('scolarite/inscription/pedagogique/Liste')},
        {path: 'inscription/pedagogique/ajout', component: load('scolarite/inscription/pedagogique/Ajout')},
        {path: 'inscription/administrative', component: load('scolarite/inscription/administrative/Liste')},
        {path: 'inscription/administrative/ajout', component: load('scolarite/inscription/administrative/Ajout')},
        {path: 'note', component: load('scolarite/note/Liste')},
        {path: 'resultat', component: load('scolarite/resultat/Resultat')},
        {path: 'resultatparniveau', component: load('scolarite/resultat/ResultatParNiveau')},
        {path: 'attestation', component: load('scolarite/attestation/Attestation')},
        {path: 'releve', component: load('scolarite/releve/Liste')},
        {path: 'bourse', component: load('scolarite/bourse/Liste')},
        {path: 'diplome', component: load('scolarite/diplome/Liste')},
        {path: 'diplome/etudiants', component: load('scolarite/diplome/ListeEtudiants')}
      ] },
    { path: '/etudiant',
      component: load('layout/layoutEtudiant'),
      children: [
        {path: 'configuration', component: load('layout/configuration')},
        {path: 'profil', component: load('Profil')},

        {path: 'accueil', component: load('etudiant/Home')},
        {path: 'plan-de-formation', component: load('etudiant/planformation/planformation')},
        {path: 'mon-cursus', component: load('etudiant/cursus/Informations')},
        {path: 'faire-une-demande', component: load('etudiant/demande/demande')},
        {path: 'notifications', component: load('etudiant/notifications/notifications')}
      ] },
    { path: '/admin',
      component: load('layout/LayoutAdmin'),
      children: [
        { path: 'etablissement', component: load('admin/etablissement/Etablissement') },
        { path: 'etablissement/cards', component: load('admin/etablissement/ListeCards') },
        { path: 'etablissement/tableau', component: load('admin/etablissement/ListeTable') },
        { path: 'etablissement/ajout', component: load('admin/etablissement/Ajout') },
        { path: 'etablissement/modifier', component: load('admin/etablissement/Modifier') },
        { path: 'etablissement/vue-globale', component: load('admin/etablissement/VueGlobale') },
        { path: 'domaine', component: load('admin/domaine/Domaine') },
        { path: 'domaine/cards', component: load('admin/domaine/ListeCards') },
        { path: 'domaine/tableau', component: load('admin/domaine/ListeTable') },
        { path: 'domaine/ajout', component: load('admin/domaine/Ajout') },
        { path: 'domaine/modifier', component: load('admin/domaine/Modifier') },
        { path: 'composant/:code_universite', component: load('admin/composant/Composant') },
        { path: 'composant', component: load('admin/composant/Composant') },
        { path: 'composant/cards', component: load('admin/composant/ListeCards') },
        { path: 'composant/tableau', component: load('admin/composant/ListeTable') },
        { path: 'composant/ajout', component: load('admin/composant/Ajout') },
        { path: 'composant/modifier', component: load('admin/composant/Modifier') },
        { path: 'mention/:code_composant', component: load('admin/mention/Mention') },
        { path: 'mention', component: load('admin/mention/Mention') },
        { path: 'mention/cards', component: load('admin/mention/ListeCards') },
        { path: 'mention/tableau', component: load('admin/mention/ListeTable') },
        { path: 'mention/ajout', component: load('admin/mention/Ajout') },
        { path: 'mention/modifier', component: load('admin/mention/Modifier') },
        { path: 'anneeUniversitaire', component: load('admin/AnneeUniversitaire') },
        { path: 'niveau', component: load('admin/Niveau') },
        { path: 'parcours/:code_mention', component: load('admin/parcours/ListeTable') },
        { path: 'personne/liste', component: load('admin/personne/Liste') },
        { path: 'etudiant/liste', component: load('admin/etudiant/Liste') },
        {path: 'personne/ajout', component: load('utilisateur/Ajout')}
      ]
    },
    { path: '/composant',
      component: load('layout/LayoutComposant'),
      children: [
        { path: 'mention/:code_composant', component: load('composant/mention/Mention') },
        { path: 'mention', component: load('composant/mention/Mention') },
        { path: 'mention/cards', component: load('composant/mention/ListeCards') },
        { path: 'mention/tableau', component: load('composant/mention/ListeTable') },
        { path: 'mention/ajout', component: load('composant/mention/Ajout') },
        { path: 'mention/modifier', component: load('composant/mention/Modifier') },
        { path: 'parametre', component: load('composant/Parametre') },
        { path: 'afficheparametres', component: load('composant/afficheparametres') },
        { path: 'parcours/:code_mention', component: load('composant/parcours/ListeTable') }
      ]
    },
    { path: '/etablissement',
      component: load('layout/LayoutEtablissement'),
      children: [
        { path: 'tableaudebord/:id_universite', component: load('etablissement/tableaudebord/ListeCards') },
        { path: 'composant/:code_universite', component: load('etablissement/composant/Composant') },
        { path: 'composant', component: load('etablissement/composant/Composant') },
        { path: 'composant/cards', component: load('etablissement/composant/ListeCards') },
        { path: 'composant/tableau', component: load('etablissement/composant/ListeTable') },
        { path: 'composant/ajout', component: load('etablissement/composant/Ajout') },
        { path: 'composant/modifier', component: load('etablissement/composant/Modifier') },
        { path: 'anneeUniversitaire', component: load('etablissement/AnneeUniversitaire') },
        { path: 'mention/:', component: load('etablissement/mention/Mention') },
        { path: 'mention', component: load('etablissement/mention/Mention') },
        { path: 'mention/cards', component: load('etablissement/mention/ListeCards') },
        { path: 'mention/tableau', component: load('etablissement/mention/ListeTable') },
        { path: 'mention/ajout', component: load('etablissement/mention/Ajout') },
        { path: 'mention/modifier', component: load('etablissement/mention/Modifier') },
        { path: 'parcours/:code_mention', component: load('etablissement/parcours/ListeTable') }

      ]
    },
    { path: '/parcours',
      component: load('layout/layoutParcours'),
      children: [
        {path: 'plan-de-formation', component: load('parcours/PlanFormation')},
        {path: 'plan-de-formation/ue', component: load('parcours/planFormation/ue')},
        {path: 'plan-de-formation/ue-optionnel', component: load('parcours/planFormation/ue-optionnel')},
        {path: 'plan-de-formation/ec-ue-optionnel/:id_ue_optionnel', component: load('parcours/planFormation/ec-ue-optionnel')},
        // {path: 'attribuer-ec', component: load('parcours/AttribuerEC')},
        {path: 'connexion', component: load('parcours/Connexion')},
        // {path: 'attribuer-ue', component: load('parcours/AttribuerUE')},
        {path: 'atome-pedagogique', component: load('parcours/AtomePedagogique')},
        {path: 'parametres', component: load('parcours/Parametres')},
        {path: 'afficheparametres', component: load('parcours/afficheparametres')},
        {path: 'connexion', component: load('parcours/Connexion')}
      ]
    },
    { path: '/login', component: load('login/Login') },
    { path: '/connect', component: load('login/Connect') },
    {
      path: '/details',
      component: load('etudiant/VoirDetails'),
      children: [
        {path: 'informations', component: load('etudiant/voirDetails/Informations')}
      ]
    },
    // Always leave this last one
    { path: '*', component: load('Error404') } // Not found
  ]
})

router.beforeResolve((to, from, next) => {
  const token = LocalStorage.get.item('auth_token')
  const fonction = LocalStorage.get.item('fonction')
  if (to.path === '/') {
    if (token) {
      return next({path: '/connect', query: {}})
    }
    else return next({path: '/login', query: {}})
  }
  else if (to.path === '/login') {
    if (from.path !== '/') {
      LocalStorage.remove('auth_token')
    }
    else if (token) {
      return next({path: '/connect', query: {}})
    }
  }
  else if (to.path === '/connect') {
    LocalStorage.remove('fonction')
  }
  else if (to.path !== '/') {
    if (!token) {
      let alert = Alert.create({
        enter: 'bounceInRight',
        leave: 'bounceOutRight',
        color: 'red',
        icon: 'warning',
        html: 'Veuillez d\'abord vous connecter s\'il vous plait.',
        position: 'top-right'
      })
      setTimeout(function () {
        alert.dismiss()
      }, 4000)
      return next({path: '/login', query: {}})
    }
    if (!fonction) {
      return next({path: '/connect', query: {}})
    }
  }
  return next()
})

export default router

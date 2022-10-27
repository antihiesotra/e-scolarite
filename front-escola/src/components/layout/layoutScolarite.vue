<template>
  <q-layout
    ref="layout"
    :view="layoutStore.view"
    :left-breakpoint="layoutStore.leftBreakpoint"
    :right-breakpoint="layoutStore.rightBreakpoint"
    :reveal="layoutStore.reveal"
  >
    <q-toolbar color="primary" slot="header" style="padding-top: 0;padding-bottom: 0;">
      <q-btn flat @click="$refs.layout.toggleLeft()">
        <q-icon name="menu" />
      </q-btn>
      <q-item>
        <q-item-side avatar="statics/etablissement/eScola.png" />
      </q-item>
      <q-toolbar-title class="hidden-sm sm-hide hidden-md gt-md">
        eScola
        <span slot="subtitle">Equipe de la scolarité</span>
      </q-toolbar-title>
      <q-btn class="gt-sm" @click="layoutStore.hideTabs = !layoutStore.hideTabs" flat style="margin-right: 15px;padding-right: 10px;">
        <q-icon name="publish" class="on-left" :class="layoutStore.hideTabs ? 'flip-vertical': ''" /> Menu</q-btn>
      <q-btn icon="reply" class="within-iframe-hide gt-sm" flat @click="$router.go(-1)" style="margin-right: 15px;padding-right: 10px;">
        Retour
      </q-btn>
      <q-btn icon="fullscreen" class="within-iframe-hide gt-sm" flat @click="toggleFullscreen()" style="margin-right: 15px;padding-right: 10px;">
        Plein ecran
      </q-btn>
      <q-btn icon="vibration" class="within-iframe-hide gt-sm" flat @click="toggleFullscreen()" style="margin-right: 15px;padding-right: 10px;">
        Notifications
      </q-btn>
      <q-item>
        <q-item-side :avatar="user.photo ? user.photo : 'statics/photovide.png'" />
          <q-item-main class="gt-sm" :label="user.prenom + ' ' + user.nom" />
          <q-popover class="user-options" ref="popover">
            <q-list link>
              <q-item @click="$refs.popover.close()">
                <q-item-side icon="account_circle" />
                <q-item-main label="Mon profil" />
              </q-item>
              <q-item @click="changePost()">
                <q-item-side icon="dns" />
                <q-item-main label="Changer de poste" />
              </q-item>
              <q-item @click="logout()">
                <q-item-side icon="input" />
                <q-item-main label="Se déconnecter" />
              </q-item>
            </q-list>
          </q-popover>
        </q-item-side>
      </q-item>
    </q-toolbar>

    <q-tabs slot="navigation" class="items-center bg-primary" color="primary" v-if="!layoutStore.hideTabs">
      <q-route-tab slot="title" icon="people" to="/scolarite/etudiant" replace label="Etudiant" />
      <q-route-tab slot="title" icon="view_array" to="/scolarite/inscription/administrative" replace label="Inscription" />
      <!--<q-route-tab slot="title" icon="view_array" to="/scolarite/inscription/pedagogique" replace label="Inscription Péd." />-->
      <!--<q-route-tab slot="title" icon="content_paste" to="/scolarite/resultat" replace label="Attestation de réussite" /> -->
      <q-route-tab slot="title" icon="content_paste" to="/scolarite/note" replace label="Note" />
      <q-route-tab slot="title" icon="content_paste" to="/scolarite/resultat" replace label="Résultat" />
      <q-route-tab slot="title" icon="school" to="/scolarite/diplome" replace label="Diplome" />
      <!--q-route-tab slot="title" icon="edit" to="/scolarite/edition" replace label="Edition" /-->
    </q-tabs>

    <q-scroll-area slot="left" class="_navbar"  style="width: 100%; height: 100%">
      <q-list-header>Menu générale</q-list-header>
      <q-side-link item to="/scolarite/accueil">
        <q-item-side icon="home" />
        <q-item-main label="Accueil" sublabel="Menu principale" />
      </q-side-link>
      <q-side-link item to="/scolarite/etudiant">
        <q-item-side icon="people" />
        <q-item-main label="Etudiant" sublabel="Recherche" />
      </q-side-link>
      <!--<q-side-link item to="/scolarite/inscription/administrative">-->
        <!--<q-item-side icon="assignment" />-->
        <!--<q-item-main label="Inscription Administrative" sublabel="Inscription dans un composant" />-->
      <!--</q-side-link>-->
      <q-side-link item to="/scolarite/inscription">
        <q-item-side icon="assignment" />
        <q-item-main label="Inscription" sublabel="Entrée" />
      </q-side-link>
      <q-side-link item to="/scolarite/bourse">
        <q-item-side icon="map" />
        <q-item-main label="Bourse" sublabel="Bourse des étudiant" />
      </q-side-link>
      <q-side-link item to="/scolarite/note">
        <q-item-side icon="content_paste" />
        <q-item-main label="Note" sublabel="Faciliter l'insertion des notes" />
      </q-side-link>
      <q-side-link item to="/scolarite/releve">
        <q-item-side icon="print" />
        <q-item-main label="Impression" sublabel="Sortie" />
      </q-side-link>
      <!--q-side-link item to="/scolarite/resultat">
        <q-item-side icon="visibility" />
        <q-item-main label="Resultat" sublabel="Affichage simple et efficace des résultats" />
      </q-side-link-->
      <q-list>
        <q-collapsible icon="visibility" label="Resultat">
            <div>
                <q-side-link item to="/scolarite/resultat">
                  <q-item-side icon="list" />
                  <q-item-main label="Semestrielle" sublabel="Affichage simple et efficace des résultats semestrielle" />
                </q-side-link>
                <q-side-link item to="/scolarite/resultatparniveau">
                  <q-item-side icon="list" />
                  <q-item-main label="Par niveau" sublabel="Affichage simple et efficace des résultats par niveau" />
                </q-side-link>
            </div>
        </q-collapsible>
      </q-list>
      <q-side-link item to="/scolarite/diplome">
        <q-item-side icon="school" />
        <q-item-main label="Diplôme" sublabel="Imprimer un diplôme" />
      </q-side-link>
      <q-side-link v-if="false" item to="/scolarite/bacc">
        <q-item-side icon="school" />
        <q-item-main label="Bacc" sublabel="Vérifier le bacc" />
      </q-side-link>
      <q-collapsible v-if="false" icon="settings" label="Parametre" sublabel="Parametre de l'application">
        <div>
          Ceci est un paramètre ...
        </div>
      </q-collapsible>



      <div v-if="layoutStore.leftScroll" style="padding: 25px 16px 16px;">
        <p class="caption" v-for="n in 50" :key="n">
          <em>Left Panel has intended scroll</em>
        </p>
      </div>
    </q-scroll-area>

    <!--<q-scroll-area slot="right" style="width: 100%; height: 100%">
      <q-list-header>Right Panel</q-list-header>
      <div v-if="layoutStore.rightScroll" style="padding: 25px 16px 16px;">
        <p class="caption" v-for="n in 50">
          <em>Right Panel has intended scroll</em>
        </p>
      </div>
    </q-scroll-area>-->

    <q-transition enter="fadeIn" leave="fadeOut" mode="out-in" :duration="300" @leave="resetScroll">
      <router-view />
    </q-transition>

    <q-toolbar color="primary" class="" slot="footer">
      <q-toolbar-title>
        <div style="font-size: 15px;" class="text-italic"> Copyright © eScola Team - 2019 - </div>
      </q-toolbar-title>
    </q-toolbar>
  </q-layout>
</template>

<script>
import {
  QLayout,
  QToolbar,
  QToolbarTitle,
  QSearch,
  QTabs,
  QRouteTab,
  QBtn,
  QIcon,
  QItem,
  QItemSide,
  QItemMain,
  QSideLink,
  QListHeader,
  QScrollArea,
  QCollapsible,
  QPopover,
  QList,
  AppFullscreen,
  QTransition,
  LocalStorage
} from 'quasar'

import layoutStore from './layout-store'

export default {
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QSearch,
    QTabs,
    QRouteTab,
    QBtn,
    QIcon,
    QItem,
    QItemSide,
    QItemMain,
    QSideLink,
    QListHeader,
    QScrollArea,
    QPopover,
    QList,
    QCollapsible,
    QTransition
  },
  data () {
    return {
      layoutStore,
      user: {
        fullname: ''
      }
    }
  },
  methods: {
    toggleFullscreen () {
      AppFullscreen.toggle()
    },
    changePost () {
      this.$router.push('/connect')
    },
    resetScroll (el, done) {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      done()
    },
    logout () {
      LocalStorage.remove('user')
      this.$router.push('/login')
    }
  },
  mounted () {
    this.$store.dispatch('getCurrentUser')
      .then((user) => {
        this.user = user
        if (!user.photo) this.user.photo = '/statics/photovide.png'
      })
  }
}
</script>
<style lang="stylus">
  @import '~variables'

  .q-item.active, .q-item.router-link-active, .q-item:focus
    color $primary
    .q-item-side
      color $primary
    .q-item-main .q-item-sublabel
      font-style italic

  ._no-padding
    padding 0 !important

  ._modal-content
    padding 15px 70px
    border-bottom 1px solid whitesmoke

  ._navbar
    .q-item.active, .q-item.router-link-active, .q-item:focus
      border-right 2px solid $primary

  @media only screen and (max-width: 500px) {
    ._modal-content {
      padding: 10px 10px;
      border-bottom: 1px solid whitesmoke;
    }
  }
</style>

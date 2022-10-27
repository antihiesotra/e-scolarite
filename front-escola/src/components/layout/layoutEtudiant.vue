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
              <q-item @click="$router.go('Profil.vue')">
                <q-item-side icon="account_circle" />
                <q-item-main label="Mon profil" />
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
      <q-route-tab slot="title" icon="school" to="/etudiant/accueil" replace label="Accueil" />
      <q-route-tab slot="title" icon="dashboard" to="/etudiant/plan-de-formation" replace label="Plan de Formation" />
      <q-route-tab slot="title" icon="view_array" to="/etudiant/mon-cursus" replace label="Mon cursus" />
      <q-route-tab slot="title" icon="content_paste" to="/etudiant/faire-une-demande" replace label="Demande" />
      <q-route-tab slot="title" icon="notifications" to="/etudiant/notifications" replace label="Notifications" />
    </q-tabs>

    <q-scroll-area slot="left" class="_navbar"  style="width: 100%; height: 100%">
      <q-list-header>Menu générale</q-list-header>
      <q-side-link item to="/etudiant/accueil">
        <q-item-side icon="home" />
        <q-item-main label="Accueil" sublabel="Guide" />
      </q-side-link>
      <q-side-link item to="/etudiant/plan-de-formation">
        <q-item-side icon="dashboard" />
        <q-item-main label="Plan de Formation" sublabel="Voir les details" />
      </q-side-link>
      <q-side-link item to="/etudiant/mon-cursus">
        <q-item-side icon="assignment" />
        <q-item-main label="Mon cursus" sublabel="Voir les details" />
      </q-side-link>
      <q-side-link item to="/etudiant/faire-une-demande">
        <q-item-side icon="content_paste" />
        <q-item-main label="Demande" sublabel="Faire une demande" />
      </q-side-link>
      <q-side-link item to="/etudiant/notifications">
        <q-item-side icon="notifications" />
        <q-item-main label="Notifications" sublabel="Messages" />
      </q-side-link>
      <div v-if="layoutStore.leftScroll" style="padding: 25px 16px 16px;">
        <p class="caption" v-for="n in 50" :key="n">
          <em>Left Panel has intended scroll</em>
        </p>
      </div>
    </q-scroll-area>

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

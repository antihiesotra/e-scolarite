<template>
  <q-layout
    ref="layout"
    :view="layoutStore.view"
    :left-breakpoint="layoutStore.leftBreakpoint"
    :right-breakpoint="layoutStore.rightBreakpoint"
    :reveal="layoutStore.reveal"
  >
    <q-toolbar slot="header" style="padding-top: 0;padding-bottom: 0;">
      <q-btn flat @click="$refs.layout.toggleLeft()">
        <q-icon name="menu" />
      </q-btn>
      <q-item>
        <q-item-side avatar="statics/etablissement/eScola.png" />
      </q-item>
      <q-toolbar-title>
        eScola
        <span slot="subtitle">Enseignant</span>
      </q-toolbar-title>
      <q-btn class="gt-sm" @click="layoutStore.hideTabs = !layoutStore.hideTabs" flat style="margin-right: 15px;padding-right: 10px;">
        <q-icon name="publish" class="on-left" :class="layoutStore.hideTabs ? 'flip-vertical': ''" /> Menu</q-btn>
      <q-btn icon="reply" class="within-iframe-hide gt-sm" flat @click="$router.go(-1)" style="margin-right: 15px;padding-right: 10px;">
        Retour
      </q-btn>
      <q-btn icon="fullscreen" class="within-iframe-hide gt-sm" flat @click="toggleFullscreen()" style="margin-right: 15px;padding-right: 10px;">
        Plein ecran
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
      </q-item>
      <!--<q-btn class="" flat @click="$refs.layout.toggleRight()">
        <q-icon name="menu" />
      </q-btn>-->
    </q-toolbar>

    <q-tabs slot="navigation" class="items-center bg-primary" color="primary" v-if="!layoutStore.hideTabs">
      <q-route-tab slot="title" icon="people" to="/enseignant/notes" replace label="Notes" />
    </q-tabs>

    <q-scroll-area slot="left" class="_navbar"  style="width: 100%; height: 100%">
      <q-list-header>Menu générale</q-list-header>
      <q-side-link item to="/enseignant/notes" style="height: 60px">
        <q-item-side icon="assignment" />
        <q-item-main label="Notes" sublabel="" />
      </q-side-link>


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
    <router-view />

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
    QTransition
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
      logout () {
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

  ._navbar
    .q-item.active, .q-item.router-link-active, .q-item:focus
      border-right 2px solid $primary
    .q-item-link
      padding-left:0
      .q-item-side-left
        display: flex
        align-items: center
        justify-content: center
</style>

<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div class="layout-padding _page-connect Login" style="height: 100vh;">
    <!-- your content -->
    <!--<div id="logo" class="">
      &lt;!&ndash;<img class="gt-md" src="statics/logo.png"/>&ndash;&gt;
      <h3 style="position: fixed;padding-top: 0;margin-top: 0;font-weight: bold;">eScola</h3>
    </div>-->
    <div class="row">
      <div class="col-sm-5 gt-sm flex-center flex" >
        <div style="" class="">
          <img style="width:100%; opacity: 0.9;" src="statics/background.png"/>
          <div class="text-grey text-italic">
            Bienvenue sur Escola, la plateforme pour la gestion de scolarité de l'Université de Madagascar
          </div>
        </div>
      </div>
      <div class="col-sm-7 " style="z-index: 1;padding-top: 20px;">
        <div class="row justify-center ">
          <q-card class="col-sm-12 bg-white" style="max-width: 425px;">
            <q-card-main>
              <div class="old-user">
                <div class="row flex flex-center">
                  <div class="col-sm-6 flex flex-center">
                    <img style="width: auto;height: 100px;" src="/statics/logo/escola.png"/>
                  </div>
                </div>
                <div class=" text-italic text-grey flex flex-center" :data-show="user.fullname ? 'on' : 'off'">
                  eScola<br>
                </div>
              </div>
              <br/>
              <h6 class="get-connect flex flex-center">
                Veuillez vous connecter
              </h6>
            </q-card-main>
            <q-card-main style="padding-top: 0;">
              <q-input v-model="user.email" type="email" float-label="Email" clearable/>
              <br/>
              <q-input v-model="user.password" type="password" float-label="Password" @keyup.enter="handleConnect()"/>
              <br/>
              <q-btn push class="shadow-0" style="width: 100%; height: 48px;" @click="handleConnect()" rounded color="primary">Se connecter</q-btn>
              <br/>
              <br/>
              <br/>
              <div class="row ">
                <q-checkbox color="primary" v-model="remind" label="Rester connecté(e)"/>
              </div><br/><br/>
              <div class="row">
                <!--div class="col-sm-6">
                  <a href="#" @click="changerPoste" class="text-italic">Changer de poste</a>
                </div-->
                <div class="col-sm-12 text-right">
                  <a href="#">Besoin d'aide ?</a>
                </div>
              </div>
            </q-card-main>
            <q-card-actions style="padding-bottom:15px;" align="around">
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    QCard,
    QCardMedia,
    QCardTitle,
    QCardSeparator,
    QCardMain,
    QCardActions,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
    QBtn,
    QInput,
    QCheckbox,
    QModal,
    QModalLayout,
    QIcon,
    Alert
  } from 'quasar'

  export default {
    components: {
      QCard,
      QCardMedia,
      QCardTitle,
      QCardSeparator,
      QCardMain,
      QCardActions,
      QItem,
      QItemSide,
      QItemMain,
      QItemTile,
      QBtn,
      QInput,
      QCheckbox,
      QModal,
      QModalLayout,
      QIcon
    },
    data () {
      return {
        remind: '',
        choiceModal: false,
        user: {
          email: '',
          password: ''
        }
      }
    },
    methods: {
      handleConnect () {
        this.$store.dispatch('signIn', this.user)
          .then((response) => {
            if (response.status === 'OK') {
              this.$store.dispatch('setStorageUserAndToken', response.data)
                .then((d) => {
                  this.$router.push('/connect')
                })
                .catch((error) => {
                  console.log('-- ERROR setStorageToken Login.vue', error)
                })
            }
            else {
              let alert = Alert.create({
                enter: 'bounceInRight',
                leave: 'bounceOutRight',
                color: 'red',
                icon: 'warning',
                html: response.message,
                position: 'top-right'
              })
              setTimeout(function () {
                alert.dismiss()
              }, 4000)
            }
          })
          .catch((error) => {
            console.log('-- ERROR methods handleConnect Login.vue', error)
            this.$alert.error('Echec de la connexion au serveur')
          })
      }
    },
    mounted () {
      this.$store.dispatch('getCurrentUser')
        .then((lastUser) => {
          if (lastUser) {
            this.user.email = lastUser.email
          }
        })
        .catch((error) => {
          console.log('-- ERROR getCurrentUser, mounted Login.vue --', error)
        })
    }
  }
</script>

<style lang="stylus">
  .Login
    .old-user
      text-align: center
    [data-show='off']
      display: none
    .get-connect
      color: #333
    ._page-connect .q-option-label
      font-style italic
      color gray

    ._page-connect #logo
      position: absolute;
      margin: 10px;
      top: 10px;
      left: 20px;
      img
        width: 150px;

    ._no-padding
      padding 0 !important

    ._modal-content
      padding 15px 70px
      border-bottom: 0

    ._choiceModal
      .layout-header
        box-shadow none

    .layout-footer
      box-shadow none
      border-top 1px solid lightgrey

  @media only screen and (max-width: 500px) {
  
  .Login ._modal-content {
      padding: 10px 10px;
    }
  }
  .Login ._button-row
    img
      width 100px
      height 100px
      margin-bottom 15px
    .showcase-top
      margin-bottom 35px
      .q-alert
        max-width 500px
    .card
      cursor pointer
      position relative
      padding 16px
      .q-icon
        font-size 56px
      p
        color rgba(0, 0, 0, .87)
        margin 15px 0 0 0 !important
      &:before
        content ''
        position absolute
        top 0
        right 0
        bottom 0
        left 0
        border-radius 2px
        opacity 0
        transition opacity .2s
        background currentColor
      &:hover:before
        opacity .4
</style>

<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div class="layout-padding _page-connect Connect" style="height: 100vh;">
    <div class="ConnectHead">
      <div class="row flex flex-center">
        <div class="col-sm-6 flex flex-center">
          <div :style="'background-image:url(' + user.photo + ')'" class="avatar"></div>
        </div>
      </div>
      <div>Choisissez votre fonction pour cette session</div>
      <div>{{user.nom}} {{user.prenom}}</div>
    </div>
    <div class="ConnectBody flex-center row layout-padding">
      <q-card class="fonction col-sm-4" v-for="fonction in fonctions" @click="go(fonction)" :key="fonction.id">
        <q-item>
          <q-item-side :avatar="getView(fonction).pd" class="" />
            <q-item-main class="" :label="getView(fonction).title" :sublabel="getView(fonction).txt"/>
          <q-item-side :avatar="getView(fonction).pg" class="" right />
        </q-item>
      </q-card>
    </div>
    <div class="connexion" @click="toLogin()">Se connecter à un autre compte</div>
  </div>
</template>

<script>
  import {
    QLayout,
    QCard,
    QCardMedia,
    QCardTitle,
    QCardSeparator,
    QCardMain,
    QSelect,
    QCardActions,
    QBtn,
    QFixedPosition,
    QItem,
    QItemSide,
    QItemMain,
    Alert
  } from 'quasar'

  import { mapGetters } from 'vuex'

  export default {
    components: {
      QLayout,
      QCard,
      QCardMedia,
      QCardTitle,
      QCardSeparator,
      QCardMain,
      QSelect,
      QCardActions,
      QBtn,
      QFixedPosition,
      QItem,
      QItemSide,
      QItemMain
    },
    data () {
      return {
        fonctions: [],
        user: {}
      }
    },
    computed: {
      ...mapGetters({
        changePost: 'changePost'
      })
    },
    mounted () {
      // Fonction pour autofill de la photo
      this.$store.dispatch('getCurrentUser')
        .then((user) => {
          this.user = user
          if (!user.photo) this.user.photo = '/statics/photovide.png'
          this.$store.dispatch('checkToken')
            .then((token) => {
              if (!token) {
                this.$router.push('/login')
              }
              else {
                this.$store.dispatch('getFonctions')
                  .then((fonctions) => {
                    this.fonctions = fonctions
                  })
                  .catch(() => {
                    this.toLogin()
                  })
              }
            })
        })
        .catch(() => {
          this.toLogin()
        })
    },
    methods: {
      getView (fonction) {
        const vars = fonction.vars
        let view = {}
        switch (fonction.role.name) {
          case 'resp_ec': {
            view.title = 'Responsable de ' + vars.ec.libelle
            view.pd = vars.etablissement.photo
            view.pg = vars.composant.photo
            view.txt = vars.composant.libelle
            break
          }
          case 'enseignant': {
            view.title = 'Professeur de ' + vars.ec.libelle
            view.pd = vars.etablissement.photo
            view.pg = vars.composant.photo
            view.txt = vars.composant.libelle + '<br>' + vars.ue.anneeUniversitaire.code + ' (' + vars.ue.semestre.code + ')'
            console.log(vars)
            break
          }
          case 'resp_ue': {
            view.title = 'Responsable de l\'UE ' + vars.ue.libelle
            view.pd = vars.etablissement.photo
            view.pg = vars.composant.photo
            view.txt = vars.composant.libelle
            break
          }
          case 'resp_parcours': {
            view.title = 'Responsable du parcours ' + vars.parcours.libelle
            view.pd = vars.etablissement.photo
            view.pg = vars.composant.photo
            view.txt = vars.composant.libelle
            break
          }
          case 'chef_mention': {
            view.title = 'Chef de la Mention ' + vars.mention.libelle
            view.pd = vars.etablissement.photo
            view.pg = vars.composant.photo
            view.txt = vars.composant.libelle
            break
          }
          case 'resp_composant': {
            view.title = 'Responsable du Composant ' + vars.composant.libelle
            view.pd = vars.etablissement.photo
            view.pg = vars.composant.photo
            view.txt = vars.composant.libelle
            break
          }
          case 'resp_scolarite': {
            view.title = 'Chef de Scolarité - ' + vars.composant.libelle
            view.pd = vars.etablissement.photo
            view.pg = vars.composant.photo
            view.txt = vars.composant.libelle
            break
          }
          case 'resp_domaine': {
            view.title = 'Responsable du domaine ' + vars.domaine.libelle
            view.pd = vars.domaine.photo ? vars.domaine.photo : 'statics/domainevide.png'
            view.pg = this.user.photo ? this.user.photo : '/statics/photovide.png'
            break
          }
          case 'resp_etablissement': {
            view.title = 'Responsable de l\'' + vars.etablissement.libelle
            view.pd = vars.etablissement.photo
            view.pg = null
            break
          }
          case 'admin': {
            view.title = '<br>Administrateur'
            view.pd = this.user.photo ? this.user.photo : '/statics/photovide.png'
            view.pg = null
            break
          }
          case 'student': {
            view.title = '<br>Etudiant'
            view.pd = this.user.photo ? this.user.photo : '/statics/photovide.png'
            view.pg = null
            break
          }
        }

        return view
      },
      toLogin () {
        this.$router.push('login')
      },
      go (fonction) {
        this.$store.dispatch('saveFonction', fonction)
          .then((fonction) => {
            let composant, etablissement, mention
            if (fonction.vars) {
              composant = fonction.vars.composant
              etablissement = fonction.vars.etablissement
              mention = fonction.vars.mention
            }
            switch (fonction.role.name) {
              case 'resp_composant': {
                this.$router.push('composant/mention/' + composant.code)
                break
              }
              case 'resp_scolarite': {
                this.$router.push('scolarite/accueil')
                break
              }
              case 'chef_mention': {
                this.$router.push('mention/parcours/' + mention.id)
                break
              }
              case 'resp_parcours': {
                this.$router.push('parcours/plan-de-formation')
                break
              }
              case 'enseignant': {
                this.$router.push('enseignant/notes')
                break
              }
              case 'resp_etablissement': {
                this.$router.push('etablissement/tableaudebord/' + etablissement.id)
                break
              }
              case 'admin': {
                this.$router.push('admin/etablissement')
                break
              }
              case 'student': {
                this.$router.push('etudiant/accueil')
                break
              }
              default: {
                let alert = Alert.create({
                  enter: 'bounceInRight',
                  leave: 'bounceOutRight',
                  color: 'blue',
                  icon: 'warning',
                  html: 'Pas de prise en charge par eScola pour le moment',
                  position: 'top-right'
                })
                setTimeout(function () {
                  alert.dismiss()
                }, 4000)
              }
            }
          })
      }
    }
  }
</script>
<style>
  .Connect{
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .ConnectHead{
    padding: 2em 1em;
    padding-bottom: 0;
    text-align: center;
    color: gray;
  }
  .ConnectBody{
    margin: 0;
  }
  .Connect .q-card{
    cursor: pointer;
    position: relative;
    overflow: hidden;
    padding: 0 .5em;
  }
  .Connect .q-card:after{
    content: '';
    background: #6bf;
    width: 0;
    height: 2px;
    position: absolute;
    bottom: 0;
    right: 0;
    transition: width .5s ease;
  }
  .Connect .q-card:hover:after{
    left: 0;
    width: 100%;
  }
  .Connect .q-card>.q-item{
      padding:0;
  }
  .Connect .q-card .q-item-main{
      padding:.5em;
      margin: 0;
      min-height: 80px;
  }
  .Connect .q-item-avatar,.Connect .q-item-side.q-item-side-left.q-item-section {
    min-width: 60px;
    max-width: 60px;
    min-height: 60px;
    max-height: 60px;
  }
  .Connect .connexion{
    cursor: pointer;
    position: fixed;
    font-size: .9em;
    right: 1em;
    bottom: .5em;
    padding: .5em;
    color: dodgerblue;
  }
  .Connect .connexion:hover{
    text-decoration: underline;
  }
  .Connect .fonction{
    user-select: none;
  }
  .Connect .avatar{
    width: 100px;
    height: 100px;
    background-size: cover;
    background-position: center;
    border-radius: 100%;
  }
</style>

<template>
  <div class="_voir-details" v-if="this.infoEtudiant.etudiant">
    <q-toolbar color="" class="shadow-0" style="border-bottom: 1px solid ghostwhite;padding-top: 0;padding-bottom: 0;">
      <!--<q-btn flat @click="$refs.layout.toggleLeft()">
        <q-icon name="account_circle" />
      </q-btn>-->
      <q-item>
        <q-item-side avatar="statics/etablissement/fianarantsoa.png" />
      </q-item>
      <q-toolbar-title>
        <div v-if="infoEtudiant.etudiant !== undefined">
          {{ this.infoEtudiant.etudiant.idPersonne.nom | capitalize }} {{ this.infoEtudiant.etudiant.idPersonne.prenom | capitalizeFirst }}
        </div>
        <span slot="subtitle">Details de l' étudiant</span>
      </q-toolbar-title>

      <q-btn color="" icon="close" class="within-iframe-hide" flat @click="closeThisModal()" style="margin-right: 15px;padding-right: 10px;">
        Fermer
      </q-btn>
      <!--<q-btn class="" flat @click="$refs.layout.toggleRight()">
        <q-icon name="menu" />
      </q-btn>-->
    </q-toolbar>
    <div class="row layout-padding">
      <div class="col-sm-12 col-md-2" style="padding-top: 0;">
        <q-card class="shadow-6" style="margin-top: 0;padding-bottom: 0;margin-bottom: 0;font-size: 0;">
          <img class="responsive" :src="infoEtudiant.etudiant.idPersonne.photo ? infoEtudiant.etudiant.idPersonne.photo : 'statics/photovide.png'" style="border: 2px solid #efefef;width: 100%;"/>
        </q-card>
        <div><br/>
        <div>
          <q-item v-ripple @click="toogleDetails(0)" class="" :class="{'active' : details[0]}">
            <q-item-side icon="content_paste" class="" />
            <q-item-main label="Informations" sublabel="Informations sur l'étudiant" />
          </q-item>
          <q-item v-ripple @click="toogleDetails(1)" :class="{'active' : details[1]}">
            <q-item-side icon="school" />
            <q-item-main label="Cursus" sublabel="Cursus universitaire de l'étudiant" />
          </q-item>
          <q-item v-ripple @click="toogleDetails(2)" :class="{'active': details[2]}">
            <q-item-side icon="warning" />
            <q-item-main label="Sanction" sublabel="Les sanctions reçues par l'étudiant" />
          </q-item>
        </div>
        </div>
      </div>
      <div class="col-sm-12 col-md " style="margin-top: 0;">
        <informations :infoEtudiant="infoEtudiant" v-if="details[0]"></informations>
        <cursus :infoEtudiant="infoEtudiant" v-if="details[1]"></cursus>
        <sanction v-if="details[2]"></sanction>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QTabs,
    QRouteTab,
    QCard,
    QCardTitle,
    QCardMain,
    QCardSeparator,
    QSideLink,
    QItem,
    QItemMain,
    QItemSide,
    QList,
    Ripple
  } from 'quasar'

  import informations from './voirDetails/Informations.vue'
  import cursus from './voirDetails/Cursus.vue'
  import sanction from './voirDetails/Sanction.vue'

  export default {
    directives: {
      Ripple
    },
    components: {
      QLayout,
      QToolbar,
      QToolbarTitle,
      QBtn,
      QIcon,
      QTabs,
      QRouteTab,
      QCard,
      QCardTitle,
      QCardMain,
      QCardSeparator,
      QSideLink,
      QItem,
      QItemMain,
      QItemSide,
      QList,
      informations,
      cursus,
      sanction
    },
    data () {
      return {
        details: [true, false, false],
        infoEtudiant: {}
      }
    },
    props: {
      etudiantDetails: ''
    },
    watch: {
      etudiantDetails: function (newVal, oldVal) {
        this.infoEtudiant = newVal
      }
    },
    methods: {
      closeThisModal () {
        this.$emit('close')
      },
      toogleDetails (menu) {
        this.details = [false, false, false]
        this.details[menu] = true
      }
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

  ._voir-details
    .q-item.active, .q-item.router-link-active, .q-item:focus
      border-left 2px solid $primary

  .q-item
    cursor pointer
</style>

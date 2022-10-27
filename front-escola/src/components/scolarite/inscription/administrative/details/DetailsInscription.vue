<template>
  <div class="_voir-details" v-if="infoEtudiant.idPersonne !== undefined">
    <q-toolbar color="" class="shadow-0" style="border-bottom: 1px solid ghostwhite;padding-top: 0;padding-bottom: 0;">
      <!--<q-btn flat @click="$refs.layout.toggleLeft()">
        <q-icon name="account_circle" />
      </q-btn>-->
      <q-item>
        <q-item-side avatar="statics/etablissement/fianarantsoa.png" />
      </q-item>
      <q-toolbar-title>
        {{ this.infoEtudiant.idPersonne.nom | capitalize }} {{ this.infoEtudiant.idPersonne.prenom | capitalizeFirst }}
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
      <div class="row">
        <div class="col-sm-12 col-md-4">
          <q-card >
            <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
              Photo
            </q-card-title>
            <q-card-separator />
            <q-card-main style="margin-top: 0; padding: 20px 50px;">
              <div class="_image-upload">
                <div v-ripple="" style="overflow: hidden;cursor: pointer;padding-bottom: 0;margin-bottom: 0;font-size: 0;width: 100%;" class="relative-position flex flex-center items-center">
                  <label>
                    <img class="responsive" :src="this.infoEtudiant.idPersonne.urlPhoto" />
                  </label>
                </div>
              </div>
            </q-card-main>
          </q-card>
          <q-card style="margin-top: 0;">
            <q-card-title>
              <div class="col-8">
                Informations
              </div>
            </q-card-title>
            <q-card-separator></q-card-separator>
            <q-card-main class="row">
              <div class="col-6 text-primary">Nom:</div> {{ this.infoEtudiant.idPersonne.nom | capitalize }}
              <div class="col-6 text-primary">Prénoms:</div> <div class="col-6">{{ this.infoEtudiant.idPersonne.prenom | capitalizeFirst }}</div>
              <div class="col-6"></div><div class="col-6">{{ this.infoEtudiant.idPersonne.sexe | capitalizeFirst }}</div>
              <div class="col-6 text-primary">Adresse:</div> <div class="col-6">{{ this.infoEtudiant.idPersonne.adresse }}</div> <br />
              <div class="col-6 text-primary">Adresse e-mail:</div> {{ this.infoEtudiant.idPersonne.email }} <br />
              <div class="col-6 text-primary">Contact:</div> {{ this.infoEtudiant.idPersonne.tel}} <br />
              <div class="col-6 text-primary">Situation matrimoniale:</div> {{ this.infoEtudiant.idPersonne.situation | capitalizeFirst }} <br /><br />
            </q-card-main>
          </q-card>
        </div>
        <div class="col-sm-12 col-md-4 " >
          <q-card>
            <q-card-title class="">Naissance</q-card-title>
            <q-card-separator></q-card-separator>
            <q-card-main class="row">
              <div class="col-6 text-primary ">Date de naissance: </div>{{ this.infoEtudiant.idPersonne.dateNais | dateFormat }} <br />
              <div class="col-6 text-primary ">Lieu de naissance: </div> {{ this.infoEtudiant.idPersonne.lieuNais | capitalizeFirst }}<br />
              <div class="col-6 text-primary ">Nationalité: </div> {{ this.infoEtudiant.idPersonne.nationalite | capitalizeFirst }}<br />
              <div class="col-6 text-primary ">  Pays d'orignine: </div>{{ this.infoEtudiant.idPersonne.pays | capitalizeFirst }}  <br /><br />
            </q-card-main>
          </q-card>
          <q-card>
            <q-card-title class="">Carte d'identité / Passeport</q-card-title><q-card-separator></q-card-separator>
            <q-card-main class="row">
              <div class="col-6 text-primary ">Numéro CIN:</div> <div class="col-6">{{ this.infoEtudiant.idPersonne.cin }}</div>
              <div class="col-6 text-primary ">Fait à :</div> <div>{{ this.infoEtudiant.idPersonne.lieuCin }}</div> <br />
              <div class="col-6 text-primary ">Fait le :</div> <div>{{ this.infoEtudiant.idPersonne.dateCin | dateFormat }}</div> <br />
              <div class="col-6 text-primary ">Date duplicata :</div> <div>{{ this.infoEtudiant.idPersonne.duplicataCin | dateFormat }}</div> <br />
            </q-card-main>
          </q-card>
        </div>
        <div class="col-sm-12 col-md-4 " >
          <q-card style="margin-top: 0;">
            <q-card-title class="">
              Famille
              <span slot="subtitle">Situation sociale, père, mère, tuteur</span>
            </q-card-title><q-card-separator></q-card-separator>
            <q-card-main class="row">
              <div v-for="parent in this.infoEtudiant.idPersonne.parentCollection">
                <div v-if="parent.role === 'père'" class="row">
                  <div class="col-6 text-primary ">Nom du père: </div><div class="col-6">{{ parent.nom }}</div>
                  <div class="col-6 text-primary ">Profession du père: </div> <div class="col-6">{{ parent.profession }}</div>
                  <br><br>
                </div>
                <div v-if="parent.role === 'mère'" class="row">
                  <div class="col-6 text-primary ">Nom de la mère: </div><div class="col-6">{{ parent.nom }}</div>
                  <div class="col-6 text-primary ">Profession de la mère: </div> <div class="col-6">{{ parent.profession }}</div>
                  <div class="col-6 text-primary ">Téléphone des parents: </div> <div class="col-6">{{ parent.tel }}</div>
                  <div class="col-6 text-primary ">Adresse des parents: </div> <div class="col-6">{{ parent.adresse }}</div>
                  <br><br>
                </div>
                <div v-if="parent.role === 'tuteur'" class="row">
                  <div class="col-6 text-primary ">Nom du tuteur: </div><div class="col-6">{{ parent.nom }}</div>
                  <div class="col-6 text-primary ">Profession du tuteur: </div> <div class="col-6">{{ parent.profession }}</div>
                  <div class="col-6 text-primary ">Téléphone du tuteur: </div> <div class="col-6">{{ parent.tel }}</div>
                  <div class="col-6 text-primary ">Adresse du tuteur: </div> <div class="col-6">{{ parent.adresse }}</div>
                  <br><br>
                </div>
              </div>
              <div class="col-6 text-primary "> Nombre de frères:</div>   {{ this.infoEtudiant.idPersonne.nbFrere }} <br />
              <div class="col-6 text-primary ">Nombre de soeurs:</div>   {{ this.infoEtudiant.idPersonne.nbSoeur }} <br /><br />
            </q-card-main>
          </q-card>
          <q-card style="margin-top: 0;">
            <q-card-title class=" ">
              Baccalauréat
              <span slot="subtitle">Informations concernant le baccalauréat de l'étudiant</span>
            </q-card-title><q-card-separator></q-card-separator>
            <q-card-main class="row">
              <div class="col-6 text-primary ">Numéro au Bacc:</div> {{ this.infoEtudiant.idPersonne.infoBaccCollection[0].numBacc }} <br />
              <div class="col-6 text-primary">Obtenu en :</div> {{ this.infoEtudiant.idPersonne.infoBaccCollection[0].annee }} <br />
              <div class="col-6 text-primary">Province :</div> {{ this.infoEtudiant.idPersonne.infoBaccCollection[0].province | capitalize }} <br />
              <div class="col-6 text-primary">Lycée:</div> {{ this.infoEtudiant.idPersonne.infoBaccCollection[0].lycee | capitalizeFirst }}  <br />
              <div class="col-6 text-primary">Série:</div> {{ this.infoEtudiant.idPersonne.infoBaccCollection[0].serie | capitalize }} <br />
            </q-card-main>
          </q-card>
        </div>
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
      QList
    },
    data () {
      return {
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

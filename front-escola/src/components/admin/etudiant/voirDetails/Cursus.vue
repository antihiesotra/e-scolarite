<template>
  <div class="row" style="">
    <div class="layout-padding text-italic text-grey" v-if="false">
      L'étudiant ne s'est pas encore inscrit dans une unité de formation
    </div>
    <div class="col-sm-4">
      <q-scroll-area style="width: 100%; height: 85vh">
        <template v-for="etudiant in etudiants">
          <q-card v-bind:key="etudiant.id" style="margin-top: 0;">
            <q-card-title>
              <!--Année universitaire ?-->
              <span slot="subtitle">{{ etudiant.etablissement.libelle}} - {{etudiant.idComposant.libelle}}</span>
            </q-card-title>
            <q-card-separator/>
            <q-card-main class="row">
              <div class="col-sm-6">
                <img style="width: 100%;" :src="etudiant.etablissement.photo"/>
              </div>
              <div class="col-sm-6">
                <img style="width: 100%;" :src="etudiant.idComposant.photo"/>
              </div>
            </q-card-main>
            <q-card-actions style="padding-top: 5px; padding-bottom: 5px;">
              <q-btn color="primary" @click="afficherDetails(etudiant.id)" flat>voir details</q-btn>
            </q-card-actions>
          </q-card>
        </template>
        <!--<q-card style="margin-top: 0;">
          <q-card-title>
            Année universitaire 2013 - 2014
            <span slot="subtitle">Université de Fianarantsoa - Faculté de droit et des sciences sociales de développement</span>
          </q-card-title>
          <q-card-separator/>
          <q-card-main class="row">
            <div class="col-sm-6">
              <img style="width: 100%;" src="statics/etablissement/antananarivo.png"/>
            </div>
            <div class="col-sm-6">
              <img style="width: 100%;" src="statics/composant/degs.png"/>
            </div>
          </q-card-main>
          <q-card-actions style="padding-top: 5px; padding-bottom: 5px;">
            <q-btn color="primary" @click="afficherDetails" flat>voir details</q-btn>
          </q-card-actions>
        </q-card>
        <q-card style="margin-top: 0;">
          <q-card-title>
            Année universitaire 2013 - 2014
            <span slot="subtitle">Université de Fianarantsoa - Ecole Nationale d'informatique</span>
          </q-card-title>
          <q-card-separator/>
          <q-card-main class="row">
            <div class="col-sm-6">
              <img style="width: 100%;" src="statics/logo/fianarantsoa.png"/>
            </div>
            <div class="col-sm-6">
              <img style="width: 100%;" src="statics/composant/eni.png"/>
            </div>
          </q-card-main>
          <q-card-actions style="padding-top: 5px; padding-bottom: 5px;">
            <q-btn color="primary" @click="afficherDetails" flat>voir details</q-btn>
          </q-card-actions>
        </q-card>
        <q-card style="margin-top: 0;">
          <q-card-title>
            Année universitaire 2013 - 2014
            <span slot="subtitle">Université de Fianarantsoa - Ecole Nationale d'informatique</span>
          </q-card-title>
          <q-card-separator/>
          <q-card-main class="row">
            <div class="col">
              <img style="width: 100%;" src="statics/logo/fianarantsoa.png"/>
            </div>
            <div class="col">
              <img style="width: 100%;" src="statics/composant/eni.png"/>
            </div>
          </q-card-main>
          <q-card-actions style="padding-top: 5px; padding-bottom: 5px;">
            <q-btn color="primary" @click="afficherDetails" flat>voir details</q-btn>
          </q-card-actions>
        </q-card>-->
      </q-scroll-area>
    </div>
    <div class="col" v-if="voirDetails">
      <q-card v-for="(cursus, index) in cursusArray" :key="index" style="margin-top:0;">
        <q-card-main >
          <div class="row">
            <div class="col-md-6"><!--<h6>Mention:</h6> <i>??</i>--><h6>Parcours:</h6> <i>{{cursus.parcours.libelle}} ({{cursus.resultat.semestre.code}})</i>
            </div>
            <div class="col-md-6 flex items-start justify-end">
              <q-chip style="padding-top: 10px;padding-bottom: 10px;" tag square color="primary">
                <b><i>Total crédit:</i>&nbsp;&nbsp;</b> {{cursus.resultat.creditSemestre}}&nbsp;&nbsp;
              </q-chip>
            </div>
          </div>
          <br/>
          <table  class="q-table cell-separator" style="width: 100%;">
            <!--<thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-right">Price</th>
              <th class="text-right">In Stock</th>
            </tr>
            </thead>-->
            <tbody>
            <template v-for="(noteUe, index) in cursus.resultat.noteParUe">
              <tr v-bind:key="index" class="_ue">
                <td class="text-left">UE: {{noteUe.ueInfo.code}}</td>
                <td class="text-right">{{noteUe.ueInfo.creditUe}}</td>
              </tr>
              <tr v-for="(noteEc, i) in noteUe.noteEcList" :key="i">
                <td class="text-left">{{noteEc.ecInfo.libelle}}</td>
                <td class="text-right">{{noteEc.note}}</td>
              </tr>
            </template>
            </tbody>
          </table>
          <br />
          <table class="q-table" style="width: 100%;">
          </table>
          <br />
          <div class="col-md-6 flex items-start justify-end">
            <q-chip style="padding-top: 10px;padding-bottom: 10px;" tag :color="cursus.resultat.status === 'VALIDE' ? 'positive' : 'negative'">
              <b><i>Observations: </i>&nbsp;&nbsp; {{cursus.resultat.status}}&nbsp;&nbsp;</b>
            </q-chip>
          </div>
        </q-card-main>
      </q-card>
      <div v-if="!voirDetails" class="flex justify-center" style="height: 75vh">
        <div class="flex-center flex col-sm-12">
          <img src="statics/presentation.png" style=""/>
        </div>
        <p class="text-italic text-grey text-center light-paragraph" style="width: 75%;">
          Cliquez sur voir details pour afficher la formation suivit par l'étudiant lors de l'année universitaire</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    QCard,
    QCardTitle,
    QCardMain,
    QCardSeparator,
    QCardActions,
    QBtn,
    QScrollArea,
    QChip
  } from 'quasar'

  export default {
    components: {
      QCard,
      QCardTitle,
      QCardMain,
      QCardSeparator,
      QCardActions,
      QBtn,
      QScrollArea,
      QChip
    },
    data () {
      return {
        voirDetails: false,
        cursusArray: [],
        etudiants: []
      }
    },
    methods: {
      afficherDetails (index) {
        this.voirDetails = true
        this.$store
          .dispatch('getEtudiantCursus', index)
          .then((resultat) => {
            console.log('cursus', resultat)
            this.cursusArray = []
            for (let i = 0; i < resultat.length; i++) {
              this.cursusArray.push(resultat[i])
            }
          })
          .catch((error) => {
            console.log('error', error)
          })
      }
    },
    props: {
      infoEtudiant: {}
    },
    created () {
      console.log('etudiant', this.infoEtudiant.etudiant)
      this.$store
        .dispatch('getEtudiantsByPersonne', this.infoEtudiant.etudiant.idPersonne.id)
        .then((resultat) => {
          console.log('resultat', resultat)
          for (let i = 0; i < resultat.length; i++) {
            this.etudiants.push(resultat[i])
          }
        })
        .catch((error) => {
          console.log('error', error)
        })
    }
  }
</script>

<style lang="stylus">
  ._ue
    background #dddddd
    font-weight bold
</style>

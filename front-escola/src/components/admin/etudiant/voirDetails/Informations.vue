<template>
  <div class="row">
    <div class="col-sm-12 col-md-4">
      <q-card style="margin-top: 0;">
        <q-card-title class="">Informations
          <span slot="subtitle">Informations concernant l'étudiant</span>
        </q-card-title>
        <q-card-separator></q-card-separator>
        <q-card-main class="row">
          <div class="col-6 text-primary">Nom:</div> {{ this.$props.infoEtudiant.etudiant.idPersonne.nom | capitalize }}
          <div class="col-6 text-primary">Prénoms:</div> <div class="col-6">{{ this.$props.infoEtudiant.etudiant.idPersonne.prenom | capitalizeFirst }}</div>
          <div class="col-6"></div><div class="col-6">{{ this.$props.infoEtudiant.etudiant.idPersonne.sexe | capitalizeFirst }}</div>
          <div class="col-6 text-primary">Adresse:</div> <div class="col-6">{{ this.$props.infoEtudiant.etudiant.idPersonne.adresse }}</div> <br />
          <div class="col-6 text-primary">Adresse e-mail:</div> {{ this.$props.infoEtudiant.etudiant.idPersonne.email }} <br />
          <div class="col-6 text-primary">Contact:</div> {{ this.$props.infoEtudiant.etudiant.idPersonne.tel}} <br />
          <div class="col-6 text-primary">Situation matrimoniale:</div> {{ this.$props.infoEtudiant.etudiant.idPersonne.situation | capitalizeFirst }} <br /><br />
        </q-card-main>
      </q-card>
      <q-card>
        <q-card-title class="">Naissance</q-card-title>
        <q-card-separator></q-card-separator>
        <q-card-main class="row">
          <div class="col-6 text-primary ">Date de naissance: </div>{{ this.$props.infoEtudiant.etudiant.idPersonne.dateNais | dateFormat }} <br />
          <div class="col-6 text-primary ">Lieu de naissance: </div> {{ this.$props.infoEtudiant.etudiant.idPersonne.lieuNais | capitalizeFirst }}<br />
          <div class="col-6 text-primary ">Nationalité: </div> {{ this.$props.infoEtudiant.etudiant.idPersonne.nationalite | capitalizeFirst }}<br />
          <div class="col-6 text-primary ">  Pays d'orignine: </div>{{ this.$props.infoEtudiant.etudiant.idPersonne.pays | capitalizeFirst }}  <br /><br />
        </q-card-main>

      </q-card>
      <q-card>
        <q-card-title class="">Carte d'identité / Passeport</q-card-title><q-card-separator></q-card-separator>
        <q-card-main class="row">
          <div class="col-6 text-primary ">Numéro CIN:</div> <div class="col-6">{{ this.$props.infoEtudiant.etudiant.idPersonne.cin }}</div>
          <div class="col-6 text-primary ">Fait à :</div> <div>{{ this.$props.infoEtudiant.etudiant.idPersonne.lieuCin }}</div> <br />
          <div class="col-6 text-primary ">Fait le :</div> <div>{{ this.$props.infoEtudiant.etudiant.idPersonne.dateCin | dateFormat }}</div> <br />
          <div class="col-6 text-primary ">Date duplicata :</div> <div>{{ this.$props.infoEtudiant.etudiant.idPersonne.duplicataCin | dateFormat }}</div> <br />
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
          <div v-for="parent in this.$props.infoEtudiant.etudiant.idPersonne.parentCollection">
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
          <div class="col-6 text-primary "> Nombre de frères:</div>   {{ this.$props.infoEtudiant.etudiant.idPersonne.nbFrere }} <br />
          <div class="col-6 text-primary ">Nombre de soeurs:</div>   {{ this.$props.infoEtudiant.etudiant.idPersonne.nbSoeur }} <br /><br />
        </q-card-main>
      </q-card>

    </div>
    <div class="col-sm-12 col-md-4 " >
      <q-card style="margin-top: 0;">
        <q-card-title class=" ">
          Baccalauréat
          <span slot="subtitle">Informations concernant le baccalauréat de l'étudiant</span>
        </q-card-title><q-card-separator></q-card-separator>
        <q-card-main class="row">
          <div class="col-6 text-primary ">Numéro au Bacc:</div> {{ this.$props.infoEtudiant.etudiant.idPersonne.infoBaccCollection[0].numBacc }} <br />
          <div class="col-6 text-primary">Obtenu en :</div> {{ this.$props.infoEtudiant.etudiant.idPersonne.infoBaccCollection[0].annee }} <br />
          <div class="col-6 text-primary">Province :</div> {{ this.$props.infoEtudiant.etudiant.idPersonne.infoBaccCollection[0].province | capitalize }} <br />
          <div class="col-6 text-primary">Lycée:</div> {{ this.$props.infoEtudiant.etudiant.idPersonne.infoBaccCollection[0].lycee | capitalizeFirst }}  <br />
          <div class="col-6 text-primary">Série:</div> {{ this.$props.infoEtudiant.etudiant.idPersonne.infoBaccCollection[0].serie | capitalize }} <br />
        </q-card-main>
      </q-card>
    </div>

  </div>
</template>

<script>
  import {
    QCard,
    QCardTitle,
    QCardMain,
    QCardSeparator
  } from 'quasar'

  export default {
    components: {
      QCard,
      QCardTitle,
      QCardMain,
      QCardSeparator
    },
    data () {
      return {}
    },
    props: {
      infoEtudiant: {}
    }
  }
</script>

<style>
</style>

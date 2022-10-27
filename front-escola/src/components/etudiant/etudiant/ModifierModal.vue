<template>
  <div>
    <q-toolbar color="" class="shadow-0" style="border-bottom: 1px solid ghostwhite;padding-top: 0;padding-bottom: 0;">
      <q-item>
        <q-item-side avatar="statics/etablissement/fianarantsoa.png" />
      </q-item>
      <q-toolbar-title>
        {{ this.fullName }}
        <span slot="subtitle">Modification de l' étudiant</span>
      </q-toolbar-title>

      <q-btn color="" icon="close" class="within-iframe-hide" flat @click="closeThisModal()" style="margin-right: 15px;padding-right: 10px;">
        Fermer
      </q-btn>
    </q-toolbar>
    <!-- if you want automatic padding use "layout-padding" class -->
    <div class="layout-padding">
      <!-- your content -->
      <div class="row">
        <div class="col-sm-12 col-md-4">
          <q-card >
            <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
              Photo
              <span slot="subtitle">Cliquer l'image pour changer la photo</span>
            </q-card-title>
            <q-card-separator />
            <q-card-main style="margin-top: 0; padding: 20px 50px;">
              <div class="_image-upload">
                <div v-ripple="" style="overflow: hidden;cursor: pointer;padding-bottom: 0;margin-bottom: 0;font-size: 0;width: 100%;" class="relative-position flex flex-center items-center">
                  <label for="image-input">
                    <img class="responsive" :src="avatarImage" style=""/>
                  </label>
                </div>
                <input id="image-input" ref="imageInput" @change="changerImage()" type="file"/>
              </div>
            </q-card-main>
          </q-card>
          <q-card >
            <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
              Informations
            </q-card-title>
            <q-card-separator />
            <q-card-main style="margin-top: 0;padding-top: 0;padding-bottom: 0;">
              <q-input v-model="form.matricule" type="text" float-label="Numéro matricule" disabled/>
              <q-input v-model="form.nom" type="text" float-label="Nom"/>
              <q-input v-model="form.prenom" type="text" float-label="Prénom(s)"/>
              <q-list style="padding: 16px;padding-top: 10px;padding-bottom: 10px;margin-top: 32px;">
                <q-radio v-model="form.sexe" val="Homme" color="primary" class="text-grey" label="Homme" />
                <q-radio v-model="form.sexe" val="Femme" color="primary" class="text-grey" label="Femme" style="margin-left: 10px" />
              </q-list>
              <q-input v-model="form.adresse" type="text" float-label="Adresse"/>
              <q-input v-model="form.email" type="text" float-label="Email"/>
              <q-input v-model="form.tel" type="text" float-label="Contact"/>
              <br/>
            </q-card-main>
          </q-card>
          <q-card >
            <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
              Naissance
            </q-card-title>
            <q-card-separator />
            <q-card-main style="margin-top: 0;padding-top: 0;">
              <q-datetime float-label="Née le" format="DD MMMM YYYY"  :month-names="monthNames" :day-names="dayNames" cancel-label="" ok-label="Selectionner" clear-label="Effacer"  v-model="form.dateNais" type="date" />
              <q-input v-model="form.lieuNais" type="text" float-label="Née à"/>
              <q-input v-model="form.nationalite" type="text" float-label="Nationalité"/>
              <q-input v-model="form.pays" type="text" float-label="Pays"/>
              <br/>
            </q-card-main>
          </q-card>
        </div>

        <div class="col-sm-12 col-md-4">
          <q-card >
            <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
              Parents
            </q-card-title>
            <q-card-separator />
            <q-card-main style="margin-top: 0;">

              <q-list link style="padding-top: 0; padding-bottom: 0">
                <q-item tag="label">
                  <q-item-side>
                    <q-checkbox color="primary" v-model="form.orphPere" />
                  </q-item-side>
                  <q-item-main>
                    <q-item-tile class="text-grey" label>Orphelin père</q-item-tile>
                  </q-item-main>
                </q-item>
              </q-list>

              <q-input v-model="form.nomPere" type="text" float-label="Nom du père"/>
              <q-input v-model="form.profPere" type="text" float-label="Profession du père"/>
              <q-list link style="margin-top: 32px;padding-top: 0; padding-bottom: 0">
                <q-item tag="label">
                  <q-item-side>
                    <q-checkbox color="primary" v-model="form.orphMere" />
                  </q-item-side>
                  <q-item-main>
                    <q-item-tile class="text-grey" label>Orphelin mère</q-item-tile>
                  </q-item-main>
                </q-item>
              </q-list>
              <q-input v-model="form.nomMere" type="text" float-label="Nom de la mère"/>
              <q-input v-model="form.profMere" type="text" float-label="Profession de la mère"/>
              <q-input v-model="form.adresseParent" type="text" float-label="Adresse des parents"/>
              <q-input v-model="form.telParent" type="text" float-label="N° telephone des parents"/>
              <q-input v-model="form.nbFrere" type="number" :min="0" :max="100" :step="1" float-label="Nombre de frère(s)"/>
              <q-input v-model="form.nbSoeur" type="number" :min="0" :max="100" :step="1" float-label="Nombre de soeur(s)"/>
              <br/>
            </q-card-main>
          </q-card>
          <q-card >
            <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
              Tuteur
            </q-card-title>
            <q-card-separator />
            <q-card-main style="margin-top: 0;padding-top: 0;padding-bottom: 0;">
              <q-input v-model="form.nomTuteur" type="text" float-label="Nom du tuteur"/>
              <q-input v-model="form.profTuteur" type="text" float-label="Profession du tuteur"/>
              <q-input v-model="form.telTuteur" type="text" float-label="N° telephone du tuteur"/>
              <q-input v-model="form.adresseTuteur" type="text" float-label="Adresse du tuteur"/>
              <br/>
            </q-card-main>
          </q-card>

          <q-card >
            <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
              Situation matrimoniale
            </q-card-title>
            <q-card-separator />
            <q-card-main style="margin-top: 0;">
              <q-list link style="padding-top: 0; padding-bottom: 0">
                <q-item tag="label">
                  <q-item-side>
                    <q-radio color="primary" v-model="form.situation" val="célibataire" />
                  </q-item-side>
                  <q-item-main>
                    <q-item-tile class="text-grey" label>Célibataire</q-item-tile>
                  </q-item-main>
                </q-item>
                <q-item tag="label">
                  <q-item-side>
                    <q-radio color="primary" v-model="form.situation" val="marié(e)" />
                  </q-item-side>
                  <q-item-main>
                    <q-item-tile class="text-grey" label>Marié(e)</q-item-tile>
                  </q-item-main>
                </q-item>
                <q-item multiline tag="label">
                  <q-item-side>
                    <q-radio color="primary" v-model="form.situation" val="divorcé(e)" />
                  </q-item-side>
                  <q-item-main>
                    <q-item-tile class="text-grey" label>Divorcé(e)</q-item-tile>
                  </q-item-main>
                </q-item>
                <q-item multiline tag="label">
                  <q-item-side>
                    <q-radio color="primary" v-model="form.situation" val="veuf(ve)" />
                  </q-item-side>
                  <q-item-main>
                    <q-item-tile class="text-grey" label>Veuf(ve)</q-item-tile>
                  </q-item-main>
                </q-item>
              </q-list>
              <br/>
            </q-card-main>
          </q-card>
        </div>

        <div class="col-sm-12 col-md-4">
          <q-card >
            <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
              Titre Accès (Bacc)
            </q-card-title>
            <q-card-separator />
            <q-card-main style="margin-top: 0;padding-top: 0;padding-bottom: 0;">
              <q-input v-model="form.numBacc" type="text" float-label="Numero Bacc"/>
              <q-input v-model="form.anneeBacc" type="number" float-label="Obtenu en"/>
              <q-input v-model="form.lyceeBacc" type="text" float-label="Lycée"/>
              <q-input v-model="form.provinceBacc" type="text" float-label="Province"/>
              <q-input v-model="form.bacc" type="text" float-label="Bacc série"/>
              <br/>
            </q-card-main>
          </q-card>
          <q-card >
            <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
              Carte d'identité nationale / Passeport
            </q-card-title>
            <q-card-separator />
            <q-card-main style="margin-top: 0;padding-top: 0;">
              <q-input v-model="form.numCin" type="text" float-label="Numero CIN / Passeport"/>
              <q-input v-model="form.lieuCin" type="text" float-label="Fait à "/>
              <q-datetime float-label="Fait le" format="DD MMMM YYYY"
                          :month-names="monthNames" :day-names="dayNames" cancel-label="" ok-label="Selectionner"
                          clear-label="Effacer"  v-model="form.dateCin" type="date" />
              <q-datetime float-label="Date duplicata" format="DD MMMM YYYY"
                          :month-names="monthNames" :day-names="dayNames" cancel-label="" ok-label="Selectionner"
                          clear-label="Effacer"  v-model="form.duplicataCin" type="date" />
              <br/>
            </q-card-main>
          </q-card>
          <q-card >
            <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
              Valider
            </q-card-title>
            <q-card-separator />
            <q-card-main style="margin-top: 0; padding: 20px 50px;">
              <q-btn rounded push color="primary" style="width: 100%;height: 50px;" @click="updateEtudiant()">Mettre à jour les informations</q-btn>
            </q-card-main>
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
    QSelect,
    QBtn,
    QInput,
    QRadio,
    QList,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
    QCheckbox,
    QField,
    QDatetime,
    Ripple,
    QCollapsible,
    Alert,
    QToolbar,
    QToolbarTitle
  } from 'quasar'

  import { map } from 'lodash'

  export default {
    directives: {
      Ripple
    },
    components: {
      QCard,
      QCardMedia,
      QCardTitle,
      QCardSeparator,
      QCardMain,
      QCardActions,
      QSelect,
      QBtn,
      QInput,
      QRadio,
      QList,
      QItem,
      QItemSide,
      QItemMain,
      QItemTile,
      QCheckbox,
      QField,
      QDatetime,
      QCollapsible,
      Alert,
      QToolbar,
      QToolbarTitle
    },
    data () {
      return {
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        dayNames: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        form: {
          matricule: '',
          nom: '',
          prenom: '',
          sexe: '',
          adresse: '',
          tel: '',
          email: '',
          dateNais: '',
          lieuNais: '',
          nationalite: '',
          pays: '',
          situation: '',
          numCin: '',
          dateCin: '',
          lieuCin: '',
          duplicataCin: '',
          numBacc: '',
          anneeBacc: '',
          provinceBacc: '',
          lyceeBacc: '',
          bacc: '',
          orphPere: false,
          nomPere: '',
          profPere: '',
          orphMere: false,
          nomMere: '',
          profMere: '',
          adresseParent: '',
          telParent: '',
          nbFrere: 0,
          nbSoeur: 0,
          nomTuteur: '',
          profTuteur: '',
          telTuteur: '',
          adresseTuteur: ''
        },
        id: '',
        idPere: '',
        idMere: '',
        idTuteur: '',
        idBacc: '',
        fullName: '',
        avatarImage: 'statics/photovide.jpg'
      }
    },
    props: {
      etudiantModif: ''
    },
    watch: {
      etudiantModif: function (newVal, oldVal) {
        console.log('new val', newVal)
        this.form.matricule = newVal.numeroMatricule
        this.form.nom = newVal.idPersonne.nom
        this.form.prenom = newVal.idPersonne.prenom
        this.form.sexe = newVal.idPersonne.sexe
        this.form.adresse = newVal.idPersonne.adresse
        this.form.email = newVal.idPersonne.email
        this.form.tel = newVal.idPersonne.tel
        this.form.dateNais = newVal.idPersonne.dateNais
        this.form.lieuNais = newVal.idPersonne.lieuNais
        this.form.nationalite = newVal.idPersonne.nationalite
        this.form.pays = newVal.idPersonne.pays
        this.form.situation = newVal.idPersonne.situation
        this.form.numCin = newVal.idPersonne.cin
        this.form.dateCin = newVal.idPersonne.dateCin
        this.form.lieuCin = newVal.idPersonne.lieuCin
        this.form.duplicataCin = newVal.idPersonne.duplicataCin
        this.form.orphPere = newVal.idPersonne.orphelinPere
        this.form.orphMere = newVal.idPersonne.orphelinMere
        this.form.nbFrere = newVal.idPersonne.nbFrere
        this.form.nbSoeur = newVal.idPersonne.nbSoeur
        this.form.bacc = newVal.idPersonne.infoBaccCollection[0].serie
        this.form.numBacc = newVal.idPersonne.infoBaccCollection[0].numBacc
        this.form.anneeBacc = newVal.idPersonne.infoBaccCollection[0].annee
        this.form.provinceBacc = newVal.idPersonne.infoBaccCollection[0].province
        this.form.lyceeBacc = newVal.idPersonne.infoBaccCollection[0].lycee
        this.id = newVal.idPersonne.id
        this.idBacc = newVal.idPersonne.infoBaccCollection[0].id
        this.fullName = newVal.fullName
        this.avatarImage = newVal.idPersonne.urlPhoto
        map(newVal.idPersonne.parentCollection, (parent) => {
          if (parent.role === 'père') {
            this.form.nomPere = parent.nom
            this.form.profPere = parent.profession
            this.form.adresseParent = parent.adresse
            this.form.telParent = parent.tel
            this.idPere = parent.id
          }
          else if (parent.role === 'mère') {
            this.form.nomMere = parent.nom
            this.form.profMere = parent.profession
            this.form.adresseParent = parent.adresse
            this.form.telParent = parent.tel
            this.idMere = parent.id
          }
          else {
            this.form.nomTuteur = parent.nom
            this.form.profTuteur = parent.profession
            this.form.telTuteur = parent.tel
            this.form.adresseTuteur = parent.adresse
            this.idTuteur = parent.id
          }
        })
      }
    },
    methods: {
      changerImage () {
        let reader = new FileReader()
        let self = this
        reader.onload = function (e) {
          self.avatarImage = e.target.result
        }
        reader.readAsDataURL(document.getElementById('image-input').files[0])
      },
      closeThisModal () {
        this.$emit('close')
      },
      updateEtudiant () {
        let etudiant = {
          id: this.id,
          nom: this.form.nom,
          prenom: this.form.prenom,
          dateNais: this.form.dateNais,
          lieuNais: this.form.lieuNais,
          nationalite: this.form.nationalite,
          pays: this.form.pays,
          sexe: this.form.sexe,
          situation: this.form.situation,
          orphelinPere: this.form.orphPere,
          orphelinMere: this.form.orphMere,
          nbFrere: this.form.nbFrere,
          nbSoeur: this.form.nbSoeur,
          cin: this.form.cin,
          dateCin: this.form.dateCin,
          lieuCin: this.form.lieuCin,
          duplicataCin: this.form.duplicataCin,
          passePort: this.form.passePort,
          email: this.form.email,
          tel: this.form.tel,
          adresse: this.form.adresse,
          urlPhoto: this.avatarImage,
          parentCollection: [
            {
              id: this.idPere,
              nom: this.form.nomPere,
              profession: this.form.profPere,
              tel: this.form.telParent,
              role: 'père',
              idPersonne: this.id
            },
            {
              id: this.idMere,
              nom: this.form.nomMere,
              profession: this.form.profMere,
              adresse: this.form.adresseParent,
              tel: this.form.telParent,
              role: 'mère',
              idPersonne: this.id
            },
            {
              id: this.idTuteur,
              nom: this.form.nomTuteur,
              profession: this.form.profTuteur,
              adresse: this.form.adresseTuteur,
              tel: this.form.telTuteur,
              role: 'tuteur',
              idPersonne: this.id
            }
          ],
          infoBaccCollection: [
            {
              id: this.idBacc,
              serie: this.form.bacc,
              numBacc: this.form.numBacc,
              annee: this.form.anneeBacc,
              lycee: this.form.lyceeBacc,
              province: this.form.provinceBacc,
              idPersonne: this.id
            }
          ]
        }
        this.$store.dispatch('etudiant/updateEtudiant', etudiant)
          .then((res) => {
            this.$alert.success('Les informations ont été mises à jour')
            this.closeThisModal()
          })
          .catch((err) => {
            if (err) this.$alert.error('Erreur lors de la mise à jour')
          })
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
    .q-popover .q-item-image {
      min-width: 55px;
      max-width: 55px;
      max-height: 55px;
    }

  ._image-upload > input
  {
    display: none;
  }

  ._modal-content
    padding 15px 70px
    border-bottom 1px solid whitesmoke

  @media only screen and (max-width: 500px) {
    ._modal-content {
      padding: 10px 10px;
      border-bottom: 1px solid whitesmoke;
    }
  }
</style>

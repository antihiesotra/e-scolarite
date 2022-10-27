<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div class="">
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
                  <img class="responsive" :src="this.utilisateur.personne.photo" style=""/>
                </label>
              </div>
              <input id="image-input" ref="imageInput" @change="changeImage()" type="file"/>
            </div>
          </q-card-main>
        </q-card>
        <q-card >
          <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
            Mot de passe
          </q-card-title>
          <q-card-separator />
          <q-card-main style="margin-top: 0;padding-top: 0;">
            <q-input
              float-label="Mot de passe"
              v-model="utilisateur.password"
              type="password"
              no-pass-toogle="false"
            />
            <q-input
              float-label="Répéter votre mot de passe"
              v-model="passwordRepeat"
              type="password"
              no-pass-toogle="false"
            />
          </q-card-main>
        </q-card>
      </div>
      <div class="col-sm-12 col-md-4">
        <q-card >
          <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
            Informations
          </q-card-title>
          <q-card-separator />
          <q-card-main style="margin-top: 0;padding-top: 0;padding-bottom: 0;">
            <q-input v-model="utilisateur.personne.nom" type="text" float-label="Nom"/>
            <q-input v-model="utilisateur.personne.prenom" type="text" float-label="Prénom(s)"/>
            <q-list style="padding: 16px;padding-top: 10px;padding-bottom: 10px;margin-top: 32px;">
              <q-radio v-model="utilisateur.personne.sexe" val="Homme" color="primary" class="text-grey" label="Homme" />
              <q-radio v-model="utilisateur.personne.sexe" val="Femme" color="primary" class="text-grey" label="Femme" style="margin-left: 10px" />
            </q-list>
            <q-input v-model="utilisateur.personne.adresse" type="text" float-label="Adresse"/>
            <q-input v-model="utilisateur.personne.email" type="text" float-label="Email"/>
            <q-input v-model="utilisateur.personne.tel" type="text" float-label="Contact"/>
            <br/>
          </q-card-main><!--
          <q-card-actions align="end">
            <q-btn flat color="primary" @click="$router.push('connect')">Valider</q-btn>
          </q-card-actions>-->
        </q-card>
        <q-card >
          <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
            Naissance
          </q-card-title>
          <q-card-separator />
          <q-card-main style="margin-top: 0;padding-top: 0;">
            <q-datetime float-label="Née le" format="DD MMMM YYYY"  :month-names="monthNames" :day-names="dayNames" cancel-label="" ok-label="Selectionner" clear-label="Effacer"  v-model="utilisateur.personne.dateNais" type="date" />
            <q-input v-model="utilisateur.personne.lieuNais" type="text" float-label="Née à"/>
            <q-input v-model="utilisateur.personne.nationalite" type="text" float-label="Nationalité"/>
            <q-input v-model="utilisateur.personne.pays" type="text" float-label="Pays"/>
            <br/>
          </q-card-main>
        </q-card>
      </div>
      <div class="col-sm-12 col-md-4">
        <q-card >
          <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
            Carte d'identité nationale / Passeport
          </q-card-title>
          <q-card-separator />
          <q-card-main style="margin-top: 0;padding-top: 0;">
            <q-input v-model="utilisateur.personne.cin" type="text" float-label="Numero CIN / Passeport"/>
            <q-input v-model="utilisateur.personne.lieuCin" type="text" float-label="Fait à "/>
            <q-datetime float-label="Fait le" format="DD MMMM YYYY"
                        :month-names="monthNames" :day-names="dayNames" cancel-label="" ok-label="Selectionner"
                        clear-label="Effacer"  v-model="utilisateur.personne.dateCin" type="date" />
            <q-datetime float-label="Date duplicata" format="DD MMMM YYYY"
                        :month-names="monthNames" :day-names="dayNames" cancel-label="" ok-label="Selectionner"
                        clear-label="Effacer"  v-model="utilisateur.personne.dateDuplicata" type="date" />
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
                  <q-radio color="primary" v-model="utilisateur.personne.situation" val="Celibataire" />
                </q-item-side>
                <q-item-main>
                  <q-item-tile class="text-grey" label>Célibataire</q-item-tile>
                </q-item-main>
              </q-item>
              <q-item tag="label">
                <q-item-side>
                  <q-radio color="primary" v-model="utilisateur.personne.situation" val="Marie" />
                </q-item-side>
                <q-item-main>
                  <q-item-tile class="text-grey" label>Marié(e)</q-item-tile>
                </q-item-main>
              </q-item>
              <q-item multiline tag="label">
                <q-item-side>
                  <q-radio color="primary" v-model="utilisateur.personne.situation" val="Divorce" />
                </q-item-side>
                <q-item-main>
                  <q-item-tile class="text-grey" label>Divorcé(e)</q-item-tile>
                </q-item-main>
              </q-item>
              <q-item multiline tag="label">
                <q-item-side>
                  <q-radio color="primary" v-model="utilisateur.personne.situation" val="Veuf" />
                </q-item-side>
                <q-item-main>
                  <q-item-tile class="text-grey" label>Veuf(ve)</q-item-tile>
                </q-item-main>
              </q-item>
            </q-list>
            <br/>
          </q-card-main>
        </q-card>
        <q-card >
          <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
            Valider
          </q-card-title>
          <q-card-separator />
          <q-card-main style="margin-top: 0; padding: 20px 50px;">
            <q-btn rounded push color="primary" style="width: 100%;height: 50px;" @click="ajouterUtilisateur()">Ajouter le responsable</q-btn>
          </q-card-main>
        </q-card>
      </div>
    </div>
    <!--q-modal ref="verificationModal" v-model="verificationModal" class="_verificationModal"  :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '40vw', minHeight: '80vh'}">
      <q-modal-layout>
        <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey;">
          <div class="text-center">
            <div class="col-sm-12 layout-padding ">
              <div style="margin: 0;font-size: 24px" class="light-paragraph">Utilisateur</div>
            </div>
          </div>
          <q-btn flat round small @click="$refs.verificationModal.close()" style="position: absolute;top: 1em;right: 1em">
            <q-icon name="close" />
          </q-btn>
        </div>
        <div class="_modal-content">
          <pre class=""><code class="language-javascript">{{utilisateur}}</code></pre>
        </div>
        <div slot="footer" :class="'_no-shadow'" style="padding: 15px 100px 20px;">
          <div class="flex flex-center">
            <q-btn color="secondary" style="height: 50px;" rounded push class="col-md-7 col-sm-12 col-12"
                   @click="ajouterUtilisateur()">Valider
            </q-btn>
          </div>
        </div>
      </q-modal-layout>
    </q-modal-->
    <q-fixed-position corner="bottom-left" :offset="[18, 18]">
      <q-btn
        round
        color="primary"
        @click="$router.push('/mention/personne/liste')"
        class="animate-pop"
      >
        <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Liste des personnes</q-tooltip>
        <q-icon name="people" />
      </q-btn>
    </q-fixed-position>
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
    QModal,
    QModalLayout,
    QIcon,
    QFixedPosition,
    QTooltip,
    Alert
  } from 'quasar'

  import 'quasar-extras/animate/bounceInRight.css'
  import 'quasar-extras/animate/bounceOutRight.css'

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
      QModal,
      QModalLayout,
      QIcon,
      QFixedPosition,
      QTooltip
    },
    data () {
      return {
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        dayNames: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        form: {
          password: '',
          nom: '',
          prenom: '',
          dateNais: '',
          lieuNais: '',
          nationalite: '',
          pays: '',
          sexe: '',
          situation: '',
          orphelinPere: '',
          orphelinMere: '',
          nbFrere: '',
          nbSoeur: '',
          cin: '',
          dateCin: '',
          lieuCin: '',
          duplicataCin: '',
          dateDuplicata: '',
          passePort: '',
          email: '',
          tel: '',
          adresse: ''
        },
        utilisateur: {
          password: '',
          personne: {
            nom: '',
            prenom: '',
            dateNais: '',
            lieuNais: '',
            nationalite: '',
            pays: '',
            sexe: '',
            situation: '',
            cin: '',
            dateCin: '',
            lieuCin: '',
            duplicataCin: '',
            dateDuplicata: '',
            passePort: '',
            email: '',
            tel: '',
            photo: 'statics/photovide.jpg',
            adresse: ''
          }
        },
        passwordRepeat: ''
      }
    },
    methods: {
      changeImage () {
        let file = document.getElementById('image-input').files[0]
        this.utilisateur.personne.photo = URL.createObjectURL(file)
        this.image = file
      },
      ajouterUtilisateur () {
        this.$store.dispatch('utilisateur/addUser', this.utilisateur)
          .then((utilisateur) => {
            console.log(utilisateur)
            this.$store.dispatch('utilisateur/setPhoto', {utilisateur: utilisateur, image: this.image})
              .then((utilisateur) => {
                Alert.create({enter: 'bounceInRight', leave: 'bounceOutRight', color: 'positive', html: 'L\'utilisateur a bien été ajouté'})
                this.$router.push('/mention/personne/liste')
              })
              .catch((err) => {
                console.log('Erreur d\'ajout de la photo: ', err)
              })
          })
          .catch((error) => {
            console.log('Ajout.vue ajouterUtilisateur', error)
          })
      }
    },
    computed: {
    },
    watch: {
    },
    mounted () {
    }
  }
</script>

<style lang="stylus">
  .q-popover .q-item-image {
    min-width: 55px;
    max-width: 55px;
    max-height: 55px;
  }

  ._image-upload > input
  {
    display: none;
  }

  ._no-padding
    padding 0 !important

  ._modal-content
    padding 15px 70px
    border-bottom 1px solid whitesmoke

  ._noteModal, ._verificationModal
    .layout-header
      box-shadow none

    .layout-footer
      box-shadow none
      border-top 1px solid lightgrey

  @media only screen and (max-width: 500px) {
    ._modal-content {
      padding: 10px 10px;
      border-bottom: 1px solid whitesmoke;
    }
  }

  pre {
    padding: 10px;
    background: #fafafa;
    font: 12px/18px Consolas,monospace,serif;
    color: #444;
    -moz-tab-size: 4;
    tab-size: 4;
    overflow: auto;
    border: 1px solid #ddd;
    border-radius: 3px;
  }
</style>

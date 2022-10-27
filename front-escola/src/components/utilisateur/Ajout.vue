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
            <q-input v-model="utilisateur.personne.tel" type="text" float-label="Contact"/>
            <q-input v-model="utilisateur.personne.email" type="text" float-label="Adresse e-mail"/>
            <br/>
          </q-card-main>
        </q-card>
      </div>
      <div class="col-sm-12 col-md-4">
        <q-card >
          <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
            Valider
          </q-card-title>
          <q-card-separator />
          <q-input v-model="utilisateur.login" type="text" float-label="Identifiant"/>
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
          <q-card-main style="margin-top: 0; padding: 20px 50px;">
            <q-btn rounded push color="primary" style="width: 100%;height: 50px;" @click="ajouterUtilisateur()">Ajouter le responsable</q-btn>
          </q-card-main>
        </q-card>
      </div>
    </div>
    <q-fixed-position corner="bottom-left" :offset="[18, 18]">
      <q-btn
        round
        color="primary"
        @click="$router.go(-1)"
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
          sexe: '',
          situation: '',
          email: '',
          tel: '',
          adresse: ''
        },
        utilisateur: {
          password: '',
          login: '',
          personne: {
            nom: '',
            prenom: '',
            pays: '',
            sexe: '',
            email: '',
            tel: '',
            photo: 'statics/photovide.jpg'
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
        let login = this.utilisateur.login
        this.utilisateur.login = login
        let password = this.utilisateur.password
        this.utilisateur.password = password
        let email = this.utilisateur.personne.email
        this.utilisateur.email = email
        if (password !== this.passwordRepeat) {
          this.$alert.error('Veuillez bien confirmer le mot de passe.')
        }
        else if (this.utilisateur.login === '' && email !== '') {
          this.utilisateur.login = email
          this.$store.dispatch('utilisateur/addUser', this.utilisateur)
            .then((utilisateur) => {
              this.$store.dispatch('utilisateur/setPhoto', {utilisateur: utilisateur, image: this.image})
                .then((utilisateur) => {
                  Alert.create({enter: 'bounceInRight', leave: 'bounceOutRight', color: 'positive', html: 'L\'utilisateur a bien été ajouté'})
                  this.$router.go(-1)
                  this.$store.dispatch('utilisateur/envoimail', this.utilisateur)
                    .then((resmail) => {
                      Alert.create({enter: 'bounceInRight', leave: 'bounceOutRight', color: 'positive', html: 'L\'email a été envoyé avec succès'})
                    })
                    .catch((error) => {
                      this.$alert.error('Veuillez bien vérifier votre connexion Internet et l\'adresse email saisie pour l\'envoi d\'email.')
                      console.log('Ajout.vue envoi mail', error)
                    })
                })
                .catch((err) => {
                  console.log('Erreur d\'ajout de la photo: ', err)
                })
            })
            .catch((error) => {
              console.log('Ajout.vue ajouterUtilisateur', error)
            })
        }
        else if (this.utilisateur.personne.email === '' && login !== '') {
          this.utilisateur.personne.email = login
          this.$store.dispatch('utilisateur/addUser', this.utilisateur)
            .then((utilisateur) => {
              this.$store.dispatch('utilisateur/setPhoto', {utilisateur: utilisateur, image: this.image})
                .then((utilisateur) => {
                  Alert.create({enter: 'bounceInRight', leave: 'bounceOutRight', color: 'positive', html: 'L\'utilisateur a bien été ajouté'})
                  this.$router.go(-1)
                  this.$store.dispatch('utilisateur/envoimail', this.utilisateur)
                    .then((resmail) => {
                      Alert.create({enter: 'bounceInRight', leave: 'bounceOutRight', color: 'positive', html: 'L\'email a été envoyé avec succès'})
                    })
                    .catch((error) => {
                      this.$alert.error('Veuillez bien vérifier votre connexion Internet et l\'adresse email saisie pour l\'envoi d\'email.')
                      console.log('Ajout.vue envoi mail', error)
                    })
                })
                .catch((err) => {
                  console.log('Erreur d\'ajout de la photo: ', err)
                })
            })
            .catch((error) => {
              console.log('Ajout.vue ajouterUtilisateur', error)
            })
        }
        else if (email === '' && login === '') {
          this.$alert.error('Veuillez remplir les champs email et identifiant.')
        }
        else {
          this.$store.dispatch('utilisateur/addUser', this.utilisateur)
            .then((utilisateur) => {
              this.$store.dispatch('utilisateur/setPhoto', {utilisateur: utilisateur, image: this.image})
                .then((utilisateur) => {
                  Alert.create({enter: 'bounceInRight', leave: 'bounceOutRight', color: 'positive', html: 'L\'utilisateur a bien été ajouté'})
                  this.$router.go(-1)
                  this.$store.dispatch('utilisateur/envoimail', this.utilisateur)
                    .then((resmail) => {
                      Alert.create({enter: 'bounceInRight', leave: 'bounceOutRight', color: 'positive', html: 'L\'email a été envoyé avec succès'})
                    })
                    .catch((error) => {
                      this.$alert.error('Veuillez bien vérifier votre connexion Internet et l\'adresse email saisie pour l\'envoi d\'email.')
                      console.log('Ajout.vue envoi mail', error)
                    })
                })
                .catch((err) => {
                  console.log('Erreur d\'ajout de la photo: ', err)
                })
            })
            .catch((error) => {
              console.log('Ajout.vue ajouterUtilisateur', error)
            })
        }
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

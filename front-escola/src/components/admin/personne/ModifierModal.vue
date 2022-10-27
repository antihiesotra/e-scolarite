<template>
  <div>
    <q-toolbar color="" class="shadow-0" style="border-bottom: 1px solid ghostwhite;padding-top: 0;padding-bottom: 0;">
      <q-item>
        <q-item-side avatar="statics/etablissement/fianarantsoa.png" />
      </q-item>
      <q-toolbar-title>
        <span slot="subtitle">Modification personne</span>
      </q-toolbar-title>
        {{ this.fullName }}
      <q-btn color="" icon="close" class="within-iframe-hide" flat @click="closeThisModal()" style="margin-right: 15px;padding-right: 10px;">
        Fermer
      </q-btn>
    </q-toolbar>
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
        </div>

        <div class="col-sm-12 col-md-4">
          <q-card >
          <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
            Informations
          </q-card-title>
          <q-card-separator />
          <q-card-main style="margin-top: 0;padding-top: 0;padding-bottom: 0;">
            <q-input v-model="form.nom" type="text" float-label="Nom"/>
            <q-input v-model="form.prenom" type="text" float-label="Prénom(s)"/>
            <q-list style="padding: 16px;padding-top: 10px;padding-bottom: 10px;margin-top: 32px;">
              <q-radio v-model="form.sexe" val="Homme" color="primary" class="text-grey" label="Homme" />
              <q-radio v-model="form.sexe" val="Femme" color="primary" class="text-grey" label="Femme" style="margin-left: 10px" />
            </q-list>
            <q-input v-model="form.tel" type="text" float-label="Contact"/>
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
            <q-card-main style="margin-top: 0;padding-top: 0;">
              <q-input v-model="form.email" type="text" float-label="Email"/>
              <q-input
                float-label="Mot de passe"
                v-model="form.password"
                type="password"
                no-pass-toogle="false"
              />
              <q-input
                float-label="Répéter votre mot de passe"
                v-model="form.passwordRepeat"
                type="password"
                no-pass-toogle="false"
              />
            </q-card-main>
            <q-card-main style="margin-top: 0; padding: 20px 50px;">
              <q-btn rounded push color="primary" style="width: 100%;height: 37px;" @click="updateUsers()">Mettre à jour les informations</q-btn>
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
          tel: '',
          email: '',
          photo: '',
          passwordRepeat: '',
          situation: ''
        },
        id: '',
        idPersonne: '',
        fullName: '',
        utilisateur: '',
        passwordRepeat: '',
        avatarImage: 'statics/photovide.jpg'
      }
    },
    props: {
      personneModif: ''
    },
    watch: {
      personneModif: function (newVal, oldVal) {
        console.log('idPersonne', newVal)
        this.id = ''
        this.idPersonne = ''
        this.form.nom = newVal.personne.nom
        this.form.prenom = newVal.personne.prenom
        this.fullName = newVal.personne.nom + ' ' + newVal.personne.prenom
        this.form.sexe = newVal.personne.sexe
        this.form.email = newVal.personne.email
        this.form.tel = newVal.personne.tel
        if (newVal.photo === '') {
          this.avatarImage = 'statics/photovide.jpg'
        }
        else {
          this.avatarImage = newVal.photo
        }
        this.idPersonne = newVal.personne.id
        this.id = newVal.id
      }
    },
    methods: {
      changerImage () {
        let reader = new FileReader()
        let self = this
        reader.onload = function (e) {
          self.avatarImage = e.target.result
        }
        let file = document.getElementById('image-input').files[0]
        this.form.photo = URL.createObjectURL(file)
        this.image = file
        reader.readAsDataURL(file)
      },
      closeThisModal () {
        this.$emit('close')
      },
      updateUsers () {
        let utilisateur = {
          id: this.id,
          personne: {
            id: this.idPersonne,
            nom: this.form.nom,
            prenom: this.form.prenom,
            sexe: this.form.sexe,
            tel: this.form.tel,
            photo: this.form.photo,
            email: this.form.email
          },
          password: this.form.password
        }
        this.$store.dispatch('utilisateur/editUser', utilisateur)
          .then((utilisateur) => {
            this.$store.dispatch('utilisateur/setPhoto', {utilisateur: utilisateur, image: this.image})
              .then((utilisateur) => {
                Alert.create({enter: 'bounceInRight', leave: 'bounceOutRight', color: 'positive', html: 'Modification de enregistrer avec succés'})
                this.$router.go(-1)
              })
              .catch((err) => {
                console.log('Erreur d\'ajout de la photo: ', err)
              })
          })
          .catch((error) => {
            console.log('ModifierModal.vue modificatinUtilisateur', error)
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

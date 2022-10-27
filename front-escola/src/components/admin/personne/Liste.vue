<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div class="layout-padding">
    <div class="row" style="padding-left: 10px;padding-right: 10px;">
      <div class="col-sm-3">
        <q-select
          style="margin-top: 0;"
          color="primary"
          float-label="Filtre"
          v-model="select"
          :options="selectOptions"
        />
      </div>   
    </div>
    <div class="layout-view">
      <!-- your content -->
      <q-card v-if="isReady">
        <q-data-table
          :data="utilisateurs"
          :config="config"
          :columns="columns"
          :refresh="refresh"
          class="bg-white"
        >
          <!-- Custom renderer when user selected one or more rows -->
          <template slot="selection" slot-scope="selection">
            <q-btn color="primary" icon="edit" @click="modifierUtilisateur(selection)">
              <span class="gt-sm">Modifier</span>
            </q-btn>
            <q-btn color="negative" icon="delete" @click="supprimerUtilisateur(selection)">
              <span class="gt-sm">Supprimer</span>
            </q-btn>
          </template>

          <template slot="col-photo" slot-scope="item">
            <q-item>
              <q-item-side :avatar="item.row.photo" />
              <q-item-side style="cursor:pointer" right icon="file_upload" @click="changeImage()"/>
            </q-item>
          </template>
        </q-data-table>
      </q-card>

      <template v-else>
        <div style="height: 80vh" class="row justify-center items-center">
          <q-spinner
            color="primary"
            size="100"
          />
        </div>
      </template>
      <q-fixed-position corner="bottom-left" :offset="[18, 18]">
        <q-fab color="primary" push icon="settings" direction="right">
          <q-btn
            round
            color="primary"
            @click="$router.push('/admin/personne/ajout')"
            class="animate-pop"
          >
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Ajouter un utilisateur</q-tooltip>
          <q-icon name="person_add" />
        </q-btn>
          
        </q-fab>
      </q-fixed-position>
      <q-modal ref="deleteModal" class="_deleteModal" v-model="openSupprimer"
               :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '50vw', minHeight: '45vh'}">
        <q-modal-layout>
          <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey">
            <div class="">
              <div class="col-sm-12 layout-padding ">
                <div style="margin: 0;font-size: 24px" class="text-negative">Supprimer l'utilisateur ?</div>
              </div>
            </div>
            <q-btn flat round small @click="$refs.deleteModal.close()" style="position: absolute;top: 1em;right: 1em">
              <q-icon name="close" />
            </q-btn>
          </div>
          <div class="layout-padding">
            <div class="text-grey text-italic">Voulez vous vraiment supprimer cet utilisateur ?</div>
            <div class="text-grey text-italic">{{ utilisateurToDeleteFullName }}</div>
            <q-input
              v-model="motif"
              color="tertiary"
              type="textarea"
              float-label="Motif de la suppresion"
              :min-rows="5"
            />
          </div>
          <div slot="footer" :class="'_no-shadow'" style="padding: 15px 20px;">
            <div class="flex justify-end">
              <q-btn color="tertiary" style="height: 45px;" rounded class=" col-md-3 col-sm-12 col-12"
                     @click="$refs.deleteModal.close()">Non
              </q-btn>&nbsp;&nbsp;
              <q-btn color="negative" style="height: 45px;" rounded class="col-md-3 col-sm-12 col-12"
                     @click="deleteUtilisateur()">Oui
              </q-btn>
            </div>
          </div>
        </q-modal-layout>
      </q-modal>
      <q-modal @open="setProps()" ref="modifUtilisateur" maximized v-model="modifModal">
        <modif-utilisateur ref="modifierUtilisateurModal" :utilisateurModif="utilisateurToEdit2"></modif-utilisateur>
      </q-modal>
      <q-modal ref="modifModal" class="_deleteModal" v-model="modifModal"
               :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '100vw', minHeight: '100vh'}">
        <q-modal-layout>
          <div>
            <q-toolbar color="" class="shadow-0" style="border-bottom: 1px solid ghostwhite;padding-top: 0;padding-bottom: 0;">
              <q-item>
                <q-item-side avatar="statics/etablissement/fianarantsoa.png" />
              </q-item>
              <q-toolbar-title>
                <span slot="subtitle">Modification personne</span>
              </q-toolbar-title>
                {{ this.fullName }}
              <q-btn color="" icon="close" class="within-iframe-hide" flat @click="$router.go(-1)" style="margin-right: 15px;padding-right: 10px;">
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
                    <q-input v-model="utilisateurToEdit.nom" type="text" float-label="Nom"/>
                    <q-input v-model="utilisateurToEdit.prenom" type="text" float-label="Prénom(s)"/>
                    <q-list style="padding: 16px;padding-top: 10px;padding-bottom: 10px;margin-top: 32px;">
                      <q-radio v-model="utilisateurToEdit.sexe" val="Homme" color="primary" class="text-grey" label="Homme" />
                      <q-radio v-model="utilisateurToEdit.sexe" val="Femme" color="primary" class="text-grey" label="Femme" style="margin-left: 10px" />
                    </q-list>
                    <q-input v-model="utilisateurToEdit.tel" type="text" float-label="Contact"/>
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
                      <q-input v-model="utilisateurToEdit.email" type="text" float-label="Email"/>
                      <q-input
                        float-label="Mot de passe"
                        v-model="utilisateurToEdit.password"
                        type="password"
                        no-pass-toogle="false"
                      />
                      <q-input
                        float-label="Répéter votre mot de passe"
                        v-model="utilisateurToEdit.passwordRepeat"
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
    </q-modal-layout>
  </q-modal>
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
    QDataTable,
    QItemMain,
    QItemTile,
    QDatetime,
    QCollapsible,
    QToolbar,
    QToolbarTitle,
    QField,
    QRadio,
    QList,
    QBtn,
    QIcon,
    Loading,
    Alert,
    QItem,
    QItemSide,
    QSelect,
    QTooltip,
    QFixedPosition,
    QModal,
    QModalLayout,
    QInput,
    QSpinner,
    QFab
  } from 'quasar'
  import ModifUtilisateur from '../etudiant/ModifierModal.vue'
  import { map, last } from 'lodash'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      QCard,
      QDataTable,
      QCardMedia,
      QCardTitle,
      QCardSeparator,
      QCardMain,
      QCardActions,
      QBtn,
      QIcon,
      Loading,
      Alert,
      QItem,
      QItemSide,
      QSelect,
      QTooltip,
      QFixedPosition,
      QModal,
      QModalLayout,
      QInput,
      QSpinner,
      ModifUtilisateur,
      QFab,
      QRadio,
      QList,
      QItemMain,
      QItemTile,
      QField,
      QDatetime,
      QCollapsible,
      QToolbar,
      QToolbarTitle
    },
    data () {
      return {
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        dayNames: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        id: '',
        idPersonne: '',
        fullName: '',
        model: [],
        utilisateur: '',
        passwordRepeat: '',
        avatarImage: 'statics/photovide.jpg',
        utilisateurs: [],
        config: {
          rowHeight: '60px',
          title: '',
          refresh: true,
          columnPicker: true,
          bodyStyle: {
            maxHeight: '400px'
          },
          responsive: true,
          pagination: {
            rowsPerPage: 15,
            options: [5, 10, 15, 30]
          },
          selection: 'single',
          messages: {
            noData: 'Aucune données dans la base données',
            noDataAfterFiltering: 'Aucun résultat. Veuillez raffiner les termes de votre recherche.'
          },
          labels: {
            columns: 'Colonnes',
            allCols: 'Toutes',
            rows: 'Lignes',
            selected: {
              singular: 'utilisateur séléctionné.',
              plural: 'utilisateurs séléctionnés.'
            },
            clear: 'Annuler',
            search: 'Recherche',
            all: 'Tous'
          }
        },
        columns: [
          {
            label: 'Nom(s) et prénom(s)',
            field: 'fullName',
            width: '150px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Identifiant',
            field: 'login',
            width: '150px',
            filter: true,
            sort: true,
            type: 'string'
          }
        ],
        openSupprimer: false,
        openModifierUtilisateurModal: false,
        modifModal: false,
        motif: '',
        isReady: false,
        utilisateurToDelete: '',
        utilisateurToEdit2: '',
        utilisateurToEdit: '',
        utilisateurToDeleteFullName: '',
        mention: '',
        mentionOptions: [],
        annee: '',
        anneeOptions: [],
        parcours: '',
        parcoursOptions: [],
        semestre: '',
        semestreOptions: [],
        select: '',
        selectOptions: [
          {
            label: 'Rp etablissement',
            value: 'resp_etablissement'
          },
          {
            label: 'Rp composant',
            value: 'resp_composant'
          },
          {
            label: 'Rp Domaines',
            value: 'resp_domaine'
          },
          {
            label: 'Chef Mention',
            value: 'chef_mention'
          },
          {
            label: 'Rp Parcours',
            value: 'resp_parcours'
          },
          {
            label: 'Rp UE',
            value: 'resp_ue'
          },
          {
            label: 'Enseignants',
            value: 'enseignant'
          },
          {
            label: 'Chef Scolarité',
            value: 'resp_scolarite'
          },
          {
            label: 'Administrateur',
            value: 'admin'
          },
          {
            label: 'Aucune responsabilité',
            value: 'aucune_resp'
          }
        ]
      }
    },
    computed: {
      ...mapGetters({
        u: 'utilisateur/utilisateurs'
      })
    },
    props: {
      personneModif: ''
    },
    watch: {
      personneModif: function (newVal, oldVal) {
        console.log('idPersonne', newVal)
        this.id = ''
        this.idPersonne = ''
        this.utilisateurToEdit.nom = newVal.personne.nom
        this.utilisateurToEdit.prenom = newVal.personne.prenom
        this.fullName = newVal.personne.nom + ' ' + newVal.personne.prenom
        this.utilisateurToEdit.sexe = newVal.personne.sexe
        this.utilisateurToEdit.email = newVal.personne.email
        this.utilisateurToEdit.tel = newVal.personne.tel
        if (newVal.photo === '') {
          this.avatarImage = 'statics/photovide.jpg'
        }
        else {
          this.avatarImage = newVal.photo
        }
        this.idPersonne = newVal.personne.id
        this.id = newVal.id
      },
      select: function (selection) {
        console.log(selection)
        this.$store.dispatch('utilisateur/filter', selection)
          .then((res) => {
            this.isReady = true
            this.utilisateurs = []
            map(res, (ut) => {
              ut.email = ut.email
              ut.fullName = ut.nom + ' ' + ut.prenom
              ut.photo = ''
              ut.tel = ut.tel
              this.utilisateurs.push(ut)
            })
          })
          .catch((err) => {
            console.log(err)
          })
      },
      compoundProperty () {
        if (this.select !== '') {
          this.refresh(() => {
            console.log('Init finished')
          })
        }
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
        this.utilisateurToEdit.photo = URL.createObjectURL(file)
        this.image = file
        reader.readAsDataURL(file)
      },
      closeThisModal () {
        this.$emit('close')
      },
      updateUsers () {
        let utilisateur = {
          id: this.utilisateurToEdit.id,
          nom: this.utilisateurToEdit.nom,
          contact: this.utilisateurToEdit.contact,
          prenom: this.utilisateurToEdit.prenom,
          sexe: this.utilisateurToEdit.sexe,
          tel: this.utilisateurToEdit.tel,
          photo: this.utilisateurToEdit.photo,
          email: this.utilisateurToEdit.email,
          password: this.utilisateurToEdit.password
        }
        this.$store.dispatch('utilisateur/editUser', utilisateur)
          .then((utilisateur) => {
            this.$store.dispatch('utilisateur/setPhoto', {utilisateur: utilisateur, image: this.image})
              .then((utilisateur) => {
                Alert.create({enter: 'bounceInRight', leave: 'bounceOutRight', color: 'positive', html: 'Modification effectuée avec succés'})
                this.$router.go(-1)
              })
              .catch((err) => {
                console.log('Erreur d\'ajout de la photo: ', err)
              })
          })
          .catch((error) => {
            console.log('ModifierModal.vue modificatinUtilisateur', error)
          })
      },
      setProps () {
        this.utilisateurToEdit2 = this.utilisateurToEdit
      },
      refresh (done) {
        this.$store.dispatch('getFonction')
          .then((fonction) => {
            this.config.title = '<span style="color: rgba(0,0,0,0.54);font-weight: bold;font-size: 95%;">Liste de(s) Utilisateurs administrateur</span>'
          })
        this.$store.dispatch('utilisateur/filter', 'aucune_resp')
          .then((res) => {
            this.isReady = true
            this.utilisateurs = []
            map(res, (ut) => {
              ut.login = ut.login
              ut.fullName = ut.nom + ' ' + ut.prenom
              ut.photo = ''
              ut.tel = ut.tel
              this.utilisateurs.push(ut)
            })
          })
          .catch((err) => {
            console.log(err)
          })
        if (done) done()
      },
      modifierUtilisateur (selection) {
        this.modifModal = true
        this.utilisateurToEdit = selection.rows[0].data
      },
      supprimerUtilisateur (selection) {
        this.openSupprimer = true
        this.utilisateurToDelete = selection
        this.utilisateurToDeleteFullName = selection.rows[0].data.fullName
      },
      deleteUtilisateur () {
        let utilisateur = this.utilisateurToDelete.rows[0].data
        utilisateur.motifSuppr = this.motif
        utilisateur.supprime = true
        delete utilisateur.fullName
        this.$store.dispatch('etudiant/deleteEtudiant', utilisateur)
          .then((res) => {
            let alert = Alert.create({
              html: 'L\'utilisateur ' + utilisateur.numeroMatricule + ' est supprimé',
              enter: 'bounceInLeft',
              leave: 'bounceOutRight',
              color: 'green',
              position: 'top-right',
              icon: 'check'
            })
            this.refresh()
            this.openSupprimer = false
            setTimeout(function () {
              alert.dismiss()
            }, 4000)
          })
          .catch((err) => {
            if (err) {
              let alert = Alert.create({
                html: 'L\'utilisateur ne peut pas être supprimé',
                enter: 'bounceInLeft',
                leave: 'bounceOutRight',
                color: 'red',
                position: 'top-right',
                icon: 'warning'
              })
              setTimeout(function () {
                alert.dismiss()
              }, 2000)
            }
          })
      },
      changeImage () {
        alert('Fonction pour changer l\'image ...')
      }
    },
    mounted () {
      this.select = 'aucune_resp'
      this.refresh()
      this.$refs.modifierUtilisateurModal.$on('close', () => {
        this.modifModal = false
        this.refresh(() => {
          // console.log('Init finished')
        })
      })
      this.$store.dispatch('anneeuniversitaire/getAllAnneeUniversitaire')
        .then((res) => {
          map(res, a => {
            let annee = {
              label: a.code,
              value: a.id,
              icon: 'date_range'
            }
            this.anneeOptions.push(annee)
          })
          this.annee = last(res).id
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
  }
</script>

<style lang="stylus">
  @import '~variables'
  ._no-padding
    padding 0 !important
    .q-item
      padding-left 0

  ._deleteModal
    .layout-header
      box-shadow none

    .layout-footer
      box-shadow none
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

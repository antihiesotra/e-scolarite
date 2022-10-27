<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div class="layout-padding">
    <div class="layout-view">
      <!-- your content -->
      <q-card v-if="isReady">
        <q-data-table
          :data="etudiants"
          :config="config"
          :columns="columns"
          :refresh="refresh"
          class="bg-white"
        >
          <!-- Custom renderer when user selected one or more rows -->
          <template slot="selection" slot-scope="selection">
            <q-btn color="primary" icon="edit" @click="modifierEtudiant(selection)">
              <span class="gt-sm">Modifier</span>
            </q-btn>
            <q-btn color="negative" icon="delete" @click="supprimerEtudiant(selection)">
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
            @click="$router.push('/scolarite/etudiant/ajout')"
            class="animate-pop"
          >
            <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Inscrire un étudiant</q-tooltip>
            <q-icon name="person_add" />
          </q-btn>
          <q-btn
            round
            color="primary"
            @click="$router.push('/scolarite/etudiant/supprime')"
            class="animate-pop"
          >
            <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Etudiant(s) supprimé(s)</q-tooltip>
            <q-icon name="delete" />
          </q-btn>
          <q-btn
            round
            color="primary"
            @click="$router.push('/scolarite/etudiant/personnes')"
            class="animate-pop"
          >
            <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Liste de tous les étudiants de tous les établissements</q-tooltip>
            <q-icon name="assignment" />
          </q-btn>
        </q-fab>
      </q-fixed-position>
      <q-modal ref="deleteModal" class="_deleteModal" v-model="openSupprimer"
               :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '50vw', minHeight: '45vh'}">
        <q-modal-layout>
          <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey">
            <div class="">
              <div class="col-sm-12 layout-padding ">
                <div style="margin: 0;font-size: 24px" class="text-negative">Supprimer l'étudiant ?</div>
              </div>
            </div>
            <q-btn flat round small @click="$refs.deleteModal.close()" style="position: absolute;top: 1em;right: 1em">
              <q-icon name="close" />
            </q-btn>
          </div>
          <div class="layout-padding">
            <div class="text-grey text-italic">Voulez vous vraiment supprimer cet étudiant ?</div>
            <div class="text-grey text-italic">{{ etudiantToDeleteFullName }}</div>
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
                     @click="deleteEtudiant()">Oui
              </q-btn>
            </div>
          </div>
        </q-modal-layout>
      </q-modal>
      <q-modal @open="setProps()" ref="modifEtudiant" maximized v-model="openModifierEtudiantModal">
        <modif-etudiant ref="modifierEtudiantModal" :etudiantModif="etudiantToEdit2"></modif-etudiant>
      </q-modal>
    </div>
  </div>
</template>

<script>
  import {
    QCard,
    QDataTable,
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
  import ModifEtudiant from './ModifierModal.vue'
  import { map } from 'lodash'

  export default {
    components: {
      QCard,
      QDataTable,
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
      ModifEtudiant,
      QFab
    },
    data () {
      return {
        etudiants: [],
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
              singular: 'etudiant séléctionné.',
              plural: 'etudiants séléctionnés.'
            },
            clear: 'Annuler',
            search: 'Recherche',
            all: 'Tous'
          }
        },
        columns: [
          {
            label: 'Photo',
            field: 'photo',
            width: '50px',
            classes: '_no-padding',
            type: 'string'
          },
          {
            label: 'Nom(s) et prénom(s)',
            field: 'fullName',
            width: '150px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Sexe',
            field: 'sexe',
            width: '40px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Adresse',
            field: 'adresse',
            width: '150px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Contact',
            field: 'tel',
            width: '50px',
            filter: true,
            sort: true,
            type: 'string'
          }
        ],
        openSupprimer: false,
        openModifierEtudiantModal: false,
        motif: '',
        isReady: false,
        etudiantToDelete: '',
        etudiantToEdit2: '',
        etudiantToEdit: '',
        etudiantToDeleteFullName: ''
      }
    },
    computed: {
    },
    methods: {
      setProps () {
        this.etudiantToEdit2 = this.etudiantToEdit
      },
      refresh (done) {
        this.$store.dispatch('getFonction')
          .then((fonction) => {
            let {composant} = fonction.vars
            this.config.title = '<span style="color: rgba(0,0,0,0.54);font-weight: bold;font-size: 95%;">Etudiants du composant ' + composant.libelle + '</span>'
            this.$store.dispatch('etudiant/getAllEtudiantByComposant', composant.id)
              .then((res) => {
                this.isReady = true
                this.etudiants = []
                map(res, (et) => {
                  et.adresse = et.idPersonne.adresse
                  et.tel = et.idPersonne.tel
                  et.sexe = et.idPersonne.sexe
                  et.fullName = et.idPersonne.nom + ' ' + et.idPersonne.prenom
                  et.photo = et.idPersonne.urlPhoto
                  this.etudiants.push(et)
                })
              })
              .catch((err) => {
                console.log(err)
              })
          })
          .catch((err) => {
            console.log(err)
          })
        if (done) done()
      },
      modifierEtudiant (selection) {
        this.openModifierEtudiantModal = true
        this.etudiantToEdit = selection.rows[0].data
      },
      supprimerEtudiant (selection) {
        this.openSupprimer = true
        this.etudiantToDelete = selection
        this.etudiantToDeleteFullName = selection.rows[0].data.fullName
      },
      deleteEtudiant () {
        let etudiant = this.etudiantToDelete.rows[0].data
        etudiant.motifSuppr = this.motif
        etudiant.supprime = true
        delete etudiant.fullName
        this.$store.dispatch('etudiant/deleteEtudiant', etudiant)
          .then((res) => {
            let alert = Alert.create({
              html: 'L\'étudiant ' + etudiant.numeroMatricule + ' est supprimé',
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
                html: 'L\'étudiant ne peut pas être supprimé',
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
      this.refresh()
      this.$refs.modifierEtudiantModal.$on('close', () => {
        this.openModifierEtudiantModal = false
        this.refresh(() => {
          // console.log('Init finished')
        })
      })
    }
  }
</script>

<style lang="stylus">
  ._no-padding
    padding 0 !important
    .q-item
      padding-left 0

  ._deleteModal
    .layout-header
      box-shadow none

    .layout-footer
      box-shadow none


</style>

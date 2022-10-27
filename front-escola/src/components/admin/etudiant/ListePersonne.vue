<template>
  <div class="layout-view">
    <!-- if you want automatic padding use "layout-padding" class -->
    <div class="layout-padding" v-if="isReady">
      <!-- your content -->
      <q-card>
        <q-data-table
          :data="etudiants"
          :config="config"
          :columns="columns"
          :refresh="refresh"
          class="bg-white"
        >
          <!-- Custom renderer when user selected one or more rows -->
          <template slot="selection" slot-scope="selection">
            <q-btn color="primary" icon="person add" @click="inscrire(selection)">
              <span class="gt-sm">Inscrire</span>
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

      <q-fixed-position corner="bottom-left" :offset="[18, 18]">
        <q-btn
          round
          color="primary"
          @click="$router.push('/scolarite/etudiant/ajout')"
          class="animate-pop"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Ajout d'un étudiant</q-tooltip>
          <q-icon name="person_add" />
        </q-btn>
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
            <div class="text-grey text-italic">RAKOTOARISOA Jean</div>
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
    </div>
    <template v-else>
      <div style="height: 80vh" class="row justify-center items-center">
        <q-spinner
          color="primary"
          size="100"
        />
      </div>
    </template>
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
    Dialog,
    QInput,
    QSpinner
  } from 'quasar'
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
      Dialog,
      QInput,
      QSpinner
    },
    data () {
      return {
        etudiants: [],
        config: {
          rowHeight: '60px',
          title: '<span style="color: rgba(0,0,0,0.54);font-weight: bold;font-size: 95%;">Liste des étudiants de tous les établissements</span>',
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
        motif: '',
        isReady: false
      }
    },
    computed: {
    },
    methods: {
      refresh (done) {
        setTimeout(() => {
          this.$store.dispatch('etudiant/getAllEtudiants')
            .then((res) => {
              this.etudiants = []
              this.isReady = true
              map(res, (et) => {
                et.fullName = et.nom + ' ' + et.prenom
                et.photo = et.urlPhoto
                this.etudiants.push(et)
              })
            })
            .catch((err) => {
              console.log(err)
            })
          done()
        }, 1000)
      },
      inscrire (selection) {
        alert('Fonction pour inscrire l\'etudiant ...')
      },
      changeImage () {
        alert('Fonction pour changer l\'image ...')
      }
    },
    mounted () {
      this.refresh(() => {
        console.log('Init finished')
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

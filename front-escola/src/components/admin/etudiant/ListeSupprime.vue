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
        isReady: false
      }
    },
    computed: {
    },
    methods: {
      refresh (done) {
        setTimeout(() => {
          this.$store.dispatch('getFonction')
            .then((fonction) => {
              const {composant} = fonction.vars
              this.config.title = '<span style="color: rgba(0,0,0,0.54);font-weight: bold;font-size: 95%;">Listes des étudiants supprimés du composant ' + composant.libelle + '</span>'
              this.$store.dispatch('etudiant/getAllEtudiantSupprimeByComposant', composant.id)
                .then((res) => {
                  this.isReady = true
                  this.etudiants = []
                  map(res, (et) => {
                    et.adresse = et.idPersonne.adresse
                    et.tel = et.idPersonne.tel
                    et.sexe = et.idPersonne.sexe
                    et.fullName = et.idPersonne.nom + ' ' + et.idPersonne.prenom
                    et.photo = et.idPersonne.photo
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
          done()
        }, 2000)
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

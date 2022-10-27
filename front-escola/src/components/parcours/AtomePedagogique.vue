<template>
  <div class="layout-padding">
    <!--Data Table-->
    <q-card class="shadow-1">
      <q-data-table
        :data="atomePedagogiques"
        :config="config"
        :columns="columns"
        @refresh="refresh"
      >
        <!-- Custom renderer when user selected one or more rows -->
        <template slot="selection" slot-scope="selection">
          <q-btn color="primary" icon="edit" @click="openModalUpdate(selection)">
            <span class="gt-sm">Modifier</span>
          </q-btn>
          <q-btn color="negative" icon="delete" @click="deleteAtomePedagogique(selection)">
            <span class="gt-sm">Supprimer</span>
          </q-btn>
        </template>
      </q-data-table>
    </q-card>

    <!--Modal Add Atome Pedagogique-->
    <q-modal v-model="modalAddAtomePedagogique" :content-css="{minWidth: '40vw', minHeight: '40vh'}">
      <div class="layout-padding">
        <q-input v-model="newAtomePedagogique.code" float-label="Code" />
        <q-input v-model="newAtomePedagogique.libelle" float-label="Libelle" />
        <q-input v-model="newAtomePedagogique.abreviation" float-label="Abréviation" />
        <q-btn color="primary" @click="addAtomePedagogique()">Modifier</q-btn>
        <q-btn color="" @click="modalAddAtomePedagogique = false">Close</q-btn>
      </div>
    </q-modal>

    <!--Modal Update Atome Pedagogique-->
    <q-modal v-model="modalUpdateAtomePedagogique" :content-css="{minWidth: '40vw', minHeight: '40vh'}">
      <div class="layout-padding">
        <q-input v-model="selectedAtomePedagogique.code" stack-label="Code" />
        <q-input v-model="selectedAtomePedagogique.libelle" stack-label="Libelle" />
        <q-input v-model="selectedAtomePedagogique.abreviation" stack-label="Abréviation" />
        <q-btn color="primary" @click="updateAtomePedagogique()">Modifier</q-btn>
        <q-btn color="" @click="cancelUpdate()">Close</q-btn>
      </div>
    </q-modal>

    <!--Button fixed left botton-->
    <q-fixed-position corner="bottom-left" :offset="[18, 18]">
      <q-btn
        round
        color="primary"
        @click="modalAddAtomePedagogique = true"
        class="animate-pop"
      >
        <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Ajout d'un étudiant</q-tooltip>
        <q-icon name="note_add" />
      </q-btn>
    </q-fixed-position>

  </div>
</template>

<script>
  import {
    QDataTable,
    QTooltip,
    QBtn,
    QModal,
    QInput,
    Dialog,
    QFixedPosition,
    QIcon,
    QCard
  } from 'quasar'

  import { mapGetters } from 'vuex'

  export default {
    components: {
      QDataTable,
      QTooltip,
      QBtn,
      QModal,
      QInput,
      QFixedPosition,
      QIcon,
      QCard
    },
    data () {
      return {
        /* atomePedagogiques: [
          {
            code: 'et',
            libelle: 'Enseignement Théorique',
            abreviation: 'ET'
          },
          {
            code: 'ed',
            libelle: 'Enseignement Doctoral',
            abreviation: 'ED'
          },
          {
            code: 'ep',
            libelle: 'Enseignement Pratique',
            abreviation: 'EP'
          }
        ],
        */
        selectedAtomePedagogique: [],
        oldSelectedAtomePedagogique: [],
        modalUpdateAtomePedagogique: false,
        modalAddAtomePedagogique: false,
        config: {
          // [REQUIRED] Set the row height
          rowHeight: '50px',
          // (optional) Title to display
          title: '<span style="color: rgba(0,0,0,0.54);font-weight: bold;font-size: 95%;">Atome pédagogique</span>',
          // (optional) No columns header
          noHeader: false,
          // (optional) Display refresh button
          refresh: true,
          // (optional)
          // User will be able to choose which columns
          // should be displayed
          columnPicker: true,
          // (optional) How many columns from the left are sticky
          leftStickyColumns: 0,
          // (optional) How many columns from the right are sticky
          rightStickyColumns: 2,
          // (optional)
          // Styling the body of the data table;
          // "minHeight", "maxHeight" or "height" are important
          bodyStyle: {
            maxHeight: '500px'
          },
          // (optional) By default, Data Table is responsive,
          // but you can disable this by setting the property to "false"
          responsive: true,
          // (optional) Use pagination. Set how many rows per page
          // and also specify an additional optional parameter ("options")
          // which forces user to make a selection of how many rows per
          // page he wants from a specific list
          pagination: {
            rowsPerPage: 8,
            options: [5, 8, 10, 15, 30, 50, 500]
          },
          // (optional) Select one or more rows for an action
          // "single" adds a column with radio buttons for single row selection
          // "multiple" adds a column with checkboxes for multiple row selection
          // omitting the property will result in no selection column at all
          selection: 'single',
          // (optional) Override default messages when no data is available
          // or the user filtering returned no results.
          messages: {
            noData: 'Aucune données dans la base de données',
            noDataAfterFiltering: 'Aucun résultat. Veuillez raffiner les termes de votre recherche.'
          },
          // (optional) Override default labels. Useful for I18n.
          labels: {
            columns: 'Colonnes',
            allCols: 'Toutes',
            rows: 'Lignes',
            selected: {
              singular: 'Atome Pédagogique séléctionné.',
              plural: 'Atome Pédagogique séléctionnés.'
            },
            clear: 'Annuler',
            search: 'Recherche',
            all: 'Tous'
          }
        },
        columns: [
          {
            label: 'Code',
            field: 'code',
            width: '100px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Libelle',
            field: 'libelle',
            width: '100px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Abréviation',
            field: 'abreviation',
            width: '100px',
            filter: true,
            sort: true,
            type: 'string'
          }
        ],
        atomePedagogiques: [],
        newAtomePedagogique: {
          code: '',
          libelle: '',
          abreviation: ''
        }
      }
    },
    methods: {
      refresh () {
        this.$store.dispatch('getAllAtomePedagogique')
          .then((res) => {
            this.atomePedagogiques = res
          })
          .catch((err) => {
            console.log('err', err)
          })
      },
      openModalUpdate (ap) {
        this.selectedAtomePedagogique = ap.rows[0].data
        this.oldSelectedAtomePedagogique = Object.assign({}, ap.rows[0].data)
        this.modalUpdateAtomePedagogique = true
      },
      deleteAtomePedagogique (ap) {
        this.selectedAtomePedagogique = ap.rows[0].data
        let that = this
        Dialog.create({
          title: '<div style="color: red;">Suppression</div>',
          message: `Voulez-vous vraiment supprimer cet Atome pédagogique ?`,
          buttons: [
            'Annuler',
            {
              label: '<div style="color: red;">Oui, supprimer définitivement</div>',
              handler: () => {
                this.$store.dispatch('deleteAtomePedagogique', that.selectedAtomePedagogique)
                  .then((res) => {
                    console.log('res delete', res)
                    let compareId = (at) => {
                      return at.id === that.selectedAtomePedagogique.id
                    }
                    let index = that.atomePedagogiques.findIndex(compareId)
                    that.atomePedagogiques.splice(index, 1)
                  })
                  .catch((err) => {
                    console.log('err delete', err)
                  })
              }
            }
          ]
        })
      },
      cancelUpdate () {
        let compareId = (at) => {
          return at.id === this.selectedAtomePedagogique.id
        }
        let index = this.atomePedagogiques.findIndex(compareId)
        this.atomePedagogiques.splice(index, 1, this.oldSelectedAtomePedagogique)
        this.selectedAtomePedagogique = []
        this.modalUpdateAtomePedagogique = false
      },
      updateAtomePedagogique () {
        this.$store.dispatch('updateAtomePedagogique', this.selectedAtomePedagogique)
          .then((res) => {
            console.log('res update', res)
          })
          .catch((err) => {
            console.log('err update', err)
          })
      },
      addAtomePedagogique () {
        this.$store.dispatch('addAtomePedagogique', this.newAtomePedagogique)
          .then((res) => {
            console.log('res', res)
            this.atomePedagogiques.push(res)
            this.modalAddAtomePedagogique = false
            this.newAtomePedagogique = {
              code: '',
              libelle: '',
              abreviation: ''
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      }
    },
    computed: {
      ...mapGetters({
      })
    },
    mounted () {
      this.$store.dispatch('getAllAtomePedagogique')
        .then((res) => {
          this.atomePedagogiques = res[0]
          console.log('res', res)
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
  }
</script>

<style>
</style>

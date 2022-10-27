<template>
  <div>
    <q-data-table
      :data="domaines"
      :config="config"
      :columns="columns"
      :refresh="refresh"
    >

      <template slot="selection" slot-scope="selection">
        <q-btn color="primary" icon="edit" @click="selectionner(selection)">
          <span class="gt-sm">Modifier</span>
        </q-btn>
      </template>

    </q-data-table>
  </div>
</template>

<script>
  // native components
  import {
    QDataTable,
    QBtn
  } from 'quasar'

  // Vuex
  import {mapActions, mapGetters} from 'vuex'

  export default {
    props: {
      value: Object
    },
    components: {
      QDataTable,
      QBtn
    },
    data () {
      return {
        // selectedEtablissement: JSON.parse(JSON.stringify(this.value)),
        selectedDomaine: { ...this.value },
        config: {
          rowHeight: '60px',
          title: '<span style="color: rgba(0,0,0,0.54);font-weight: bold;font-size: 95%;">Listes des domaines</span>',
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
            noData: 'Aucune données dans la base données ...',
            noDataAfterFiltering: 'Aucun résultat. Veuillez peaufiner les termes de votre recherche.'
          },
          labels: {
            columns: 'Colonnes',
            allCols: 'Toutes',
            rows: 'Lignes',
            selected: {
              singular: 'libelle séléctionné.',
              plural: 'data séléctionnés.'
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
            width: '50px',
            filter: true,
            sort: true,
            classes: '_no-padding',
            type: 'string'
          },
          {
            label: 'Libellé',
            field: 'libelle',
            width: '100px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Responsable',
            field: 'responsableDomaine',
            width: '70px',
            filter: true,
            sort: true,
            type: 'string',
            format (value) {
              return value ? value.nom + ' ' + value.prenom : value
            }
          }
        ]
      }
    },
    computed: {
      ...mapGetters('domaine', [
        'domaines'
      ])
    },
    mounted () {
      this.getAllDomaine()
    },
    methods: {
      ...mapActions('domaine', [
        'getAllDomaine'
      ]),
      selectionner (selection) {
        this.selectedDomaine = JSON.parse(JSON.stringify(selection.rows[0].data))
        this.$emit('input', this.selectedDomaine)
        this.$emit('modification')
      },
      refresh (done) {
        setTimeout(() => {
          this.getAllDomaine()
          done()
        }, 2000)
      }
    }
  }
</script>

<style>
</style>

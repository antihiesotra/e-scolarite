<template>
  <q-card>
    <q-data-table
      :data="filteredMentions"
      :config="config"
      :columns="columns">

      <template slot="selection" slot-scope="selection">
        <q-btn color="primary" icon="edit" @click="selectionner(selection)">
          <span class="gt-sm">Modifier</span>
        </q-btn>
        <q-btn color="secondary" icon="list" @click="selectionner(selection)">
          <span class="gt-sm">Liste des parcours</span>
        </q-btn>
      </template>

    </q-data-table>
  </q-card>
</template>

<script>
  // native components
  import {
    QDataTable,
    QBtn,
    QCard
  } from 'quasar'

  // Vuex
  import { mapGetters } from 'vuex'

  export default {
    props: {
      value: Object
    },
    components: {
      QDataTable,
      QBtn,
      QCard
    },
    computed: {
      ...mapGetters('mention', [
        'filteredMentions'
      ])
    },
    data () {
      return {
        config: {
          rowHeight: '60px',
          title: '<span style="color: rgba(0,0,0,0.54);font-weight: bold;font-size: 95%;">Liste des mentions</span>',
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
          selection: false,
          messages: {
            noData: 'Aucune données dans la base de données ...',
            noDataAfterFiltering: 'Aucun résultat pour votre recherche.'
          },
          labels: {
            columns: 'Colonnes',
            allCols: 'Toutes',
            rows: 'Lignes',
            selected: {
              singular: 'mention séléctionnée.',
              plural: 'mentions séléctionnées.'
            },
            clear: 'Annuler',
            search: 'Rechercher',
            all: 'Tous'
          }
        },
        columns: [
          {
            label: 'Code',
            field: 'code',
            width: '50px',
            paddingLeft: '1em',
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
            field: 'responsableMention',
            width: '40px',
            filter: true,
            sort: true,
            type: 'string',
            format (value) {
              return value ? value.nom + ' ' + value.prenom : ''
            }
          }
        ],
        selectedMention: { ...this.value }
      }
    },
    mounted () {
    },
    methods: {
      selectionner (selection) {
        this.selectedMention = JSON.parse(JSON.stringify(selection.rows[0].data))
        this.$emit('input', this.selectedMention)
        this.$emit('modification')
      }
    }
  }
</script>

<style>
</style>

<template>
  <q-data-table
    :data="filteredComposants"
    :config="config"
    :columns="columns">

    <template slot="selection" slot-scope="selection">
      <q-btn color="primary" icon="edit" @click="selectionner(selection)">
        <span class="gt-sm">Modifier</span>
      </q-btn>
      &nbsp;
      <q-btn color="secondary" icon="list" @click="voirMentions(selection)">
        <span class="gt-sm">Liste des mentions</span>
      </q-btn>
    </template>

  </q-data-table>
</template>

<script>
  // native components
  import {
    QDataTable,
    QBtn
  } from 'quasar'

  // Vuex
  import { mapGetters } from 'vuex'

  export default {
    components: {
      QDataTable,
      QBtn
    },
    computed: {
      ...mapGetters('composant', [
        'filteredComposants'
      ])
    },
    data () {
      return {
        config: {
          rowHeight: '60px',
          title: '<span style="color: rgba(0,0,0,0.54);font-weight: bold;font-size: 95%;">Listes des composants</span>',
          refresh: true,
          columnPicker: true,
          bodyStyle: {
            maxHeight: '400px'
          },
          responsive: true,
          pagination: {
            rowsPerPage: 15, options: [5, 10, 15, 30]
          },
          selection: 'single',
          messages: {
            noData: 'Aucune données dans la base de données ...',
            noDataAfterFiltering: 'Aucun résultat pour votre recherche.'
          },
          labels: {
            columns: 'Colonnes',
            allCols: 'Toutes',
            rows: 'Lignes',
            selected: {
              singular: 'composant séléctionné.',
              plural: 'composants séléctionnés.'
            },
            clear: 'Annuler',
            search: 'Rechercher',
            all: 'Tous'
          }
        },
        columns: [
          {
            label: 'Code Composant',
            field: 'code',
            width: '40px',
            type: 'string'
          },
          {
            label: 'Libellé',
            field: 'libelle',
            width: '80px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Localisation',
            field: 'localisation',
            width: '70px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Statut',
            field: 'status',
            width: '50px',
            filter: true,
            sort: true,
            type: 'string',
            format (value) {
              switch (value) {
                case 'grande_ecole':
                  return 'GRANDE ÉCOLE'
                case 'universite':
                  return 'UNIVERSITÉ'
                case 'ecole':
                  return 'ÉCOLE SPÉCIALISÉ'
                case 'institut':
                  return 'INSTITUT SPÉCIALISÉ'
                case 'ecole_art':
                  return 'ECOLE SUPÉRIEURE D’ART ET D’ARTS APPLIQUÉS'
                case 'ens':
                  return 'ÉCOLE NATIONALE SUPÉRIEURE'
                default:
                  return value
              }
            }
          }
        ]
      }
    },
    mounted () {
    },
    methods: {
      selectionner (selection) {
        this.selectedComposant = JSON.parse(JSON.stringify(selection.rows[0].data))
        this.$emit('input', this.selectedComposant)
        this.$emit('modification')
      },
      voirMentions (selection) {
        const composant = selection.rows[0].data
        this.$router.push('/etablissement/mention/' + composant.code)
      }
    }
  }
</script>

<style>
</style>

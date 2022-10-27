<template>
  <q-card>
    <q-data-table
      :data="filteredParcours"
      :config="config"
      :columns="columns">

      <!--<template slot="selection" slot-scope="selection">
        <q-btn color="primary" icon="edit" @click="selectionner(selection)">
          <span class="gt-sm">Modifier</span>
        </q-btn>
        <q-btn color="secondary" icon="list" @click="selectionner(selection)">
          <span class="gt-sm">Liste des unités d'enseignement</span>
        </q-btn>
      </template>-->

    </q-data-table>

    <q-fixed-position corner="bottom-left" :offset="[18, 18]">
      <q-btn round color="primary" @click="$router.go(-1)" class="animate-pop">
        <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Retour</q-tooltip>
        <q-icon name="reply"></q-icon>
      </q-btn>
    </q-fixed-position>
  </q-card>
</template>

<script>
  // native components
  import {
    QDataTable,
    QBtn,
    QCard,
    QFixedPosition,
    QIcon,
    QTooltip
  } from 'quasar'

  // Vuex
  import { mapGetters } from 'vuex'

  export default {
    components: {
      QDataTable,
      QBtn,
      QCard,
      QFixedPosition,
      QIcon,
      QTooltip
    },
    computed: {
      ...mapGetters('parcours', [
        'filteredParcours'
      ])
    },
    data () {
      return {
        config: {
          rowHeight: '60px',
          title: '<span style="color: rgba(0,0,0,0.54);font-weight: bold;font-size: 95%;">Liste des parcours</span>',
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
            field: 'responsableParcours',
            width: '100px',
            filter: true,
            sort: true,
            type: 'string',
            format (value) {
              return value ? value.responsableParcours : value
            }
          }
        ]
      }
    },
    mounted () {
      if (!this.$route.params.code_mention) {
        this.$router.go(-1)
      }
      this.getFilteredParcours()
    },
    methods: {
      getFilteredParcours () {
        this.$store.dispatch('parcours/getAllParcoursByCodeMention', this.$route.params.code_mention)
          .then(allParcours => {
            console.log('Liste filtrée des parcours: ', allParcours)
            // this.filteredParcours = JSON.parse(JSON.stringify(allParcours))
          })
          .catch(error => {
            console.log('Erreur de récupération des parcours: ', error)
          })
      }
    }
  }
</script>

<style>
</style>

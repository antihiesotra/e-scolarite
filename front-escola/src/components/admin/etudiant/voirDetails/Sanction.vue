<template>
  <div class="row">
    <br/>
    <div class="col-xs-12">
      <q-card class="animate-fade">
        <q-data-table
          :data="etudiants"
          :config="config"
          :columns="columns"
          class="bg-white"
        >
        <template slot="selection" slot-scope="selection">
          <q-btn color="purple" icon="file_upload" @click="telechargerReference(selection)">
            <span class="gt-sm">Téléchagrer la référence</span>
          </q-btn>
          <!--q-btn color="secondary" icon="assignment_ind" @click="detailSanction(selection)">
            <span class="gt-sm">Voir détail</span>
          </q-btn-->
        </template>
        </q-data-table>
      </q-card>
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
    // Dialog,
    Alert,
    QItem,
    QItemMain,
    QItemSide,
    QItemTile,
    QSelect,
    QTooltip,
    QFixedPosition,
    QCheckbox,
    QChip,
    QModal,
    QModalLayout,
    QInput,
    QFab
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
      QItemMain,
      QItemSide,
      QItemTile,
      QSelect,
      QTooltip,
      QFixedPosition,
      QCheckbox,
      QChip,
      QModal,
      QModalLayout,
      QInput,
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
              singular: 'sanction séléctionné.',
              plural: 'sanctions séléctionnés.'
            },
            clear: 'Annuler',
            search: 'Recherche',
            all: 'Tous'
          }
        },
        columns: [
          {
            label: 'Mesure',
            field: 'mesure_libelle',
            width: '55px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Date de décision',
            field: 'date',
            width: '200px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Commentaire',
            field: 'commentaire',
            width: '125px',
            filter: true,
            sort: true,
            type: 'string'
          }
        ]
      }
    },
    methods: {
      telechargerReference (selection) {
        const url = window.URL.createObjectURL(new Blob(['../../escola-api/document_sanction/' + selection.rows[0].data.reference]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', selection.rows[0].data.reference)
        document.body.appendChild(link)
        link.click()
      }
    },
    props: {
      infoEtudiant: {}
    },
    created () {
      console.log('etudiant', this.infoEtudiant.etudiant)
      this.$store
        .dispatch('getSanctionEtudiantsByPersonne', this.infoEtudiant.etudiant.idPersonne.id)
        .then((res) => {
          this.etudiants = []
          map(res, (et) => {
            console.log('et ', et)
            et.mesure_libelle = et.mesure.libelle
            et.date = et.mesureDate
            et.commentaire = et.commentaire
            this.etudiants.push(et)
          })
        })
        .catch((error) => {
          console.log('error', error)
        })
    }
  }
</script>

<style lang="stylus">
  ._ue
    background #dddddd
    font-weight bold
</style>
<template>
  <div class="layout-view">
    <div class="text-center">
      <div class="col-sm-12 layout-padding ">
        <div style="margin: 0;font-size: 24px" class="light-paragraph">Nombres total des étudiant est de {{ totalNbEtudiant }}</div>
      </div>
    </div>
    <q-card>
      <q-data-table
        :data="composantHistoriques"
        :config="config"
        :columns="columns"
        :refresh="refresh"
      >

        <template slot="selection" slot-scope="selection">
          <q-btn color="primary" icon="edit" @click="openModalDetails(selection)">
            <span class="gt-sm">Voir détail</span>
          </q-btn>
        </template>

      </q-data-table>
    </q-card>
    <q-modal class="_addModal" v-model="openDetail"
               :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '40vw', minHeight: '80vh'}"
               @close="closeModalDetails">
        <q-modal-layout>
          <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey;">
            <div class="text-center">
              <div class="col-sm-12 layout-padding ">
                <div style="margin: 0;font-size: 24px" class="light-paragraph">Répartition des étudians du composant {{ composantSelect.code }}</div>
              </div>
            </div>
            <q-btn flat round small @click="closeModalDetails" style="position: absolute;top: 1em;right: 1em">
              <q-icon name="close" />
            </q-btn>
          </div>

          <div class="_modal-content" style="border-bottom: none;">
            <br>
            <br>
            <div class="row" style="padding-left: 10px;padding-right: 10px;">
              <div class="col-md-3">
                <q-select
                  style="margin-top: 0;"
                  color="primary"
                  float-label="Année universitaire *"
                  v-model="annee"
                  :options="anneeOptions"
                />
              </div>
              <div class="col-md-4">
                <q-select
                  style="margin-top: 0;"
                  color="primary"
                  float-label="Mention *"
                  v-model="mention"
                  :options="mentionOptions"
                />
              </div>
              <div class="col-md-5">
                <q-select
                  style="margin-top: 0;"
                  color="primary"
                  float-label="Parcours *"
                  v-model="parcours"
                  :options="parcoursOptions"
                />
              </div>
            </div>
            <br>
            <div class="row" style="padding-left: 10px;padding-right: 10px;">
              <p class="gt-sm">Nombre d'étudiant inscrit a cette année  : {{ nbEtudiantByAnneeComposant }}</p>
              <p class="gt-sm">Nombre d'étudiant inscrit a cette mention dans cette années  : {{ nbEtudiantByAnneeMention }}</p>
              <p class="gt-sm">Nombre d'étudiant inscrit a cette parcours  : {{ nbEtudiantByAnneeParcours }}</p>
            </div>
          </div>
          <div slot="footer" :class="'_no-shadow'" style="padding: 15px 100px 20px;">
            <div class="flex flex-center">
            </div>
          </div>
        </q-modal-layout>
      </q-modal>
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
  import { map, last, first } from 'lodash'

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
        composantHistoriques: [],
        openSupprimer: false,
        motif: '',
        totalNbEtudiant: 0,
        isReady: false,
        composantSelect: {},
        openDetail: false,
        anneeLabel: '',
        annee: '',
        anneeOptions: [],
        mention: '',
        mentionOptions: [],
        parcours: '',
        parcoursOptions: [],
        nbEtudiantByAnneeComposant: '',
        nbEtudiantByAnneeMention: '',
        nbEtudiantByAnneeParcours: '',
        config: {
          rowHeight: '60px',
          title: '<span style="color: rgba(0,0,0,0.54);font-weight: bold;font-size: 95%;">Tableau de bord</span>',
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
            noData: 'Aucune données dans la base de données ...',
            noDataAfterFiltering: 'Aucun résultat pour votre recherche.'
          },
          labels: {
            columns: 'Colonnes',
            allCols: 'Toutes',
            rows: 'Lignes',
            selected: {
              singular: 'annee séléctionnée.',
              plural: 'annees séléctionnées.'
            },
            clear: 'Annuler',
            search: 'Rechercher',
            all: 'Tous'
          }
        },
        columns: [
          {
            label: 'Composant',
            field: 'infoComposant',
            classes: '_no-padding',
            type: 'string'
          },
          {
            label: 'Nb Etudiant',
            field: 'nbEtudiantByComposant',
            filter: true,
            sort: true,
            type: 'string'
          }
        ]
      }
    },
    computed: {
      allFormFill: function () {
        return this.annee !== '' && this.mention !== ''
      }
    },
    methods: {
      openModalDetails (selection) {
        this.composantSelect = selection.rows[0].data
        this.mentionOptions = []
        Loading.show()
        this.$store.dispatch('mention/getAllMentionByComposant', selection.rows[0].data.id)
          .then((res) => {
            map(res, m => {
              let mention = {
                label: m.libelle,
                value: m.id,
                icon: 'extension'
              }
              this.mentionOptions.push(mention)
            })
            this.mention = first(this.mentionOptions).value
            this.openDetail = true
            Loading.hide()
          })
          .catch((err) => {
            console.log(err)
            Loading.hide()
          })
        if (this.allFormFill) {
          this.getAllEtudiant()
        }
      },
      getAllEtudiant () {
        this.nbEtudiantByAnneeComposant = ''
        this.nbEtudiantByAnneeMention = ''
        this.nbEtudiantByAnneeParcours = ''
        let param = {
          composantId: this.composantSelect.id,
          anneeUnivId: this.annee
        }
        let param1 = {
          mentionId: this.mention,
          anneeUnivId: this.annee
        }
        let param2 = {
          parcoursId: this.parcours,
          anneeUnivId: this.annee
        }
        this.$store.dispatch('tableaudebord/getAllEtudiantByComposantAnnee', param)
          .then((res) => {
            this.nbEtudiantByAnneeComposant = res
          })
          .catch((err) => {
            console.log('Err get etudiant', err)
          })
        this.$store.dispatch('tableaudebord/getAllEtudiantAnnneMention', param1)
          .then((res) => {
            this.nbEtudiantByAnneeMention = res
          })
          .catch((err) => {
            console.log('Err get etudiant', err)
          })
        this.$store.dispatch('tableaudebord/getAllEtudiantByAnneParcours', param2)
          .then((res) => {
            this.nbEtudiantByAnneeParcours = res
          })
          .catch((err) => {
            console.log('Err get etudiant', err)
          })
      },
      closeModalDetails () {
        this.openDetail = false
      },
      getInfosEtudiantByComposant: function (composant) {
        this.composantHistoriques = []
        let totaux = 0
        map(composant, (et) => {
          this.$store.dispatch('tableaudebord/getInfosEtudiantByComposant', et.id).then((res) => {
            et.infoComposant = et.libelle
            et.nbEtudiantByComposant = res
            totaux += res
            this.composantHistoriques.push(et)
            this.totalNbEtudiant = totaux
          }).catch((err) => {
            console.log(err)
          })
        })
      },
      refresh (done) {
        Loading.show()
        setTimeout(() => {
          this.$store.dispatch('tableaudebord/getAllComposantByEtablissement', this.$route.params.id_universite)
            .then((res) => {
              this.getInfosEtudiantByComposant(res)
              Loading.hide()
            })
            .catch((err) => {
              console.log(err)
              Loading.hide()
            })
          done()
        }, 1000)
      }
    },
    watch: {
      annee: function (val) {
        console.log('annee : ' + val)
        if (val && this.allFormFill) {
          this.getAllEtudiant()
        }
      },
      mention: function (mention) {
        if (mention !== '') {
          this.parcoursOptions = []
          this.$store.dispatch('parcours/getParcoursByMention', mention)
            .then((res) => {
              map(res, p => {
                let parcours = {
                  label: p.libelle,
                  value: p.id,
                  icon: 'bubble_chart'
                }
                this.parcoursOptions.push(parcours)
              })
              this.parcours = first(this.parcoursOptions).value
            })
            .catch((err) => {
              console.log(err)
            })
        }
      },
      parcours: function (val) {
        if (this.allFormFill) {
          this.getAllEtudiant()
        }
      }
    },
    mounted () {
      this.refresh(() => {
        console.log('Init finished')
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
          this.anneeLabel = last(res).code
        })
        .catch((err) => {
          console.log('err', err)
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

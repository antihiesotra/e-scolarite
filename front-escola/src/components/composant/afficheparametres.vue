<template>
  <div>
    <div class="layout-padding">
      <div class="row">
        <div class="col-md-3">
          <q-card>
            <q-card-main>
              <q-select
                v-model="parametre.annee"
                float-label="Année Universitaire"
                :options="listAnnee"
                v-on:change="changeYear($event)"
              />
            </q-card-main>
          </q-card>
        </div>
      </div>
      <div>
        <q-card>
          <q-card-main>
            <h6> Paramètres Généraux, Paramètres de validation de l'Unité d'Enseignement (UE) et Moyenne Générale pour la Délibération</h6>
            <div class="row">
              <div class="col-md-13">
                <q-data-table
                  :data="parametres"
                  :config="config"
                  :columns="columns"
                  :refresh="refresh"
                  class="bg-white"
                >
                </q-data-table>
                <br>
              </div>
            </div>
          </q-card-main>
        </q-card>
      </div>
    </div>
    <div class="layout-padding text-center">
      <q-btn color="primary" @click="$router.push('/composant/parametre')">Nouveaux paramètres</q-btn>
    </div>
  </div>
</template>

<script>
  import {
    QBtn,
    QIcon,
    QSelect,
    QInput,
    QDialogSelect,
    QToggle,
    Alert,
    QCardMain,
    QCard,
    QDataTable,
    Loading
  } from 'quasar'

  import {map, first} from 'lodash'
  import {required, between} from 'vuelidate/lib/validators'
  import * as paramsValue from '../../configs/constants/paramsValue'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      Loading,
      QDataTable,
      QBtn,
      QIcon,
      QSelect,
      QInput,
      QDialogSelect,
      QToggle,
      QCardMain,
      Alert,
      QCard
    },
    data () {
      return {
        parametres: [],
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
              singular: 'parametre séléctionné.',
              plural: 'parametres séléctionnés.'
            },
            clear: 'Annuler',
            search: 'Recherche',
            all: 'Tous'
          }
        },
        columns: [
          {
            label: 'Identifiant',
            field: 'id',
            width: '3px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Clef',
            field: 'clef',
            width: '150px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Entité',
            field: 'entite',
            width: '150px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Valeur',
            field: 'valeur',
            width: '150px',
            filter: true,
            sort: true,
            type: 'string'
          }
        ],
        listAnnee: [],
        listMention: [],
        selectedAnnee: [],
        listModeSaisie: [
          {
            label: 'directe',
            value: 'directe'
          },
          {
            label: 'autres',
            value: 'autre'
          }
        ],
        selectedModeSaisie: '',
        noteDefinitiveOptions: [
          {
            label: 'Note maximale',
            value: paramsValue.NOTE_MAX
          },
          {
            label: 'Note rattrapage',
            value: paramsValue.NOTE_RATTRAPAGE
          }
        ],
        listAdmission: [
          {
            label: 'voie de concours',
            value: 'concours'
          },
          {
            label: 'selection de dossier',
            value: 'dossier'
          },
          {
            label: 'autre',
            value: 'autre'
          }
        ],
        selectedAdmission: '',
        parametre: {
          libelle: 'MENTION',
          annee: '',
          modeSaisie: '',
          admission: '',
          noteEliminatoire: '',
          noteEliminatoireEC: '',
          noteSupEliminatoire: '',
          noteValideChefMention: '',
          moyenneDeliberable: '',
          moyenneGDeliberable: '',
          creditSemestre: '',
          noteDefinitive: ''
        },
        selection: ''
      }
    },
    computed: {
      noData () {
        return this.mentions.length === 0
      },
      ...mapGetters('etablissement', [
        'adminData'
      ])
    },
    watch: {
      parametre: function () {
        /*  let field = {
          codeEntite: this.parametre.codeEntite,
          annee: this.parametre.annee
        }
        this.$store.dispatch('parametre/getParametre', field)
          .then((res) => {
            console.log(res)
          }) */
      }
    },
    validations: {
      parametre: {
        annee: {required},
        modeSaisie: {required},
        admission: {required},
        noteEliminatoire: {required},
        noteEliminatoireEC: {required},
        noteSupEliminatoire: {required},
        noteValideChefMention: {required},
        moyenneDeliberable: {required},
        moyenneGDeliberable: {required},
        creditSemestre: {required},
        noteDefinitive: {required},
        pourcentage: {required, between: between(0, 100)}
      }
    },
    methods: {
      refresh (done) {
        /* setTimeout(() => {
          let field = {
            codeEntite: this.parametre.codeEntite,
            annee: this.parametre.annee
          }
          this.$store.dispatch('parametre/getParametre', field)
            .then((res) => {
              console.log(res)
            })
            .catch((err) => {
              console.log(err)
            })
        }, 1000) */
      },
      changeParametre: function changeParametre ($event) {
        /* let field = {
          idComposant: this.adminData.composant,
          idAnneeUniversitaire: $event
        }
        console.log('field ', field)
        this.$store.dispatch('mention/getAllMentionsByCodeComposant', this.adminData.composant.code)
          .then((res) => {
            console.log('annee', res)
            let mentionConvert = res
            map(mentionConvert, (a, i) => {
              let mention = {
                label: a.libelle,
                value: a.id,
                icon: 'today'
              }
              this.listMention.push(mention)
            })
            this.parametre.mention = first(res).id
          })
          .catch((err) => {
            console.log('err', err)
          }) */
      },
      changeYear: function changeYear ($event) {
        let field = {
          idComposant: this.adminData.composant,
          annee: $event
        }
        console.log('field ', field)
        this.config.title = '<span style="color: rgba(0,0,0,0.54);font-weight: bold;font-size: 95%;">Informations dans paramètre</span>'
        this.$store.dispatch('parametre/getParametreByYear', field)
          .then((res) => {
            this.isReady = true
            this.parametres = []
            console.log('Res Resultat :' + res.data)
            map(res, (ut) => {
              ut.id = ut.id
              ut.clef = ut.clef
              ut.entite = ut.entite
              ut.valeur = ut.valeur
              this.parametres.push(ut)
            })
          })
          .catch((err) => {
            console.log(err)
          })
        /* this.$store.dispatch('mention/getAllMentionsByCodeComposant', this.adminData.composant.code)
          .then((res) => {
            console.log('annee', res)
            this.parametre.mention = []
            let mentionConvert = res
            map(mentionConvert, (a, i) => {
              let mention = {
                label: a.libelle,
                value: a.id,
                icon: 'today'
              }
              this.listMention.push(mention)
            })
            this.parametre.mention = first(res).id
          })
          .catch((err) => {
            console.log('err', err)
          }) */
      }
    },
    mounted () {
      let anneeUniv = 0
      this.$store.dispatch('anneeuniversitaire/getAllAnneeUniversitaire')
        .then((res) => {
          console.log('annee', res)
          let anneeConvert = res
          map(anneeConvert, (a, i) => {
            let annee = {
              label: a.code,
              value: a.id
            }
            this.listAnnee.push(annee)
          })
          this.parametre.annee = first(res).id
          anneeUniv = first(res).id
          this.$store.dispatch('getFonction')
            .then((fonction) => {
              let vars = fonction.vars
              this.listMention.push({
                label: vars.mention.libelle,
                value: vars.mention.id,
                icon: 'today'
              })
              this.parametre.mention = vars.mention.id
              this.parametre.codeEntite = vars.mention.code
              this.config.title = '<span style="color: rgba(0,0,0,0.54);font-weight: bold;font-size: 95%;">Informations dans paramètre</span>'
              let field = {
                annee: anneeUniv
              }
              this.$store.dispatch('parametre/getParametreByYear', field)
                .then((res) => {
                  this.isReady = true
                  this.parametres = []
                  console.log('Res Resultat :' + res.data)
                  map(res, (ut) => {
                    ut.id = ut.id
                    ut.clef = ut.clef
                    ut.entite = ut.entite
                    ut.valeur = ut.valeur
                    this.parametres.push(ut)
                  })
                })
                .catch((err) => {
                  console.log(err)
                })
            })
        })
        .catch((err) => {
          console.log('err', err)
        })
      this.refresh()
    }
  }
</script>

<style>

</style>

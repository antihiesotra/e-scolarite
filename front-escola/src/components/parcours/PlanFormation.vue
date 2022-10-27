<template>
  <div class="layout-padding">
    <q-modal :no-esc-dismiss="true" v-model="import_export">
      <PfEditor :identity="{semestre, annee, parcours}" @close="closeImportExport"/>
    </q-modal>
    <div class="row" style="padding-left: 10px;padding-right: 10px;">
      <div class="col-sm-3">
        <q-select
          style="margin-top: 0;"
          color="primary"
          float-label="Année universitaire"
          v-model="annee"
          :options="anneeOptions"
        />
      </div>
      <div class="col-sm-3">
        <q-select
          style="margin-top: 0;"
          color="primary"
          float-label="Semestre "
          v-model="semestre"
          :options="semestreOptions"
        />
      </div>
      <div class="col-sm-3">
        <q-select
          style="margin-top: 0;"
          color="primary"
          float-label="Mention"
          v-model="mention"
          read-only='true'
          :options="mentionOptions"
        />
      </div>
      <div class="col-sm-3">
        <q-select
          style="margin-top: 0;"
          color="primary"
          float-label="Parcours"
          v-model="parcours"
          :options="parcoursOptions"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-4 offset-1">
        <h4 class="text-left content-left">Plan de Formation</h4>
        <div class="row justify-left">
          <div class="col-8">
            <q-card v-for="u in ue" class="cursor-pointer" @click="infoUE(u)" :key="u.id">
              <q-card-title>
                {{ u.libelle }}
              </q-card-title>
            </q-card>
          </div>
        </div>
      </div>
      <div class="col-6">
        <h4 class="text-left content-left">Eléments constitutifs</h4>
        <h5 class="text-left content-left">{{ totalcredit }} <span :class="statusColor"> {{statusCredit}} </span></h5>
        <div class="row justify-left">
          <div class="col-12">
          <q-data-table
            :data="ecSelectUe"
            :config="config"
            :columns="columns"
            class="bg-white"
          >
            <template slot="selection" slot-scope="selection">
              <q-btn color="secondary" icon="edit" @click="openModalReinscription(selection)">
                <span class="gt-sm">Modifier</span>
              </q-btn>
            </template>
          </q-data-table>
          </div>
        </div>
      </div>
    </div>

    <!--Modal Add UE-->
    <q-modal v-model="modalAddUE" :content-css="{minWidth: '40vw', minHeight: '40vh'}">
      <div class="layout-padding">
        <q-input v-model="newUE.libelle" :error="$v.newUE.libelle.$error" float-label="Libelle" />
        <q-input v-model="newUE.code" :error="$v.newUE.code.$error" float-label="Code" />
        <q-input v-model="newUE.abreviation" :error="$v.newUE.abreviation.$error" float-label="Abréviation" />
        <q-select
          v-model="newUE.isCompensable" :error="$v.newUE.isCompensable.$error"
          float-label="Compensable"
          :options="is_compensableOptions"
        />
        <q-select
          v-model="newUE.typeUe" :error="$v.newUE.typeUe.$error"
          float-label="Type UE"
          :options="typeUe"
        />
        <q-select
          :options="utilisateurs"
          v-model="newUE.responsableUe"
          chips
          float-label="Nom de l'Enseignant responsable"
          filter
          autofocus-filter
          filter-placeholder="Chercher l'enseignant"
          justify-center
        ></q-select>
        <q-btn color="primary" @click="addUe()">Ajouter</q-btn>
        <q-btn color="" @click="resetValueUe()">Annuler</q-btn>
      </div>
    </q-modal>
    <q-fixed-position v-if="allFormFill" corner="bottom-left" :offset="[18, 18]">
      <q-btn
        round
        color="primary"
        @click="openModalAddUE()"
        class="animate-pop"
      >
        <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Ajouter une unité d'enseignement</q-tooltip>
        <q-icon name="note_add" />
      </q-btn>
    </q-fixed-position>
    <q-fixed-position v-if="allFormFill" corner="bottom-right" :offset="[18, 18]">
      <q-btn
        round
        color="primary"
        @click="import_export = true"
        class="animate-pop"
        icon="import_export"
      >
        <q-tooltip anchor="center left" self="center right" :offset="[10, 10]">Import/Export</q-tooltip>
      </q-btn>
    </q-fixed-position>
  </div>
</template>

<script>
  import {
    QCard,
    QDataTable,
    QCardTitle,
    QCardSeparator,
    QCardMain,
    QBtn,
    QTransition,
    QSelect,
    QFixedPosition,
    QTooltip,
    QIcon,
    Loading,
    QModal,
    QInput,
    Alert,
    QField,
    QList,
    QListHeader
  } from 'quasar'

  import { map } from 'lodash'
  import {required} from 'vuelidate/lib/validators'
  import PfEditor from './PfEditor'

  export default {
    components: {
      PfEditor,
      QDataTable,
      QIcon,
      QCard,
      QCardTitle,
      QCardSeparator,
      QCardMain,
      QBtn,
      QTransition,
      QSelect,
      QFixedPosition,
      QTooltip,
      QModal,
      QInput,
      Alert,
      QField,
      QList,
      QListHeader
    },
    data () {
      return {
        typeUe: [],
        is_compensableOptions: [
          {
            label: 'Oui',
            value: 'true'
          },
          {
            label: 'Non',
            value: 'false'
          }
        ],
        utilisateurs: [],
        modalAddUE: false,
        ue: [],
        ecSelectUe: [],
        annee: '',
        anneeOptions: [],
        mention: '',
        mentionOptions: [],
        parcours: '',
        parcoursOptions: [],
        semestre: '',
        semestreOptions: [],
        import_export: false,
        totalcredit: '',
        statusCredit: '',
        statusColor: '',
        newUE: {
          libelle: '',
          code: '',
          abreviation: '',
          isCompensable: 'true',
          typeUe: 0,
          responsableUe: 0
        },
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
              singular: 'Ec séléctionné.',
              plural: 'Ec séléctionnés.'
            },
            clear: 'Annuler',
            search: 'Recherche',
            all: 'Tous'
          }
        },
        columns: [
          {
            label: 'Libelle',
            field: 'libelle',
            width: '70px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Crédit',
            field: 'credit',
            width: '70px',
            filter: true,
            sort: true,
            type: 'string'
          }
        ]
      }
    },
    computed: {
      allFormFill: function () {
        return this.annee !== '' && this.mention !== '' && this.parcours !== '' && this.semestre !== ''
      }
    },
    watch: {
      allFormFill: function (val) {
        if (val) {
          this.findPlanFormation()
        }
      },
      annee: function (val) {
        if (val) {
          this.fillSemestre(val)
        }
      },
      semestre: function () {
        this.findPlanFormation()
      }
    },
    validations: {
      newUE: {
        libelle: {required},
        code: {required},
        abreviation: {required},
        typeUe: {required},
        isCompensable: {required}
      }
    },
    methods: {
      getSelected (value) {
        if (value) return {id: value}
        else return null
      },
      closeImportExport () {
        this.import_export = false
      },
      addUe () {
        this.$v.newUE.$touch()
        if (this.$v.newUE.$error) {
          this.$alert.error('Veuillez remplir les champs')
        }
        else {
          let params = {
            code: this.newUE.code,
            parcours: this.parcours,
            semestre: {
              semestrePK: {
                id: this.semestre,
                idAnneeUniversitaire: this.annee
              }
            },
            libelle: this.newUE.libelle,
            abreviation: this.newUE.abreviation,
            isCompensable: this.newUE.isCompensable,
            typeUe: this.getSelected(this.newUE.typeUe),
            responsableUe: this.getSelected(this.newUE.responsableUe)
          }
          this.$store.dispatch('ue/addUe', params)
            .then((res) => {
              console.log(res)
              this.$alert.success('Ajout avec succès')
              this.findPlanFormation()
              this.modalAddUE = false
            })
            .catch((err) => {
              console.log('err Add Ue', err)
            })
        }
      },
      resetValueUe () {
        this.newUE = {
          libelle: '',
          code: '',
          abreviation: '',
          typeUe: 0,
          responsableUe: 0
        }
        this.modalAddUE = false
      },
      openModalAddUE () {
        this.modalAddUE = true
      },
      getInfoSelectFilter () {
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
            this.annee = this.anneeOptions[this.anneeOptions.length - 1].value
          })
          .catch((err) => {
            console.log('err', err)
          })
      },
      fillSemestre (id) {
        this.$store.dispatch('semestre/getSemestreByIdAnneeUniversitaire', id)
          .then((semestres) => {
            this.semestreOptions = []
            map(semestres, s => {
              let semestre = {
                label: s.libelle,
                value: s.semestrePK.id,
                icon: 'today'
              }
              this.semestreOptions.push(semestre)
            })
            this.semestre = this.semestreOptions[0].value
          })
          .catch((err) => {
            console.log('err', err)
          })
      },
      infoUE (ue) {
        this.$store.commit('planformation/SET_SELECTED_UE_PF', ue)
        if (ue.typeUe.libelle === 'Optionnel') {
          this.$router.push('/parcours/plan-de-formation/ue-optionnel')
        }
        else {
          this.$router.push('/parcours/plan-de-formation/ue')
        }
      },
      findPlanFormation () {
        if (!this.annee || !this.mention || !this.parcours || !this.semestre) {
          return
        }
        let params = {
          idParcours: this.parcours,
          idSemestre: this.semestre,
          idAnneeUniversitaire: this.annee
        }
        Loading.show()
        this.$store.dispatch('planformation/getPlanDeFormation', params)
          .then((res) => {
            this.ecSelectUe = []
            this.statusCredit = ''
            setTimeout(() => {
              let creditTotal = 0
              this.totalcredit = res.creditUe
              map(res, c => {
                this.$store.dispatch('ec/getAllEcOfUe', c.id)
                  .then((resec) => {
                    map(resec, (et) => {
                      et.libelle = et.libelle
                      et.credit = et.credit
                      creditTotal += et.credit
                      this.ecSelectUe.push(et)
                    })
                    this.totalcredit = 'Total crédit : ' + creditTotal
                    if (creditTotal === 30) {
                      this.statusCredit = '(Complet)'
                      this.statusColor = 'text-positive'
                    }
                    else if (creditTotal < 30) {
                      this.statusCredit = '(Incomplet)'
                      this.statusColor = 'text-negative'
                    }
                    else {
                      this.statusCredit = '(Exhaustif)'
                      this.statusColor = 'text-negative'
                    }
                  })
                  .catch((err) => {
                    console.log('EC error', err)
                  })
              })
              this.ue = res
              Loading.hide()
            }, 1000)
          })
          .catch((err) => {
            console.log('err', err)
          })
      }
    },
    mounted () {
      this.getInfoSelectFilter()

      this.$store.dispatch('getFonction')
        .then((fonction) => {
          let vars = fonction.vars

          let mention = {
            label: vars.mention.libelle,
            value: vars.mention,
            icon: 'extension'
          }
          this.mention = mention.value
          this.mentionOptions.push(mention)

          let parcours = {
            label: vars.parcours.libelle,
            value: vars.parcours.id,
            icon: 'bubble_chart'
          }
          this.parcours = parcours.value
          this.parcoursOptions.push(parcours)
        })

      this.$store.dispatch('planformation/getAllTypeUe')
        .then((res) => {
          map(res, t => {
            let type = {
              label: t.libelle,
              value: t.id
            }
            this.typeUe.push(type)
          })
        })
        .catch((err) => {
          console.log(err)
        })
      this.$store.dispatch('utilisateur/getAllUsers')
        .then((res) => {
          map(res, u => {
            let utilisateur = {
              label: u.nom + ' ' + u.prenom,
              value: u.id
            }
            this.utilisateurs.push(utilisateur)
          })
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
  }
</script>

<style>
</style>

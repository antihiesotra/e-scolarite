<template>
  <q-transition
    appear
    enter="fadeInRight"
    leave="fadeOutRight"
  >
    <div class="layout-padding" v-if="isReady">
      <!--Card with info about the UE-->
      <q-card class="head-card" color="blue-grey-1">
        <q-card-title class="text-black">
          <div class="row">
            <div class="col-3 offset-4" style="margin-button: -20px">
              Unité D'enseignements
            </div>
            <div class="col-2 offset-11" style="margin-top: -30px">
              <q-btn round color="primary" icon="edit" small @click="openModalUpdateUE()"/>
            </div>
          </div>
          <div class="row">
            <div style="margin-left: 20px">
              <b>Libelle : </b>{{ ue.libelle }}
            </div>
            <div style="margin-left: 20px">
              <b>Code : </b>{{ ue.code }}
            </div>
            <div style="margin-left: 20px">
              <b>Abréviation : </b>{{ ue.abreviation }}
            </div>
            <div style="margin-left: 20px">
              <b>Compensable : </b>{{ french(ue.isCompensable) }}
            </div>
          </div>
        </q-card-title>
      </q-card>

      <!--Data Table-->
      <q-data-table
        :data="allEc"
        :config="config"
        :columns="columns"
        @refresh=""
      >
        <!-- Custom renderer when user selected one or more rows -->
        <template slot="selection" slot-scope="selection">
          <q-btn color="primary" icon="edit" @click="openModalUpdateEC(selection)">
            <span class="gt-sm">Modifier</span>
          </q-btn>
        </template>
      </q-data-table>

      <!--Modal Edit UE-->
      <q-modal v-model="modalUpdateUE" :content-css="{minWidth: '40vw', minHeight: '40vh'}">
        <div class="layout-padding">
          <q-input v-model="ue.libelle" float-label="Libelle" />
          <q-input v-model="ue.code" float-label="Code" />
          <q-input v-model="ue.abreviation" float-label="Abréviation" />
          <q-select
            v-model="ue.isCompensable"
            float-label="Compensable"
            :options="is_compensableOptions"
          />
          <q-btn color="primary" @click="updateUe()">Modifier</q-btn>
          <q-btn color="" @click="resetValueUe()">Annuler</q-btn>
        </div>
      </q-modal>

      <!--Modal Edit EC-->
      <q-modal v-model="modalUpdateEC" :content-css="{minWidth: '40vw', minHeight: '40vh'}">
        <div class="layout-padding">
          <q-input v-model="selectedEC.libelle" float-label="Libelle" />
          <q-input v-model="selectedEC.code" float-label="Code" />
          <q-input v-model="selectedEC.abreviation" float-label="Abréviation" />
          <q-input type="number" v-model="selectedEC.credit" float-label="Credit" />
          <q-input type="number" v-model="selectedEC.noteEliminatoire" float-label="Note éliminatoire" />
          <q-select
            :options="utilisateurs"
            v-model="selectedEC.enseignant"
            chips
            float-label="Nom de l'Enseignant"
            filter
            autofocus-filter
            filter-placeholder="Chercher l'enseignant"
            justify-center
          />

          <q-btn color="primary" @click="updateEc()">Modifier</q-btn>
          <q-btn color="" @click="resetValueEc()">Close</q-btn>
        </div>
      </q-modal>

      <!--Modal Add EC-->
      <q-modal v-model="modalAddEC" :content-css="{minWidth: '40vw', minHeight: '40vh'}">
        <div class="layout-padding">
          <q-input v-model="newEc.libelle" float-label="Libelle" />
          <q-input v-model="newEc.code" float-label="Code" />
          <q-input v-model="newEc.abreviation" float-label="Abréviation" />
          <q-select
            v-model="newEc.typeEc"
            float-label="Type EC"
            :options="typeEc"
          />
          <q-input type="number" v-model="newEc.credit" float-label="Credit" />
          <q-input type="number" v-model="newEc.noteEliminatoire" float-label="Note éliminatoire" />
          <q-select
            :options="utilisateurs"
            v-model="newEc.enseignant"
            chips
            float-label="Enseignant"
            filter
            autofocus-filter
            filter-placeholder="Chercher l'enseignant"
            justify-center/>

          <q-btn color="primary" @click="addEc()">Ajouter</q-btn>
          <q-btn color="" @click="resetValueEc()">Close</q-btn>
        </div>
      </q-modal>
      <q-fixed-position corner="bottom-left" :offset="[18, 18]">
        <q-btn
          round
          color="primary"
          @click="openModalAddEC()"
          class="animate-pop"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Ajouter un EC</q-tooltip>
          <q-icon name="note_add" />
        </q-btn>
      </q-fixed-position>
    </div>
  </q-transition>
</template>

<script>
  import 'quasar-extras/animate/fadeInRight.css'
  import 'quasar-extras/animate/fadeOutRight.css'

  import {
    QTransition,
    QCard,
    QCardTitle,
    QCardSeparator,
    QCardMain,
    QInput,
    QDataTable,
    QBtn,
    QModal,
    QSelect,
    QAutocomplete,
    QChipsInput,
    QFixedPosition,
    QTooltip,
    Loading,
    QIcon

  } from 'quasar'

  import { map } from 'lodash'

  export default {
    components: {
      QTransition,
      QCard,
      QCardTitle,
      QCardSeparator,
      QCardMain,
      QInput,
      QDataTable,
      QBtn,
      QModal,
      QSelect,
      QAutocomplete,
      QChipsInput,
      QFixedPosition,
      QTooltip,
      QIcon

    },
    data () {
      return {
        newEc: {
          libelle: '',
          code: '',
          abreviation: '',
          typeEc: '',
          credit: '',
          noteEliminatoire: ''
        },
        allEc: [],
        isResponsableSelected: true,
        active: false,
        input: '',
        isReady: false,
        ue: null,
        modalUpdateUE: false,
        modalUpdateEC: false,
        modalAddEC: false,
        editedUE: {
          code: '',
          libelle: '',
          abreviation: '',
          isCompensable: ''
        },
        selectedTypeEc: null,
        config: {
          rowHeight: '50px',
          title: '<span style="color: rgba(0,0,0,0.54);font-weight: bold;font-size: 95%;">Elements Constitutif</span>',
          noHeader: false,
          refresh: false,
          columnPicker: true,
          leftStickyColumns: 0,
          rightStickyColumns: 2,
          bodyStyle: {
            maxHeight: '500px'
          },
          responsive: true,
          pagination: {
            rowsPerPage: 8,
            options: [5, 8, 10, 15, 30, 50, 500]
          },
          selection: 'single',
          messages: {
            noData: 'Aucune données dans la base de données',
            noDataAfterFiltering: 'Aucun résultat. Veuillez raffiner les termes de votre recherche.'
          },
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
          },
          {
            label: 'Note éliminatoire',
            field: 'noteEliminatoire',
            width: '100px',
            filter: true,
            sort: true,
            type: 'number'
          },
          {
            label: 'Type',
            field: 'typeEc',
            format (value) {
              return value.libelle
            },
            width: '100px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Crédit',
            field: 'credit',
            width: '100px',
            filter: true,
            sort: true,
            type: 'number'
          }
        ],
        typeUe: [],
        typeEc: [],
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
        isCompensable: '',
        nameSelectedResponsable: '',
        utilisateurs: [],
        selectedResponsable: null,
        selectedEC: {
          id: null,
          abreviation: '',
          code: '',
          credit: '',
          noteEliminatoire: null,
          typeEc: {
            id: null,
            code: '',
            libelle: ''
          }
        }
      }
    },
    methods: {
      french (value) {
        if (value === true) return 'Oui'
        else return 'Non'
      },
      getSelected (value) {
        if (value) return {id: value}
        else return null
      },
      addEc () {
        let ec = {
          ...this.newEc,
          typeEc: this.getSelected(this.newEc.typeEc),
          enseignant: this.getSelected(this.newEc.enseignant),
          responsableEc: this.getSelected(this.newEc.responsableEc),
          ue: null,
          ueOptionnel: this.getSelected(this.ue.id)
        }
        this.$store.dispatch('ec/addEc', ec)
          .then((res) => {
            this.modalAddEC = false
            if (this.newEc.typeEc === 2) {
              this.$store.dispatch('ec/getIdecOpt', this.ue.id)
                .then((resid) => {
                  let tabIdecopt = []
                  map(resid, (ecselect) => {
                    let idecopt = {
                      id: ecselect.id
                    }
                    tabIdecopt.push(idecopt.id)
                    console.log('idecopt.id :' + idecopt.id)
                    console.log('res.id :' + res.id)
                    this.$store.dispatch('ec/updateidEcTab', tabIdecopt + '/' + res.id)
                      .then((insert) => {
                        console.log('LG 327----')
                      })
                  })
                })
            }
            this.checkEcCollection()
            this.newEc = {ue: {id: this.ue.id}}
          })
          .catch((err) => {
            console.log('Err Add', err)
          })
      },
      openModalAddEC () {
        this.modalAddEC = true
      },
      checkResponsable () {
        if (this.$store.getters['planformation/selectedUE'].idUtilisateur) {
          this.nameSelectedResponsable = [ this.$store.getters['planformation/selectedUE'].idUtilisateur.nom + ' ' + this.$store.getters['planformation/selectedUE'].idUtilisateur.prenom ]
          this.selectedResponsable = this.$store.getters['planformation/selectedUE'].idUtilisateur.id
        }
      },
      checkUeSelected () {
        /* let ueId = this.$store.getters['planformation/selectedUE'].id */
        this.$store.dispatch('ueoptionnel/getInfosById', this.$route.params.id_ue_optionnel)
          .then((ueInfos) => {
            this.ue = ueInfos
          })
          .catch((err) => {
            this.$alert.error('Une erreur est survenue lors de ueoptionnel/getInfosById')
            console.log('err Ue', err)
          })
      },
      checkEcCollection () {
        /* let ueId = this.$store.getters['planformation/selectedUE'].id */
        this.$store.dispatch('ec/getAllEcOfUeOptionnel', this.$route.params.id_ue_optionnel)
          .then((ecs) => {
            this.allEc = ecs
          })
          .catch((err) => {
            this.$alert.error('Une erreur est survenue lors de ue/getAllEcOfUeOptionnel')
            console.log('err Ue', err)
          })
      },
      resetValueUe () {
        this.modalUpdateUE = false
      },
      resetValueEc () {
        this.modalAddEC = false
        this.modalUpdateEC = false
      },
      updateUe () {
        let params = {
          ...this.ue,
          isCompensable: this.ue.isCompensable,
          idTypeUe: 2,
          enseignant: this.getSelected(this.ue.enseignant),
          ue: this.getSelected(this.ue.id)
        }
        console.log(params)
        this.$store.dispatch('ueoptionnel/updateUeOp', params)
          .then((res) => {
            this.modalUpdateUE = false
            this.checkUeSelected()
            this.$alert.success('Modifié avec succès')
          })
          .catch((err) => {
            this.$alert.error('Une erreur est survenue lors de la modification')
            console.log('err update Ue', err)
          })
      },
      updateEc () {
        let ec = {
          ...this.selectedEC,
          typeEc: 2,
          enseignant: this.getSelected(this.selectedEC.enseignant),
          responsableEc: this.getSelected(this.selectedEC.responsableEc),
          ue: null,
          ueOptionnel: this.getSelected(this.ue.id)
        }
        this.$store.dispatch('ec/updateEc', ec)
          .then((res) => {
            this.$alert.success('EC Modifié avec succès')
            this.checkEcCollection()
            this.modalUpdateEC = false
          })
          .catch((err) => {
            console.log('error Update Ec', err)
            this.$alert.error('Une erreur est survenue lors de la modification')
          })
      },
      openModalUpdateUE () {
        this.modalUpdateUE = true
      },
      openModalUpdateEC (selection) {
        this.selectedEC = JSON.parse(JSON.stringify(selection.rows[0].data))
        this.modalUpdateEC = true
      }
    },
    watch: {
      selectedEC: function (val) {
        if (typeof val.enseignant !== 'number') {
          this.selectedEC = {
            ...val,
            isCompensable: val.isCompensable.id,
            typeEc: val.typeEc.id,
            enseignant: val.enseignant ? val.enseignant.id : 0,
            responsableEc: val.responsableEc ? val.responsableEc.id : 0
          }
        }
      },
      modalUpdateEC: function (val) {
        if (!val) {
          console.log(val)
          this.selectedEC.typeEc = {...this.fullTypeEc}
        }
      }
    },
    computed: {
    },
    mounted: function () {
      this.ue = this.$store.getters['planformation/selectedUE']
      this.isReady = true
      this.checkUeSelected()
      this.checkEcCollection()
      this.checkResponsable()
      this.editedUE = {
        ...this.ue,
        isCompensable: this.ue.isCompensable
      }
      this.$store.dispatch('utilisateur/getAllUsers')
        .then((res) => {
          this.utilisateurs.push({
            label: 'Aucun responsable',
            value: 0
          })
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
      this.$store.dispatch('planformation/getAllTypeEc')
        .then((res) => {
          map(res, t => {
            let type = {
              label: t.libelle,
              value: t.id
            }
            this.typeEc.push(type)
          })
        })
        .catch((err) => {
          console.log(err)
        })
      Loading.hide()
    }
  }
</script>

<style>
  .text-black {
    color: black;
  }
  .head-card{
    margin-left: 0;
    margin-right: 0;
    overflow: hidden;
  }
</style>
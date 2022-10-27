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
              Unité D'enseignements optionnel
            </div>
            <div class="col-2 offset-11" style="margin-top: -30px">
              <q-btn round color="primary" icon="edit" small @click="openModalUpdateUE()"/>
            </div>
          </div>
          <div class="row">
            <div class="col-5" style="margin-left: 20px">
              <b>Libelle : </b>{{ ue.libelle }}
            </div>
            <div class="col-2 offset-1">
              <b>Code : </b>{{ ue.code }}
            </div>
            <div class="col-2 offset-1">
              <b>Abréviation : </b>{{ ue.abreviation }}
            </div>
          </div>
        </q-card-title>
        <q-card-main class="text-black" style="margin-top: -50px">
          <div class="row">
            <div class="col-5" style="margin-left: 20px">
              <b>Résponsable : </b><div v-if="ue.responsableUe" style="display: inline">{{ ue.responsableUe.nom }} {{ ue.responsableUe.prenom }}</div>
            </div>
            <div class="col-2 offset-1">
              <b>Type : </b>Optionnel
            </div>
            <div class="col-2 offset-1">
              <b>Compensable : </b>{{ french(ue.isCompensable) }}
            </div>
          </div>
        </q-card-main>
      </q-card>

      <!--Data Table-->
      <q-data-table
        :data="allUeOptionnel"
        :config="config"
        :columns="columns"
        @refresh=""
      >
        <!-- Custom renderer when user selected one or more rows -->
        <template slot="selection" slot-scope="selection">
          <q-btn color="negative" icon="delete" @click="openModalDeleteUeOptionnel(selection)">
            <span class="gt-sm">Supprimer</span>
          </q-btn>
          <q-btn color="primary" icon="edit" @click="openModalUpdateUeOptionnel(selection)">
            <span class="gt-sm">Modifier</span>
          </q-btn>
          <q-btn color="secondary" icon="list" @click="listEcsForUeOptionnel(selection)">
            <span class="gt-sm">Detail</span>
          </q-btn>
        </template>
      </q-data-table>

      <!--Modal Edit UE Parents-->
      <q-modal v-model="modalUpdateUE" :content-css="{minWidth: '40vw', minHeight: '40vh'}">
        <div class="layout-padding">
          <q-input v-model="editedUeOptionnel.libelle" float-label="Libelle" />
          <q-input v-model="editedUeOptionnel.code" float-label="Code" />
          <q-input v-model="editedUeOptionnel.abreviation" float-label="Abréviation" />
          <q-select
            v-model="editedUeOptionnel.isCompensable"
            float-label="Compensable"
            :options="is_compensableOptions"
          />
          <q-select
            v-model="editedUeOptionnel.typeUe"
            float-label="Type UE"
            :options="typeUe"
          />
          <q-select
            :options="utilisateurs"
            v-model="editedUeOptionnel.responsableUe"
            chips
            float-label="Nom de l'Enseignant responsable"
            filter
            autofocus-filter
            filter-placeholder="Chercher l'enseignant"
            justify-center
          ></q-select>
          <q-btn color="primary" @click="updateUe()">Modifier</q-btn>
          <q-btn color="" @click="resetValueUe()">Annuler</q-btn>
        </div>
      </q-modal>
      

      <!--Modal confirm delete ue optionnel-->
      <q-modal ref="deleteModal" class="_deleteModal" v-model="modalDelUeOptionnel"
             :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '50vw', minHeight: '45vh'}">
        <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey">
          <div class="">
            <div class="col-sm-12 layout-padding ">
              <div style="margin: 0;font-size: 24px" class="text-negative">Supprimer l'unité d'enseignement ?</div>
            </div>
          </div>
          <q-btn flat round small @click="$refs.deleteModal.close()" style="position: absolute;top: 1em;right: 1em">
            <q-icon name="close" />
          </q-btn>
        </div>
        <div class="layout-padding">
          <div class="text-grey text-italic">Voulez vous vraiment supprimer de cette l'unité d'enseignement {{ selectedUeOptionnel.libelle }}</div>
          <q-input
            v-model="motif"
            color="tertiary"
            type="textarea"
            float-label="Motif de la suppression"
            :min-rows="5"
          />
        
          <div slot="footer" :class="'_no-shadow'" style="padding: 15px 20px;">
            <div class="flex justify-end">
              <q-btn color="tertiary" style="height: 45px;" rounded class=" col-md-3 col-sm-12 col-12"
                    @click="$refs.deleteModal.close()">Non
              </q-btn>&nbsp;&nbsp;
              <q-btn color="negative" style="height: 45px;" rounded class="col-md-3 col-sm-12 col-12"
                    @click="deleteUeOptionnel()">Oui
              </q-btn>
            </div>
          </div>
        </div>
      </q-modal>
    </q-modal>

      <!--Modal Edit UE Optionnel-->
      <q-modal v-model="modalUpdateUeOptionnel" :content-css="{minWidth: '40vw', minHeight: '40vh'}">
        <div class="layout-padding">
          <q-input v-model="selectedUeOptionnel.libelle" float-label="Libelle" />
          <q-input v-model="selectedUeOptionnel.code" float-label="Code" />
          <q-input v-model="selectedUeOptionnel.abreviation" float-label="Abréviation" />
          <q-select
            v-model="selectedUeOptionnel.isCompensable"
            float-label="Compensable"
            :options="is_compensableOptions"
          />
          <q-btn color="primary" @click="updateUeOptionnnelSelected()">Modifier</q-btn>
          <q-btn color="" @click="resetValueUeOptionnelSelected()">Close</q-btn>
        </div>
      </q-modal>

      <!--Modal Add UE Optionnel-->
      <q-modal v-model="modalAddUeOptionnel" :content-css="{minWidth: '40vw', minHeight: '40vh'}">
        <div class="layout-padding">
          <q-input v-model="newUE.libelle" float-label="Libelle" />
          <q-input v-model="newUE.code" float-label="Code" />
          <q-input v-model="newUE.abreviation" float-label="Abréviation" />
          <q-select
            v-model="newUE.isCompensable"
            float-label="Compensable"
            :options="is_compensableOptions"
          />
          <q-btn color="primary" @click="addUeOptionnel()">Ajouter</q-btn>
          <q-btn color="" @click="resetValueUeOptionnel()">Close</q-btn>
        </div>
      </q-modal>
      <q-fixed-position corner="bottom-left" :offset="[18, 18]">
        <q-btn
          round
          color="primary"
          @click="openModalAddUeOptionnel()"
          class="animate-pop"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Ajouter un UE</q-tooltip>
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
    QRouteTab,
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
      QRouteTab,
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
        newUE: {
          libelle: '',
          code: '',
          abreviation: ''
        },
        allUeOptionnel: [],
        isResponsableSelected: true,
        active: false,
        input: '',
        isReady: false,
        ue: null,
        motif: '',
        modalUpdateUE: false,
        modalUpdateUeOptionnel: false,
        modalDelUeOptionnel: false,
        modalAddUeOptionnel: false,
        editedUeOptionnel: {
          code: '',
          libelle: '',
          abreviation: '',
          isCompensable: ''
        },
        selectedUeOptionnel: {
          code: '',
          libelle: '',
          abreviation: '',
          isCompensable: ''
        },
        selectedTypeEc: null,
        config: {
          rowHeight: '50px',
          title: '<span style="color: rgba(0,0,0,0.54);font-weight: bold;font-size: 95%;">Unités d\'enseignements constitutifs</span>',
          noHeader: false,
          refresh: false,
          columnPicker: true,
          leftStickyColumns: 0,
          rightStickyColumns: 2,
          bodyStyle: {
            maxHeight: '500pSartorius x'
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
          }
        ],
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
        isCompensable: '',
        typeEc: [],
        nameSelectedResponsable: '',
        utilisateurs: [],
        selectedResponsable: null
        // selectedUeOptionnel: []
        /* selectedUeOptionnel: {
          id: null,
          abreviation: '',
          code: '',
          libelle: ''
        } */
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
      addUeOptionnel () {
        let ueOptionnel = {
          ...this.newUE,
          ue: this.getSelected(this.ue.id)
        }
        this.$store.dispatch('ueoptionnel/addUeOptionnel', ueOptionnel)
          .then((res) => {
            this.modalAddUeOptionnel = false
            this.checkUeOptionnelCollection()
            this.newUE = {addUeOptionnel: {id: this.addUeOptionnel.id}}
          })
          .catch((err) => {
            this.$alert.error('Erreur de saisie,' + err)
          })
      },
      listEcsForUeOptionnel (selection) {
        Loading.show()
        return this.$router.push('/parcours/plan-de-formation/ec-ue-optionnel/' + JSON.parse(JSON.stringify(selection.rows[0].data)).id)
      },
      openModalDeleteUeOptionnel (selection) {
        console.log(selection)
        this.selectedUeOptionnel = JSON.parse(JSON.stringify(selection.rows[0].data))
        this.modalDelUeOptionnel = true
      },
      openModalAddUeOptionnel () {
        this.modalAddUeOptionnel = true
      },
      checkResponsable () {
        if (this.$store.getters['planformation/selectedUE'].idUtilisateur) {
          this.nameSelectedResponsable = [ this.$store.getters['planformation/selectedUE'].idUtilisateur.nom + ' ' + this.$store.getters['planformation/selectedUE'].idUtilisateur.prenom ]
          this.selectedResponsable = this.$store.getters['planformation/selectedUE'].idUtilisateur.id
        }
      },
      checkUeOptionnelCollection () {
        let ueId = this.$store.getters['planformation/selectedUE'].id
        this.$store.dispatch('ueoptionnel/getAllUeOfUeOptionnel', ueId)
          .then((ueopts) => {
            this.allUeOptionnel = ueopts
          })
          .catch((err) => {
            this.$alert.error('Une erreur est survenue lors de la chagrement de la page')
            console.log('err Ue', err)
          })
      },
      resetValueUe () {
        this.modalUpdateUE = false
      },
      resetValueUeOptionnel () {
        this.modalAddUeOptionnel = false
        this.modalUpdateUeOptionnel = false
      },
      updateUe () {
        let params = {
          ...this.editedUeOptionnel,
          isCompensable: this.editedUeOptionnel.isCompensable,
          idTypeUe: this.editedUeOptionnel.typeUe,
          responsableUe: this.getSelected(this.editedUeOptionnel.responsableUe),
          enseignant: this.getSelected(this.editedUeOptionnel.enseignant)
        }
        this.$store.dispatch('ue/updateUe', params)
          .then((res) => {
            this.$store.commit('planformation/UPDATE_SELECTED_UE_PF', res)
            this.ue = this.$store.getters['planformation/selectedUE']
            this.modalUpdateUE = false
            this.$alert.success('Modifié avec succès')
          })
          .catch((err) => {
            this.$alert.error('Une erreur est survenue lors de la modification')
            console.log('err update Ue', err)
          })
      },
      updateUeOptionnnelSelected () {
        let params = {
          ...this.selectedUeOptionnel,
          isCompensable: this.selectedUeOptionnel.isCompensable,
          enseignant: this.getSelected(this.selectedUeOptionnel.enseignant),
          responsableEc: this.getSelected(this.selectedUeOptionnel.responsableEc),
          ue: this.getSelected(this.ue.id)
        }
        this.$store.dispatch('ueoptionnel/updateUeOp', params)
          .then((res) => {
            this.$store.commit('planformation/UPDATE_SELECTED_UE_PF', res)
            this.ue = this.$store.getters['planformation/selectedUE']
            this.modalUpdateUeOptionnel = false
            this.$alert.success('Modifié avec succès')
          })
          .catch((err) => {
            this.$alert.error('Une erreur est survenue lors de la modification')
            console.log('err update Ue', err)
          })
      },
      openModalUpdateUE () {
        this.modalUpdateUE = true
      },
      openModalUpdateUeOptionnel (selection) {
        this.selectedUeOptionnel = JSON.parse(JSON.stringify(selection.rows[0].data))
        this.modalUpdateUeOptionnel = true
      },
      deleteUeOptionnel () {
        /* On verifie tout d'abord si les elements contitufs de cette unité d'enseignement ont déjà des notes */
        this.$store.dispatch('note/getAllNotesUeOptionnel', this.selectedUeOptionnel.id)
          .then((res) => {
            if (res >= 1) {
              this.$alert.error('Desolé, vous ne pouvez pas supprimer cette UE car ' + res + 'note sont déjà ajouter aux élément constitutif de cetter derniér.')
            }
            else {
              this.$store.dispatch('ueoptionnel/delete', this.selectedUeOptionnel.id)
                .then((ret) => {
                  console.log(ret)
                  this.$alert.success('L\'unité d\'enseignement ' + this.selectedUeOptionnel.libelle + 'a été supprimé avec succés')
                })
                .catch((err) => {
                  console.log(err)
                })
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    watch: {
      selectedUeOptionnel: function (val) {
        if (typeof val.enseignant !== 'number') {
          this.selectedUeOptionnel = {
            ...val,
            // isCompensable: val.isCompensable.id,
            // typeEc: val.typeEc.id,
            isCompensable: val.isCompensable.id,
            enseignant: val.enseignant ? val.enseignant.id : 0,
            responsableEc: val.responsableEc ? val.responsableEc.id : 0
          }
        }
      },
      modalUpdateEC: function (val) {
        if (!val) {
          console.log(val)
          this.selectedUeOptionnel.typeEc = {...this.fullTypeEc}
        }
      }
    },
    computed: {
    },
    mounted: function () {
      this.ue = this.$store.getters['planformation/selectedUE']
      if (!this.ue.id) {
        return this.$router.push('/parcours/plan-de-formation')
      }
      this.isReady = true
      this.checkUeOptionnelCollection()
      this.checkResponsable()
      this.editedUeOptionnel = {
        ...this.ue,
        isCompensable: this.ue.isCompensable,
        typeUe: this.ue.typeUe.id,
        responsableUe: this.ue.responsableUe ? this.ue.responsableUe.id : 0
      }
      this.selectedUeOptionnel = {
        ...this.ue,
        isCompensable: this.ue.isCompensable,
        responsableUe: this.ue.responsableUe ? this.ue.responsableUe.id : 0
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
<template>
  <div>
    <div class="layout-padding">

      <!-- Data table liste des parcours -->
      <q-data-table
        :data="parcoursTable"
        :config="config"
        :columns="columns"
        @refresh="refresh"
      >
        <!-- Custom renderer when user selected one or more rows -->
        <template slot="selection" slot-scope="selection">
          <q-btn color="primary" icon="edit" @click="openModalUpdate(selection)">
            <span class="gt-sm">Modifier</span>
          </q-btn>
        </template>

      </q-data-table>
      <q-btn
        round
        color="primary"
        @click="autrefonction()"
        class="animate-pop"
      >
        <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Créer un parcours</q-tooltip>
        <q-icon name="add" />
      </q-btn>
    </div>

    <q-modal v-model="createModal" :content-css="{minWidth: '40vw', minHeight: '60vh'}" >
      <h5 class="text-center">Ajout de parcours</h5>
      <div class="layout-padding">
        <h6> Parcours</h6>
        <q-input v-model="newParcours.code" float-label="code de parcours" :error="$v.newParcours.code.$error" />
        <q-input v-model="newParcours.libelle" float-label="Libelle de parcours" :error="$v.newParcours.libelle.$error" />
        <br>
        <h6>Responsable de Parcours</h6>
        <q-select
          :options="listResponsable"
          v-model="selectedResponsable"
          chips
          float-label="Nom du Responsable"
          filter
          autofocus-filter
          filter-placeholder="Chercher le Responsable"
          justify-center
        ></q-select>
        <div class="layout-padding text-center">
          <q-btn color="primary" @click="createParcours()">Enregistrer</q-btn>
          <q-btn color="light" class="text-black" @click="annulerSaisie()">Annuler</q-btn>
        </div>
      </div>
    </q-modal>


    <!-- Modal modifier un parcours -->
    <q-modal v-model="updateModal" :content-css="{minWidth: '40vw', minHeight: '60vh'}" >
      <h5 class="text-center">Modification de parcours</h5>
      <div class="layout-padding">
        <h6> Parcours</h6>
        <q-input v-model="selectedParcours.code" float-label="code" placeholder="" />
        <q-input v-model="selectedParcours.libelle" float-label="libelle" placeholder="" />
        <br>
        <h6>Responsable de Parcours</h6>
        <q-select
          :options="listResponsable"
          v-model="selectedResponsable"
          chips
          float-label="Nom du Responsable"
          filter
          autofocus-filter
          filter-placeholder="Chercher le Responsable"
          justify-center
        ></q-select>
        <div class="layout-padding text-center">
          <q-btn color="primary" @click="updateParcours()">Modifier</q-btn>
          <q-btn color="light" class="text-black" @click="annulerSaisie()">Annuler</q-btn>
        </div>
      </div>
    </q-modal>
  </div>
</template>

<script>
  import {
    QCard,
    QCardMain,
    QBtn,
    QModal,
    QSelect,
    QInput,
    QDataTable,
    QTooltip,
    // Dialog,
    Alert,
    QIcon
  } from 'quasar'

  import 'quasar-extras/animate/bounceInRight.css'
  import 'quasar-extras/animate/bounceOutRight.css'
  import {required} from 'vuelidate/lib/validators'

  export default {
    components: {
      QCard,
      QCardMain,
      QBtn,
      QModal,
      QSelect,
      QInput,
      QDataTable,
      QTooltip,
      Alert,
      QIcon
    },
    data () {
      return {
        createModal: false,
        updateModal: false,
        listResponsable: [],
        selectedResponsable: null,
        selectedParcours: {
          mention: {
            id: null
          },
          responsableParcours: {
            id: null
          }
        },
        parcoursTable: [],
        newParcours: {
          code: '',
          libelle: '',
          responsableParcours: null
        },
        parcours: {
          code: '',
          libelle: '',
          responsable: '',
          mention: ''
        },
        config: {
          // [REQUIRED] Set the row height
          rowHeight: '50px',
          // (optional) Title to display
          title: 'Liste des parcours',
          // (optional) No columns header
          noHeader: false,
          // (optional) Display refresh button
          refresh: true,
          // (optional)
          // User will be able to choose which columns
          // should be displayed
          columnPicker: true,
          // (optional) How many columns from the left are sticky
          leftStickyColumns: 0,
          // (optional) How many columns from the right are sticky
          rightStickyColumns: 2,
          // (optional)
          // Styling the body of the data table;
          // "minHeight", "maxHeight" or "height" are important
          bodyStyle: {
            maxHeight: '500px'
          },
          // (optional) By default, Data Table is responsive,
          // but you can disable this by setting the property to "false"
          responsive: true,
          // (optional) Use pagination. Set how many rows per page
          // and also specify an additional optional parameter ("options")
          // which forces user to make a selection of how many rows per
          // page he wants from a specific list
          pagination: {
            rowsPerPage: 15,
            options: [5, 10, 15, 30, 50, 500]
          },
          // (optional) Select one or more rows for an action
          // "single" adds a column with radio buttons for single row selection
          // "multiple" adds a column with checkboxes for multiple row selection
          // omitting the property will result in no selection column at all
          selection: 'single',
          // (optional) Override default messages when no data is available
          // or the user filtering returned no results.
          messages: {
            noData: 'Aucune données dans la base de données',
            noDataAfterFiltering: 'Aucun résultat. Veuillez raffiner les termes de votre recherche.'
          },
          labels: {
            columns: 'Colonnes',
            allCols: 'Toutes',
            rows: 'Lignes',
            selected: {
              singular: 'parcours séléctionné.',
              plural: 'parcours séléctionnés.'
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
            label: 'Responsable',
            field: 'responsableParcours',
            width: '100px',
            filter: true,
            sort: true,
            type: 'string',
            format (value) {
              if (value !== null) {
                return value.nom + ' ' + value.prenom
              }
              else {
                return ''
              }
            }
          }
        ]
      }
    },
    watch: {
      selectedParcours: function (newSelectedParcours) {
        this.selectedResponsable = newSelectedParcours.responsableParcours ? newSelectedParcours.responsableParcours.id : 0
      }
    },
    computed: {
    },
    validations: {
      newParcours: {
        code: {required},
        libelle: {required}
      }
    },
    methods: {
      autrefonction () {
        this.createModal = true
        this.$v.newParcours.$reset()
      },
      createParcours () {
        this.$v.newParcours.$touch()
        if (this.$v.newParcours.code.$error) {
          this.$alert.error('Veuillez remplir le champs code')
        }
        else if (this.$v.newParcours.libelle.$error) {
          this.$alert.error('Veuillez remplir les champs libellé')
        }
        else {
          this.$store.dispatch('getFonction')
            .then((fonction) => {
              // affectation du responsable
              this.newParcours.responsableParcours = this.getSelectedResponsable()
              // Affectation de la mention
              this.newParcours.mention = fonction.vars.mention.id
              // Saving

              this.$store.dispatch('parcours/addParcours', this.newParcours)
                .then((res) => {
                  this.$alert.success('Parcours ajouté avec succès')
                  this.annulerSaisie()
                  this.getAllParcours()
                })
                .catch((err) => {
                  console.log(err)
                  this.$alert.error('Veuillez verifier vos entrées')
                })
            })
            .catch((err) => {
              console.log('Err', err)
            })
        }
      },
      openModalUpdate (selection) {
        this.updateModal = true
        this.selectedParcours = selection.rows[0].data
      },
      // Update parcours
      getSelectedResponsable () {
        if (this.selectedResponsable) {
          return {
            id: this.selectedResponsable
          }
        }
        else return null
      },
      updateParcours () {
        this.$store.dispatch('getFonction')
          .then((fonction) => {
            let parcours = {
              id: this.selectedParcours.id,
              code: this.selectedParcours.code,
              libelle: this.selectedParcours.libelle,
              mention: fonction.vars.mention.id,
              responsableParcours: this.getSelectedResponsable()
            }
            /* console.log(parcours) */
            this.$store.dispatch('parcours/updateParcours', parcours)
              .then((response) => {
                this.$alert.success('Parcours modifié avec succès')
                this.annulerSaisie()
                this.getAllParcours()
              })
              .catch((error) => {
                console.log(error)
              })
          })
          .catch((err) => {
            console.log('Err', err)
          })
      },
      refresh () {},
      /* getAllParcours () {
        this.$store.dispatch('parcours/getParcoursByUser')
          .then((parcours) => {
            console.log(parcours)
            this.parcoursTable = parcours
          })
          .catch((err) => {
            console.log(err)
          })
      }, */
      getAllParcours () {
        this.$store.dispatch('parcours/getParcoursByMentionByUser', this.$route.params.id_mention)
          .then((parcours) => {
            this.parcoursTable = parcours
          })
          .catch((err) => {
            console.log(err)
          })
      },
      getAllResponsable () {
        this.$store.dispatch('utilisateur/getAllUtilisateurs')
          .then((res) => {
            this.listResponsable.push({
              label: 'Aucun Responsable',
              sublabel: '',
              value: 0,
              image: 'statics/photovide.png'
            })
            res.map(user => {
              this.listResponsable.push({
                label: user.nom + ' ' + user.prenom,
                sublabel: user.login,
                value: user.id,
                image: user.photo ? user.photo : 'statics/photovide.png'
              })
            })
          })
          .catch((err) => {
            console.log('erreur de récupération des responsables', err)
          })
      },
      annulerSaisie () {
        this.newParcours = {
          code: '',
          libelle: '',
          responsableParcours: null
        }
        this.selectedResponsable = null
        this.createModal = false
        this.updateModal = false
      }

    },
    mounted () {
      this.getAllParcours()
      this.getAllResponsable()
    }
  }
</script>

<style>
  .q-popover .q-item-image {
    min-width: 55px;
    max-width: 55px;
    max-height: 55px;
  }
</style>
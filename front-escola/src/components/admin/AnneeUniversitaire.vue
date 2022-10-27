<template>
  <div>
    <div class="layout-padding">
      <!-- AFFICHAGE EN TABLEAU -->
      <q-card v-if="!anneesExist">
        <q-data-table
          :data="annees"
          :config="config"
          :columns="columns"
          :refresh="refresh"
        >

          <!-- ACTIONS DISPONIBLES ==> MODIFICATION ET SUPPRESSION -->
          <template slot="selection" slot-scope="selection">
            <q-btn color="primary" icon="edit" @click="openModalModifier(selection)">
              <span class="gt-sm">Modifier</span>
            </q-btn>
            &nbsp;
            <q-btn color="negative" icon="delete" @click="openModalSupprimer(selection)">
              <span class="gt-sm">Supprimer</span>
            </q-btn>
          </template>

        </q-data-table>
      </q-card>

      <!-- AFFICHAGE EN CARDS -->
      <div class="row" v-if="anneesExist">
        <div class="col-sm-12 col-md-4">
          <q-card class="animate-scale animated" v-for="c1 in col1" :key="c1.id">
            <q-card-title class="text-center">Année universitaire</q-card-title>
            <div class="flex flex-center"><h3 class="text-italic text-bold light-paragraph text-center">{{ c1.code }}</h3>
            </div>
            <div class="row">
              <div class="col-6 layout-padding">
                <div class=" text-grey text-italic" style="padding-bottom: 0;">Date de début</div>
                <div class="" style="padding-bottom: 0;">{{ c1.debut | formatFR('DD/MM/YYYY') }}</div>
              </div>
              <div class="col-6 layout-padding">
                <div class="text-grey text-italic" style="padding-bottom: 0;">Date de fin</div>
                <div class="" style="padding-bottom: 0;">{{ c1.fin | formatFR('DD/MM/YYYY') }}</div>
              </div>
            </div>
            <q-card-actions align="around">
              <div>
                <q-btn @click="toogleShowModal(c1)" flat color="primary">Modifier</q-btn>
                <!--<q-btn @click="openSupprimerDomainModal()" flat color="negative">Supprimer</q-btn>-->
              </div>
              <!--<div>
                <q-btn @click="toogleShowModal()" flat color="tertiary">Voir les mentions</q-btn>
              </div>-->
            </q-card-actions>
          </q-card>
        </div>
        <div class="col-sm-12 col-md-4">
          <q-card class="animate-scale animated" v-for="c2 in col2" :key="c2.id">
            <q-card-title>Année universitaire</q-card-title>
            <div class="flex flex-center"><h3 class="text-italic text-bold light-paragraph text-center">{{ c2.code }}</h3>
            </div>
            <div class="row">
              <div class="col-6 layout-padding">
                <div class=" text-grey text-italic" style="padding-bottom: 0;">Date de début</div>
                <div class="" style="padding-bottom: 0;">{{ c2.debut | formatFR('DD/MM/YYYY') }}</div>
              </div>
              <div class="col-6 layout-padding">
                <div class="text-grey text-italic" style="padding-bottom: 0;">Date de fin</div>
                <div class="" style="padding-bottom: 0;">{{ c2.fin | formatFR('DD/MM/YYYY') }}</div>
              </div>
            </div>
            <q-card-actions align="around">
              <div>
                <q-btn @click="toogleShowModal(c2)" flat color="primary">Modifier</q-btn>
                <!--<q-btn @click="openSupprimerDomainModal()" flat color="negative">Supprimer</q-btn>-->
              </div>
              <!--<div>
                <q-btn @click="toogleShowModal()" flat color="tertiary">Voir les mentions</q-btn>
              </div>-->
            </q-card-actions>
          </q-card>
        </div>
        <div class="col-sm-12 col-md-4">
          <q-card class="animate-scale animated" v-for="c3 in col3" :key="c3.id">
            <q-card-title>Année universitaire</q-card-title>
            <div class="flex flex-center"><h3 class="text-italic text-bold light-paragraph text-center">{{ c3.code }}</h3>
            </div>
            <div class="row">
              <div class="col-6 layout-padding">
                <div class=" text-grey text-italic" style="padding-bottom: 0;">Date de début</div>
                <div class="" style="padding-bottom: 0;">{{ c3.debut | formatFR('DD/MM/YYYY') }}</div>
              </div>
              <div class="col-6 layout-padding">
                <div class="text-grey text-italic" style="padding-bottom: 0;">Date de fin</div>
                <div class="" style="padding-bottom: 0;">{{ c3.fin | formatFR('DD/MM/YYYY') }}</div>
              </div>
            </div>
            <q-card-actions align="around">
              <div>
                <q-btn @click="toogleShowModal(c3)" flat color="primary">Modifier</q-btn>
                <!--<q-btn @click="openSupprimerDomainModal()" flat color="negative">Supprimer</q-btn>-->
              </div>
              <!--<div>
                <q-btn @click="toogleShowModal()" flat color="tertiary">Voir les mentions</q-btn>
              </div>-->
            </q-card-actions>
          </q-card>
        </div>
      </div>

      <!-- BOUTTON SETTINGS A DEROULER -->
      <q-fixed-position corner="bottom-left" :offset="[18, 18]">
        <q-fab color="primary" push icon="settings" direction="right">
          <q-btn round color="primary" @click="openModalAjout" class="animate-pop">
            <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Ajout annee universitaire</q-tooltip>
            <q-icon name="add"></q-icon>
          </q-btn>
          <q-btn round color="primary" @click="afficherEnTableau = !afficherEnTableau" class="animate-pop">
            <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Afficher en tableau</q-tooltip>
            <q-icon name="border_all"></q-icon>
          </q-btn>
        </q-fab>
      </q-fixed-position>

      <!-- FENETRE MODAL POUR AJOUTER ANNEE UNIVERSITAIRE -->
      <q-modal ref="openAjout" class="_addModal" v-model="openAjout"
               :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '40vw', minHeight: '80vh'}">
        <q-modal-layout>
          <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey;">
            <div class="text-center">
              <div class="col-sm-12 layout-padding ">
                <div style="margin: 0;font-size: 24px" class="light-paragraph">Ajout d'une année universitaire</div>
              </div>
            </div>
            <q-btn flat round small @click="$refs.openAjout.close()" style="position: absolute;top: 1em;right: 1em">
              <q-icon name="close" />
            </q-btn>
          </div>

          <div class="_modal-content" style="border-bottom: none;">
            <div class="row sm-gutter">
              <div class="col-md-12">
                <q-field
                  icon="style"
                  helper="9 caractères max"
                  :error="$v.anneeUniv.code.$error"
                  error-label="Veuillez entrer un code valide, ex: AUV0012"
                  count
                >
                  <q-input v-model="anneeUniv.code"
                           float-label="Code"
                           @blur="$v.anneeUniv.code.$touch">
                  </q-input>
                </q-field>
              </div>
            </div>
          </div>
          <div class="_modal-content" style="border-bottom: none;">
            <div class="row sm-gutter">
              <div class="col-md-12">
                <q-field
                  :error="$v.anneeUniv.debut.$error"
                  icon="today"
                  error-label="Veuillez sélectionner une date de début valide"
                >
                  <q-datetime v-model="anneeUniv.debut"
                              float-label="Date début"
                              type="date"
                              :day-names="dayNames"
                              :month-names="monthNames"
                              ok-label="Sélectionner"
                              cancel-label="Annuler"
                              @blur="$v.anneeUniv.debut.$touch"
                              :no-clear="true">

                  </q-datetime>
                </q-field>

                <q-field
                  :error="$v.anneeUniv.fin.$error"
                  icon="today"
                  error-label="Veuillez sélectionner une date de fin valide"
                >
                  <q-datetime v-model="anneeUniv.fin"
                              float-label="Date fin"
                              type="date"
                              :day-names="dayNames"
                              :month-names="monthNames"
                              :min="dateMinAutorisee"
                              @blur="$v.anneeUniv.fin.$touch"
                              ok-label="Sélectionner"
                              cancel-label="Annuler"
                              :no-clear="true">
                  </q-datetime>
                </q-field>
              </div>
            </div>
          </div>
          <div slot="footer" :class="'_no-shadow'" style="padding: 15px 100px 20px;">
            <div class="flex flex-center">
              <q-btn color="primary"
                     style="height: 50px;"
                     rounded
                     push
                     class="col-md-7 col-sm-12 col-12"
                     :disabled="$v.validationGroup.$invalid"
                     @click="ajouterAnneeUniv">
                Ajouter
              </q-btn>
            </div>
          </div>
        </q-modal-layout>
      </q-modal>

      <!-- FENETRE MODAL POUR SUPPRIMER UNE ANNEE UNIVERSITAIRE -->
      <q-modal ref="deleteModal" class="_deleteModal" v-model="openSupprimer"
               :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '50vw', minHeight: '45vh'}">
        <q-modal-layout>
          <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey; text-align: center">
            <div class="">
              <div class="col-sm-12 layout-padding ">
                <div style="margin: 0;font-size: 24px" class="text-negative">Supprimer l'année universitaire ?</div>
              </div>
            </div>
            <q-btn flat round small @click="$refs.deleteModal.close()" style="position: absolute;top: 1em;right: 1em">
              <q-icon name="close" />
            </q-btn>
          </div>
          <div class="layout-padding">
            <div class="text-grey text-italic">Voulez vous vraiment supprimer cette année universitaire ?</div><br/>
            <div class="text-grey text-italic">Année universitaire: #{{ selectedAnneeUniversitaire.code }}</div>
            <div class="text-grey text-italic">Début: {{ selectedAnneeUniversitaire.debut }}</div>
            <div class="text-grey text-italic">Fin: {{ selectedAnneeUniversitaire.fin }}</div>
          </div>
          <div slot="footer" :class="'_no-shadow'" style="padding: 15px 20px;">
            <div class="flex justify-end">
              <q-btn color="tertiary" style="height: 45px;" rounded class=" col-md-3 col-sm-12 col-12"
                     @click="$refs.deleteModal.close()">Non
              </q-btn>&nbsp;&nbsp;
              <q-btn color="negative" style="height: 45px;" rounded class="col-md-3 col-sm-12 col-12"
                     @click="deleteAnneeUniversitaire">Oui
              </q-btn>
            </div>
          </div>
        </q-modal-layout>
      </q-modal>

      <!-- FENETRE MODAL POUR MODIFIER ANNEE UNIVERSITAIRE -->
      <q-modal class="_addModal" v-model="openModifier"
               :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '40vw', minHeight: '80vh'}"
               @close="closeModalModifier">
        <q-modal-layout>
          <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey;">
            <div class="text-center">
              <div class="col-sm-12 layout-padding ">
                <div style="margin: 0;font-size: 24px" class="light-paragraph">Modification d'une année universitaire</div>
              </div>
            </div>
            <q-btn flat round small @click="closeModalModifier" style="position: absolute;top: 1em;right: 1em">
              <q-icon name="close" />
            </q-btn>
          </div>

          <div class="_modal-content" style="border-bottom: none;">
            <div class="row sm-gutter">
              <div class="col-md-12">
                <q-field
                  icon="style"
                  helper="9 caractères max"
                  :error="$v.selectedAnneeUniversitaire.code.$error"
                  error-label="Veuillez entrer un code valide, ex: 2015-2016"
                  count
                >
                  <q-input v-model="selectedAnneeUniversitaire.code"
                           float-label="Code"
                           :disable="true"
                           @blur="$v.selectedAnneeUniversitaire.code.$touch">
                  </q-input>
                </q-field>
              </div>
            </div>
          </div>
          <div class="_modal-content" style="border-bottom: none;">
            <div class="row sm-gutter">
              <div class="col-md-12">
                <q-field
                  :error="$v.selectedAnneeUniversitaire.debut.$error"
                  icon="person"
                  error-label="Veuillez sélectionner une date de début valide"
                >
                  <q-datetime v-model="selectedAnneeUniversitaire.debut"
                              float-label="Date début"
                              type="date"
                              :day-names="dayNames"
                              :month-names="monthNames"
                              ok-label="Sélectionner"
                              cancel-label="Annuler"
                              format="DD MMMM YYYY"
                              @blur="$v.selectedAnneeUniversitaire.debut.$touch"
                              :no-clear="true">

                  </q-datetime>
                </q-field>

                <q-field
                  :error="$v.selectedAnneeUniversitaire.fin.$error"
                  icon="person"
                  error-label="Veuillez sélectionner une date de fin valide"
                >
                  <q-datetime v-model="selectedAnneeUniversitaire.fin"
                              float-label="Date fin"
                              type="date"
                              :day-names="dayNames"
                              :month-names="monthNames"
                              :min="dateMinAutorisee"
                              format="DD MMMM YYYY"
                              @blur="$v.selectedAnneeUniversitaire.fin.$touch"
                              ok-label="Sélectionner"
                              cancel-label="Annuler"
                              :no-clear="true">
                  </q-datetime>
                </q-field>
              </div>
            </div>
          </div>
          <div slot="footer" :class="'_no-shadow'" style="padding: 15px 100px 20px;">
            <div class="flex flex-center">
              <q-btn color="primary"
                     style="height: 50px;"
                     rounded
                     push
                     class="col-md-7 col-sm-12 col-12"
                     @click="updateAnneeUniversitaire">
                Modifier
              </q-btn>
            </div>
          </div>
        </q-modal-layout>
      </q-modal>
    </div>
  </div>
</template>

<script>
  import {
    QDatetimeRange,
    QDatetime,
    QInlineDatetime,
    QCard,
    QDataTable,
    QBtn,
    QFixedPosition,
    QModal,
    QCardMain,
    QCardSeparator,
    QCardTitle,
    QCardActions,
    QInput,
    QTooltip,
    QIcon,
    QField,
    QItem,
    QItemMain,
    QItemSide,
    QFab,
    QModalLayout,
    date
  } from 'quasar'

  // VUELIDATE
  import { required } from 'vuelidate/lib/validators'

  import moment from 'moment'
  import 'moment/locale/fr'

  moment.locale('fr')

  // Est utilisé pour valider la durée d'une année universitaire
  const { subtractFromDate } = date

  // custom filters
  let formatFR = (value, pattern) => {
    return moment(value).format(pattern)
  }

  export default {
    components: {
      QDatetimeRange,
      QDatetime,
      QInlineDatetime,
      QCard,
      QDataTable,
      QBtn,
      QFixedPosition,
      QModal,
      QCardMain,
      QCardSeparator,
      QCardTitle,
      QCardActions,
      QInput,
      QTooltip,
      QIcon,
      QField,
      QItem,
      QItemMain,
      QItemSide,
      QFab,
      QModalLayout
    },
    filters: {
      formatFR
    },
    data () {
      return {
        annees: [],
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        dayNames: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        config: {
          rowHeight: '60px',
          title: '<span style="color: rgba(0,0,0,0.54);font-weight: bold;font-size: 95%;">Liste des années universitaires</span>',
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
            label: 'Code',
            field: 'code',
            width: '20px',
            classes: '_no-padding',
            type: 'string'
          },
          {
            label: 'Date début',
            field: 'debut',
            width: '60px',
            filter: true,
            sort: true,
            type: 'string',
            format (value) {
              return value !== undefined ? moment(value.debut).format('DD/MM/YYYY') : value
            }
          },
          {
            label: 'Date fin',
            field: 'fin',
            width: '60px',
            filter: true,
            sort: true,
            type: 'string',
            format (value) {
              return value !== undefined ? moment(value.fin).format('DD/MM/YYYY') : value
            }
          }
        ],
        openAjout: false,
        anneeUniv: {
          code: '',
          debut: null,
          fin: null
        },
        selectedAnneeUniversitaire: {},
        rangeAnneeUniv: {
          from: null,
          to: null
        },
        afficherEnTableau: true,
        openSupprimer: false,
        oldSelectedAnneeUniversitaire: {},
        openModifier: false,
        arrayChuncked: [],
        col1: [],
        col2: [],
        col3: [],
        updated: false
      }
    },
    validations: {
      anneeUniv: {
        code: {
          required
        },
        debut: {
          required
        },
        fin: {
          required
        }
      },
      selectedAnneeUniversitaire: {
        code: {
          required
        },
        debut: {
          required
        },
        fin: {
          required
        }
      },
      validationGroup: ['anneeUniv.code', 'anneeUniv.debut', 'anneeUniv.fin']
    },
    mounted () {
      this.getAllAnneeUniversitaire()
    },
    computed: {
      // contraint le nombre de jours entre dateDebut et dateFin de 273j
      dateMinAutorisee () {
        return subtractFromDate(this.anneeUniv.debut, { days: -273 })
      },
      anneesExist () {
        return this.annees.length > 0 && this.afficherEnTableau
      }
    },
    methods: {
      openModalModifier (selection) {
        this.selectedAnneeUniversitaire = selection.rows[0].data
        this.oldSelectedAnneeUniversitaire = Object.assign({}, this.selectedAnneeUniversitaire)
        this.openModifier = true
      },
      closeModalModifier () {
        if (!this.updated) {
          // Reset cards value
          this.arrayChuncked = this.$resetCardValue(this.arrayChuncked, this.oldSelectedAnneeUniversitaire)
          // Reset tabs value
          let compareId = (at) => {
            return at.id === this.selectedAnneeUniversitaire.id
          }
          let index = this.annees.findIndex(compareId)
          this.annees.splice(index, 1, this.oldSelectedAnneeUniversitaire)
        }
        else {
          // update view cards
          this.arrayChuncked = this.$resetCardValue(this.arrayChuncked, this.selectedAnneeUniversitaire)
          // update view table
          let compareId = (at) => {
            return at.id === this.selectedAnneeUniversitaire.id
          }
          let index = this.annees.findIndex(compareId)
          this.annees.splice(index, 1, this.selectedAnneeUniversitaire)
        }
        this.selectedAnneeUniversitaire = {}
        this.openModifier = false
      },
      updateAnneeUniversitaire () {
        this.$store.dispatch('anneeuniversitaire/updateAnneeUniversitaire', this.selectedAnneeUniversitaire)
          .then((res) => {
            this.updated = true
            this.closeModalModifier()
            this.getAllAnneeUniversitaire()
            this.$alert.success('Année universitaire #' + res.code + ' modifiée avec succès!')
          })
          .catch((err) => {
            console.log('Erreur de mise à jour de l\'année universitaire:', err)
            this.openModifier = false
          })
        this.openModifier = false
      },
      openModalSupprimer (selection) {
        this.selectedAnneeUniversitaire = selection.rows[0].data
        this.openSupprimer = true
      },
      deleteAnneeUniversitaire () {
        // console.log(this.selectedAnneeUniversitaire)
        this.$store.dispatch('anneeuniversitaire/deleteAnneeUniversitaire', this.selectedAnneeUniversitaire)
          .then(() => {
            let compareId = (at) => {
              return at.id === this.selectedAnneeUniversitaire.id
            }
            let index = this.annees.findIndex(compareId)
            this.annees.splice(index, 1)
            this.selectedAnneeUniversitaire = {}

            this.openSupprimer = false
          })
          .catch((err) => {
            console.log('Erreur de suppression de l\'année universitaire: ', err)
          })
      },
      refresh () {
        this.getAllAnneeUniversitaire()
      },
      closeModalAjout () {
        this.openAjout = false
      },
      openModalAjout () {
        this.openAjout = true
      },
      ajouterAnneeUniv () {
        this.$store.dispatch('anneeuniversitaire/addAnneeUniversitaire', this.anneeUniv)
          .then((res) => {
            /* res.debut = moment(res.debut).format('DD/MM/YYYY')
            res.fin = moment(res.fin).format('DD/MM/YYYY')
            this.annees.push(res)
            this.arrayChuncked = this.$chunk(this.annees, 3, true)
            this.col1 = this.arrayChuncked[0]
            this.col2 = this.arrayChuncked[1]
            this.col3 = this.arrayChuncked[2] */
            this.getAllAnneeUniversitaire()
            this.anneeUniv = {}
            this.openAjout = false
            this.$alert.success('Année universitaire #' + res.code + ' ajoutée avec succès!')
          })
          .catch((err) => {
            console.log('Erreur pendant l\'ajout de l\'année universitaire: ', err)
            this.$alert.error('Erreur lors du sauvegarde de l\'année universitaire.')
          })
      },
      getAllAnneeUniversitaire () {
        this.$store.dispatch('anneeuniversitaire/getAllAnneeUniversitaire')
          .then((res) => {
            this.annees = res
            this.arrayChuncked = this.$chunk(this.annees, 3, true)
            this.col1 = this.arrayChuncked[0]
            this.col2 = this.arrayChuncked[1]
            this.col3 = this.arrayChuncked[2]
          })
          .catch((err) => {
            console.log('Erreur de récupération de la liste des années universitaires: ', err)
          })
      },
      toogleShowModal (annee) {
        this.selectedAnneeUniversitaire = annee
        this.oldSelectedAnneeUniversitaire = Object.assign({}, this.selectedAnneeUniversitaire)
        this.openModifier = true
      }
    }
  }
</script>

<style lang="stylus">
  .q-popover .q-item-image {
    min-width: 55px;
    max-width: 55px;
    max-height: 55px;
  }

  ._no-padding
    padding 0 !important

  ._modal-content
    padding 15px 70px
    border-bottom 1px solid whitesmoke

  ._addModal, ._verificationModal, ._deleteModal
    .layout-header
      box-shadow none

  .layout-footer
    box-shadow none
    border-top 1px solid lightgrey

  @media only screen and (max-width: 500px) {
    ._modal-content {
      padding: 10px 10px;
      border-bottom: 1px solid whitesmoke;
    }
  }
</style>

<template>
  <div>
    <div class="layout-padding">
      <!-- AFFICHAGE EN TABLEAU -->
      <q-card>
        <q-data-table
          :data="niveaux"
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

      <!-- BOUTTON AJOUTER NIVEAU -->
      <q-fixed-position corner="bottom-left" :offset="[18, 18]">
        <q-btn round color="primary" @click="openModalAjout" class="animate-pop">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Ajouter niveau</q-tooltip>
          <q-icon name="add"></q-icon>
        </q-btn>
      </q-fixed-position>

      <!-- MODAL POUR AJOUTER NIVEAU -->
      <q-modal ref="addModal" class="_addModal" v-model="openAjout"
               :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '40vw', minHeight: '80vh'}">
        <q-modal-layout>

          <!-- Header -->
          <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey;">
            <div class="text-center">
              <div class="col-sm-12 layout-padding ">
                <div style="margin: 0;font-size: 24px" class="light-paragraph">Ajout d'un niveau</div>
              </div>
            </div>
            <q-btn flat round small @click="$refs.addModal.close()" style="position: absolute;top: 1em;right: 1em">
              <q-icon name="close" />
            </q-btn>
          </div>

          <!-- Code -->
          <div class="_modal-content" style="border-bottom: none;">
            <div class="row sm-gutter">
              <div class="col-md-12">
                <q-field
                  icon="code"
                  helper="10 caractères max"
                  :error="$v.niveau.code.$error"
                  error-label="Veuillez entrer un code valide"
                  count
                >
                  <q-input v-model="niveau.code" float-label="Code" @blur="$v.niveau.code.$touch"></q-input>
                </q-field>
              </div>
            </div>
          </div>

          <!-- Libellé -->
          <div class="_modal-content" style="border-bottom: none;">
            <div class="row sm-gutter">
              <div class="col-md-12">
                <q-field
                  icon="style"
                  helper="70 caractères max"
                  :error="$v.niveau.libelle.$error"
                  error-label="Veuillez entrer un libellé valide"
                  count
                >
                  <q-input v-model="niveau.libelle" float-label="Libellé" @blur="$v.niveau.libelle.$touch"></q-input>
                </q-field>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div slot="footer" :class="'_no-shadow'" style="padding: 15px 100px 20px;">
            <div class="flex flex-center">
              <q-btn color="primary"
                     style="height: 50px;"
                     rounded push
                     class="col-md-7 col-sm-12 col-12"
                     @click="addNiveau"
                     :disabled="$v.validationGroup.$invalid">
                Ajouter
              </q-btn>
            </div>
          </div>
        </q-modal-layout>
      </q-modal>

      <!-- MODAL POUR SUPPRIMER NIVEAU -->
      <q-modal ref="deleteModal" class="_deleteModal" v-model="openSupprimer"
               :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '50vw', minHeight: '45vh'}">
        <q-modal-layout>
          <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey; text-align: center">
            <div class="">
              <div class="col-sm-12 layout-padding ">
                <div style="margin: 0;font-size: 24px" class="text-negative">Supprimer le niveau ?</div>
              </div>
            </div>
            <q-btn flat round small @click="$refs.deleteModal.close()" style="position: absolute;top: 1em;right: 1em">
              <q-icon name="close" />
            </q-btn>
          </div>
          <div class="layout-padding">
            <div class="text-grey text-italic">Voulez vous vraiment supprimer ce niveau ?</div><br/>
            <div class="text-grey text-italic">Code: {{ selectedNiveau.code }}</div>
            <div class="text-grey text-italic">Libellé: {{ selectedNiveau.libelle }}</div>
          </div>
          <div slot="footer" :class="'_no-shadow'" style="padding: 15px 20px;">
            <div class="flex justify-end">
              <q-btn color="tertiary" style="height: 45px;" rounded class=" col-md-3 col-sm-12 col-12"
                     @click="$refs.deleteModal.close()">Non
              </q-btn>&nbsp;&nbsp;
              <q-btn color="negative" style="height: 45px;" rounded class="col-md-3 col-sm-12 col-12"
                     @click="deleteNiveau">Oui
              </q-btn>
            </div>
          </div>
        </q-modal-layout>
      </q-modal>

      <!-- MODAL POUR MODIFIER NIVEAU -->
      <q-modal ref="updateModal" class="_addModal" v-model="openModifier"
               :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '40vw', minHeight: '80vh'}"
               @close="closeModalModifier">
        <q-modal-layout>

          <!-- Header -->
          <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey;">
            <div class="text-center">
              <div class="col-sm-12 layout-padding ">
                <div style="margin: 0;font-size: 24px" class="light-paragraph">Modifier le niveau</div>
              </div>
            </div>
            <q-btn flat round small @click="closeModalModifier" style="position: absolute;top: 1em;right: 1em">
              <q-icon name="close" />
            </q-btn>
          </div>

          <!-- Code -->
          <div class="_modal-content" style="border-bottom: none;">
            <div class="row sm-gutter">
              <div class="col-md-12">
                <q-field
                  icon="style"
                  helper="10 caractères max"
                  :error="$v.selectedNiveau.code.$error"
                  error-label="Veuillez entrer un code valide"
                  count
                >
                  <q-input v-model="selectedNiveau.code" float-label="Code" @blur="$v.selectedNiveau.code.$touch" :disable="true"></q-input>
                </q-field>
              </div>
            </div>
          </div>

          <!-- Libellé -->
          <div class="_modal-content" style="border-bottom: none;">
            <div class="row sm-gutter">
              <div class="col-md-12">
                <q-field
                  icon="style"
                  helper="70 caractères max"
                  :error="$v.selectedNiveau.libelle.$error"
                  error-label="Veuillez entrer un libellé valide"
                  count
                >
                  <q-input v-model="selectedNiveau.libelle" float-label="Libellé" @blur="$v.selectedNiveau.libelle.$touch"></q-input>
                </q-field>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div slot="footer" :class="'_no-shadow'" style="padding: 15px 100px 20px;">
            <div class="flex flex-center">
              <q-btn color="primary"
                     style="height: 50px;"
                     rounded push
                     class="col-md-7 col-sm-12 col-12"
                     @click="updateNiveau">
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
  // COMPONENTS
  import {
    QCard,
    QDataTable,
    QBtn,
    QFixedPosition,
    QModal,
    QCardMain,
    QCardSeparator,
    QCardTitle,
    QInput,
    QTooltip,
    QIcon,
    QField,
    QModalLayout
  } from 'quasar'

  // VUELIDATE
  import { required, maxLength } from 'vuelidate/lib/validators'

  export default {
    components: {
      QCard,
      QDataTable,
      QBtn,
      QFixedPosition,
      QModal,
      QCardMain,
      QCardSeparator,
      QCardTitle,
      QInput,
      QTooltip,
      QIcon,
      QField,
      QModalLayout
    },
    data () {
      return {
        niveaux: [],
        config: {
          rowHeight: '60px',
          title: '<span style="color: rgba(0,0,0,0.54);font-weight: bold;font-size: 95%;">Liste des niveaux</span>',
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
            width: '30px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Libellé',
            field: 'libelle',
            width: '100px',
            filter: true,
            sort: true,
            type: 'string'
          }
        ],
        openAjout: false,
        openSupprimer: false,
        openModifier: false,
        niveau: {
          code: '',
          libelle: ''
        },
        selectedNiveau: {},
        oldSelectedNiveau: {}
      }
    },
    validations: {
      niveau: {
        code: {
          required,
          maxLength: maxLength(10)
        },
        libelle: {
          required,
          maxLength: maxLength(70)
        }
      },
      selectedNiveau: {
        code: {
          required,
          maxLength: maxLength(10)
        },
        libelle: {
          required,
          maxLength: maxLength(70)
        }
      },
      validationGroup: ['niveau.code', 'niveau.libelle']
    },
    mounted () {
      this.getAllNiveau()
    },
    methods: {
      openModalAjout () {
        this.openAjout = true
      },
      addNiveau () {
        this.$store.dispatch('niveau/addNiveau', this.niveau)
          .then((res) => {
            this.niveaux.push(res)
            this.$alert.success('Niveau #' + this.niveau.code + ' ajouté avec succès!')
            this.openAjout = false
          })
          .catch((err) => {
            console.log('Erreur pendant l\'ajout du niveau: ', err)
            this.$alert.error('Echec d\'enregistrement du Niveau #' + this.niveau.code)
          })
      },
      openModalModifier (selection) {
        this.selectedNiveau = selection.rows[0].data
        this.oldSelectedNiveau = Object.assign({}, this.selectedNiveau)
        this.openModifier = true
      },
      closeModalModifier () {
        let compareId = (at) => {
          return at.id === this.selectedNiveau.id
        }
        let index = this.niveaux.findIndex(compareId)
        this.niveaux.splice(index, 1, this.oldSelectedNiveau)
        this.selectedNiveau = {}
        this.openModifier = false
      },
      updateNiveau () {
        this.$store.dispatch('niveau/updateNiveau', this.selectedNiveau)
          .then(() => {
            this.openModifier = false
          })
          .catch((err) => {
            console.log('Erreur lors de la modification du niveau: ', err)
          })
      },
      openModalSupprimer (selection) {
        this.selectedNiveau = selection.rows[0].data
        this.openSupprimer = true
      },
      deleteNiveau () {
        this.$store.dispatch('niveau/deleteNiveau', this.selectedNiveau)
          .then(() => {
            let compareId = (at) => {
              return at.id === this.selectedNiveau.id
            }
            let index = this.niveaux.findIndex(compareId)
            this.niveaux.splice(index, 1)
            this.selectedNiveau = {}
            this.$alert.success('Niveau #' + this.selectedNiveau.code + ' supprimé avec succès!')
            this.openSupprimer = false
          })
          .catch((err) => {
            console.log('Erreur de la suppression du niveau: ', err)
            this.$alert.error('Echec de suppression du Niveau #' + this.selectedNiveau.code)
          })
      },
      refresh () {
        this.getAllNiveau()
      },
      closeModalAjout () {
        this.openAjout = false
      },
      getAllNiveau () {
        this.$store.dispatch('niveau/getAllNiveau')
          .then((res) => {
            this.niveaux = res
          })
          .catch((err) => {
            console.log('Erreur de récupération de tous les niveaux: ', err)
          })
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

  pre {
    padding: 10px;
    background: #fafafa;
    font: 12px/18px Consolas,monospace,serif;
    color: #444;
    -moz-tab-size: 4;
    tab-size: 4;
    overflow: auto;
    border: 1px solid #ddd;
    border-radius: 3px;
  }
</style>

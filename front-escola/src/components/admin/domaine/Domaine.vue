<template>
  <div class="layout-padding">
    <!-- Affichage en tableau -->
    <div v-if="noData || afficherEnTableau">
      <ListeTable v-model="selectedDomaine" @modification="modifierDomaine" />
    </div>

    <!-- Affichage en cards -->
    <div v-else>
      <ListeCards v-model="selectedDomaine" @modification="modifierDomaine" />
    </div>

    <!-- Ajout domaine -->
    <q-modal v-model="openAddModal" class="_addModal" :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '40vw', minHeight: '80vh'}">
      <Ajout @close="closeAddModal" @success="successAddDomaine" :responsableOptions="responsableOptions" @failure="failureAddDomaine" />
    </q-modal>

    <!-- Modifier domaine -->
    <q-modal @close="closeUpdateModal" v-model="openUpdateModal" class="_addModal" :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '40vw', minHeight: '80vh'}">
      <Modifier :selectedDomaine="selectedDomaine" :responsableOptions="responsableOptions" @close="closeUpdateModal" @success="successUpdateDomaine" @failure="failureUpdateDomaine" />
    </q-modal>

    <!-- Actions disponibles pour les cutoms components -->
    <q-fixed-position corner="bottom-left" :offset="[18, 18]">
      <q-fab color="primary" push icon="settings" direction="right">
        <q-btn round color="primary" @click="afficherModalAjout" class="animate-pop">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Ajouter domaine</q-tooltip>
          <q-icon name="add"></q-icon>
        </q-btn>
        <q-btn round color="primary" @click="afficherEnTableau = !afficherEnTableau" class="animate-pop">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Afficher en tableau</q-tooltip>
          <q-icon name="border_all"></q-icon>
        </q-btn>
      </q-fab>
    </q-fixed-position>
  </div>
</template>

<script>
  // native components
  import {
    QFixedPosition,
    QFab,
    QBtn,
    QIcon,
    QTooltip,
    QSpinner,
    QModal
  } from 'quasar'

  // custom components
  import ListeTable from './ListeTable.vue'
  import ListeCards from './ListeCards.vue'
  import Ajout from './Ajout.vue'
  import Modifier from './Modifier.vue'

  // Vuex
  import {mapGetters} from 'vuex'

  export default {
    components: {
      ListeCards,
      ListeTable,
      Ajout,
      Modifier,
      QFixedPosition,
      QFab,
      QBtn,
      QIcon,
      QTooltip,
      QSpinner,
      QModal
    },
    computed: {
      ...mapGetters('domaine', [
        'domaines'
      ]),
      domainesExist () {
        return this.domaines.length > 0 && this.afficherEnTableau
      },
      noData () {
        return this.domaines.length === 0
      }
    },
    data () {
      return {
        afficherEnTableau: false,
        openAddModal: false,
        selectedDomaine: {
          id: null,
          code: '',
          libelle: '',
          responsableDomaine: {
            id: null
          }
        },
        openUpdateModal: false,
        responsableOptions: []
      }
    },
    mounted () {
      this.getAllUtilisateurs()
    },
    methods: {
      modifierDomaine () {
        // indicate the actual manager of this Domaine
        if (this.selectedDomaine.responsableDomaine) {
          this.responsableOptions.unshift({
            label: this.selectedDomaine.responsableDomaine.nom + ' ' + this.selectedDomaine.responsableDomaine.prenom,
            sublabel: 'Responsable actuel',
            value: this.selectedDomaine.responsableDomaine.id,
            image: this.selectedDomaine.responsableDomaine.photo ? this.selectedDomaine.responsableDomaine.photo : 'statics/photovide.png'
          })
          // remove duplication in responsableOptions
          this.responsableOptions = this.responsableOptions.filter(r => {
            return r.sublabel !== this.selectedDomaine.responsableDomaine.email
          })
        }
        this.openUpdateModal = true
      },
      getAllUtilisateurs () {
        this.$store.dispatch('utilisateur/getAllUtilisateurs')
          .then(utilisateurs => {
            this.responsableOptions = []
            this.responsableOptions.push({
              label: 'Aucun responsable',
              sublabel: '',
              value: 0,
              image: 'statics/photovide.png'
            })
            utilisateurs.map(u => {
              this.responsableOptions.push({
                label: u.nom + ' ' + u.prenom,
                sublabel: u.email,
                value: u.id,
                image: u.photo ? u.photo : 'statics/photovide.png'
              })
            })
          })
          .catch(err => {
            console.log('Erreur de récupération des fonctions utilisateurs: ', err)
          })
      },
      closeUpdateModal () {
        this.responsableOptions = []
        this.getAllUtilisateurs()
        this.resetDomaineValue()
        this.openUpdateModal = false
      },
      successUpdateDomaine (code) {
        this.$alert.success('Domaine #' + code + ' modifié avec succès!')
      },
      failureUpdateDomaine (code) {
        this.$alert.error('Erreur lors de la modification du Domaine #' + code)
      },
      resetDomaineValue () {
        this.domaine = {
          id: null,
          code: '',
          libelle: '',
          photo: '003-trophy.png',
          responsableDomaine: {
            id: null
          }
        }
      },
      closeAddModal () {
        this.resetDomaineValue()
        this.openAddModal = false
      },
      afficherModalAjout () {
        this.openAddModal = true
      },
      successAddDomaine (code) {
        this.$alert.success('Domaine #' + code + ' ajouté avec succès!')
      },
      failureAddDomaine (code) {
        this.$alert.error('Echec lors de l\'ajout du Domaine #' + code)
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

  ._logo-upload > input {
    display: none;
  }

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

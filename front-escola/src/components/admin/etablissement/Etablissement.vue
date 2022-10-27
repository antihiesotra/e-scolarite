<template>
  <div class="layout-padding">

    <!-- Affichage en tableau -->
    <div v-if="noData || afficherEnTableau">
      <ListeTable v-model="selectedEtablissement" @modification="modifierEtablissement" />
    </div>

    <!-- Affichage en cards -->
    <div v-else>
      <ListeCards v-model="selectedEtablissement" @modification="modifierEtablissement" />
    </div>

    <!-- Ajout établissement -->
    <q-modal @close="closeAddModal" v-model="openAddModal" class="_addModal" :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '40vw', minHeight: '80vh'}">
      <Ajout :adminData="adminData" @reload="getEtablissementsUniv" @close="closeAddModal" @success="successAddEtablissement" @failure="failureAddEtablissement" :etablissement="etablissementActuel" />
    </q-modal>

    <!-- Modifier établissement -->
    <q-modal @close="closeUpdateModal" v-model="openUpdateModal" class="_addModal" :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '40vw', minHeight: '80vh'}">
      <Modifier :selectedEtablissement="selectedEtablissement" :responsableOptions="responsableOptions" @close="closeUpdateModal" @success="successUpdateEtablissement" @failure="failureUpdateEtablissement" />
    </q-modal>
    <!-- Actions disponibles pour les cutoms components -->
    <q-fixed-position corner="bottom-left" :offset="[18, 18]">
      <q-fab color="primary" push icon="settings" direction="right">
        <q-btn round color="primary" @click="afficherModalAjout" class="animate-pop">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Ajouter établissement</q-tooltip>
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
    QModal,
    QSpinner
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
      ListeTable,
      ListeCards,
      Ajout,
      Modifier,
      QFixedPosition,
      QFab,
      QBtn,
      QIcon,
      QTooltip,
      QModal,
      QSpinner
    },
    data () {
      return {
        selectedEtablissement: {
          id: null,
          code: '',
          libelle: '',
          localisation: '',
          devise: '',
          photo: '',
          responsableEtablissement: {
            id: null
          }
        },
        afficherEnTableau: false,
        openAddModal: false,
        openUpdateModal: false,
        responsableOptions: [],
        etablissementActuel: {}
      }
    },
    computed: {
      ...mapGetters('etablissement', [
        'etablissements',
        'adminData'
      ]),
      etablissementsExist () {
        return this.etablissements.length > 0 && this.afficherEnTableau
      },
      noData () {
        return this.etablissements.length === 0
      }
    },
    mounted () {
      // initialisation de responsableOptions
      this.getAllUtilisateurs()
      this.$store.dispatch('getFonction')
        .then((fonction) => {
          this.etablissementActuel = this.adminData.etablissement
        })
    },
    methods: {
      getEtablissementsUniv (etablissement = false) {
        this.$store.dispatch('etablissement/getAllEtablissement')
          .then(() => {
            if (etablissement) {
              this.$store.commit('etablissement/FORCE', etablissement)
            }
          })
          .catch(error => {
            this.$router.go(-1)
            this.$alert.warning('Echec de récupération des établissements.')
            console.log('Erreur de récupération des établissements dans univ: ', error)
          })
      },
      getAllUtilisateurs () {
        this.$store.dispatch('utilisateur/getAllUtilisateurs')
          .then(utilisateurs => {
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
      modifierEtablissement () {
        this.openUpdateModal = true
      },
      afficherModalAjout () {
        this.openAddModal = true
      },
      closeAddModal () {
        this.afficherEnTableau = false
        this.openAddModal = false
      },
      successAddEtablissement (code) {
        this.$alert.success('Etablissement #' + code + ' ajouté avec succès!')
      },
      failureAddEtablissement (code) {
        this.$alert.error('Erreur lors de l\'ajout de l\'établissement #' + code)
      },
      closeUpdateModal () {
        this.responsableOptions = []
        this.getAllUtilisateurs()
        this.openUpdateModal = false
      },
      successUpdateEtablissement (code) {
        this.$alert.success('Etablissement #' + code + ' modifié avec succès!')
      },
      failureUpdateEtablissement (code) {
        this.$alert.error('Erreur lors de la modification de l\'établissement #' + code)
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

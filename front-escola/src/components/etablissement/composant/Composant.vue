<template>
  <div class="layout-padding">

    <div class="modif_etab" @click="openEtabModal = true">
      <q-btn color="primary" class="animate-pop">
        <q-icon name="settings"></q-icon>
        &nbsp;&nbsp;Modifier l'établissement
      </q-btn>
    </div>

    <div v-if="noData || afficherEnTableau">
      <ListeTable v-model="selectedComposant" @modification="modifierComposant"/>
    </div>
    <div v-else>
      <ListeCards v-model="selectedComposant" @modification="modifierComposant" />
    </div>

    <!-- Ajout composant -->
    <q-modal @close="closeAddModal" v-model="openAddModal" class="_addModal" :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '40vw', minHeight: '80vh'}">
      <Ajout @reload="getComposantsByCodeUniv" @close="closeAddModal" @success="successAddComposant" @failure="failureAddComposant" :etablissement="etablissementActuel" />
    </q-modal>

    <!-- Modifier composant -->
    <q-modal @close="closeUpdateModal" v-model="openUpdateModal" class="_addModal" :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '40vw', minHeight: '80vh'}">
      <Modifier @reload="getComposantsByCodeUniv" :selectedComposant="selectedComposant" @close="closeUpdateModal" @success="successUpdateComposant" @failure="failureUpdateComposant" />
    </q-modal>

    <q-modal @close="closeEtabModal" v-model="openEtabModal" class="_addModal" :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '40vw', minHeight: '80vh'}">
      <ModifierEtab @close="closeEtabModal" @success="successUpdateEtablissement" @failure="failureUpdateEtablissement" />
    </q-modal>

    <!-- Actions disponibles pour les cutoms components -->
    <q-fixed-position corner="bottom-left" :offset="[18, 18]">
      <q-fab color="primary" push icon="settings" direction="right">
        <q-btn round color="primary" @click="afficherModalAjout" class="animate-pop">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Ajouter composant</q-tooltip>
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
    QModal
  } from 'quasar'

  // custom components
  import ListeTable from './ListeTable.vue'
  import ListeCards from './ListeCards.vue'
  import Ajout from './Ajout.vue'
  import Modifier from './Modifier.vue'
  import ModifierEtab from './ModifierEtab.vue'

  // Vuex
  import { mapGetters } from 'vuex'

  export default {
    components: {
      ListeTable,
      ListeCards,
      Ajout,
      Modifier,
      QFixedPosition,
      ModifierEtab,
      QFab,
      QBtn,
      QIcon,
      QTooltip,
      QModal
    },
    computed: {
      ...mapGetters('composant', [
        'filteredComposants'
      ]),
      noData () {
        return this.filteredComposants.length === 0
      }
    },
    data () {
      return {
        afficherEnTableau: false,
        openAddModal: false,
        openEtabModal: false,
        openUpdateModal: false,
        responsableOptions: [],
        etablissementOptions: [],
        selectedComposant: {
          responsableComposant: {
            id: null
          },
          chefScolarite: {
            id: null
          }
        },
        etablissementActuel: {}
      }
    },
    mounted () {
      if (!this.$route.params.code_universite) {
        this.$router.go(-1)
      }
      this.$store.dispatch('getFonction')
        .then((fonction) => {
          this.etablissementActuel = fonction.vars.etablissement
          this.getComposantsByCodeUniv()
        })
    },
    methods: {
      getComposantsByCodeUniv (composant = false) {
        this.$store.dispatch('composant/getAllComposantsByCodeEtablissement', this.$route.params.code_universite)
          .then(() => {
            if (composant) {
              this.$store.commit('composant/FORCE', composant)
            }
          })
          .catch(error => {
            this.$router.go(-1)
            this.$alert.warning('Echec de récupération des composants de cet établissement.')
            console.log('Erreur de récupération des composants dans univ: ', error)
          })
      },
      modifierComposant () {
        if (this.selectedComposant.responsableComposant) {
          this.responsableOptions.unshift({
            label: this.selectedComposant.responsableComposant.nom + ' ' + this.selectedComposant.responsableComposant.prenom,
            sublabel: 'Responsable actuel',
            value: this.selectedComposant.responsableComposant.id,
            image: this.selectedComposant.responsableComposant.photo ? this.selectedComposant.responsableComposant.photo : 'statics/photovide.png'
          })
          // remove duplication in responsableOptions
          this.responsableOptions = this.responsableOptions.filter(r => {
            return r.sublabel !== this.selectedComposant.responsableComposant.email
          })
        }
        this.openUpdateModal = true
      },
      getAllUtilisateurs () {
        this.$store.dispatch('utilisateur/getAllUtilisateurs')
          .then(utilisateurs => {
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
      modifierResponsableComposant (pathVariables) {
        return this.$store.dispatch('utilisateur/updateResponsableComposant', pathVariables)
      },
      afficherModalAjout () {
        this.openAddModal = true
      },
      closeAddModal () {
        this.afficherEnTableau = false
        this.openAddModal = false
      },
      closeEtabModal () {
        this.openEtabModal = false
      },
      successAddComposant (code) {
        this.$alert.success('Composant #' + code + ' ajouté avec succès!')
      },
      successUpdateEtablissement () {
        this.$alert.success('Etablissement mis à jour')
      },
      failureAddComposant (code) {
        this.$alert.error('Erreur lors de l\'ajout du Composant #' + code)
      },
      failureUpdateEtablissement (code) {
        this.$alert.error('Erreur de la modiffication de l\'établissement')
      },
      closeUpdateModal () {
        this.responsableOptions = []
        this.getAllUtilisateurs()
        this.openUpdateModal = false
      },
      successUpdateComposant (code) {
        this.$alert.success('Composant #' + code + ' modifié avec succès!')
      },
      failureUpdateComposant (code) {
        this.$alert.error('Erreur lors de la modification du Composant #' + code)
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
  .modif_etab{
    display: flex;
    justify-content: flex-end;
    padding-right: 22px;
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

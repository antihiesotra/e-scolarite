<template>
  <div class="layout-padding">
    <!-- Affichage en tableau -->
    <div v-if="noData || afficherEnTableau">
      <ListeTable v-model="selectedMention" :mentions="mentions" @modification="modifierMention" />
    </div>
    <!-- Affichage en cards -->
    <div v-else>
      <ListeCards v-model="selectedMention" @modification="modifierMention" />
    </div>

    <!-- Ajout mention -->
    <q-modal @close="closeAddModal" v-model="openAddModal" class="_addModal" :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '40vw', minHeight: '80vh'}">
      <Ajout @close="closeAddModal" :composant="composant" :domaineOptions="domaineOptions" :responsableOptions="responsableOptions" @reload="getAllMention" @success="successAddMention" @failure="failureAddMention" />
    </q-modal>

    <!-- Modifier mention -->
    <q-modal @close="closeUpdateModal" v-model="openUpdateModal" class="_addModal" :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '40vw', minHeight: '80vh'}">
      <Modifier :selectedMention="selectedMention" :composant="composant" :domaineOptions="domaineOptions" :responsableOptions="responsableOptions" @close="closeUpdateModal" @reload="getAllMention" @success="successUpdateMention" @failure="failureUpdateMention" />
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

  // Vuex
  import { mapGetters } from 'vuex'

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
      QModal
    },
    computed: {
      noData () {
        return this.mentions.length === 0
      },
      ...mapGetters('etablissement', [
        'adminData'
      ])
    },
    data () {
      return {
        afficherEnTableau: false,
        openAddModal: false,
        openUpdateModal: false,
        responsableOptions: [],
        mentions: [],
        domaineOptions: [],
        composant: {},
        selectedMention: {
          code: '',
          libelle: '',
          photo: '',
          composant: null,
          domaine: null,
          chefMention: null
        }
      }
    },
    mounted () {
      this.composant = this.adminData.composant
      if (!this.$route.params.code_composant || !this.composant) {
        this.$router.go(-1)
      }
      this.getAllMention()
      this.getAllUtilisateurs()
      this.getAllDomaines()
    },
    methods: {
      getAllMention (mention = false) {
        this.$store.dispatch('mention/getAllMentionByComposant', this.composant.id)
          .then((mentions) => {
            this.mentions = mentions
            if (mention) {
              this.$store.commit('mention/FORCE', mention)
            }
          })
      },
      getAllDomaines () {
        this.$store.dispatch('domaine/getAllDomaine')
          .then((res) => {
            this.domaineOptions = res.map((d) => {
              return {
                label: d.libelle,
                image: d.photo ? d.photo : 'statics/domainevide.png',
                value: d.id
              }
            })
          })
          .catch((err) => {
            console.log('Erreur de récupération de tous les domaines: ', err)
          })
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
      modifierResponsableMention (pathVariables) {
        return this.$store.dispatch('utilisateur/updateResponsableMention', pathVariables)
      },
      afficherModalAjout () {
        this.openAddModal = true
      },
      closeAddModal () {
        this.afficherEnTableau = false
        this.openAddModal = false
      },
      successAddMention (code) {
        this.$alert.success('Mention #' + code + ' ajoutée avec succès!')
      },
      failureAddMention (code) {
        this.$alert.error('Erreur lors de l\'ajout de la Mention #' + code)
      },
      closeUpdateModal () {
        this.responsableOptions = []
        this.getAllUtilisateurs()
        this.openUpdateModal = false
      },
      successUpdateMention (code) {
        this.$alert.success('Mention #' + code + ' modifié avec succès!')
      },
      failureUpdateMention (code) {
        this.$alert.error('Erreur lors de la modification de la Mention #' + code)
      },
      modifierMention () {
        this.openUpdateModal = true
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
  .modif_composant{
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

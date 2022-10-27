<template>
  <div class="layout-padding">
    <!-- Affichage en tableau -->
    <div v-if="noData || afficherEnTableau">
      <ListeTable v-model="selectedMention"/>
    </div>

    <!-- Affichage en cards -->
    <div v-else>
      <ListeCards v-model="selectedMention"/>
    </div>

    <!-- Actions disponibles pour les cutoms components -->
    <q-fixed-position corner="bottom-left" :offset="[18, 18]">
      <q-btn round color="primary" @click="afficherEnTableau = !afficherEnTableau" class="animate-pop">
        <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Afficher en tableau</q-tooltip>
        <q-icon name="border_all"></q-icon>
      </q-btn>
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

  // Vuex
  import {mapGetters} from 'vuex'

  export default {
    components: {
      ListeTable,
      ListeCards,
      QFixedPosition,
      QFab,
      QBtn,
      QIcon,
      QTooltip,
      QModal
    },
    computed: {
      ...mapGetters('mention', [
        'filteredMentions'
      ]),
      noData () {
        return this.filteredMentions.length === 0
      }
    },
    data () {
      return {
        afficherEnTableau: false,
        openAddModal: false,
        openUpdateModal: false,
        responsableOptions: [],
        selectedMention: {
          code: '',
          libelle: '',
          photo: 'statics/icons/school-2/041-chalks.png',
          composant: null,
          domaine: null,
          chefMention: null
        }
      }
    },
    mounted () {
      if (!this.$route.params.code_composant) {
        this.$router.go(-1) // on retourne à la vue précédente si le code_composant n'est pas reçu
      }
      this.getMentionsByCodeComposant()
    },
    methods: {
      getMentionsByCodeComposant () {
        this.$store.dispatch('mention/getAllMentionsByCodeComposant', this.$route.params.code_composant)
          .then((mentionsFiltrees) => {
            console.log('Mentions filtrée: ', mentionsFiltrees)
          })
          .catch(error => {
            this.$router.go(-1)
            this.$alert.warning('Echec de récupération des mentions de ce composant.')
            console.log('Erreur de récupération des mentions dans univ: ', error)
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

<template>
  <div class="layout-padding">
    <div class="row">
      <div class="col-sm-12 col-md-4">
        <q-card class="animate-scale animated" v-for="c1 in col1" :key="c1.id">
          <q-card-title>Domaine #{{ c1.code }}</q-card-title>
          <div class="flex flex-center"><img :src="c1.photo ? c1.photo : 'statics/domainevide.png'" width="80" /></div>
          <div class="flex flex-center"><h5 class="light-paragraph text-center">{{ c1.libelle }}</h5></div>
          <q-card-actions align="around">
            <div>
              <q-btn @click="modifierDomaine(c1)" flat color="primary">Modifier</q-btn>
            </div>
            <!--<div>
              <q-btn @click="$router.push('/composant/mention')" flat color="tertiary">Voir les composants</q-btn>
            </div>-->
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-sm-12 col-md-4">
        <q-card class="animate-scale animated" v-for="c2 in col2" :key="c2.id">
          <q-card-title>Domaine #{{ c2.code }}</q-card-title>
          <div class="flex flex-center"><img :src="c2.photo ? c2.photo : 'statics/domainevide.png'" width="80" /></div>
          <div class="flex flex-center"><h5 class="light-paragraph text-center">{{ c2.libelle }}</h5></div>
          <q-card-actions align="around">
            <div>
              <q-btn @click="modifierDomaine(c2)" flat color="primary">Modifier</q-btn>
            </div>
            <!--<div>
              <q-btn @click="$router.push('/composant/mention')" flat color="tertiary">Voir les composants</q-btn>
            </div>-->
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-sm-12 col-md-4">
        <q-card class="animate-scale animated" v-for="c3 in col3" :key="c3.id">
          <q-card-title>Domaine #{{ c3.code }}</q-card-title>
          <div class="flex flex-center"><img :src="c3.photo ? c3.photo : 'statics/domainevide.png'" width="80" /></div>
          <div class="flex flex-center"><h5 class="light-paragraph text-center">{{ c3.libelle }}</h5></div>
          <q-card-actions align="around">
            <div>
              <q-btn @click="modifierDomaine(c3)" flat color="primary">Modifier</q-btn>
            </div>
            <!--<div>
              <q-btn @click="$router.push('/composant/mention')" flat color="tertiary">Voir les composants</q-btn>
            </div>-->
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
  // native components
  import {
    QCard,
    QCardActions,
    QBtn,
    QItem,
    QItemMain,
    QItemSide,
    QCardTitle
  } from 'quasar'

  // Vuex
  import {mapGetters, mapActions} from 'vuex'

  export default {
    props: {
      value: Object
    },
    components: {
      QCard,
      QCardActions,
      QBtn,
      QItem,
      QItemMain,
      QItemSide,
      QCardTitle
    },
    data () {
      return {
        selectedDomaine: { ...this.value }
      }
    },
    computed: {
      ...mapGetters('domaine', [
        'chunckedDomaines',
        'domaines'
      ]),
      col1 () {
        return this.chunckedDomaines[0]
      },
      col2 () {
        return this.chunckedDomaines[1]
      },
      col3 () {
        return this.chunckedDomaines[2]
      }
    },
    mounted () {
      this.getAllDomaine()
    },
    methods: {
      ...mapActions('domaine', [
        'getAllDomaine'
      ]),
      modifierDomaine (domaine) {
        this.selectedDomaine = JSON.parse(JSON.stringify(domaine))
        this.$emit('input', this.selectedDomaine)
        this.$emit('modification')
      }
    }
  }
</script>

<style>
</style>

<template>
  <div class="layout-padding">
    <div class="row" >
      <div class="col-sm-12 col-md-4">
        <q-card class="animate-scale animated" v-for="c1 in col1" :key="c1.id">
          <div class="flex flex-center"><h5 class="light-paragraph text-center">Université</h5></div>
          <div class="flex flex-center"><img :src="c1.photo" width="150" /></div>
          <div class="flex flex-center"><h5 class="light-paragraph text-center">{{ c1.libelle.split(" ")[1]}} {{c1.libelle.split(" ")[2] }}</h5></div>
          <q-card-actions align="around">
            <div>
              <q-btn @click="toogleShowModal(c1)" flat color="primary">Modifier</q-btn>
            </div>
            <div>
              <q-btn @click="voirComposants(c1)" flat color="secondary">Composants</q-btn>
            </div>
            <div>
              <q-btn @click="vueGlobale(c1.id)" flat color="deep-purple">Vue global</q-btn>
            </div>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-sm-12 col-md-4">
        <q-card class="animate-scale animated" v-for="c2 in col2" :key="c2.id">
          <div class="flex flex-center"><h5 class="light-paragraph text-center">Université</h5></div>
          <div class="flex flex-center"><img :src="c2.photo" width="150" /></div>
          <div class="flex flex-center"><h5 class="light-paragraph text-center">{{ c2.libelle.split(" ")[1]}} {{c2.libelle.split(" ")[2] }}</h5></div>
          <q-card-actions align="around">
            <div>
              <q-btn @click="toogleShowModal(c2)" flat color="primary">Modifier</q-btn>
            </div>
            <div>
              <q-btn @click="voirComposants(c2)" flat color="secondary">Composants</q-btn>
            </div>
            <div>
              <q-btn @click="vueGlobale(c2.id)" flat color="deep-purple">Vue global</q-btn>
            </div>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-sm-12 col-md-4">
        <q-card class="animate-scale animated" v-for="c3 in col3" :key="c3.id">
          <div class="flex flex-center"><h5 class="light-paragraph text-center">Université</h5></div>
          <div class="flex flex-center"><img :src="c3.photo" width="150" /></div>
          <div class="flex flex-center"><h5 class="light-paragraph text-center">{{ c3.libelle.split(" ")[1]}} {{c3.libelle.split(" ")[2] }}</h5></div>
          <q-card-actions align="around">
            <div>
              <q-btn @click="toogleShowModal(c3)" flat color="primary">Modifier</q-btn>
            </div>
            <div>
              <q-btn @click="voirComposants(c3)" flat color="secondary">Composants</q-btn>
            </div>
            <div>
              <q-btn @click="vueGlobale(c3.id)" flat color="deep-purple">Vue global</q-btn>
            </div>
          </q-card-actions>
        </q-card>
      </div>
  </div>
  </div>
</template>

<script>
  import {
    QCard,
    QCardActions,
    QBtn,
    QItem,
    QItemMain,
    QItemSide,
    QCardTitle
  } from 'quasar'

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
        selectedEtablissement: { ...this.value }
      }
    },
    computed: {
      ...mapGetters('etablissement', [
        'chunkedEtablissements',
        'etablissements'
      ]),
      col1 () {
        return this.chunkedEtablissements[0]
      },
      col2 () {
        return this.chunkedEtablissements[1]
      },
      col3 () {
        return this.chunkedEtablissements[2]
      }
    },
    mounted () {
      this.getAllEtablissement()
    },
    methods: {
      ...mapActions('etablissement', [
        'getAllEtablissement'
      ]),
      toogleShowModal (etablissement) {
        this.selectedEtablissement = JSON.parse(JSON.stringify(etablissement))
        this.$emit('input', this.selectedEtablissement)
        this.$emit('modification')
      },
      vueGlobale (id) {
        this.$store.commit('etablissement/SET_ID_TSIORY', id)
        this.$router.push('/admin/etablissement/vue-globale')
      },
      voirComposants (etablissement) {
        this.$store.commit('etablissement/ADMIN_DATA', {etablissement: etablissement})
        this.$router.push('/admin/composant/' + etablissement.code)
      }
    }
  }
</script>

<style>
</style>

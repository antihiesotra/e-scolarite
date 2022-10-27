<template>
  <div class="layout-padding">
    <div class="row" >
      <div class="col-sm-12 col-md-4">
        <q-card class="animate-scale animated" v-for="c1 in col1" :key="c1.id">
          <q-card-title><h6 class="text-center">{{ c1.code | uppercase }}</h6></q-card-title>
          <div class="flex flex-center"><img :src="c1.photo ? c1.photo : 'statics/icons/school-2/041-chalks.png'" width="150" /></div>
          <div style="height:112px" class="flex flex-center"><h5 class="light-paragraph text-center">{{ c1.libelle }}</h5></div>
          <!--div class="layout-padding">
            <q-item style="padding-left: 0">
              <q-item-main class=""  >
                <div v-if="c1.responsableComposant">
                  {{ c1.responsableComposant.nom }} {{ c1.responsableComposant.prenom }}
                  <div class="q-item-sublabel">Responsable du Composant</div>
                </div>
                <div v-if="c1.chefScolarite">
                  {{ c1.chefScolarite.nom }} {{ c1.chefScolarite.prenom }}
                  <div class="q-item-sublabel">Chef de la scolarité</div>
                </div>
              </q-item-main>
            </q-item>
          </div-->
          <q-card-actions align="around">
            <div>
              <q-btn @click="modifierComposant(c1)" flat color="primary">Modifier</q-btn>
            </div>
            <div>
              <q-btn @click="voirMentions(c1)" flat color="secondary">Mentions</q-btn>
            </div>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-sm-12 col-md-4">
        <q-card class="animate-scale animated" v-for="c2 in col2" :key="c2.id">
          <q-card-title><h6 class="text-center">{{ c2.code | uppercase }}</h6></q-card-title>
          <div class="flex flex-center"><img :src="c2.photo ? c2.photo : 'statics/icons/school-2/041-chalks.png'" width="150" /></div>
          <div style="height:112px" class="flex flex-center"><h5 class="light-paragraph text-center">{{ c2.libelle }}</h5></div>
          <!--div class="layout-padding">
            <q-item style="padding-left: 0">
              <q-item-main class=""  >
                <div v-if="c2.responsableComposant">
                  {{ c2.responsableComposant.nom }} {{ c2.responsableComposant.prenom }}
                  <div class="q-item-sublabel">Responsable du Composant</div>
                </div>
                <div v-if="c2.chefScolarite">
                  {{ c2.chefScolarite.nom }} {{ c2.chefScolarite.prenom }}
                  <div class="q-item-sublabel">Chef de la scolarité</div>
                </div>
              </q-item-main>
            </q-item>
          </div-->
          <q-card-actions align="around">
            <div>
              <q-btn @click="modifierComposant(c2)" flat color="primary">Modifier</q-btn>
            </div>
            <div>
              <q-btn @click="voirMentions(c2)" flat color="secondary">Mentions</q-btn>
            </div>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-sm-12 col-md-4">
        <q-card class="animate-scale animated" v-for="c3 in col3" :key="c3.id">
          <q-card-title><h6 class="text-center">{{ c3.code | uppercase }}</h6></q-card-title>
          <div class="flex flex-center"><img :src="c3.photo ? c3.photo : 'statics/icons/school-2/041-chalks.png'" width="150" /></div>
          <div style="height:112px" class="flex flex-center"><h5 class="light-paragraph text-center">{{ c3.libelle }}</h5></div>
          <!--div class="layout-padding">
            <q-item style="padding-left: 0">
              <q-item-main class=""  >
                <div v-if="c3.responsableComposant">
                  {{ c3.responsableComposant.nom }} {{ c3.responsableComposant.prenom }}
                  <div class="q-item-sublabel">Responsable du Composant</div>
                </div>
                <div v-if="c3.chefScolarite">
                  {{ c3.chefScolarite.nom }} {{ c3.chefScolarite.prenom }}
                  <div class="q-item-sublabel">Chef de la scolarité</div>
                </div>
              </q-item-main>
            </q-item>
          </div-->
          <q-card-actions align="around">
            <div>
              <q-btn @click="modifierComposant(c3)" flat color="primary">Modifier</q-btn>
            </div>
            <div>
              <q-btn @click="voirMentions(c3)" flat color="secondary">Mentions</q-btn>
            </div>
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
  import { mapGetters } from 'vuex'

  export default {
    props: ['composants'],
    components: {
      QCard,
      QCardActions,
      QBtn,
      QItem,
      QItemMain,
      QItemSide,
      QCardTitle
    },
    computed: {
      ...mapGetters('composant', [
        'chunckedFilteredComposants'
      ]),
      col1 () {
        return this.chunckedFilteredComposants[0]
      },
      col2 () {
        return this.chunckedFilteredComposants[1]
      },
      col3 () {
        return this.chunckedFilteredComposants[2]
      }
    },
    data () {
      return {
        selectedComposant: { ...this.value }
      }
    },
    methods: {
      modifierComposant (composant) {
        this.selectedComposant = JSON.parse(JSON.stringify(composant))
        this.$emit('input', this.selectedComposant)
        this.$emit('modification')
      },
      voirMentions (composant) {
        this.$router.push('/etablissement/mention/' + composant.code)
      }
    },
    filters: {
      uppercase: function (v) {
        return v.toUpperCase()
      }
    }
  }
</script>

<style>
</style>

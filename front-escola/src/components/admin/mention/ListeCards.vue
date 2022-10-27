<template>
  <div class="layout-padding">
    <div class="row" >
      <div class="col-sm-12 col-md-4">
        <q-card class="animate-scale animated" v-for="c1 in col1" :key="c1.id">
          <q-card-title><h6 class="text-center">Mention</h6></q-card-title>
          <div class="flex flex-center"><img :src="c1.photo ? c1.photo : 'statics/mentionvide.png'" width="150" /></div>
          <div class="flex flex-center"><h5 class="light-paragraph text-center">{{ c1.libelle }}</h5></div>
          <div class="layout-padding text-grey text-italic"  style="padding-bottom: 0;" v-if="c1.chefMention">Responsable</div>
          <div class="layout-padding" v-if="c1.chefMention">
            <q-item style="padding-left: 0">
              <q-item-side >
                <img :src="c1.chefMention.photo ? c1.chefMention.photo : 'statics/photovide.jpg'" width="80" style="border-radius: 50%;"/>
              </q-item-side>
              <q-item-main class=""  >
                {{ c1.chefMention.nom }} {{ c1.chefMention.prenom }}
                <div class="q-item-sublabel">Professeur titulaire</div>
                <div class="q-item-sublabel">{{ c1.chefMention.email }}</div>
                <div class="q-item-sublabel">{{ c1.chefMention.phone }}</div>
              </q-item-main>
            </q-item>
          </div>
          <q-card-actions align="around">
            <div>
              <q-btn @click="modifierMention(c1)" flat color="primary">Modifier</q-btn>
            </div>
            <div>
              <q-btn @click="voirParcours(c1)" flat color="secondary">Voir les parcours</q-btn>
            </div>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-sm-12 col-md-4">
        <q-card class="animate-scale animated" v-for="c2 in col2" :key="c2.id">
          <q-card-title><h6 class="text-center">Mention</h6></q-card-title>
          <div class="flex flex-center"><img :src="c2.photo ? c2.photo : 'statics/mentionvide.png'" width="150" /></div>
          <div class="flex flex-center"><h5 class="light-paragraph text-center">{{ c2.libelle }}</h5></div>
          <div class="layout-padding text-grey text-italic"  style="padding-bottom: 0;" v-if="c2.chefMention">Responsable</div>
          <div class="layout-padding" v-if="c2.chefMention">
            <q-item style="padding-left: 0">
              <q-item-side >
                <img :src="c2.chefMention.photo ? c2.chefMention.photo : 'statics/photovide.jpg'" width="80" style="border-radius: 50%;"/>
              </q-item-side>
              <q-item-main class=""  >
                {{ c2.chefMention.nom }} {{ c2.chefMention.prenom }}
                <div class="q-item-sublabel">Professeur titulaire</div>
                <div class="q-item-sublabel">{{ c2.chefMention.email }}</div>
                <div class="q-item-sublabel">{{ c2.chefMention.phone }}</div>
              </q-item-main>
            </q-item>
          </div>
          <q-card-actions align="around">
            <div>
              <q-btn @click="modifierMention(c2)" flat color="primary">Modifier</q-btn>
            </div>
            <div>
              <q-btn @click="voirParcours(c2)" flat color="secondary">Voir les parcours</q-btn>
            </div>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-sm-12 col-md-4">
        <q-card class="animate-scale animated" v-for="c3 in col3" :key="c3.id">
          <q-card-title><h6 class="text-center">Mention</h6></q-card-title>
          <div class="flex flex-center"><img :src="c3.photo ? c3.photo : 'statics/mentionvide.png'" width="150" /></div>
          <div class="flex flex-center"><h5 class="light-paragraph text-center">{{ c3.libelle }}</h5></div>
          <div class="layout-padding text-grey text-italic"  style="padding-bottom: 0;" v-if="c3.chefMention">Responsable</div>
          <div class="layout-padding" v-if="c3.chefMention">
            <q-item style="padding-left: 0">
              <q-item-side >
                <img :src="c3.chefMention.photo ? c3.chefMention.photo : 'statics/photovide.jpg'" width="80" style="border-radius: 50%;"/>
              </q-item-side>
              <q-item-main class=""  >
                {{ c3.chefMention.nom }} {{ c3.chefMention.prenom }}
                <div class="q-item-sublabel">Professeur titulaire</div>
                <div class="q-item-sublabel">{{ c3.chefMention.email }}</div>
                <div class="q-item-sublabel">{{ c3.chefMention.phone }}</div>
              </q-item-main>
            </q-item>
          </div>
          <q-card-actions align="around">
            <div>
              <q-btn @click="modifierMention(c3)" flat color="primary">Modifier</q-btn>
            </div>
            <div>
              <q-btn @click="voirParcours(c3)" flat color="secondary">Voir les parcours</q-btn>
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
    computed: {
      ...mapGetters('mention', [
        'chunckedFilteredMentions'
      ]),
      col1 () {
        return this.chunckedFilteredMentions[0]
      },
      col2 () {
        return this.chunckedFilteredMentions[1]
      },
      col3 () {
        return this.chunckedFilteredMentions[2]
      }
    },
    data () {
      return {
        selectedMention: { ...this.value }
      }
    },
    methods: {
      voirParcours (mention) {
        this.$store.commit('etablissement/ADMIN_DATA', {mention: mention})
        this.$router.push('/admin/parcours/' + mention.code)
      },
      modifierMention (mention) {
        this.selectedMention = JSON.parse(JSON.stringify(mention))
        this.$emit('input', this.selectedMention)
        this.$emit('modification')
      }
    }
  }
</script>

<style>
</style>

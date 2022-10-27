<template>
  <div class="layout-padding">
    <div class="row">
      <div class="col-8 offset-2">
        <h3 class="text-center content-center">Plan de Formation</h3>
        <div class="row justify-center">
          <div class="col-8">
            <q-card v-for="u in ue" class="cursor-pointer" @click="infoUE(u)" :key="u.id">
              <q-card-title>
                {{ u.libelle }}
              </q-card-title>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    QCard,
    QCardTitle,
    QCardSeparator,
    QCardMain,
    QBtn,
    QTransition,
    QSelect,
    QFixedPosition,
    QTooltip,
    QIcon,
    Loading,
    QModal,
    QInput,
    Alert
  } from 'quasar'

  import { map } from 'lodash'
  export default {
    components: {
      QCard,
      QCardTitle,
      QCardSeparator,
      QCardMain,
      QBtn,
      QTransition,
      QSelect,
      QFixedPosition,
      QTooltip,
      QIcon,
      QModal,
      QInput,
      Alert
    },
    data () {
      return {
        typeUe: [],
        utilisateur: [],
        ue: [],
        annee: '',
        anneeOptions: [],
        mention: '',
        mentionOptions: [],
        parcours: '',
        parcoursOptions: [],
        semestre: '',
        semestreOptions: [],
        newUE: {
          libelle: '',
          code: '',
          abreviation: '',
          typeUe: 0,
          responsableUe: 0
        }
      }
    },
    computed: {
    },
    watch: {
    },
    methods: {
      getSelected (value) {
        if (value) return {id: value}
        else return null
      },
      infoUE (ue) {
        this.$router.push('/parcours/plan-de-formation/ue')
      },
      findPlanFormation () {
        let params = {
          idParcours: this.parcours,
          idSemestre: this.semestre,
          idAnneeUniversitaire: this.annee
        }
        Loading.show()
        this.$store.dispatch('planformation/getPlanDeFormation', params)
          .then((res) => {
            setTimeout(() => {
              this.ue = res
              Loading.hide()
            }, 1000)
          })
          .catch((err) => {
            console.log('err', err)
          })
      }
    },
    mounted () {
      this.$store.dispatch('getCurrentUser')
        .then((utilisateur) => {
          console.log(utilisateur.id)
        })
      this.$store.dispatch('planformation/getAllTypeUe')
        .then((res) => {
          map(res, t => {
            let type = {
              label: t.libelle,
              value: t.id
            }
            this.typeUe.push(type)
          })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
</script>

<style>
</style>
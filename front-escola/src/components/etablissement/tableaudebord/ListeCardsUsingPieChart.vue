<template>
  <div class="layout-view">
    <div class="row" id="chart-id">
      <div class="col-sm-8 col-md-8">
        <pie-chart :data="composantHistoriques" :options="composantOptions"></pie-chart>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    QCard,
    QDataTable,
    QBtn,
    QIcon,
    Loading,
    Alert,
    QItem,
    QItemSide,
    QSelect,
    QTooltip,
    QFixedPosition,
    QModal,
    QModalLayout,
    Dialog,
    QInput,
    QSpinner
  } from 'quasar'
  import { map } from 'lodash'
  import PieChart from './PieChart.js'

  export default {
    components: {
      QCard,
      QDataTable,
      QBtn,
      QIcon,
      Loading,
      Alert,
      QItem,
      QItemSide,
      QSelect,
      QTooltip,
      QFixedPosition,
      QModal,
      QModalLayout,
      Dialog,
      QInput,
      PieChart,
      QSpinner
    },
    data () {
      return {
        /* composantHistoriques: [], */
        composantOptions: {
          hoverBorderWidth: 20
        },
        composantHistoriques: {
          hoverBackgroundColor: 'red',
          hoverBorderWidth: 10,
          labels: ['Green', 'Red', 'Blue', 'Blue', 'Blue', 'Blue', 'Blue', 'Blue', 'Blue', 'Blue'],
          datasets: [
            {
              label: 'Nombres des étudiant pour chaque composant',
              backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#00D8FF', '#00D8FF', '#00D8FF', '#00D8FF', '#00D8FF', '#00D8FF', '#00D8FF'],
              data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
            }
          ]
        },
        openSupprimer: false,
        motif: '',
        isReady: false
      }
    },
    computed: {
    },
    methods: {
      getInfosEtudiantByComposant: function (composant) {
        this.composantHistoriques = []
        map(composant, (et) => {
          this.$store.dispatch('tableaudebord/getInfosEtudiantByComposant', et.id).then((res) => {
            et.labels = et.libelle
            /* et.datasets.data = res */
            this.composantHistoriques.push(et)
            console.log(this.composantHistoriques)
          }).catch((err) => {
            console.log(err)
          })
        })
      },
      refresh (done) {
        Loading.show()
        setTimeout(() => {
          this.$store.dispatch('tableaudebord/getAllComposantByEtablissement', this.$route.params.id_universite)
            .then((res) => {
              this.getInfosEtudiantByComposant(res)
              Loading.hide()
            })
            .catch((err) => {
              console.log(err)
              Loading.hide()
            })
          done()
        }, 1000)
      }
    },
    mounted () {
      this.refresh(() => {
        console.log('Init finished')
      })
    }
  }
</script>

<style lang="stylus">
  ._no-padding
    padding 0 !important
    .q-item
      padding-left 0

  ._deleteModal
    .layout-header
      box-shadow none

    .layout-footer
      box-shadow none

  #chart-id {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>

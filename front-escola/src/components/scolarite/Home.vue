<template>
  <div>
    <div class="layout-padding">

      <div class="row sm-gutter">
        <div class="col-sm-12">
          <q-card class="layout-padding" style="padding-top: 0; ">
            <q-card-title style="">
              Messages
            </q-card-title>
            <q-card-main>
              <blockquote>
                <p>
                  Bienvenue les membres de l'équipe de la Scolarité! eScola vous assure que tout ira mieux dorénavant avec l'utilisation de cette Application!</p>
                <small><cite title="Quasar Framework">L'équipe eScola</cite></small>
              </blockquote>
            </q-card-main>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    QCard,
    QDataTable,
    QBtn,
    QFixedPosition,
    LocalStorage,
    QTooltip,
    QIcon,
    QModal,
    QCardTitle,
    QCardMain,
    QCardSeparator,
    QCardMedia,
    QRating,
    QCardActions,
    QInput,
    QField,
    QSelect,
    QItem,
    QItemSide,
    QItemMain,
    QModalLayout
  } from 'quasar'

  export default {
    components: {
      QCard,
      QDataTable,
      QBtn,
      QFixedPosition,
      QTooltip,
      QIcon,
      QModal,
      QCardTitle,
      QCardMain,
      QCardSeparator,
      QCardMedia,
      QRating,
      QCardActions,
      QInput,
      QField,
      QSelect,
      QItem,
      QItemSide,
      QItemMain,
      QModalLayout
    },
    data () {
      return {
      }
    },
    validations: {
    },
    computed: {
    },
    mounted () {
      if (LocalStorage.get.item('user') == null) {
        this.$router.push('/login')
      }
    },
    methods: {
    }
  }
</script>

<style lang="stylus">

</style>

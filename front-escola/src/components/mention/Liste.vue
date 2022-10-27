<template>
  <div class="layout-padding" style="padding-top: 10px;">
    <div class="row" style="padding-bottom: 30px;padding-top: 10px;">
      <div class="col-12">
        <q-card class="full-width layout-padding">
          <div class="row sm-gutter">
            <div class="col-lg-4">
              <q-input v-model="search"  type="text" placeholder="Rechercher" :before="[{icon: 'search', handler () {}}]" style="margin-top: 0px" />
            </div>
            <div class="col-md-6"></div>
            <div class="col-md-2">
              <q-btn flat icon-right="arrow_drop_down" style="width: 100%" color="grey" @click="toogleFilter">Trier par
              </q-btn>
            </div>
          </div>
          <div v-show="showFilter">
            <br/>
            <div class="row sm-gutter" >
              <div class="col-md-3">
                <q-btn outline rounded style="width: 100%" color="primary">Chef Scolarité
                  <span slot="loading">
                    <q-spinner-puff/>
                    Chef Scolarité
                  </span>
                </q-btn>
              </div>
              <div class="col-md-3">
                <q-btn outline rounded style="width: 100%" color="primary">Rp Parcours
                  <span slot="loading">
                    <q-spinner-puff/>
                    Rp Parcours
                  </span>
                </q-btn>
              </div>
              <div class="col-md-3">
                <q-btn outline rounded style="width: 100%" color="primary">Enseignants
                  <span slot="loading">
                    <q-spinner-puff/>
                    Enseignants
                  </span>
                </q-btn>
              </div>
              <div class="col-md-3">
                <q-btn outline rounded style="width: 100%" color="primary">Rp UE
                  <span slot="loading">
                    <q-spinner-puff/>
                    Rp UE
                  </span>
                </q-btn>
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>
    <div class="row sm-gutter " >
      <div class="col-lg-3 flex items-stretch" style="padding-top: 0;" v-for="utilisateur in utilisateurs" :key="utilisateur.id">
        <q-card inline class="full-width animate-scale animated" style=" min-height: 260px;">
          <q-btn small  style="position: absolute;margin: 10px;color: white;font-size: 18px;" round flat>
            <q-icon name="more_vert">
              <q-popover ref="popover">
                <q-list link>
                  <q-item>
                    <q-item-side icon="edit" />
                    <q-item-main label="Modifier" />
                  </q-item>
                  <q-item>
                    <q-item-side icon="delete" />
                    <q-item-main label="Supprimer" />
                  </q-item>
                </q-list>
              </q-popover>
            </q-icon>
          </q-btn>
          <div class="content-center text-center">
            <!--<q-chip tag  color="secondary" style="position: absolute; margin-left: 100px">Moi</q-chip>-->
            <div class="_entete flex items-center justify-center" style="background-size: contain;background-repeat: no-repeat;">
              <!--<img :src="utilisateur.photo ? utilisateur.photo : 'http://localhost:7070/statics/photovide.png'" class="avatar" style="background: white;width: 90px;height: 90px;margin-top: 10px;">-->
              <div class="shadow-1" style="border-radius: 50%;height: 90px;width: 90px;margin-top: 10px;" :style="utilisateur.photo ? 'background: url(' + utilisateur.photo + ');background-size: cover;background-color: white;' : 'background: url(http://localhost:7070/statics/photovide.png);background-size: cover;background-color: white;'"></div>
            </div>
            <q-card-main>
              <div style="margin-top: 10px">{{utilisateur.nom + ' ' + utilisateur.prenom}}</div>
              <div style="margin-top: 10px" ><b>{{utilisateur.email}}</b></div>
              <div style="margin-top: 10px">{{utilisateur.adresse}}</div>
              <div style="margin-top: 10px">{{utilisateur.phone}}</div>
              <!--q-chip style="margin-top: 10px;" tag color="primary">Description de la fonction</q-chip-->
            </q-card-main>
          </div>
        </q-card>
      </div>
    </div>
    <q-fixed-position corner="bottom-left" :offset="[18, 18]">
      <q-btn
        round
        color="primary"
        @click="$router.push('/mention/personne/ajout')"
        class="animate-pop"
      >
        <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Ajouter un utilisateur</q-tooltip>
        <q-icon name="person_add" />
      </q-btn>
    </q-fixed-position>
  </div>
</template>

<script>
  import {
    QCard,
    QChip,
    QCardMain,
    QRating,
    QBtn,
    QSpinnerPuff,
    QInput,
    QIcon,
    QPopover,
    QList,
    QItem,
    QItemMain,
    QItemSide,
    QFixedPosition,
    QTooltip
  } from 'quasar'

  import { mapGetters } from 'vuex'

  export default {
    components: {
      QCard,
      QChip,
      QCardMain,
      QRating,
      QBtn,
      QSpinnerPuff,
      QInput,
      QIcon,
      QPopover,
      QList,
      QItem,
      QItemMain,
      QItemSide,
      QFixedPosition,
      QTooltip
    },
    data () {
      return {
        search: '',
        showFilter: false,
        utilisateurs: null
      }
    },
    computed: {
      ...mapGetters({
        utilisateurs: 'utilisateur/utilisateurs'
      })
    },
    methods: {
      toogleFilter () {
        console.log(this.utilisateurs)
        this.showFilter = !this.showFilter
      }
    },
    mounted () {
      this.$store.dispatch('getFonction')
        .then((fonction) => {
          this.$store.dispatch('utilisateur/getSousResponsabiliteMention', fonction.vars.mention.id)
            .then((result) => {
              console.log(result)
              this.utilisateurs = result
            })
            .catch((error) => {
              console.log('mention/Liste.vue mounted ', error)
            })
        })
        .catch((error) => {
          console.log('mention/Liste.vue mounted ', error)
        })
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~variables'

  ._entete {
    height: 150px;
    background $primary
  }
</style>

<template>
  <div>
    <div class="layout-padding">

      <div class="row sm-gutter">
        <div class="col-sm-12">
          <q-card class="layout-padding" style="padding-top: 0; ">
            <q-card-main>
              <div class="row">
                <div class="col-sm-12 col-md-3 flex flex-center">
                  <img src="statics/photovide.png"/>
                </div>
                <div class="col-sm-12 col-md-9">
                  <h4 class="light-paragraph">{{user.fullname}}</h4>
                  <h5 class="text-grey text-italic light-paragraph">{{user.fonction}}</h5>
                </div>
              </div>
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
      QCardTitle,
      LocalStorage,
      QCardMain
    } from 'quasar'

    export default {
      components: {
        QCard,
        QCardTitle,
        QCardMain
      },
      data () {
        return {
          user: {
            fullname: '',
            fonction: ''
          }
        }
      },
      methods: {
        setNom () {
          this.$store.dispatch('getStorageCredential')
            .then((res) => {
              this.user.fonction = res.respOptions.label
            })
          let user = JSON.parse(LocalStorage.get.item('user'))
          this.user.fullname = user.nom + ' ' + user.prenom
        }
      },
      mounted () {
        if (LocalStorage.get.item('user') == null) {
          this.$router.push('/login')
        }
        this.setNom()
      }
    }
</script>

<style>
</style>

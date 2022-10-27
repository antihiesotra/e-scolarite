<template>
  <div></div>
</template>

<script>
  import axios from 'axios'
  import { SessionStorage } from 'quasar'

  export default {
    data () {
      return {}
    },
    mounted: function () {
      axios.post('http://localhost:5555/auth', {
        'etablissement': '',
        'composant': '',
        'fonction': 'resp_scolarite',
        'email': '',
        'password': ''
      })
        .then(function (response) {
          console.log(response)
          SessionStorage.set('auth_token', response.data.data.token)
          console.log('token', SessionStorage.get.item('auth_token'))
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
</script>

<style>
</style>

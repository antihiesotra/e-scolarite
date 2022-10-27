<template>
  <q-modal-layout>
    <!-- Header -->
    <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey;">
      <div class="text-center">
        <div class="col-sm-12 layout-padding ">
          <div style="margin: 0;font-size: 24px" class="light-paragraph">Modification d'un domaine</div>
        </div>
      </div>
      <q-btn flat round small @click="closeModalModifier" style="position: absolute;top: 1em;right: 1em">
        <q-icon name="close" />
      </q-btn>
    </div>

    <!-- Code -->
    <div class="col-sm-12">
      <div class="row  flex flex-center">
        <div class="col-md-7">
          <div class="q-item-sublabel text-italic text-center">Cliquez pour choisir un logo</div>
        </div>
        <div class="col-md-7 col-sm-12 flex justify-center flex-center">
          <q-field style="margin-top: 8px;">
            <div class="_logo-upload">
              <div style="overflow: hidden;cursor: pointer;padding-bottom: 0;margin-bottom: 0;font-size: 0;border-radius: 50%;width: 100px;height: 100px;"
                   class="relative-position flex items-center">
                <label for="logo-input-update">
                  <img class="responsive" :src="domaine.photo ? domaine.photo : 'statics/domainevide.png'" style=""/>
                </label>
              </div>
              <input
                id="logo-input-update"
                @change="changeLogoUpdate()"
                type="file"/>
            </div>
          </q-field>
        </div>
      </div>
    </div>

    <div class="_modal-content">
      <div class="row sm-gutter">
        <div class="col-sm-12">
          <div>
            <q-field
              icon="code"
              helper="20 caractères max"
              :error="$v.domaine.code.$error"
              error-label="Veuillez entrer un code valide"
              count
            >
              <q-input
                v-model="domaine.code"
                float-label="Code *"
                @blur="$v.domaine.code.$touch"
                :disable="true"></q-input>
            </q-field>
          </div>
        </div>
      </div>
    </div>

    <!-- Libellé -->
    <div class="_modal-content" style="border-bottom: none;">
      <div class="row sm-gutter">
        <div class="col-md-12">
          <q-field
            icon="style"
            helper="20 caractères max"
            :error="$v.domaine.libelle.$error"
            error-label="Veuillez entrer un code valide"
            count
          >
            <q-input
              v-model="domaine.libelle"
              float-label="Libellé *"
              @blur="$v.domaine.libelle.$touch">
            </q-input>
          </q-field>
        </div>
      </div>
    </div>

    <!-- Responsable -->
    <div class="_modal-content" style="border-bottom: none;">
      <div class="row sm-gutter">
        <div class="col-md-12">
          <q-field
            icon="person"
          >
            <q-select
                :options="listResponsable"
                v-model="domaine.responsableEtablissement"
                chips
                float-label="Responsable"
                filter
                autofocus-filter
                filter-placeholder="Chercher le Responsable"
                justify-center
              ></q-select>
            </q-select>
          </q-field>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div slot="footer" :class="'_no-shadow'" style="padding: 15px 100px 20px;">
      <div class="flex flex-center">
        <q-btn
          color="primary"
          style="height: 50px;"
          rounded
          push
          class="col-md-7 col-sm-12 col-12"
          :disabled="$v.validationGroupUpdate.$invalid"
          @click="updateDomaine">
          Modifier
        </q-btn>
      </div>
    </div>
  </q-modal-layout>
</template>

<script>
  // native components
  import {
    QModalLayout,
    QBtn,
    QIcon,
    QField,
    QInput,
    QSelect
  } from 'quasar'

  // Vuelidate
  import {required} from 'vuelidate/lib/validators'

  export default {
    props: {
      selectedDomaine: Object,
      responsableOptions: Array
    },
    components: {
      QModalLayout,
      QBtn,
      QIcon,
      QField,
      QInput,
      QSelect
    },
    validations: {
      domaine: {
        code: {required},
        libelle: {required}
      },
      validationGroupUpdate: ['domaine']
    },
    data () {
      return {
        listResponsable: [],
        domaine: {}
      }
    },
    watch: {
      selectedDomaine: function (val) {
        let domaine = {
          ...JSON.parse(JSON.stringify(val)),
          responsableDomaine: val.responsableDomaine ? val.responsableDomaine.id : 0
        }
        this.domaine = domaine
      }
    },
    mounted () {
      this.getAllResponsable()
    },
    methods: {
      getAllResponsable () {
        this.$store.dispatch('utilisateur/getAllUtilisateurs')
          .then((res) => {
            this.listResponsable.push({
              label: 'Aucun Responsable',
              sublabel: '',
              value: 0,
              image: 'statics/photovide.png'
            })
            res.map(user => {
              this.listResponsable.push({
                label: user.nom + ' ' + user.prenom,
                sublabel: user.login,
                value: user.id,
                image: user.photo ? user.photo : 'statics/photovide.png'
              })
            })
          })
          .catch((err) => {
            console.log('erreur de récupération des responsables', err)
          })
      },
      getSelected (value) {
        if (value) return {id: value}
        else return null
      },
      closeModalModifier () {
        this.$emit('close')
      },
      modifierResponsableDomaine (pathVariables) {
        return this.$store.dispatch('utilisateur/updateResponsableDomaine', pathVariables)
      },
      changeLogoUpdate () {
        let file = document.getElementById('logo-input-update').files[0]
        this.domaine.photo = URL.createObjectURL(file)
        this.image = file
      },
      updateDomaine () {
        let domaine = {
          ...this.domaine,
          responsableDomaine: this.getSelected(this.domaine.responsableDomaine)
        }
        this.$store.dispatch('domaine/updateDomaine', domaine)
          .then(domaine => {
            this.$store.dispatch('domaine/setPhoto', {domaine: domaine, image: this.image})
              .then(domaine => {
                this.closeModalModifier()
                this.$emit('reload', domaine)
              })
              .catch(err => {
                this.$emit('failure', this.image)
                console.log('Erreur de mise à jour de la photo du domaine #' + domaine.code + ': ' + err)
              })
          })
          .catch(err => {
            console.log('Erreur de mise à jour du Domaine #' + domaine.code + ': ' + err)
            this.$emit('failure', domaine.code)
          })
      }
    }
  }
</script>

<style>
</style>

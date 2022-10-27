<template>
    <q-modal-layout>
      <!-- Header -->
      <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey;">
        <div class="text-center">
          <div class="col-sm-12 layout-padding ">
            <div style="margin: 0;font-size: 24px" class="light-paragraph">Ajout d'un établissement</div>
          </div>
        </div>
        <q-btn flat round small @click="closeAddModal" style="position: absolute;top: 1em;right: 1em">
          <q-icon name="close" />
        </q-btn>
      </div>

      <!-- Logo et code -->
      <div class="_modal-content">
        <div class="row sm-gutter">
          <!-- Logo -->
          <div class="col-sm-12">
            <div class="row  flex flex-center">
              <div class="col-md-7">
                <div class="q-item-sublabel text-italic text-center">Cliquez pour définir le logo</div>
              </div>
              <div class="col-md-7 col-sm-12 flex justify-center flex-center">
                <q-field
                  style="margin-top: 8px;"
                >
                  <div class="_logo-upload">
                    <div v-ripple=""
                         style="overflow: hidden;cursor: pointer;padding-bottom: 0;margin-bottom: 0;font-size: 0;border-radius: 50%;width: 200px;height: 200px;"
                         class="relative-position flex items-center">
                      <label for="logo-input">
                        <img class="responsive" :src="etablissement.photo" style=""/>
                      </label>
                    </div>
                    <input
                      id="logo-input"
                      ref="logoInput"
                      @change="changeLogo()"
                      type="file" />
                  </div>
                </q-field>
              </div>
            </div>
          </div>

          <!-- Code -->
          <div class="col-md-12">
            <div>
              <q-field
                icon="code"
                helper="4 caractères min / 25 caractères max"
                count
                :error="$v.etablissement.code.$error"
                error-label="Veuillez saisir un code valide"
              >
                <q-input
                  v-model="etablissement.code"
                  @blur="$v.etablissement.code.$touch"
                  float-label="Code *" />
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
              helper="50 caractères max"
              count
              :error="$v.etablissement.libelle.$error"
              error-label="Veuillez saisir un libellé valide"
            >
              <q-input
                v-model="etablissement.libelle"
                @blur="$v.etablissement.libelle.$touch"
                float-label="Libellé *" />
            </q-field>
          </div>
        </div>
      </div>

      <!-- Localisation -->
      <div class="_modal-content" style="border-bottom: none;">
        <div class="row sm-gutter">
          <div class="col-md-12">
            <q-field
              icon="place"
              helper="50 caractères max"
              count
              :error="$v.etablissement.localisation.$error"
              error-label="Veuillez saisir une localisation valide"
            >
              <q-input
                v-model="etablissement.localisation"
                @blur="$v.etablissement.localisation.$touch"
                float-label="Localisation *" />
            </q-field>
          </div>
        </div>
      </div>

      <!-- Devise -->
      <div class="_modal-content" style="border-bottom: none;">
        <div class="row sm-gutter">
          <div class="col-md-12">
            <q-field
              icon="assignment"
              helper="50 caractères max"
              count
              :error="$v.etablissement.devise.$error"
              error-label="Veuillez saisir une devise valide"
            >
              <q-input
                v-model="etablissement.devise"
                @blur="$v.etablissement.devise.$touch"
                float-label="Devise *" />
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
                v-model="etablissement.responsableEtablissement"
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
          <q-btn color="primary"
                 style="height: 50px;"
                 rounded push
                 class="col-md-7 col-sm-12 col-12"
                 :disable="$v.validationGroupAdd.$invalid"
                 @click="addEtablissement">
            Ajouter
          </q-btn>
        </div>
      </div>
    </q-modal-layout>
</template>

<script>
  // native components
  import {
    QModal,
    QModalLayout,
    QBtn,
    QIcon,
    QField,
    QSelect,
    QInput,
    Ripple
  } from 'quasar'

  // Vuelidate
  import {required} from 'vuelidate/lib/validators'

  export default {
    directives: {
      Ripple
    },
    props: {
      adminData: Object
    },
    components: {
      QModal,
      QModalLayout,
      QBtn,
      QIcon,
      QField,
      QSelect,
      QInput,
      Ripple
    },
    validations: {
      etablissement: {
        code: {required},
        libelle: {required},
        localisation: {required},
        devise: {required}
      },
      validationGroupAdd: ['etablissement']
    },
    data () {
      return {
        listResponsable: [],
        etablissement: {
          responsableEtablissement: 0,
          photo: 'statics/icons/school-2/041-chalks.png'
        },
        responsableOptions: [],
        utilisateursAPI: []
      }
    },
    mounted () {
      this.getAllUtilisateurs()
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
                sublabel: user.email,
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
      getAllUtilisateurs () {
        this.$store.dispatch('utilisateur/getAllUtilisateurs')
          .then(res => {
            this.utilisateursAPI = res
            // console.log('Init utilsateursAPI: ', this.utilisateursAPI)
            res.map(u => {
              this.responsableOptions.push({
                label: u.nom + ' ' + u.prenom,
                sublabel: u.email,
                value: u.id,
                image: u.photo ? u.photo : 'statics/photovide.png'
              })
            })
          })
      },
      closeAddModal () {
        this.$emit('close')
      },
      modifierResponsableEtablissement (pathVariables) {
        return this.$store.dispatch('utilisateur/updateResponsableEtablissement', pathVariables)
      },
      addEtablissement () {
        let etablissement = {
          ...this.etablissement,
          responsableEtablissement: this.getSelected(this.etablissement.responsableEtablissement)
        }

        this.$store.dispatch('etablissement/addEtablissement', etablissement)
          .then(etablissement => {
            this.$store.dispatch('etablissement/setPhoto', {etablissement: etablissement, image: this.image})
              .then(etablissement => {
                this.closeAddModal()
                this.$emit('reload')
              })
              .catch(err => {
                this.$emit('failure', this.image)
                console.log('Erreur de l\'ajout d\'etablissement: ' + etablissement.code + ': ' + err)
              })
          })
          .catch(err => {
            this.$emit('failure', etablissement.code)
            console.log('Erreur de l\'ajout d\'etablissement: ' + etablissement.code + ': ' + err)
          })
      },
      changeLogo () {
        let file = document.getElementById('logo-input').files[0]
        this.etablissement.photo = URL.createObjectURL(file)
        this.image = file
      }
    }
  }
</script>

<style>
</style>

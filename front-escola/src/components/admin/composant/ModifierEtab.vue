<template>
  <q-modal-layout>
    <!-- Header -->
    <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey;">
      <div class="text-center">
        <div class="col-sm-12 layout-padding ">
          <div style="margin: 0;font-size: 24px" class="light-paragraph">Modification de l'établissement</div>
        </div>
      </div>
      <q-btn flat round small @click="closeModalModifier" style="position: absolute;top: 1em;right: 1em">
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
                error-label=""
              >
                <div class="_logo-upload">
                  <div v-ripple=""
                       style="overflow: hidden;cursor: pointer;padding-bottom: 0;margin-bottom: 0;font-size: 0;border-radius: 50%;width: 200px;height: 200px;"
                       class="relative-position flex items-center">
                    <label for="logo-input-update-etab">
                      <img class="responsive" :src="etablissement.photo ? etablissement.photo : 'statics/icons/school-2/041-chalks.png'" style=""/>
                    </label>
                  </div>
                  <input id="logo-input-update-etab" @change="changeLogoUpdateEtab()" type="file" />
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
            >
              <q-input
                v-model="etablissement.code"
                float-label="Code *"
                :disable="true" />
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
            :error="$v.etablissement.libelle.$error"
            error-label="Veuillez saisir un libellé valide"
            count
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
            :error="$v.etablissement.localisation.$error"
            error-label="Veuillez saisir une localisation valide"
            count
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
            :error="$v.etablissement.devise.$error"
            error-label="Veuillez saisir une devise valide"
            count
          >
            <q-input
              v-model="etablissement.devise"
              @blur="$v.etablissement.devise.$touch"
              float-label="Devise *" />
          </q-field>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div slot="footer" :class="'_no-shadow'" style="padding: 15px 100px 20px;">
      <div class="flex flex-center">
        <q-btn color="primary"
               style="height: 50px;"
               rounded
               push
               class="col-md-7 col-sm-12 col-12"
               :disable="$v.validationGroupUpdate.$invalid"
               @click="updateEtablissement">
          Modifier
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
    components: {
      QModal,
      QModalLayout,
      QBtn,
      QIcon,
      QField,
      QSelect,
      QInput
    },
    directives: {
      Ripple
    },
    validations: {
      etablissement: {
        code: {
          required
        },
        libelle: {
          required
        },
        localisation: {
          required
        },
        devise: {
          required
        },
        photo: {
          required
        }
      },
      validationGroupUpdate: ['etablissement']
    },
    data () {
      return {
        etablissement: {
        },
        responsableOptions: []
      }
    },
    mounted () {
      this.$store.dispatch('getFonction')
        .then((fonction) => {
          this.etablissement = fonction.vars.etablissement
        })
      this.$store.dispatch('getCurrentUser')
        .then((user) => {
          this.user = user
        })
    },
    methods: {
      changeLogoUpdateEtab () {
        let file = document.getElementById('logo-input-update-etab').files[0]
        this.etablissement.photo = URL.createObjectURL(file)
        this.image = file
      },
      updateEtablissement () {
        let etablissement = {
          ...this.etablissement,
          responsableEtablissement: {id: this.user.id}
        }
        this.$store.dispatch('etablissement/updateEtablissement', etablissement)
          .then(etablissement => {
            this.$store.dispatch('etablissement/setPhoto', {etablissement: etablissement, image: this.image})
              .then(etablissement => {
                etablissement = JSON.parse(JSON.stringify(etablissement))
                this.closeModalModifier()
                this.etablissement = etablissement
                this.$store.dispatch('getFonction')
                  .then((fonction) => {
                    // Prevent taking cached image
                    fonction.vars.etablissement = etablissement
                    if (fonction.vars.etablissement.photo) {
                      fonction.vars.etablissement.photo += '?' + (new Date()).setUTCDate(0, 0, 0, 0)
                    }
                    this.$store.dispatch('saveFonction', fonction)
                  })
              })
              .catch(err => {
                this.$emit('failure', this.image)
                console.log('Erreur de l\'ajout de la photo de l\'établissement #' + etablissement.code + ': ' + err)
              })
          })
          .catch(err => {
            console.log('Erreur de mise à jour de l\'Etablissement #' + this.etablissement.code + ': ' + err)
            this.$emit('failure', this.etablissement.code)
          })
      },
      closeModalModifier () {
        this.$emit('close')
      }
    }
  }
</script>

<style>
</style>

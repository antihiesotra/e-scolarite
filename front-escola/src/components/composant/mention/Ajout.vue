<template>
  <q-modal-layout>

    <!-- Header -->
    <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey;">
      <div class="text-center">
        <div class="col-sm-12 layout-padding ">
          <div style="margin: 0;font-size: 24px" class="light-paragraph">Ajout d'une mention</div>
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
                error-label=""
              >
                <div class="_logo-upload">
                  <div v-ripple=""
                       style="overflow: hidden;cursor: pointer;padding-bottom: 0;margin-bottom: 0;font-size: 0;border-radius: 50%;width: 200px;height: 200px;"
                       class="relative-position flex items-center">
                    <label for="logo-input">
                      {{mention.photo}}
                      <img class="responsive" :src="mention.photo ? mention.photo : 'statics/mentionvide.png'" style=""/>
                      }
                    </label>
                  </div>
                  <input id="logo-input" @change="changeLogo" type="file"/>
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
              helper="20 caractères max"
              :error="$v.mention.code.$error"
              error-label="Veuillez entrer un code valide"
              count
            >
              <q-input
                v-model="mention.code"
                placeholder="Code *"
                @blur="$v.mention.code.$touch"></q-input>
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
            :error="$v.mention.libelle.$error"
            error-label="Veuillez entrer un code valide"
            count
          >
            <q-input
              v-model="mention.libelle"
              placeholder="Libelle *"
              @blur="$v.mention.libelle.$touch"></q-input>
          </q-field>
        </div>
      </div>
    </div>

    <!-- Domaine -->
    <div class="_modal-content" style="border-bottom: none;">
      <div class="row sm-gutter">
        <div class="col-md-12">
          <q-field
            :error="$v.mention.domaine.$error"
            icon="account balance"
            error-label="Veuillez sélectionner un domaine"
          >
            <q-select
              v-model="mention.domaine"
              float-label="Domaine *"
              :options="domaineOptions"
              @blur="$v.mention.domaine.$touch"
            >
            </q-select>
          </q-field>
        </div>
      </div>
    </div>

    <!-- Responsable mention -->
    <div class="_modal-content" style="border-bottom: none;">
      <div class="row sm-gutter">
        <div class="col-md-12">
          <q-field
            icon="person"
          >
            <q-select
                :options="listResponsable"
                v-model="mention.responsableMention"
                chips
                float-label="Responsable du Composant"
                filter
                autofocus-filter
                filter-placeholder="Chercher le responsable"
                justify-center
              ></q-select>
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
               :disabled="$v.validationGroupAdd.$invalid"
               @click="ajouterMention">
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
  import { required, maxLength } from 'vuelidate/lib/validators'

  export default {
    directives: {
      Ripple
    },
    props: {
      responsableOptions: Array,
      domaineOptions: Array,
      composant: Object
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
      mention: {
        code: {
          required,
          maxLength: maxLength(20)
        },
        libelle: {
          required,
          maxLength: maxLength(50)
        },
        domaine: {required}
      },
      validationGroupAdd: ['mention']
    },
    data () {
      return {
        listResponsable: [],
        mention: {
          photo: ''
        }
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
      changeLogo () {
        let file = document.getElementById('logo-input').files[0]
        this.mention.photo = URL.createObjectURL(file)
        this.image = file
      },
      closeAddModal () {
        this.$emit('close')
      },
      ajouterMention () {
        let mention = {
          ...this.mention,
          responsableMention: this.getSelected(this.mention.responsableMention),
          domaine: this.getSelected(this.mention.domaine),
          composant: this.getSelected(this.composant.id)
        }
        this.$store.dispatch('mention/addMention', mention)
          .then(mention => {
            this.$store.dispatch('mention/setPhoto', {mention: mention, image: this.image})
              .then((mention) => {
                this.$emit('reload')
                this.closeAddModal()
              })
              .catch((err) => {
                console.log('Erreur d\'ajout de la photo: ', err)
              })
          })
          .catch(error => {
            this.$emit('failure', this.mention.code)
            console.log('Erreur lors de l\'ajout de la Mention #' + this.mention.code + ': ', error)
          })
      }
    }
  }
</script>

<style>
</style>

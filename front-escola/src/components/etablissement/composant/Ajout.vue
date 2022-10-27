<template>
  <q-modal-layout>
    <!-- Header -->
    <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey;">
      <div class="text-center">
        <div class="col-sm-12 layout-padding ">
          <div style="margin: 0;font-size: 24px" class="light-paragraph">Ajout d'un composant</div>
        </div>
      </div>
      <q-btn flat round small @click="closeAddModal" style="position: absolute;top: 1em;right: 1em">
        <q-icon name="close"/>
      </q-btn>
    </div>

    <!-- Code et logo -->
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
                :error="$v.composant.photo.$error"
                style="margin-top: 8px;"
                error-label=""
              >
                <div class="_logo-upload">
                  <div v-ripple=""
                       style="overflow: hidden;cursor: pointer;padding-bottom: 0;margin-bottom: 0;font-size: 0;border-radius: 50%;width: 200px;height: 200px;"
                       class="relative-position flex items-center">
                    <label for="logo-input">
                      <img class="responsive" :src="composant.photo" style=""/>
                    </label>
                  </div>
                  <input
                    @blur="$v.composant.photo.$touch"
                    id="logo-input"
                    ref="logoInput"
                    @change="changeLogo()"
                    type="file"/>
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
              :error="$v.composant.code.$error"
              error-label="Veuillez entrer un code valide"
              count
            >
              <q-input
                v-model="composant.code"
                float-label="Code *"
                @blur="$v.composant.code.$touch"></q-input>
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
            :error="$v.composant.libelle.$error"
            error-label="Veuillez entrer un libellé valide"
            count
          >
            <q-input
              v-model="composant.libelle"
              float-label="Libellé *"
              @blur="$v.composant.libelle.$touch"/>
          </q-field>
        </div>
      </div>
    </div>

    <!-- Statut -->
    <div class="_modal-content" style="border-bottom: none;">
      <div class="row sm-gutter">
        <div class="col-md-12">
          <q-field
            :error="$v.composant.status.$error"
            icon="account_balance"
            error-label="Veuillez sélectionner un statut"
          >
            <q-select
              color="primary"
              float-label="Statut *"
              v-model="composant.status"
              :options="statusOptions"
              @blur="$v.composant.status.$touch"
            ></q-select>
          </q-field>
        </div>
      </div>
    </div>

    <!-- Localisation -->
    <div class="_modal-content" style="border-bottom: none;">
      <div class="row sm-gutter">
        <div class="col-md-12">
          <q-field
            :error="$v.composant.localisation.$error"
            icon="location_on"
            helper="20 caractères max"
            error-label="Veuillez entrer une adresse valide"
            count
          >
            <q-input
              v-model="composant.localisation"
              float-label="Adresse *"
              @blur="$v.composant.localisation.$touch"
            />
          </q-field>
        </div>
      </div>
    </div>

    <!-- Devise -->
    <div class="_modal-content" style="border-bottom: none;">
      <div class="row sm-gutter">
        <div class="col-md-12">
          <q-field
            :error="$v.composant.devise.$error"
            icon="flag"
            helper="20 caractères max"
            error-label="Veuillez entrer un devise valide"
            count
          >
            <q-input
              v-model="composant.devise"
              float-label="Devise *"
              @blur="$v.composant.devise.$touch"
            >
            </q-input>
          </q-field>
        </div>
      </div>
    </div>

    <div class="_modal-content" style="border-bottom: none;">
      <div class="row sm-gutter">
        <div class="col-md-12">
          <q-field
            icon="person"
          >
            <q-select
                :options="listResponsable"
                v-model="composant.chefScolarite"
                chips
                float-label="Chef de la scolarité"
                filter
                autofocus-filter
                filter-placeholder="Chercher le chef de la scolarité"
                justify-center
              ></q-select>
          </q-field>
        </div>
      </div>
    </div>

    <div class="_modal-content" style="border-bottom: none;">
      <div class="row sm-gutter">
        <div class="col-md-12">
          <q-field
            icon="person"
          >
            <q-select
                :options="listResponsable"
                v-model="composant.responsableComposant"
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
               @click="addComposant">Ajouter
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
  import { required } from 'vuelidate/lib/validators'

  export default {
    directives: {
      Ripple
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
      composant: {
        code: {required},
        devise: {required},
        libelle: {required},
        localisation: {required},
        status: {required},
        photo: {required}
      },
      validationGroupAdd: ['composant']
    },
    data () {
      return {
        listResponsable: [],
        composant: {
          code: '',
          libelle: '',
          localisation: '',
          status: '',
          devise: '',
          photo: 'statics/icons/school-2/041-chalks.png',
          responsableComposant: 0,
          chefScolarite: 0
        },
        responsableOptions: [],
        statusOptions: [
          {
            label: 'FACULTÉ',
            sublabel: '---------',
            rightIcon: 'account_balance',
            value: 'faculte',
            image: ''
          },
          {
            label: 'ÉCOLE',
            sublabel: '---------',
            rightIcon: 'account_balance',
            value: 'ecole',
            image: ''
          },
          {
            label: 'INSTITUT',
            sublabel: '',
            rightIcon: 'account_balance',
            value: 'institut',
            image: ''
          }
        ],
        utilisateursAPI: []
      }
    },
    mounted () {
      this.$store.dispatch('getFonction')
        .then((fonction) => {
          this.etablissement = fonction.vars.etablissement
        })
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
      modifierResponsableComposant (pathVariables) {
        return this.$store.dispatch('utilisateur/updateResponsableComposant', pathVariables)
      },
      getAllUtilisateurs () {
        this.$store.dispatch('utilisateur/getAllUtilisateurs')
          .then(utilisateurs => {
            this.responsableOptions.push({
              label: 'Aucun Responsable',
              sublabel: '',
              value: 0,
              image: 'statics/photovide.png'
            })
            utilisateurs.map(u => {
              this.responsableOptions.push({
                label: u.nom + ' ' + u.prenom,
                sublabel: u.email,
                value: u.id,
                image: u.photo ? u.photo : 'statics/photovide.png'
              })
            })
          })
          .catch(err => {
            console.log('Erreur de récupération des fonctions utilisateurs: ', err)
          })
      },
      addComposant () {
        let composant = {
          ...this.composant,
          responsableComposant: this.getSelected(this.composant.responsableComposant),
          chefScolarite: this.getSelected(this.composant.chefScolarite),
          etablissement: {id: this.etablissement.id}
        }
        this.$store.dispatch('composant/addComposant', composant)
          .then(composant => {
            this.$store.dispatch('composant/setPhoto', {composant: composant, image: this.image})
              .then(composant => {
                this.closeAddModal()
                this.$emit('reload')
              })
              .catch(err => {
                this.$emit('failure', this.image)
                console.log('Erreur de l\'ajout de la photo du Composant #' + composant.code + ': ' + err)
              })
          })
          .catch(err => {
            this.$emit('failure', composant.code)
            console.log('Erreur de l\'ajout du Composant #' + composant.code + ': ' + err)
          })
      },
      changeLogo () {
        let file = document.getElementById('logo-input').files[0]
        this.composant.photo = URL.createObjectURL(file)
        this.image = file
      },
      closeAddModal () {
        this.$emit('close')
      },
      resetComposantValue () {
        this.composant = {
          code: '',
          libelle: '',
          localisation: '',
          status: '',
          devise: '',
          photo: 'statics/icons/school-2/041-chalks.png',
          responsableComposant: null
        }
      }
    }
  }
</script>

<style>
</style>

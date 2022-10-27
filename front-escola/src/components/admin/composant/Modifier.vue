<template>
  <q-modal-layout>
    <!-- Header -->
    <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey;">
      <div class="text-center">
        <div class="col-sm-12 layout-padding ">
          <div style="margin: 0;font-size: 24px" class="light-paragraph">Modification d'un composant</div>
        </div>
      </div>
      <q-btn flat round small @click="closeModalModifier" style="position: absolute;top: 1em;right: 1em">
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
              <div class="q-item-sublabel text-italic text-center">Cliquez pour choisir un logo</div>
            </div>
            <div class="col-md-7 col-sm-12 flex justify-center flex-center">
              <q-field
                :error="$v.composant.photo.$error"
                style="margin-top: 8px;"
                error-label=""
              >
                <div class="_logo-upload">
                  <div v-ripple=""
                       style="overflow: hidden;cursor: pointer;padding-bottom: 0;margin-bottom: 0;font-size: 0;border-radius: 50%;width: 100px;height: 100px;"
                       class="relative-position flex items-center">
                    <label for="logo-input-update">
                      <img class="responsive" :src="composant.photo ? composant.photo : 'statics/icons/school-2/041-chalks.png'" style=""/>
                    </label>
                  </div>
                  <input
                    @blur="$v.composant.photo.$touch"
                    id="logo-input-update"
                    @change="changeLogoUpdate()"
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
                :disable="true"
                @blur="$v.composant.code.$touch">
              </q-input>
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
              @blur="$v.composant.status.$touch"
              color="primary"
              float-label="Statut *"
              v-model="composant.status"
              :options="statusOptions"
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
              @blur="$v.composant.localisation.$touch"
              v-model="composant.localisation"
              float-label="Adresse *"/>
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
              @blur="$v.composant.devise.$touch"
              v-model="composant.devise"
              float-label="Devise *">
            </q-input>
          </q-field>
        </div>
      </div>
    </div>

    <!-- Responsable composant -->
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
                float-label="Responsable"
                filter
                autofocus-filter
                filter-placeholder="Chercher le Responsable"
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
               :disable="$v.validationGroupUpdate.$invalid"
               @click="updateComposant">Modifier
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
    QSelect,
    Ripple
  } from 'quasar'

  // Vuelidate
  import { required } from 'vuelidate/lib/validators'

  export default {
    directives: {
      Ripple
    },
    props: {
      selectedComposant: Object
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
      composant: {
        code: {required},
        devise: {required},
        libelle: {required},
        localisation: {required},
        status: {required},
        photo: {required}
      },
      validationGroupUpdate: ['composant']
    },
    data () {
      return {
        listResponsable: [],
        responsableOptions: [],
        utilisateurs: [],
        composant: {},
        statusOptions: [
          {
            label: 'UNIVERSITÉ',
            sublabel: 'L\'enseignement supérieur pour tous',
            rightIcon: 'account_balance',
            value: 'universite',
            image: ''
          },
          {
            label: 'GRANDE ÉCOLE',
            sublabel: 'La culture de l\'excellence',
            rightIcon: 'account_balance',
            value: 'grande_ecole',
            image: ''
          },
          {
            label: 'ÉCOLE SPÉCIALISÉ',
            sublabel: 'Des enseignements spécifiques',
            rightIcon: 'account_balance',
            value: 'ecole',
            image: ''
          },
          {
            label: 'INSTITUT SPÉCIALISÉ',
            sublabel: 'Des enseignements spécifiques',
            rightIcon: 'account_balance',
            value: 'institut',
            image: ''
          },
          {
            label: 'ECOLE SUPÉRIEURE D’ART ET D’ARTS APPLIQUÉS',
            sublabel: '',
            rightIcon: 'account_balance',
            value: 'ecole_art',
            image: ''
          },
          {
            label: 'FACULTÉ',
            sublabel: '',
            rightIcon: 'account_balance',
            value: 'faculte',
            image: ''
          },
          {
            label: 'ÉCOLE NATIONALE SUPÉRIEURE',
            sublabel: '',
            rightIcon: 'account_balance',
            value: 'ens',
            image: ''
          }
        ]
      }
    },
    mounted () {
      this.getAllUtilisateurs()
      this.getAllResponsable()
    },
    watch: {
      selectedComposant: function (val) {
        if (!val) return this.closeModalModifier()
        let composant = JSON.parse(JSON.stringify(val))
        composant.responsableComposant = composant.responsableComposant ? composant.responsableComposant.id : 0
        composant.chefScolarite = composant.chefScolarite ? composant.chefScolarite.id : 0
        this.composant = composant
      }
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
      closeModalModifier () {
        this.$emit('close')
      },
      changeLogoUpdate () {
        let file = document.getElementById('logo-input-update').files[0]
        this.composant.photo = URL.createObjectURL(file)
        this.image = file
      },
      updateComposant () {
        let composant = {
          ...JSON.parse(JSON.stringify(this.composant)),
          responsableComposant: this.getSelected(this.composant.responsableComposant),
          chefScolarite: this.getSelected(this.composant.chefScolarite)
        }
        this.$store.dispatch('composant/updateComposant', composant)
          .then(composant => {
            this.$store.dispatch('composant/setPhoto', {composant: composant, image: this.image})
              .then(composant => {
                this.closeModalModifier()
                this.$emit('reload', composant)
              })
              .catch(err => {
                this.$emit('failure', this.image)
                console.log('Erreur de mise à jour de la photo du Composant #' + composant.code + ': ' + err)
              })
          })
          .catch(err => {
            this.$emit('failure', composant.code)
            console.log('Erreur de mise à jour du Composant #' + composant.code + ': ' + err)
          })
      }
    }
  }
</script>

<style>
</style>

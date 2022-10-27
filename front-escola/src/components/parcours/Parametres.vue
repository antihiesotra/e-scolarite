<template>
  <div>
    <div class="layout-padding">
      <div class="row">
        <div class="col-md-3">
          <q-card>
            <q-card-main>
              <q-select
                v-model="parametre.annee"
                float-label="Année Universitaire"
                :options="listAnnee"
                v-on:change="changeYear($event)"
              />
            </q-card-main>
          </q-card>
        </div>
        <div class="col-md-3 offset-1">
          <q-card>
            <q-card-main>
              <q-select
                v-model="parametre.mention"
                float-label="Mention"
                :options="listMention"
              />
            </q-card-main>
          </q-card>
        </div>
        <div class="col-md-3 offset-1">
          <q-card>
            <q-card-main>
              <q-select
                v-model="parametre.codeEntite"
                float-label="Parcours"
                :options="listParcours"
              />
            </q-card-main>
          </q-card>
        </div>
      </div>
      <div>
        <q-card>
          <q-card-main>
            <h5> Paramètres Généraux</h5>
            <div class="row">
              <div class="col-md-5">
                Note définitive par semestre
                <q-select
                  v-model="parametre.noteDefinitive"
                  :options="noteDefinitiveOptions"
                />
                <br>
                Note éliminatoire par EC
                <q-input type="number" v-model="parametre.noteEliminatoireEC" float-label="Note éliminatoire"/>
                <br>
              </div>
              <div class="col-md-5 offset-1">
                Crédit par semestre
                <q-input type="number" v-model="parametre.creditSemestre" float-label="Nombre de crédit"/>
                <br>
                Pourcentage pour être admis(e)
                <q-input type="number" v-model="parametre.pourcentage" float-label="pourcentage"/>
                <br>
              </div>
            </div>
          </q-card-main>
        </q-card>
      </div>
      <div>
        <q-card>
          <q-card-main>
            <h5>Paramètres de validation de l'Unité d'Enseignement (UE)</h5>
            <div class="row">
              <div class="col-md-6">
                Moyenne delibérable
                <q-input type="number" v-model="parametre.moyenneDeliberable" float-label="Moyenne" placeholder=""/>
                <br>
              </div>
            </div>
          </q-card-main>
        </q-card>
      </div>
      <div>
        <q-card>
          <q-card-main>
            <h5>Moyenne Générale pour la Délibération</h5>
            <div class="row">
              <div class="col-md-6">
                Moyenne
                <q-input type="number" v-model="parametre.moyenneGDeliberable" float-label="Moyenne" placeholder=""/>
                <br>
              </div>
            </div>
          </q-card-main>
        </q-card>
      </div>
    </div>
    <div class="layout-padding text-center">
      <q-btn color="primary" @click="createParametre">Enregistrer</q-btn>
    </div>
  </div>
</template>

<script>
  import {
    QBtn,
    QIcon,
    QSelect,
    QInput,
    QDialogSelect,
    QToggle,
    Alert,
    QCardMain,
    QCard
  } from 'quasar'

  import {map, first} from 'lodash'
  import {required, between} from 'vuelidate/lib/validators'
  import * as paramsValue from '../../configs/constants/paramsValue'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      QBtn,
      QIcon,
      QSelect,
      QInput,
      QDialogSelect,
      QToggle,
      QCardMain,
      Alert,
      QCard
    },
    data () {
      return {
        listAnnee: [],
        listMention: [],
        listParcours: [],
        selectedAnnee: [],
        listModeSaisie: [
          {
            label: 'directe',
            value: 'directe'
          },
          {
            label: 'autres',
            value: 'autre'
          }
        ],
        selectedModeSaisie: '',
        noteDefinitiveOptions: [
          {
            label: 'Note maximale',
            value: paramsValue.NOTE_MAX
          },
          {
            label: 'Note rattrapage',
            value: paramsValue.NOTE_RATTRAPAGE
          }
        ],
        listAdmission: [
          {
            label: 'voie de concours',
            value: 'concours'
          },
          {
            label: 'selection de dossier',
            value: 'dossier'
          },
          {
            label: 'autre',
            value: 'autre'
          }
        ],
        selectedAdmission: '',
        parametre: {
          libelle: 'PARCOURS',
          annee: '',
          modeSaisie: '',
          admission: '',
          noteEliminatoire: '',
          noteEliminatoireEC: '',
          noteSupEliminatoire: '',
          noteValideChefMention: '',
          moyenneDeliberable: '',
          moyenneGDeliberable: '',
          creditSemestre: '',
          noteDefinitive: ''
        },
        selection: ''
      }
    },
    computed: {
      noData () {
        return this.mentions.length === 0
      },
      ...mapGetters('etablissement', [
        'adminData'
      ])
    },
    watch: {
      parametre: function () {
        let field = {
          codeEntite: this.parametre.codeEntite,
          annee: this.parametre.annee
        }
        this.$store.dispatch('parametre/getParametre', field)
          .then((res) => {
            console.log(res)
          })
      }
    },
    validations: {
      parametre: {
        annee: {required},
        modeSaisie: {required},
        admission: {required},
        noteEliminatoire: {required},
        noteEliminatoireEC: {required},
        noteSupEliminatoire: {required},
        noteValideChefMention: {required},
        moyenneDeliberable: {required},
        moyenneGDeliberable: {required},
        creditSemestre: {required},
        noteDefinitive: {required},
        pourcentage: {required, between: between(0, 100)}
      }
    },
    methods: {
      createParametre () {
        this.parametre.modeSaisie = this.selectedModeSaisie
        this.parametre.admission = this.selectedAdmission
        console.log('parametre envoi', this.parametre)
        this.$store.dispatch('parametre/addParametre', this.parametre)
          .then((res) => {
            let alert = Alert.create({
              enter: 'bounceInRight',
              leave: 'bounceOutRight',
              color: 'green',
              icon: 'check_circle',
              html: `Parametres ajoutées avec succès`,
              position: 'top-right'
            })
            setTimeout(function () {
              alert.dismiss()
            }, 4000)
          })
          .catch(() => {
            let alert = Alert.create({
              enter: 'bounceInRight',
              leave: 'bounceOutRight',
              color: 'red',
              html: 'veuillez verifier',
              position: 'top-right'
            })
            setTimeout(function () {
              alert.dismiss()
            }, 4000)
          })
      },
      refresh (done) {
        setTimeout(() => {
          let field = {
            codeEntite: this.parametre.codeEntite,
            annee: this.parametre.annee
          }
          this.$store.dispatch('parametre/getParametre', field)
            .then((res) => {
              console.log(res)
            })
            .catch((err) => {
              console.log(err)
            })
        }, 1000)
      },
      /* changeParametre: function changeParametre ($event) {
        let field = {
          idComposant: this.adminData.composant,
          idAnneeUniversitaire: $event
        }
        console.log('field ', field)
        this.$store.dispatch('mention/getAllMentionsByCodeComposant', this.adminData.composant.code)
          .then((res) => {
            console.log('annee', res)
            let mentionConvert = res
            map(mentionConvert, (a, i) => {
              let mention = {
                label: a.libelle,
                value: a.id,
                icon: 'today'
              }
              this.listMention.push(mention)
            })
            this.parametre.mention = first(res).id
          })
          .catch((err) => {
            console.log('err', err)
          })
      }, */
      changeYear: function changeYear ($event) {
        let field = {
          idComposant: this.adminData.composant,
          idAnneeUniversitaire: $event,
          idMention: this.parametre.mention,
          codeEntite: this.parametre.codeEntite
        }
        console.log('field ', field)
        /* this.$store.dispatch('mention/getAllMentionsByCodeComposant', this.adminData.composant.code)
          .then((res) => {
            console.log('annee', res)
            this.parametre.mention = []
            let mentionConvert = res
            map(mentionConvert, (a, i) => {
              let mention = {
                label: a.libelle,
                value: a.id,
                icon: 'today'
              }
              this.listMention.push(mention)
            })
            this.parametre.mention = first(res).id
          })
          .catch((err) => {
            console.log('err', err)
          }) */
      }
    },
    mounted () {
      this.$store.dispatch('anneeuniversitaire/getAllAnneeUniversitaire')
        .then((res) => {
          console.log('annee', res)
          let anneeConvert = res
          map(anneeConvert, (a, i) => {
            let annee = {
              label: a.code,
              value: a.id
            }
            this.listAnnee.push(annee)
          })
          this.parametre.annee = first(res).id
        })
        .catch((err) => {
          console.log('err', err)
        })
      this.$store.dispatch('getFonction')
        .then((fonction) => {
          let vars = fonction.vars
          this.listMention.push({
            label: vars.mention.libelle,
            value: vars.mention.id,
            icon: 'today'
          })
          this.listParcours.push({
            label: vars.parcours.libelle,
            value: vars.parcours.code,
            icon: 'today'
          })
          this.parametre.mention = vars.mention.id
          this.parametre.codeEntite = vars.parcours.code
        })
      this.refresh()
    }
  }
</script>

<style>

</style>

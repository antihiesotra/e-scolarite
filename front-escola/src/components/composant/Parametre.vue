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
                <!--Mode de saisie de note
                <q-select
                  v-model="selectedModeSaisie"
                  float-label="Mode de saisie" small
                  :options="listModeSaisie"
                />
                <br>
                Condition d'admission
                <q-select
                  v-model="selectedAdmission"
                  float-label="Admission par" small
                  :options="listAdmission"
                />
                <br>-->
                Note définitive par semestre
                <q-select
                  v-model="parametre.noteDefinitive"
                  :options="noteDefinitiveOptions"
                />
                <br>
                Note éliminatoire par EC
                <q-input v-model="parametre.noteEliminatoireEC" float-label="Note éliminatoire"/>
                <br>
              </div>
              <div class="col-md-5 offset-1">
                <!--Note éliminatoire
                <q-input v-model="parametre.noteEliminatoire" float-label="Note éliminatoire"/>
                <br>-->
                Crédit par semestre
                <q-input v-model="parametre.creditSemestre" float-label="Nombre de crédit"/>
                <br>
                <!--Note Validée par le chef de mention
                <q-input v-model="parametre.noteValideChefMention" float-label="Oui/Non"/>
                <br>-->
                Pourcentage pour être admis(e)
                <q-input v-model="parametre.pourcentage" float-label="pourcentage"/>
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
                <q-input v-model="parametre.moyenneDeliberable" float-label="Moyenne" placeholder=""/>
                <br>
                <!--Note supérieur à la note éliminatoire
                <q-input v-model="parametre.noteSupEliminatoire" float-label="Oui/Non" placeholder=""/>-->
              </div>
            </div>
          </q-card-main>
        </q-card>
      </div>
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
              <!--Note supérieur à la note éliminatoire
              <q-input v-model="parametre.noteSupEliminatoire" float-label="Oui/Non" placeholder=""/>-->
            </div>
          </div>
        </q-card-main>
      </q-card>
    </div>
    <div class="layout-padding text-center">
      <q-btn color="primary" @click="createParametre">Enregistrer</q-btn>
      <!--<q-btn color="light" class="text-black">Annuler</q-btn>-->
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
    QCard,
    QCardMain,
    LocalStorage
  } from 'quasar'

  import {map} from 'lodash'
  import {required, between} from 'vuelidate/lib/validators'
  import * as paramsValue from '../../configs/constants/paramsValue'

  export default {
    components: {
      QBtn,
      QIcon,
      QSelect,
      QInput,
      QDialogSelect,
      QToggle,
      Alert,
      QCard,
      QCardMain
    },
    data () {
      return {
        listAnnee: [],
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
        // TODO recuperation de l'idComposant, code
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
        selectedNoteDefinitive: '',
        parametre: {
          libelle: 'COMPOSANT',
          codeEntite: 'UF',
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
          noteDefinitive: '',
          pourcentage: ''
        }
      }
    },
    watch: {},
    validations: {
      parametre: {
        annee: {required},
        // modeSaisie: {required},
        // admission: {required},
        // noteEliminatoire: {required},
        noteEliminatoireEC: {required},
        // noteSupEliminatoire: {required},
        // noteValideChefMention: {required},
        moyenneDeliberable: {required},
        moyenneGDeliberable: {required},
        creditSemestre: {required},
        noteDefinitive: {required},
        pourcentage: {required, between: between(0, 100)}
      }
    },
    methods: {
      createParametre () {
        this.$v.parametre.$touch()

        if (this.$v.parametre.$error) {
          this.$alert.error('Veuillez remplir tous les champs')
        }
        else {
          // this.parametre.modeSaisie = this.selectedModeSaisie
          // this.parametre.admission = this.selectedAdmission
          // this.parametre.annee = this.selectedAnnee
          // this.parametre.libelle = JSON.parse(LocalStorage.get.item('credential')).composant
          console.log('Param', this.parametre)
          this.$store.dispatch('parametre/addParametre', this.parametre)
            .then((res) => {
              console.log(res)
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
            .catch((err) => {
              console.log(err)
              let alert = Alert.create({
                enter: 'bounceInRight',
                leave: 'bounceOutRight',
                color: 'red',
                html: 'Une erreur est survenue',
                position: 'top-right'
              })
              setTimeout(function () {
                alert.dismiss()
              }, 4000)
            })
        }
      }
    },
    mounted () {
      console.log('BABABABA', JSON.parse(LocalStorage.get.item('credential')))
      this.$store.dispatch('anneeuniversitaire/getAllAnneeUniversitaire')
        .then((res) => {
          console.log('annee', res)
          let anneeConvert = res
          map(anneeConvert, (a) => {
            let annee = {
              label: a.code,
              value: a.id
            }
            this.listAnnee.push(annee)
          })
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
  }
</script>

<style>
</style>

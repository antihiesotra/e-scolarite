<template>
  <div>
    <div class="layout-padding">
      <div class="row">
        <div class="col-md-4">
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
                Note definitive par semestre
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
    QCardTitle,
    QCardSeparator,
    QItem,
    QItemMain
  } from 'quasar'

  import {map} from 'lodash'
  import {required} from 'vuelidate/lib/validators'
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
      QCardMain,
      QCardTitle,
      QCardSeparator,
      QItem,
      QItemMain
    },
    data () {
      return {
        composant: {},
        mention: {},
        userComposant: null,
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
          libelle: 'MENTION',
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
        }
      }
    },
    watch: {},
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
        noteDefinitive: {required}
      }
    },
    methods: {
      createParametre () {
        this.parametre.modeSaisie = this.selectedModeSaisie
        this.parametre.admission = this.selectedAdmission
        this.parametre.codeEntite = this.mention.code
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
              html: 'veuillez verifier',
              position: 'top-right'
            })
            setTimeout(function () {
              alert.dismiss()
            }, 4000)
          })
      }
    },
    mounted () {
      this.$store.dispatch('anneeuniversitaire/getAllAnneeUniversitaire')
        .then((res) => {
          let anneeConvert = res
          map(anneeConvert, (a, i) => {
            let annee = {
              label: a.code,
              value: a.id,
              icon: 'today'
            }
            this.listAnnee.push(annee)
            if (i === res.length - 1) {
              this.parametre.annee = a.id
            }
          })
        })
        .catch((err) => {
          console.log('error', err)
        })

      this.$store.dispatch('getFonction')
        .then((fonction) => {
          this.mention = fonction.vars.mention
          this.composant = fonction.vars.composant
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
</script>

<style>
.mention .q-item{
  display: flex;
  flex-direction: column;
  padding-bottom: 1em;
}
.composant .q-item-label{
  font-size: 90%;
}
.mention .q-item-main{
  display: flex;
  flex-direction: column-reverse;
  width: 100%;
  margin: 0;
}
.mention .q-item-sublabel{
  font-size: 80%;
}
</style>

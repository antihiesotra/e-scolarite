<template>
  <div class="layout-padding">
    <!--Data Table-->
    <q-card class="shadow-1">
      <div class="layout-padding semestreannee">
        <div class="row" style="padding-left:0 10px;">
          <div class="col-sm-3">
            <q-select
              style="margin-top: 0;"
              color="primary"
              float-label="Année universitaire"
              v-model="annee"
              :options="anneeOptions"
            />
          </div>  
          <div class="col-sm-3">
            <q-select
              style="margin-top: 0;"
              color="primary"
              float-label="Semestre "
              v-model="semestre"
              :options="semestreOptions"
            />
          </div>
        </div>
      </div>
      <q-data-table
        :data="UEs"
        :config="config"
        :columns="columns"
        @refresh="refresh()"
      >
        <!-- Custom renderer when user selected one or more rows -->
        <template slot="selection" slot-scope="selection">
          <q-btn color="primary" icon="edit" @click="modalAttribuer(selection)">
            <span class="gt-sm">Attribuer</span>
          </q-btn>
          <q-btn color="negative" icon="delete" @click="">
            <span class="gt-sm">Supprimer</span>
          </q-btn>
        </template>
      </q-data-table>
    </q-card>

    <!--Modal Add Atome Pedagogique-->
    <q-modal v-model="modalAttribuerUe" :content-css="{minWidth: '40vw', minHeight: '40vh', maxWidth:'60vw'}">
      <div class="layout-padding row">
        <div class="row col-12 content-center self-center">
          <div class="text-bold text-center col-12"><h4> Attribuer l'Unitée d'enseignement</h4> </div>
          <div class="col-3 bg-primary  text-white " style="margin: 2px; padding:3px;">
            Code
          </div><div class="col-8" style="margin: 2px; padding:3px;">: {{ Ue.code }}</div>
          <div class="col-3 bg-primary text-white " style="margin: 2px; padding:3px;">
            Libelle
          </div><div class="col-8" style="margin: 2px; padding:3px;">: {{ Ue.libelle }}</div>
          <div class="col-3 bg-primary  text-white " style="margin: 2px; padding:3px;">
            Abreviation
          </div><div class="col-8" style="margin: 2px; padding:3px;">: {{ Ue.abreviation }}</div>
        </div>

        <div class="col-12 row justify-center">
          <div class="col-12 text-center text-bold">Liste des enseignants </div>
          <q-select
            class="col-8 text-center"
            v-model="professor"
            :options="listProfessor"
            chips
            float-label="Nom de l'Enseignant responsable"
            filter
            autofocus-filter
            filter-placeholder="Chercher l'enseignant"
            justify-center
          ></q-select>
        </div>
        <div class="col-12" style="height: 30px;"></div>
        <div class="col-12">
          <q-btn color="primary" @click="attribuer(Ue)">Modifier</q-btn>
          <q-btn color="" @click="modalAttribuerUe = false">Annuler</q-btn>
        </div>
      </div>
    </q-modal>

  </div>
</template>

<script>
  import {
    QDataTable,
    QTooltip,
    QBtn,
    QModal,
    QInput,
    QFixedPosition,
    QIcon,
    QCard,
    QSelect,
    Alert,
    Loading
  } from 'quasar'

  // import { mapGetters } from 'vuex'
  import * as _ from 'lodash'
  // import { required } from 'vuelidate'
  import 'quasar-extras/animate/bounceInRight.css'
  import 'quasar-extras/animate/bounceOutRight.css'

  export default {
    components: {
      QDataTable,
      QTooltip,
      QBtn,
      QModal,
      QInput,
      QFixedPosition,
      QIcon,
      QCard,
      QSelect
    },
    data () {
      return {
        // variable manipuler la page
        listProfessor: [],
        anneeOptions: [],
        semestreOptions: [],
        annee: null,
        semestre: null,
        professor: '',
        modalAttribuerUe: false,
        Ue: '',
        UEs: [],
        newUE: {},
        // variable de configuration de la page
        config: {
          rowHeight: '50px',
          title: '<span style="color: rgba(0,0,0,0.54);font-weight: bold;font-size: 95%;">Attribution Unité d\'Enseignemnt</span>',
          noHeader: false,
          refresh: true,
          columnPicker: true,
          leftStickyColumns: 0,
          rightStickyColumns: 2,
          bodyStyle: {
            maxHeight: '500px'
          },
          responsive: true,
          pagination: {
            rowsPerPage: 8,
            options: [5, 8, 10, 15, 30, 50, 500]
          },
          selection: 'single',
          messages: {
            noData: 'Aucune données dans la base de données',
            noDataAfterFiltering: 'Aucun résultat. Veuillez raffiner les termes de votre recherche.'
          },
          labels: {
            columns: 'Colonnes',
            allCols: 'Toutes',
            rows: 'Lignes',
            selected: {
              singular: 'Unité d\'Enseignement séléctionné.',
              plural: 'Unité d\'Enseignement séléctionnés.'
            },
            clear: 'Annuler',
            search: 'Recherche',
            all: 'Tous'
          }
        },
        columns: [
          {
            label: 'Code',
            field: 'code',
            width: '100px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Libellé',
            field: 'libelle',
            width: '100px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Abréviation',
            field: 'abreviation',
            width: '100px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Résponsable',
            field: 'responsableUe',
            width: '100px',
            filter: true,
            sort: true,
            type: 'string',
            format (value, row) {
              if (value === null) return 'Aucun Résponsable'
              else {
                if (value.prenom !== undefined && value) {
                  return value.nom + ' ' + value.prenom
                }
                else {
                  return value.nom
                }
              }
            }
          }
        ]
      }
    },
    computed: {
      filtersOK: function () {
        return this.annee && this.parcours && this.semestre
      }
    },
    watch: {
      filtersOK: function (val) {
        if (val) {
          this.refresh()
        }
      }
    },
    methods: {
      refresh () {
        let params = {
          idParcours: this.parcours,
          idSemestre: this.semestre,
          idAnneeUniversitaire: this.annee
        }
        Loading.show()
        this.$store.dispatch('planformation/getPlanDeFormation', params)
          .then((res) => {
            this.UEs = res
            Loading.hide()
          })
          .catch((err) => {
            console.log('err', err)
          })
      },
      getFilters () {
        this.$store.dispatch('anneeuniversitaire/getAllAnneeUniversitaire')
          .then((res) => {
            _.map(res, (a, i) => {
              let annee = {
                label: a.code,
                value: a.id,
                icon: 'date_range'
              }
              this.anneeOptions.push(annee)
              if (i === res.length - 1) {
                this.annee = a.id
              }
            })
          })
          .catch((err) => {
            console.log('err', err)
          })

        this.$store.dispatch('semestre/getAllSemestre')
          .then((semestres) => {
            _.map(semestres, s => {
              let semestre = {
                label: s.libelle,
                value: s.semestrePK.id,
                icon: 'today'
              }
              this.semestreOptions.push(semestre)
            })
            this.semestre = this.semestreOptions[0].value
          })
          .catch((err) => {
            console.log('err', err)
          })
      },
      modalAttribuer (selectedUe) {
        this.Ue = selectedUe.rows[0].data
        this.professor = undefined
        this.$store.dispatch('ue/getAllUsersInUe')
          .then((res) => {
            this.listProfessor = []
            let user
            _.forEach(res, (val) => {
              user = {
                label: val.nom + ' ' + val.prenom,
                value: val.id
              }
              this.listProfessor.push(user)
              if (this.Ue.responsableUe !== null) {
                if (user.value === this.Ue.responsableUe.id) {
                  this.professor = user.value
                }
              }
            })
          })
        this.modalAttribuerUe = true
      },
      attribuer (ue) {
        this.$store.dispatch('ue/setResponsableforUe', {id: ue.id, utilisateur: this.professor})
          .then((res) => {
            let alert = Alert.create({
              enter: 'bounceInRight',
              leave: 'bounceOutRight',
              color: 'positive',
              icon: 'done',
              html: `Ajout du nouveau Résponsable avec succés`,
              position: 'top-right'
            })
            setTimeout(() => {
              this.refresh()
            }, 500)
            setTimeout(() => {
              alert.dismiss()
            }, 4000)
          })
          .catch((err) => {
            err = `Erreur durant l'ajout du nouveau Résponsable`
            err = '<strong class="text-center col-12">Erreur</strong>'
            let alert = Alert.create({
              enter: 'bounceInRight',
              leave: 'bounceOutRight',
              color: 'negative',
              icon: 'error',
              html: err + `<br>le résponsable peut ne pas être un <br>Résponsable d'Unitée d'enseignement`,
              position: 'top-right'
            })
            setTimeout(() => {
              alert.dismiss()
            }, 7000)
          })
        setTimeout(() => {
          this.modalAttribuerUe = false
        }, 1000)
      }
    },
    mounted () {
      this.getFilters()
      Loading.show()
      this.$store.dispatch('getFonction')
        .then((fonction) => {
          this.parcours = fonction.vars.parcours.id
          Loading.hide()
        })
    }
  }
</script>

<style>
.q-data-table{
  border-top: none;
}
</style>


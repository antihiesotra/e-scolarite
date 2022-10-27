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
          <div class="col-sm-3">
            <q-select
              style="margin-top: 0;"
              color="primary"
              float-label="Unité d'Enseignement "
              v-model="ue"
              :options="ueOptions"
            />
          </div>
        </div>
      </div>
      <q-data-table
        :data="ECs"
        :config="config"
        :columns="columns"
        @refresh="refresh()"
      >
        <!-- Custom renderer when user selected one or more rows -->
        <template slot="selection" slot-scope="selection">
          <q-btn color="positive" icon="info" @click="informationEc(selection)">
            <span class="gt-sm">Information</span>
          </q-btn>
          <q-btn color="primary" icon="edit" @click="attribuerEC(selection)">
            <span class="gt-sm">Attribuer</span>
          </q-btn>
          <q-btn color="negative" icon="delete" @click="">
            <span class="gt-sm">Supprimer</span>
          </q-btn>
        </template>
      </q-data-table>
    </q-card>
    <!-- Modal pour les informations -->
    <q-modal v-model="modalInfoEc" :content-css="{minWidth: '40vw', minHeight: '40vh', maxWidth:'60vw'}">
      <template v-if="!isReady">
        <div style="height: 100vh" class="row justify-center items-center">
          <q-spinner :size="100" />
        </div>
      </template>
      <div v-else>
        <div class="layout-padding row">
          <div class="row col-12 content-center self-center">
            <div class="text-bold text-center col-12"><h4> Information sur  l'Elément constitutif</h4> </div>
            <div class="col-3 bg-primary  text-white " style="margin: 2px; padding:3px;">
              Code
            </div><div class="col-8" style="margin: 2px; padding:3px;">: {{ Ec.code }}</div>
            <div class="col-3 bg-primary text-white " style="margin: 2px; padding:3px;">
              Libelle
            </div><div class="col-8" style="margin: 2px; padding:3px;">: {{ Ec.libelle }}</div>
            <div class="col-3 bg-primary  text-white " style="margin: 2px; padding:3px;">
              Abreviation
            </div><div class="col-8" style="margin: 2px; padding:3px;">: {{ Ec.abreviation }}</div>
          </div>

          <!-- Liste des enseignant dans l' Ec -->
          <div class="col-12 text-center text-bold">Liste des enseignants de l'Elément constitutif</div>
          <div class="row col-12 justify-center" v-for="enseignant in enseignants">
            <div class="col-8 row shadow-2 justify-center" style="margin: 2px; padding:3px;">
              <div class="col-7 text-center" style="margin: 10px 0px 0px 5px;">{{ enseignant.data.nom + ' ' + enseignant.data.prenom }}</div>
            </div>
          </div>
          <div class="col-12" style="height: 30px;"></div>
          <div class="col-12 row justify-center">
            <q-btn color="positive" class="col-4" @click="modalInfoEc = false">Fermer</q-btn>
          </div>
        </div>
      </div>
    </q-modal>

    <!--Modal Add Atome Pedagogique-->
    <q-modal v-model="modalEc" :content-css="{minWidth: '40vw', minHeight: '40vh', maxWidth:'60vw'}">
      <template v-if="!isReady">
        <div style="height: 100vh" class="row justify-center items-center">
          <q-spinner
            :size="100"
          />
        </div>
      </template>
      <div v-else>
        <div class="layout-padding row">
          <div class="row col-12 content-center self-center">
            <div class="text-bold text-center col-12"><h4> Attribuer enseignant de l'Elément constitutif</h4> </div>
            <div class="col-3 bg-primary  text-white " style="margin: 2px; padding:3px;">
              Code
            </div><div class="col-8" style="margin: 2px; padding:3px;">: {{ Ec.code }}</div>
            <div class="col-3 bg-primary text-white " style="margin: 2px; padding:3px;">
              Libelle
            </div><div class="col-8" style="margin: 2px; padding:3px;">: {{ Ec.libelle }}</div>
            <div class="col-3 bg-primary  text-white " style="margin: 2px; padding:3px;">
              Abreviation
            </div><div class="col-8" style="margin: 2px; padding:3px;">: {{ Ec.abreviation }}</div>
          </div>

          <!-- Liste des enseignant dans l' Ec -->
          <div class="col-12 text-center text-bold">Liste des enseignants de l'Elément constitutif</div>
          <div class="row col-12 justify-center" v-for="enseignant in enseignants">
            <div class="col-8 row shadow-2 justify-center" style="margin: 2px; padding:3px;" :id='enseignant.data.id' >
              <div class="col-7" style="margin: 10px 0px 0px 5px;">{{ enseignant.data.nom + ' ' + enseignant.data.prenom }}</div>
              <div class="col-4">
                <q-btn class="bg-negative text-white" @click="supprimerEnseignant(enseignant)">
                  <q-icon name="delete"></q-icon>Supprimer
                </q-btn>
              </div>
            </div>
          </div>
          <!-- Modal d'attribution de l'Ec -->
          <div class="col-12 row justify-center">
            <div class="col-12 text-center text-bold">Liste des enseignants </div>
            <q-select
              class="col-8 text-center"
              v-model="professor"
              :options="listProfessor"
              chips
              multiple
              float-label="Nom de l'Enseignant"
              filter
              autofocus-filter
              filter-placeholder="Chercher l'enseignant"
              justify-center
            ></q-select>
          </div>
          <div class="col-12" style="height: 30px;"></div>
          <div class="col-12">
            <q-btn color="primary" @click="attribuer(Ec)">Attribuer</q-btn>
            <q-btn color="" @click="modalEc = false">Annuler</q-btn>
          </div>
        </div>
      </div>
    </q-modal>

    <!-- Modal Suppression d'un enseignant de la liste -->
    <q-modal v-model="modalSupprimerEnseignant" :content-css="{minWidth: '30vw', minHeight: '40vh', maxWidth:'50vw'}">
      <div class="layout-padding row justify-center">
       <div class="col-12 text-center"><h5>Voulez-vous vraiment supprimer?</h5></div>
        <div class="col-8">L'utilisateur
          <strong>"{{ enseiganantSupprime.nom }} {{ enseiganantSupprime.prenom }}"</strong> sera retiré de la liste des enseignant
          de l'Elément constitutif <strong>"{{ Ec.libelle }}"</strong> et ne pourra plus confirmer les notes se rattachant a celle-ci.
        </div>
        <div class="col-6 row justify-center" style="margin-top: 30px;">
          <q-btn color="negative" class="col-5" @click="confirmSupprimer(deletePK)">Supprimer</q-btn>
          <div class="col-2"> </div>
          <q-btn color="green" class="col-5" @click="modalSupprimerEnseignant = false">Annuler</q-btn>
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
    Loading,
    QSpinner,
    Alert
  } from 'quasar'

  // import { mapGetters } from 'vuex'
  import * as _ from 'lodash'
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
      QSelect,
      QSpinner
    },
    data () {
      return {
        // variable manipuler dans la page
        modalInfoEc: false,
        deletePK: '',
        isReady: false,
        anneeOptions: [],
        semestreOptions: [],
        ueOptions: [],
        annee: null,
        semestre: null,
        ue: null,
        ECs: [],
        Ec: {
          code: '',
          libelle: '',
          abreviation: '',
          note_eliminatoire: '',
          credit: ''
        },
        enseiganantSupprime: '',
        enseignants: '',
        modalEc: false,
        professor: [],
        listProfessor: [],
        modalSupprimerEnseignant: false,
        // variable de configuration de la page
        config: {
          rowHeight: '50px',
          title: '<span style="color: rgba(0,0,0,0.54);font-weight: bold;font-size: 95%;">Attribution Elément Constitutif</span>',
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
              singular: 'Atome Pédagogique séléctionné.',
              plural: 'Atome Pédagogique séléctionnés.'
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
            label: 'Libélle',
            field: 'libelle',
            width: '100px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Note Eliminatoire',
            field: 'noteEliminatoire',
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
            label: 'Crédit',
            field: 'credit',
            width: '100px',
            filter: true,
            sort: true,
            type: 'string'
          }
        ]
      }
    },
    computed: {
      getUe: function () {
        return this.annee && this.parcours && this.semestre
      }
    },
    watch: {
      getUe: function (val) {
        if (val) {
          this.fillUe()
        }
      },
      ue: function () {
        this.fillEc()
      }
    },
    methods: {
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
              if (i === this.anneeOptions.length - 1) {
                this.annee = annee.value
              }
            })
          })
          .catch((err) => {
            console.log('err', err)
          })

        this.$store.dispatch('semestre/getAllSemestre')
          .then((semestres) => {
            _.map(semestres, (s, i) => {
              let semestre = {
                label: s.libelle,
                value: s.semestrePK.id,
                icon: 'today'
              }
              this.semestreOptions.push(semestre)
              if (i === 0) {
                this.semestre = semestre.value
              }
            })
          })
          .catch((err) => {
            console.log('err', err)
          })
      },
      fillEc () {
        Loading.show()
        this.$store.dispatch('ec/getAllEcOfUe', this.ue)
          .then((ecs) => {
            Loading.hide()
            this.ECs = ecs
          })
          .catch((err) => {
            this.$alert.error('Une erreur est survenue lors de ue/getAllEcOfUe')
            console.log('err Ue', err)
          })
      },
      fillUe () {
        let params = {
          idParcours: this.parcours,
          idSemestre: this.semestre,
          idAnneeUniversitaire: this.annee
        }
        Loading.show()
        this.$store.dispatch('planformation/getPlanDeFormation', params)
          .then((ues) => {
            Loading.hide()
            this.ueOptions = []
            _.map(ues, (s, i) => {
              let ue = {
                label: s.libelle,
                value: s.id,
                icon: 'today'
              }
              this.ueOptions.push(ue)
              if (i === 0) {
                this.ue = ue.value
              }
            })
          })
          .catch((err) => {
            console.log('err', err)
          })
      },
      informationEc (sel) {
        this.Ec = sel.rows[0].data
        this.isReady = false
        this.afficherLeModale()
        this.modalInfoEc = true
      },
      confirmSupprimer (suppr) {
        console.log(suppr)
        this.$store.dispatch('ec/deleteEnseignantforEc', suppr).then((res) => {
          console.log('resultat suppression:', res)
          if (res.status === 200) {
            this.modalSupprimerEnseignant = false
            let element = document.getElementById(suppr.idUtilisateur)
            element.parentNode.removeChild(element)
            let alert = Alert.create({
              enter: 'bounceInRight',
              leave: 'bounceOutRight',
              color: 'positive',
              icon: 'done all',
              html: `Suppression de l'Enseignant avec success`,
              position: 'top-right'
            })
            setTimeout(() => {
              alert.dismiss()
            }, 4000)
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      afficherLeModale () {
        console.log('Le modale est afficher')
        this.professor = []
        this.enseignants = ''
        this.listProfessor = []
        let i = 0
        this.$store.dispatch('ec/getEnseignantsFromEc', this.Ec.id).then((res) => {
          console.log('getEnseignantsFromEc', res)
          this.enseignants = res
          if (!res.notFound) {
            this.$store.dispatch('ue/getAllUsersInUe')
              .then((res) => {
                this.listProfessor = []
                _.forEach(res, (val) => {
                  let user = {
                    label: val.nom + ' ' + val.prenom,
                    value: val.id
                  }
                  if (this.enseignants === undefined) {
                    this.listProfessor.push(user)
                  }
                  else {
                    this.filterEnseignant(this.enseignants, user)
                      .then((res) => {
                        if (res === undefined) {
                          this.listProfessor.push(user)
                        }
                      })
                  }
                  i++
                  if (i === res.length) {
                    this.isReady = true
                    console.log('enseignants:', this.enseignants)
                  }
                })
              })
          }
          else {
            this.$store.dispatch('ue/getAllUsersInUe')
              .then((res) => {
                this.listProfessor = []
                _.forEach(res, (val) => {
                  let user = {
                    label: val.nom + ' ' + val.prenom,
                    value: val.id
                  }
                  this.isReady = true
                  this.listProfessor.push(user)
                })
              })
          }
        })
          .catch((err) => {
            console.log('erreur', err)
          })
      },
      attribuer (ec) {
        let PK
        let i = 0
        let alert
        this.professor.forEach((val) => {
          PK = {
            idEc: ec.id,
            idUtilisateur: val
          }
          console.log('front PK:', PK)
          this.$store.dispatch('ec/setEnseignantForEc', PK).then((res) => {
            console.log('response: ', res)
          }).catch((err) => {
            console.log('erreur: ', err)
          })
          i++
          if (i === this.professor.length) {
            alert = Alert.create({
              enter: 'bounceInRight',
              leave: 'bounceOutRight',
              color: 'positive',
              icon: 'done all',
              html: `Ajout des nouveaux Enseignants avec succes`,
              position: 'top-right'
            })
            setTimeout(() => {
              alert.dismiss()
            }, 4000)
          }
        })
        setTimeout(() => {
          this.modalEc = false
        }, 1000)
      },
      filterEnseignant (listEnseignant, listEnseignant2) {
        return new Promise((resolve, reject) => {
          let result = _.find(listEnseignant, (ens) => {
            return ens.PK.idUtilisateur === listEnseignant2.value
          })
          resolve(result)
        })
      },
      supprimerEnseignant (ens) {
        this.enseiganantSupprime = ens.data
        this.deletePK = ens.PK
        console.log(ens.PK)
        this.modalSupprimerEnseignant = true
      },
      refresh () {
        this.$store.dispatch('getAllEcsFromUe')
          .then((res) => {
            this.ECs = res
          })
          .catch((err) => {
            console.log('err', err)
          })
      },
      attribuerEC (sel) {
        this.Ec = sel.rows[0].data
        this.isReady = false
        console.log('modale attribution de l\'ec ')
        this.afficherLeModale()
        this.modalEc = true
      }
    },
    mounted () {
      this.getFilters()
      this.$store.dispatch('getFonction')
        .then((fonction) => {
          this.parcours = fonction.vars.parcours.id
        })
    }
  }
</script>

<style>
</style>

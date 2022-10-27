<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div class="layout-padding">
    <!-- your content -->
    <div class="row" style="padding-left: 10px;padding-right: 10px;">
      <div class="col-md col-sm-12">
        <q-select
          style="margin-top: 0;"
          color="primary"
          float-label="Année universitaire"
          v-model="annee"
          :options="anneeOptions"
        />
      </div>
      <div class="col-md col-sm-12">
        <q-select
          style="margin-top: 0;"
          color="primary"
          float-label="Semestre "
          v-model="semestre"
          :options="semestreOptions"
        />
      </div>
      <div class="col-md col-sm-12">
        <q-select
          style="margin-top: 0;"
          color="primary"
          float-label="Mention"
          v-model="mention"
          :options="mentionOptions"
        />
      </div>
      <div class="col-md col-sm-12">
        <q-select
          style="margin-top: 0;"
          color="primary"
          float-label="Parcours"
          v-model="parcours"
          :options="parcoursOptions"
        />
      </div>  
    </div>
    <div class="row layout-view content-center">
      <template v-if="!isReady">
        <div style="height: 80vh; margin: auto" class="row justify-center items-center">
          <q-spinner
            color="primary"
            size="100"
          />
        </div>
      </template>
      <div v-else-if="rattrapage == false">
        <!--<q-fixed-position corner="bottom-left" :offset="[18, 18]">-->
          <!--<a target="_blank" href="http://localhost:5555/pdf/resultat/1/1/1/1">Imprimer</a>-->
        <!--</q-fixed-position>-->
        <table v-if="notes.length > 0" class="q-table cell-separator loose highlight _table-resultat">
          <thead>
            <tr>
              <th class="text-center vertical-middle thin" :rowspan="2"></th>
              <th class="text-center vertical-middle thin" :rowspan="2">Matricule</th>
              <th class="text-center vertical-middle thin" :rowspan="2">Nom et prénoms</th>
              <template v-for="noteUe in notes[0].noteParUe">
                <th class="text-center" :colspan="noteUe.noteEcList.length + 1">{{ noteUe.ueInfo.libelle }} <span class="thin-paragraph caption">({{ noteUe.ueInfo.creditUe }})</span></th>
              </template>
              <th class="text-center" :colspan="2">RESUMÉ</th>
            </tr>
            <tr>
              <template v-for="noteUe in notes[0].noteParUe">
                <template v-for="noteEc in noteUe.noteEcList">
                  <th class="text-center">{{ noteEc.ecInfo.libelle }} <small class="small thin-paragraph caption">({{ noteEc.ecInfo.credit }})</small></th>
                </template>
              </template>
              <th class="text-center">Crédits</th>
              <th class="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="note in notes" :key="note.etudiantInfo.numeroMatricule">
              <td class="text-center"><input type="radio" value="{ note.etudiantInfo.numeroMatricule }" name="radio" id="{ note.etudiantInfo.numeroMatricule }"></td>
              <td class="text-center">{{ note.etudiantInfo.numeroMatricule }}</td>
              <td class="text-left"><span class="uppercase">{{ note.etudiantInfo.nom }}</span> {{ note.etudiantInfo.prenom }}</td>
              <template v-for="noteUe in note.noteParUe">
                <template v-for="noteEc in noteUe.noteEcList">
                  <td class="text-right" >{{ noteEc.note }}</td>
                </template>
                <td class="text-center text-bold">{{ noteUe.status | filterStatus }}</td>
              </template>
              <td class="text-center">{{ note.creditSemestre }}</td>
              <td class="text-center text-bold">{{ note.status | filterStatus }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else>
          <div class="row sm-gutter">
            <div class="col-sm-12">
              <q-card class="layout-padding" style="padding-top: 0; ">
                <q-card-title style="">
                  Aucune note disponible
                </q-card-title>
                <q-card-main>
                  <blockquote>
                    <p>
                      Vous n'avez encore aucune sortie ici à cause du fait qu'aucune note encore n'a été entrée. Vous aurez les informations nécessaires après l'entrée de notes.<br>
                      On vous souhaite une bonne journée ...
                    </p>
                    <small><cite title="Quasar Framework">Escola Team</cite></small>
                  </blockquote>
                </q-card-main>
              </q-card>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="content-center" style="margin: 0 auto">
        <div id="nav">
          <template v-for="(etudiantsEc, ec) in notes">
            <q-btn  :key="ec" v-if="etudiantsEc.length>0" style="margin:10px; padding-left: 35px; padding-right: 35px"
              round
              color="white"
              @click="makeActive(ec)"
              class="animate-pop"
            >
            <a href="#" class="tab">{{ec}}</a>
            </q-btn>
          </template>
        </div>
        <div class="content">
          <hr style="color:rgba(0,0,0,0.14)"/>
          <template v-for="(etudiantsEc, ec) in notes">
            <div class="boxes" :id="ec" :key="ec" v-show="isActiveTab(ec)">
              <br v-if="etudiantsEc.length>0"/><div v-if="etudiantsEc.length>0" class="text-center">Liste des Etudiants qui passerons au rattrapage de {{ec}}</div><br v-if="etudiantsEc.length>0"/>
              <table v-if="etudiantsEc.length>0" class="q-table cell-separator loose highlight _table-resultat">
                <thead>
                  <tr>
                    <th class="text-center vertical-middle thin" :rowspan="2">Matricule</th>
                    <th class="text-center vertical-middle thin" :rowspan="2">Nom et prénoms</th>
                    <th class="text-center">Note</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="etudiantEc in etudiantsEc" :key="etudiantEc.numeroMatricule">
                    <td class="text-center">{{ etudiantEc.numeroMatricule }}</td>
                    <td class="text-left"><span class="uppercase">{{ etudiantEc.nom }}</span> {{ etudiantEc.prenom }}</td>
                    <td class="text-right">{{ etudiantEc.note }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </div>
      </div>
    </div>
    <q-fixed-position corner="bottom-left" :offset="[18, 18]">
      <q-fab color="primary" push icon="settings" direction="right">
        <q-btn
          round
          color="primary"
          @click="printPdfAttestation()"
          class="animate-pop"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Imprimer attestation</q-tooltip>
          <q-icon name="print" />
        </q-btn>
      </q-fab>
    </q-fixed-position>
    
  </div>
</template>

<script>
  /* eslint-disable no-unused-expressions */

  import {
    QSelect,
    QSpinner,
    QCard,
    QCardTitle,
    QCardMain,
    QBtn,
    QFixedPosition,
    QFab,
    QIcon,
    QTooltip
  } from 'quasar'
  import { map, first } from 'lodash'

  export default {
    components: {
      QSelect,
      QSpinner,
      QCard,
      QCardTitle,
      QCardMain,
      QBtn,
      QFixedPosition,
      QFab,
      QIcon,
      QTooltip
    },
    data () {
      return {
        isReady: false,
        notes: [],
        rattrapage: false,
        choice: '',
        annee: '',
        anneeOptions: [],
        mention: '',
        mentionOptions: [],
        parcours: '',
        parcoursOptions: [],
        niveau: '',
        niveauOptions: [],
        semestre: '',
        semestreOptions: [],
        session: '',
        sessionOptions: [],
        statusEtudiant: '',
        statusOption: []
      }
    },
    computed: {
      allFormFilled: function () {
        return this.annee !== '' && this.mention !== '' && this.parcours !== '' && this.semestre !== '' && this.session !== '' && this.statusEtudiant !== ''
      },
      compoundProperty () {
        this.annee
        this.semestre
        this.mention
        this.parcours
        this.session
        this.statusEtudiant
        return Date.now()
      }
    },
    filters: {
      filterStatus: function (status) {
        switch (status) {
          case 'VALIDE':
            return 'V'
          case 'NON_VALIDE':
            return 'NV'
          case 'NON_CLASSE':
            return 'NC'
          default:
            return ''
        }
      }
    },
    watch: {
      mention: function (mention) {
        if (mention !== '') {
          this.parcoursOptions = []
          this.$store.dispatch('parcours/getParcoursByMention', mention)
            .then((res) => {
              map(res, p => {
                let parcours = {
                  label: p.libelle,
                  value: p.id,
                  icon: 'bubble_chart'
                }
                this.parcoursOptions.push(parcours)
              })
              this.parcours = first(res).id
            })
            .catch((err) => {
              console.log(err)
            })
        }
      },
      annee: function (annee) {
        this.$store.dispatch('semestre/getSemestreByIdAnneeUniversitaire', annee)
          .then((res) => {
            this.semestreOptions = []
            map(res, s => {
              let semestre = {
                label: s.code,
                value: s.semestrePK.id,
                icon: 'today'
              }
              this.semestreOptions.push(semestre)
            })
            this.semestre = first(res).semestrePK.id
          })
      },
      compoundProperty () {
        if (this.annee !== '' && this.mention !== '' && this.parcours !== '' && this.semestre !== '' && this.session !== '') {
          this.refresh(() => {
            console.log('Init finished')
          })
        }
      }
    },
    methods: {
      refresh (done) {
        this.isReady = false
        let params = {
          annee: this.annee,
          parcours: this.parcours,
          semestre: this.semestre,
          session: this.session,
          statusEtudiant: this.statusEtudiant
        }
        this.showResults(params)
        done()
      },
      makeActive (val) {
        this.choice = val
      },
      isActiveTab (val) {
        return this.choice === val
      },
      showResults (params) {
        // session id = -1 si l'utilisateur veut afficher le résultat définitif
        let dispatchString = 'note/getAllNotesForResult'
        this.rattrapage = false
        if (params.session === -1) {
          dispatchString = 'note/getResultatGlobal'
        }
        else if (params.session === -2) {
          dispatchString = 'note/getListePourRattrapage'
          this.rattrapage = true
        }
        else if (params.statusEtudiant === -1 && (params.session === 1 || params.session === -1)) {
          dispatchString = 'note/getListePourAdmis'
          console.log('admis')
        }
        else if (params.statusEtudiant === -2 && params.session === 1) {
          dispatchString = 'note/getListePourNonAdmis'
          console.log('non admis')
        }
        console.log('admis : ' + params.session)
        this.$store.dispatch(dispatchString, params)
          .then((res) => {
            this.notes = res
            if (JSON.stringify(res).split('":').length > 0) {
              this.choice = JSON.stringify(res).split('":')[0].split('{"')[1]
            }
            this.isReady = true
          })
          .catch((err) => {
            console.log('error get all notes', err)
          })
      },
      printPdfAttestation () {
        let queryOptions = {
          annee: this.annee,
          parcours: this.parcours,
          semestre: this.semestre
        }
        if (queryOptions.annee !== undefined && queryOptions.parcours !== undefined && queryOptions.semestre !== undefined) {
          this.$store.dispatch('etudiant/printAttestation', queryOptions)
            .then((res) => {
              console.log("pdf's url :", process.env.API_BASE_URL + res.url)
              let tab = window.open(process.env.API_BASE_URL + res.url, '_blank')
              if (tab) {
                tab.focus()
              }
              else {
                console.log('please allow pop up for this site')
              }
            })
            .catch((err) => {
              console.log(err)
            })
        }
      }
    },
    mounted () {
      this.$store.dispatch('niveau/getAllNiveau')
        .then((niveaux) => {
          this.niveauOptions = niveaux.map((niv) => {
            return {
              label: niv.code,
              value: niv.id,
              icon: 'today'
            }
          })
          this.niveau = first(niveaux).id
        })
      this.$store.dispatch('anneeuniversitaire/getAllAnneeUniversitaire')
        .then((anneeunivs) => {
          this.anneeOptions = anneeunivs.map((au) => {
            return {
              label: au.code,
              value: au.id,
              icon: 'date_range'
            }
          })
          this.annee = first(anneeunivs).id
          this.$store.dispatch('getFonction')
            .then((fonction) => {
              const {composant} = fonction.vars
              this.$store.dispatch('mention/getAllMentionByComposant', composant.id)
                .then((res) => {
                  this.mentionOptions = res.map((mention) => {
                    return {
                      label: mention.libelle,
                      value: mention.id,
                      icon: 'extension'
                    }
                  })
                  this.mention = first(res).id
                  this.$store.dispatch('session/getAllSession')
                    .then((sessions) => {
                      this.sessionOptions = sessions.map((session) => {
                        return {
                          label: session.libelle,
                          value: session.id,
                          icon: 'extension'
                        }
                      })
                      this.sessionOptions.push({
                        label: 'Résultat Global',
                        value: -1,
                        icon: 'extension'
                      })
                      this.sessionOptions.push({
                        label: 'Passer au Rattrapage',
                        value: -2,
                        icon: 'extension'
                      })
                      this.session = -1
                      this.statusOption.push({
                        label: 'Admis',
                        value: -1,
                        icon: 'extension'
                      })
                      this.statusOption.push({
                        label: 'Non admis',
                        value: -2,
                        icon: 'extension'
                      })
                      this.statusOption.push({
                        label: 'A cheval',
                        value: -3,
                        icon: 'extension'
                      })
                      this.statusOption.push({
                        label: 'Global',
                        value: -4,
                        icon: 'extension'
                      })
                    })
                    .catch((err) => {
                      console.log('Cannot get all sessions', err)
                    })
                })
                .catch((err) => {
                  console.log('Cannot get all mentions', err)
                })
            })
            .catch((err) => {
              console.log('Cannot get all mentions', err)
            })
        })
        .catch(err => {
          console.log('Cannot get all AU', err)
        })
    }
  }
</script>

<style lang="stylus">
  ._table-resultat
    margin-right auto
    margin-left auto

  ._no-padding
    padding 0 !important

  ._modal-content
    padding 15px 70px
    border-bottom 1px solid whitesmoke

  ._inscriptionModal
    .layout-header
      box-shadow none

    .layout-footer
      box-shadow none
      border-top 1px solid lightgrey

  @media only screen and (max-width: 500px) {
    ._modal-content {
      padding: 10px 10px;
      border-bottom: 1px solid whitesmoke;
    }
  }
</style>

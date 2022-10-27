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
          float-label="Niveau"
          v-model="niveau"
          :options="niveauOptions"
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
      <div class="col-md col-sm-12">
        <q-select
          style="margin-top: 0;"
          color="primary"
          float-label="Session "
          v-model="session"
          :options="sessionOptions"
        />
      </div>
      <div class="col-md col-sm-12">
        <q-select
          style="margin-top: 0;"
          color="primary"
          float-label="Status "
          v-model="statusEtudiant"
          :options="statusOption"
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
      <div v-else-if="rattrapage == true" class="content-center" style="margin: 0 auto">
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
      <div v-else-if="rattrapageVal == true" class="content-center" style="margin: 0 auto">
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
              <br v-if="etudiantsEc.length>0"/><div v-if="etudiantsEc.length>0" class="text-center">Notes des Etudiants qui ont passer le rattrapage de l'EC: {{ec}}</div><br v-if="etudiantsEc.length>0"/>
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
      <div v-else-if="acheval == true" class="content-center" style="margin: 0 auto">
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
              <br v-if="etudiantsEc.length>0"/><div v-if="etudiantsEc.length>0" class="text-center">Liste des Etudiants à cheval à l'EC {{ec}}</div><br v-if="etudiantsEc.length>0"/>
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
      <div v-else>
        <!--<q-fixed-position corner="bottom-left" :offset="[18, 18]">-->
          <!--<a target="_blank" href="http://localhost:5555/pdf/resultat/1/1/1/1">Imprimer</a>-->
        <!--</q-fixed-position>-->
        <table v-if="notes.length > 0" class="q-table cell-separator loose highlight _table-resultat">
          <thead>
            <tr>
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
                <th class="text-center"></th>
              </template>
              <th class="text-center">Crédits</th>
              <th class="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="note in notes" :key="note.etudiantInfo.numeroMatricule">
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
                  Aucun résultat disponible
                </q-card-title>
                <q-card-main>
                  <blockquote>
                    <p>
                      Faire une demande de vérification des PARAMETRES (cf. Doyen | Directeur | Chef de Parsours | Chef de Mention).<br>
                      Faire une demande de validation des notes (cf. Enseignants)
                    </p>
                    <small><cite title="Quasar Framework">Escola Team</cite></small>
                  </blockquote>
                </q-card-main>
              </q-card>
            </div>
          </div>
        </div>
      </div>

    </div>
    <q-fixed-position corner="bottom-left" :offset="[18, 18]">
      <q-fab color="primary" push icon="settings" direction="right">
        <q-btn
          round
          color="primary"
          @click="printPdfResultat()"
          class="animate-pop"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Imprimer le resultat</q-tooltip>
          <q-icon name="print" />
        </q-btn>
        <!--q-btn
          round
          color="primary"
          @click="printPdfResultat()"
          class="animate-pop"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Imprimer le liste des étudaint admin en premier session</q-tooltip>
          <q-icon name="print" />
        </q-btn-->
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
        rattrapageVal: false,
        acheval: false,
        compensable: false,
        statusAdmis: false,
        statusNonAdmis: false,
        statusAcheval: false,
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
        statusAllSession: '',
        statusAdmisDefinitif: '',
        statusNonAdmisDefinitif: '',
        statusOption: [
          {
            label: 'Tous',
            value: -4,
            icon: 'extension'
          },
          {
            label: 'Admis',
            value: -1,
            icon: 'extension'
          },
          {
            label: 'Non admis',
            value: -2,
            icon: 'extension'
          }
        ],
        statusOptionRattrapage: [],
        statusOptionSessionNormal: [
          {
            label: 'Tous',
            value: -4,
            icon: 'extension'
          },
          {
            label: 'Admis',
            value: -1,
            icon: 'extension'
          },
          {
            label: 'Non admis',
            value: -2,
            icon: 'extension'
          },
          {
            label: 'Passer au rattrapage',
            value: -6,
            icon: 'extension'
          }
        ],
        statusOptionDefinitif: [
          {
            label: 'Tous',
            value: -4,
            icon: 'extension'
          },
          {
            label: 'Admis',
            value: -1,
            icon: 'extension'
          },
          {
            label: 'Non admis',
            value: -2,
            icon: 'extension'
          },
          {
            label: 'A cheval',
            value: -3,
            icon: 'extension'
          },
          {
            label: 'Compensable',
            value: -5,
            icon: 'extension'
          }
        ]
      }
    },
    computed: {
      allFormFilled: function () {
        return this.annee !== '' && this.mention !== '' && this.parcours !== '' && this.niveau !== '' && this.session !== '' && this.statusEtudiant !== ''
      },
      compoundProperty () {
        this.annee
        this.niveau
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
          case 'VALIDE_DELIB':
            return 'VD'
          case 'ACHEVAL':
            return 'ACHEVAL'
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
        if (this.annee !== '' && this.mention !== '' && this.parcours !== '' && this.niveau !== '' && this.session !== '') {
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
          niveau: this.niveau,
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
        // session id = 3 si l'utilisateur veut afficher le résultat définitif
        let dispatchString = 'note/getAllNotesForResultByLevel'
        this.rattrapage = false
        this.rattrapageVal = false
        this.acheval = false
        this.statusNonAdmis = false
        this.statusAdmis = false
        this.statusAllSession = false
        this.statusAdmisDefinitif = false
        this.statusNonAdmisDefinitif = false
        if (params.session === 3 && params.statusEtudiant === '') {
          dispatchString = 'note/getResultatGlobal'
        }
        else if (params.statusEtudiant === -1 && params.session === 1) {
          dispatchString = 'note/getListePourAdmis'
          this.statusAdmis = true
          console.log('admis')
        }
        else if (params.session === 2) {
          dispatchString = 'note/getListeNoteRattrapage'
          this.rattrapageVal = true
          console.log('Note de deuxieme Session')
        }
        else if (params.statusEtudiant === -2 && params.session === 1) {
          dispatchString = 'note/getListePourNonAdmis'
          this.statusNonAdmis = true
          console.log('non admis')
        }
        else if (params.statusEtudiant === -6 && params.session === 1) {
          dispatchString = 'note/getListePourRattrapage'
          this.rattrapage = true
          this.statusNonAdmis = true
          console.log('Ceux qui vont passer la deuxieme Session')
        }
        else if (params.session === 3 && params.statusEtudiant === -1) {
          dispatchString = 'note/getResultatGlobalAdmis'
          this.statusAdmisDefinitif = true
          console.log('Admis definitif')
        }
        else if (params.session === 3 && params.statusEtudiant === -2) {
          dispatchString = 'note/getResultatGlobalNonAdmis'
          this.statusNonAdmisDefinitif = true
          console.log('Redoublement definitif')
        }
        else if (params.session === 3 && params.statusEtudiant === -3) {
          dispatchString = 'note/getListePourAcheval'
          this.acheval = true
          console.log('A cheval')
        }
        else if (params.session === 3 && params.statusEtudiant === -4) {
          dispatchString = 'note/getResultatGlobal'
          console.log('tous définitif')
        }
        else if (params.session === 3 && params.statusEtudiant === -5) {
          dispatchString = 'note/getResultatDeliberable'
          this.compensable = true
          console.log('Compensable')
        }
        else if (params.session === 2 && params.statusEtudiant === -4) {
          this.statusAllSession = true
        }
        else if (params.session === 1 && params.statusEtudiant === -4) {
          this.statusAllSession = true
        }
        console.log('session : ' + params.session + ' etudiant : ' + params.statusEtudiant)
        if (params.session === 1) {
          this.statusOption = this.statusOptionSessionNormal
        }
        else if (params.session === 3) {
          this.statusOption = this.statusOptionDefinitif
        }
        else if (params.session === 2) {
          this.statusOption = this.statusOptionRattrapage
        }
        this.$store.dispatch(dispatchString, params)
          .then((res) => {
            console.log('PARAMETRE', res)
            this.notes = res
            if (JSON.stringify(res).split('":').length > 0) {
              this.choice = JSON.stringify(res).split('":')[0].split('{"')[1]
            }
            this.isReady = true
          })
          .catch((err) => {
            this.$alert.warning('Veuillez verifier les paramètres! Recharger la page')
            console.log('error get all notes', err)
          })
      },
      printPdfResultat () {
        let queryOptions = {
          annee: this.annee,
          mention: this.mention,
          parcours: this.parcours,
          semestre: this.semestre,
          session: this.session,
          statusEtudiant: this.statusEtudiant
        }
        if (queryOptions.annee !== undefined && queryOptions.parcours !== undefined && queryOptions.semestre !== undefined) {
          let url = 'etudiant/printResultat'
          if (this.rattrapage || this.acheval || this.rattrapageVal) {
            url = 'etudiant/printResultatParEC'
          }
          else if (this.compensable) {
            url = 'etudiant/printResultatCompensable'
          }
          else if (this.statusAdmis) {
            url = 'etudiant/printResultatPourAdmis'
          }
          else if (this.statusNonAdmis) {
            url = 'etudiant/printResultatPourNonAdmis'
          }
          else if (this.statusAllSession) {
            url = 'etudiant/printResultat'
          }
          else if (this.statusAdmisDefinitif) {
            url = 'etudiant/printResultatAdmisDefinitif'
          }
          else if (this.statusNonAdmisDefinitif) {
            url = 'etudiant/printResultatNonAdmisDefinitif'
          }
          this.$store.dispatch(url, queryOptions)
            .then((res) => {
              console.log(res)
              console.log('pdf\'s url :', process.env.API_BASE_URL + res.url)
              if (res.status !== 'INTERNAL_SERVER_ERROR') {
                console.log('mandeha')
              }
              else {
                console.log('Erreur du serveur')
              }
              let tab = window.open(process.env.API_BASE_URL + res.url, '_blank')
              if (tab) {
                tab.focus()
              }
              else {
                this.$alert.error('Veuillez activer les pop up pour ce site')
              }
            })
            .catch((err) => {
              console.log(err)
            })
        }
        else {
          this.$alert.error('Veuillez selectionner des champs valides')
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
                        label: 'Résultat Definitif',
                        value: 3,
                        icon: 'extension'
                      })
                      this.session = 3
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

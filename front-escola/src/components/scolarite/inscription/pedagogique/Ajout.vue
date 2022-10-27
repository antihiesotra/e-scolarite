<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div class="layout-padding">
    <!-- your content -->
    <div class="row" style="padding-left: 10px;padding-right: 10px;">
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
          float-label="Mention"
          v-model="mention"
          :options="mentionOptions"
        />
      </div>
      <div class="col-sm-3">
        <q-select
          style="margin-top: 0;"
          color="primary"
          float-label="Parcours"
          v-model="parcours"
          :options="parcoursOptions"
        />
      </div>
    </div>
    <!-- your content -->
    <q-card>
      <q-data-table
        :data="etudiants"
        :config="config"
        :columns="columns"
        :refresh="refresh"
        class="bg-white"
        ref="datatable"
      >
        <!-- Custom renderer when user selected one or more rows -->
        <template slot="selection" slot-scope="selection">
          <q-btn color="primary" icon="assignment" @click="openModalPedagogique(selection)">
            <span class="gt-sm">Réinscription Pédagogique Multiple</span>
          </q-btn>
        </template>
        <template slot="col-photo" slot-scope="item">
          <q-item>
            <q-item-side :avatar="item.row.photo" />
          </q-item>
        </template>
      </q-data-table>
    </q-card>

    <q-fixed-position corner="bottom-left" :offset="[18, 18]">
      <q-fab color="primary" push icon="settings" direction="right">
        <q-btn
          round
          color="primary"
          @click="$router.push('/scolarite/inscription')"
          class="animate-pop"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Revenir à la liste des inscriptions</q-tooltip>
          <q-icon name="list" />
        </q-btn>
        <q-btn
          round
          color="primary"
          @click="toggleSelect()"
          class="animate-pop"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Selectionner tout</q-tooltip>
          <q-icon name="done_all" />
        </q-btn>
      </q-fab>
    </q-fixed-position>
    <div >
      <q-modal ref="reinscriptionModal" class="_inscriptionModal" v-model="reinscriptionModal"
               :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '50vw', minHeight: '85vh'}">
        <q-modal-layout>
          <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey;">
            <div class="text-center">
              <div class="col-sm-12 layout-padding ">
                <div style="margin: 0;font-size: 24px" class="light-paragraph">Réinscription administrative des étudiants selectionnées</div>
              </div>
            </div>
            <q-btn flat round small @click="$refs.reinscriptionModal.close()" style="position: absolute;top: 1em;right: 1em">
              <q-icon name="close" />
            </q-btn>
          </div>
          <div class="_modal-content">
            <div style="font-size: 18px;" class="text-grey-8 text-italic">Scolarité</div>
            <br>
            <div class="row sm-gutter">
              <div class="col-md-6">
                <q-select
                  style="margin-top: 0;"
                  color="primary"
                  float-label="Année universitaire *"
                  v-model="anneeReinsciptionA"
                  :options="anneeOptionsA"
                />
              </div>
              <div class="col-md-6">
                <q-select
                  style="margin-top: 0;"
                  color="primary"
                  float-label="Semestre *"
                  v-model="semestresReinscriptionA"
                  :options="semestreOptionsA"
                />
              </div>
            </div>
          <div class="row sm-gutter">
            <div class="col-md-6">
              <q-select
                style="margin-top: 0;"
                color="primary"
                float-label="Mention *"
                v-model="mentionReinscriptionA"
                :options="mentionOptionsA"
              />
            </div>
            <div class="col-md-6">
              <q-select
                style="margin-top: 0;"
                color="primary"
                float-label="Parcours *"
                v-model="parcoursReinscriptionA"
                :options="parcoursOptionsA"
              />
            </div>
            <div class="col-md-6">
              <q-select
                multiple
                style="margin-top: 0;"
                color="primary"
                float-label="Unité d'Enseignement *"
                v-model="uesReinscriptionA"
                :options="ueOptionsA"
              />
            </div>
          </div>
          </div>
          <div class="_modal-content">
            <div style="font-size: 18px;" class="text-grey-8 text-italic">Quittance droit d'inscription</div>
            <br>
            <div class="row sm-gutter">
              <div class="col-md-4">
                <q-input v-model="bordereau.numero" type="text" float-label="Bordereau N°" />
              </div>
              <div class="col-md-4">
                <q-datetime v-model="bordereau.date" float-label="Date bordereau" format="DD MMMM YYYY"  :month-names="monthNames" :day-names="dayNames" cancel-label="" ok-label="Selectionner" clear-label="Effacer" type="date" />
              </div>
              <div class="col-md-4">
                <q-input v-model="bordereau.montant" type="text" suffix="Ar" float-label="Montant" />
              </div>
            </div>
          </div>
          <div class="_modal-content">
            <div style="font-size: 18px;" class="text-grey-8 text-italic">Quitus</div>
            <br>
            <div class="row sm-gutter">
              <div class="col-md-4">
                <q-item tag="label" style="padding-left: 0;">
                  <q-item-side>
                    <q-checkbox color="primary" v-model="quitus.logement" />
                  </q-item-side>
                  <q-item-main>
                    <q-item-tile class="text-grey text-italic" label>Logement</q-item-tile>
                  </q-item-main>
                </q-item>
              </div>
              <div class="col-md-4">
                <q-item tag="label" style="padding-left: 0;">
                  <q-item-side>
                    <q-checkbox color="primary" v-model="quitus.sport" />
                  </q-item-side>
                  <q-item-main>
                    <q-item-tile class="text-grey text-italic" label>Sport</q-item-tile>
                  </q-item-main>
                </q-item>
              </div>
              <div class="col-md-4">
                <q-item tag="label" style="padding-left: 0;">
                  <q-item-side>
                    <q-checkbox color="primary" v-model="quitus.bibliotheque" />
                  </q-item-side>
                  <q-item-main>
                    <q-item-tile class="text-grey text-italic" label>Bibliothèque</q-item-tile>
                  </q-item-main>
                </q-item>
              </div>
            </div>
            <br />
            <div class="row sm-gutter">
              <div class="col-md-6">

              </div>
              <div class="col-md-6">

              </div>
            </div>

          </div>
          <div class="_modal-content">
            <div style="font-size: 18px;" class="text-grey-8 text-italic">Bourse d'étude</div>
            <br>
            <div class="row sm-gutter">
              <div class="col-md-4">
                <q-input v-model="bourse.nature" type="text" float-label="Nature" />
              </div>
              <div class="col-md-4">
                <q-input v-model="bourse.taux" suffix="%" :min="0" :max="100" type="number" float-label="Taux (%)" />
              </div>
              <div class="col-md-4">
                <q-input v-model="bourse.montant" type="number" suffix="Ar" float-label="Montant (Ar)" />
              </div>
            </div>
          </div>
          <div slot="footer" :class="'_no-shadow'" style="padding: 15px 100px 20px;">
            <form method="POST" enctype="multipart/form-data" id="formaReinscriptionAdministrative">
              <div class="flex flex-center">
                <button class="q-btn row inline flex-center q-focusable q-hoverable relative-position q-btn-rectangle q-btn-standard bg-primary text-white" type="submit" id="btnSubmitReinscriptionAdministrative">Réinscrire l'étudiant</button>
              </div>
            </form>
          </div>
        </q-modal-layout>
      </q-modal>
      <q-modal ref="reinscriptionPedagogiqueModal" class="_inscriptionModal" v-model="reinscriptionPedagogiqueModal"
               :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '50vw', minHeight: '85vh'}">
        <q-modal-layout>
          <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey;">
            <div class="text-center">
              <div class="col-sm-12 layout-padding ">
                <div style="margin: 0;font-size: 24px" class="light-paragraph">Réinscription pedagogique de  {{ etudiant.fullName }}</div>
              </div>
            </div>
            <q-btn flat round small @click="$refs.reinscriptionPedagogiqueModal.close()" style="position: absolute;top: 1em;right: 1em">
              <q-icon name="close" />
            </q-btn>
          </div>
          <div class="_modal-content">
            <div class="content-center">
              <div style="font-size: 18px;" class="text-grey-8 text-italic">Scolarité</div>
              <br>
              <div style="padding: 30px">
                <q-select
                  style="margin-top: 0;"
                  color="primary"
                  float-label="Année universitaire *"
                  v-model="anneeReinsciptionA"
                  :options="anneeOptionsA"
                />
                <q-select
                  style="margin-top: 0;"
                  color="primary"
                  float-label="Semestre *"
                  v-model="semestresReinscriptionA"
                  :options="semestreOptionsA"
                />
                <q-select
                  style="margin-top: 0;"
                  color="primary"
                  float-label="Mention *"
                  v-model="mentionReinscriptionA"
                  :options="mentionOptionsA"
                />
                <q-select
                  style="margin-top: 0;"
                  color="primary"
                  float-label="Parcours *"
                  v-model="parcoursReinscriptionA"
                  :options="parcoursOptionsA"
                />
              </div>
            </div>
          </div>
          <div slot="footer" :class="'_no-shadow'" style="padding: 15px 100px 20px;">
            <form method="POST" enctype="multipart/form-data" id="formaReinscriptionPedagogique">
              <div class="flex flex-center">
                <button class="q-btn row inline flex-center q-focusable q-hoverable relative-position q-btn-rectangle q-btn-standard bg-primary text-white" type="submit" id="btnSubmitReinscriptionPedagogique">Réinscrire l'étudiant</button>
              </div>
            </form>
          </div>
        </q-modal-layout>
      </q-modal>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-expressions */

  import {
    QCard,
    QDataTable,
    QBtn,
    QIcon,
    Loading,
    Dialog,
    Alert,
    QItem,
    QItemSide,
    QItemTile,
    QItemMain,
    QSelect,
    QTooltip,
    QFixedPosition,
    QCheckbox,
    QChip,
    QInput,
    QField,
    QDatetime,
    QFab,
    QModal,
    QModalLayout,
    QList,
    QListHeader
  } from 'quasar'
  import { map, last, pick, first } from 'lodash'
  import { required, between } from 'vuelidate/lib/validators'
  import jQuery from 'jquery'
  let $ = jQuery
  export default {
    components: {
      QCard,
      QDataTable,
      QBtn,
      QIcon,
      Loading,
      Alert,
      QItem,
      QItemSide,
      QItemTile,
      QItemMain,
      QSelect,
      QTooltip,
      QFixedPosition,
      QCheckbox,
      QChip,
      QInput,
      QField,
      QDatetime,
      QFab,
      QModal,
      QModalLayout,
      QList,
      QListHeader
    },
    data () {
      return {
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        dayNames: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        etudiants: [],
        config: {
          rowHeight: '60px',
          title: '',
          refresh: true,
          columnPicker: true,
          bodyStyle: {
            maxHeight: '400px'
          },
          responsive: true,
          pagination: {
            rowsPerPage: 15,
            options: [5, 10, 15, 30]
          },
          selection: 'multiple',
          messages: {
            noData: 'Aucune données dans la base données',
            noDataAfterFiltering: 'Aucun résultat. Veuillez raffiner les termes de votre recherche.'
          },
          labels: {
            columns: 'Colonnes',
            allCols: 'Toutes',
            rows: 'Lignes',
            selected: {
              singular: 'etudiant séléctionné.',
              plural: 'etudiants séléctionnés.'
            },
            clear: 'Annuler',
            search: 'Recherche',
            all: 'Tous'
          }
        },
        columns: [
          {
            label: 'Photo',
            field: 'photo',
            width: '50px',
            classes: '_no-padding',
            type: 'string'
          },
          {
            label: 'Nom(s) et prénom(s)',
            field: 'fullName',
            width: '200px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Sexe',
            field: 'sexe',
            width: '40px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Adresse',
            field: 'adresse',
            width: '150px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Contact',
            field: 'tel',
            width: '75px',
            filter: true,
            sort: true,
            type: 'string'
          }
        ],
        annee: '',
        anneeOptions: [],
        mention: '',
        mentionOptions: [],
        semestre: '',
        semestres: [],
        semestreOptions: [],
        semestreCode: '',
        parcours: '',
        parcoursOptions: [],
        ueOptions: [],
        ues: [],
        mentionLibelle: '',
        mentionLibelleA: '',
        anneeReinsciptionA: '',
        anneeOptionsA: [],
        semestresReinscriptionA: [],
        semestreOptionsA: [],
        mentionReinscriptionA: '',
        mentionOptionsA: [],
        parcoursReinscriptionA: '',
        parcoursOptionsA: [],
        uesReinscriptionA: [],
        ueOptionsA: [],
        etudiantId: [],
        // toogling all selection in datatable
        selectAll: false,
        reinscriptionPedagogiqueModal: false,
        reinscriptionModal: false,
        numeroMatricule: '',
        bordereau: {
          numero: '',
          date: '',
          montant: ''
        },
        bourse: {
          nature: '',
          taux: '',
          montant: ''
        },
        quitus: {
          logement: false,
          sport: false,
          bibliotheque: false
        },
        etudiant: {},
        dossier: false
      }
    },
    validations: {
      quitus: {
        sport: {
          required
        },
        logement: {
          required
        },
        bibliotheque: {
          required
        }
      },
      bordereau: {
        numero: {
          required
        },
        date: {
          required
        },
        montant: {
          required
        }
      },
      bourse: {
        taux: {
          between: between(0, 100)
        }
      }
    },
    props: {
      ue: ''
    },
    created () {
      console.log('data', this.ue)
    },
    computed: {
      allFormFill: function () {
        return this.annee !== '' && this.mention !== '' && this.parcours !== '' && this.semestres !== []
      },
      compoundProperty () {
        this.annee
        this.semestre
        this.ue
        this.mention
        this.parcours
        return Date.now()
      }
    },
    watch: {
      annee: function (annee) {
        this.$store.dispatch('anneeuniversitaire/getAnneeUniversitaireById', annee)
          .then((res) => {
            this.anneeCode = res.code
          })
          .catch((err) => {
            console.log(err)
          })
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
      semestre: function () {
        let semestrePk = {
          id: this.semestre,
          idAnneeUniversitaire: this.annee
        }
        this.$store.dispatch('semestre/getSemestreBySemestrePk', semestrePk)
          .then((res) => {
            this.semestreCode = res.code
            this.config.title = '<span style="color: rgba(0,0,0,0.54);font-weight: bold;font-size: 95%;">Listes des étudiants admis en ' + this.semestreCode + ' de l\'année ' + this.anneeCode + '</span>'
          })
          .catch((err) => {
            console.log(err)
          })
      },
      mention: function (mention) {
        if (mention !== '') {
          this.parcoursOptions = []
          this.$store.dispatch('mention/getMentionById', mention)
            .then((res) => {
              this.mentionLibelle = res.libelle
            })
            .catch((err) => {
              console.log(err)
            })
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
      parcours: function (parcours) {
        this.$store.dispatch('parcours/getParcoursById', parcours)
          .then((res) => {
            this.parcoursLibelle = res.libelle
          })
          .catch((err) => {
            console.log(err)
          })
        let paramsUe = {
          idParcours: this.parcours,
          idSemestre: this.semestre,
          idAnneeUniversitaire: this.annee
        }
        this.$store.dispatch('ue/getUeByAndAnneeSemestreMentionParcours', paramsUe)
          .then((res) => {
            map(res, u => {
              let ueData = {
                label: u.libelle,
                value: u.id,
                icon: 'date_range'
              }
              this.ueOptions.push(ueData)
            })
            this.ue = last(res).id
          })
          .catch((err) => {
            console.log(err)
          })
      },
      anneeReinsciptionA: function (anneeReinsciptionA) {
        this.$store.dispatch('anneeuniversitaire/getAnneeUniversitaireById', anneeReinsciptionA)
          .then((res) => {
            this.anneeCode = res.code
          })
          .catch((err) => {
            console.log(err)
          })
        this.$store.dispatch('semestre/getSemestreByIdAnneeUniversitaire', anneeReinsciptionA)
          .then((res) => {
            this.semestreOptionsA = []
            map(res, s => {
              let semestreR = {
                label: s.code,
                value: s.semestrePK.id,
                icon: 'today'
              }
              this.semestreOptionsA.push(semestreR)
            })
            this.semestresReinscriptionA = first(res).semestrePK.id
          })
      },
      semestresReinscriptionA: function () {
        let semestrePk = {
          id: this.semestresReinscriptionA,
          idAnneeUniversitaire: this.anneeReinsciptionA
        }
        this.$store.dispatch('semestre/getSemestreBySemestrePk', semestrePk)
          .then((res) => {
            this.semestreCodeR = res.code
          })
          .catch((err) => {
            console.log(err)
          })
      },
      mentionReinscriptionA: function (mentionReinscriptionA) {
        if (mentionReinscriptionA !== '') {
          this.parcoursOptionsA = []
          this.$store.dispatch('mention/getMentionById', mentionReinscriptionA)
            .then((res) => {
              this.mentionLibelleA = res.libelle
            })
            .catch((err) => {
              console.log(err)
            })
          this.$store.dispatch('parcours/getParcoursByMention', mentionReinscriptionA)
            .then((res) => {
              map(res, p => {
                let parcoursR = {
                  label: p.libelle,
                  value: p.id,
                  icon: 'bubble_chart'
                }
                this.parcoursOptionsA.push(parcoursR)
              })
              this.parcoursReinscriptionA = first(res).id
            })
            .catch((err) => {
              console.log(err)
            })
        }
      },
      parcoursReinscriptionA: function (parcoursReinscriptionA) {
        this.ueOptionsA = []
        this.$store.dispatch('parcours/getParcoursById', parcoursReinscriptionA)
          .then((res) => {
            this.parcoursLibelle = res.libelle
            this.parcoursReinscriptionA = res.id
          })
          .catch((err) => {
            console.log(err)
          })
        let paramsUe = {
          idParcours: this.parcoursReinscriptionA,
          idSemestre: this.semestresReinscriptionA,
          idAnneeUniversitaire: this.anneeReinsciptionA
        }
        this.$store.dispatch('ue/getUeByAndAnneeSemestreMentionParcours', paramsUe)
          .then((res) => {
            map(res, u => {
              let ueData = {
                label: u.libelle,
                value: u.id,
                icon: 'date_range'
              }
              this.ueOptionsA.push(ueData)
            })
          })
          .catch((err) => {
            console.log(err)
          })
      },
      compoundProperty () {
        if (this.annee !== '' && this.mention !== '' && this.parcours !== '' && this.semestre !== '') {
          this.refresh(() => {
            console.log('Init finished')
          })
        }
      }
    },
    methods: {
      refresh (done) {
        setTimeout(() => {
          let field = {
            annee: this.annee,
            parcours: this.parcours,
            semestre: this.semestre
          }
          this.$store.dispatch('inscription/getAllInscriptionPedagogique', field)
            .then((res) => {
              this.etudiants = []
              map(res, (et) => {
                et.adresse = et.etudiant.idPersonne.adresse
                et.tel = et.etudiant.idPersonne.tel
                et.sexe = et.etudiant.idPersonne.sexe
                et.fullName = et.etudiant.idPersonne.nom + ' ' + et.etudiant.idPersonne.prenom
                et.matricule = et.etudiant.numeroMatricule
                this.etudiants.push(et)
              })
            })
            .catch((err) => {
              console.log(err)
            })
          done()
        }, 1000)
      },
      openModalReinscription (selection) {
        this.initModal()
        this.etudiant = map(selection.rows, (row) => pick(row, 'data'))
        this.reinscriptionModal = true
      },
      openModalPedagogique (selection) {
        this.initModal()
        this.etudiant = map(selection.rows, (row) => pick(row, 'data'))
        this.reinscriptionPedagogiqueModal = true
      },
      reInscrirePedagogiquementEtudiant () {
        $('#btnSubmitReinscriptionPedagogique').click((event) => {
          event.preventDefault()
          this.sendDataReinscriptionPedagogique()
        })
      },
      reInscrireEtudiant () {
        $('#btnSubmitReinscriptionAdministrative').click((event) => {
          event.preventDefault()
          this.sendDataReinscriptionAdministrative()
        })
      },
      sendDataReinscriptionAdministrative () {
        this.$refs.reinscriptionModal.close()
        Loading.show()
        var form = $('#formaReinscriptionAdministrative')[0]
        var data = new FormData(form)
        data.append('idAnneeUniversitaire', this.annee)
        data.append('idParcours', this.parcours)
        data.append('idSemestre', this.semestres)
        data.append('etudiant', this.etudiant)
        data.append('ues', this.ues)
        this.$store.dispatch('inscription/findInscriptionEtudiantAdminPedagogique', data)
          .then((res) => {
            if (res.length !== 0) {
              Loading.hide()
              this.$alert.error('Cet étudiant est déjà inscrit dans ce semestre')
              this.reinscriptionModal = false
              return false
            }
            else {
              this.dossier = this.quitus.sport && this.quitus.logement && this.quitus.bibliotheque
              var formInscriptionPedagogique = $('#formaReinscriptionAdministrative')[0]
              var dataInscriptionPedagogique = new FormData(formInscriptionPedagogique)
              dataInscriptionPedagogique.append('bordereauNumero', this.bordereau.numero)
              dataInscriptionPedagogique.append('bordereauDate', this.bordereau.date)
              dataInscriptionPedagogique.append('bordereauMontant', this.bordereau.montant)
              dataInscriptionPedagogique.append('dossierComplet', this.dossier)
              dataInscriptionPedagogique.append('bourseNature', this.bourse.nature)
              dataInscriptionPedagogique.append('bourseMontant', this.bourse.montant)
              dataInscriptionPedagogique.append('bourseTaux', this.bourse.taux)
              dataInscriptionPedagogique.append('idAnneeUniversitaire', this.annee)
              dataInscriptionPedagogique.append('idParcours', this.parcours)
              dataInscriptionPedagogique.append('idSemestre', this.semestres)
              dataInscriptionPedagogique.append('idEtudiant', this.etudiant.etudiant.id)
              dataInscriptionPedagogique.append('ues', this.ues)
              this.$store.dispatch('inscription/reInscrireEtudiantAdminPedagogiquement', dataInscriptionPedagogique)
                .then((res) => {
                  console.log('retour vers api', res)
                  if (res === 'OK') {
                    Loading.hide()
                    this.$refs.reinscriptionModal.close()
                    this.$alert.success('L\'étudiant a bien été réinscrit')
                  }
                  else {
                    Loading.hide()
                    this.$refs.reinscriptionModal.close()
                    this.$alert.error('Cette étudiant est déjà inscrit a cette semetre')
                  }
                })
                .catch((err) => {
                  this.$refs.reinscriptionModal.close()
                  Loading.hide()
                  console.log(err)
                  this.$alert.error('Erreur lors de la réinscription de l\'étudiant')
                })
            }
          })
          .catch((err) => {
            console.log(err)
          })
      },
      sendDataReinscriptionPedagogique () {
        Loading.show()
        for (var i = 0; i < this.etudiant.length; i++) {
          this.etudiantId[i] = this.etudiant[i].data.etudiant.id
        }
        var formReinscription = $('#formaReinscriptionPedagogique')[0]
        var dataReinscription = new FormData(formReinscription)
        dataReinscription.append('idAnneeUniversitaire', this.anneeReinsciptionA)
        dataReinscription.append('idParcours', this.parcoursReinscriptionA)
        dataReinscription.append('idSemestre', this.semestresReinscriptionA)
        dataReinscription.append('idEtudiants', this.etudiantId)
        console.log('etudiantId', this.etudiantId)
        this.$store.dispatch('inscription/reInscrireEtudiantPedagogiquementMultiple', dataReinscription)
          .then((res) => {
            if (res === 'OK') {
              Loading.hide()
              this.$refs.reinscriptionPedagogiqueModal.close()
              this.$alert.success('L\'étudiant a bien été réinscrit')
            }
            else {
              Loading.hide()
              this.$refs.reinscriptionPedagogiqueModal.close()
              this.$alert.error('Une erreur est survenue lors de la réinscription')
            }
          })
          .catch((err) => {
            Loading.hide()
            console.log(err)
            this.$alert.error('Erreur lors de la réinscription de l\'étudiant')
          })
      },
      supprimerEtudiant (selection) {
        Dialog.create({
          title: '<div style="color: red;">Suppression</div>',
          message: `Voulez-vous vraiment supprimer cet etudiant?`,
          buttons: [
            'Annuler',
            {
              label: '<div style="color: red;">Oui, supprimer définitivement</div>',
              handler: () => {
                alert('Fonction pour supprimer un etudiant ...')
              }
            }
          ]
        })
      },
      toggleSelect () {
        for (let i = 0; i < this.$refs.datatable.rowSelection.length; i++) {
          this.$set(this.$refs.datatable.rowSelection, i, !this.selectAll)
        }
        this.selectAll = !this.selectAll
      },
      initModal () {
        // eslint-disable-next-line no-unused-expressions
        this.bordereau.numero = ''
        this.bordereau.date = ''
        this.bordereau.montant = ''
        this.bourse.nature = ''
        this.bourse.taux = ''
        this.bourse.montant = ''
        this.quitus.logement = false
        this.quitus.sport = false
        this.quitus.bibliotheque = false
      }
    },
    mounted () {
      this.refresh(() => {}, this.annee)
      this.reInscrirePedagogiquementEtudiant()
      this.reInscrireEtudiant()
      this.$store.dispatch('anneeuniversitaire/getAllAnneeUniversitaire')
        .then((res) => {
          map(res, a => {
            let annee = {
              label: a.code,
              value: a.id,
              icon: 'date_range'
            }
            this.anneeOptions.push(annee)
            this.anneeOptionsA.push(annee)
            this.annee = first(res).id
            this.anneeReinsciptionA = first(res).id
          })
        })
        .catch((err) => {
          console.log('err', err)
        })
      this.$store.dispatch('getFonction')
        .then((fonction) => {
          const {composant} = fonction.vars
          this.$store.dispatch('mention/getAllMentionByComposant', composant.id)
            .then((res) => {
              // console.log('Mention', res)
              map(res, m => {
                let mention = {
                  label: m.libelle,
                  value: m.id,
                  icon: 'extension'
                }
                this.mentionOptions.push(mention)
                this.mentionOptionsA.push(mention)
              })
            })
            .catch((err) => {
              console.log('err', err)
            })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
</script>

<style lang="stylus">

  ._inscriptionModal
    .layout-header
      box-shadow none

    .layout-footer
      box-shadow none
      border-top 1px solid lightgrey
</style>

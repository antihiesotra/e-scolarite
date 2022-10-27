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
          float-label="Niveau "
          v-model="niveau"
          :options="niveauOptions"
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
    <q-card class="animate-fade">
      <q-data-table
        :data="etudiants"
        :config="config"
        :columns="columns"
        :refresh="refresh"
        class="bg-white"
      >
        <!-- Custom renderer when user selected one or more rows printPdfAttestation-->
        <template slot="selection" slot-scope="selection">
          <q-btn color="primary" icon="assignment_ind" @click="detailsBourses(selection)">
            <span class="gt-sm">Voir details</span>
          </q-btn>
        </template>
        <template slot="col-photo">
          <q-item>
            <q-item-side avatar="statics/photovide.png" />
            <q-item-side right icon="file_upload" />
          </q-item>
        </template>
      </q-data-table>
    </q-card>
    <q-fixed-position corner="bottom-left" :offset="[18, 18]">
      <q-fab color="primary" push icon="settings" direction="right">
        <q-btn
          round
          color="primary"
          @click="printExcelInfosMinimEtudiant()"
          class="animate-pop"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Exporter en excel</q-tooltip>
          <q-icon name="print" />
        </q-btn>
        <q-btn
          round
          color="primary"
          @click="printExcelInfosMaximEtudiant()"
          class="animate-pop"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Sauverger localement</q-tooltip>
          <q-icon name="print" />
        </q-btn>
      </q-fab>
    </q-fixed-position>
    <q-modal ref="bourseModal" class="_bourseModal" v-model="bourseModal"
              :content-css="{borderRadius: '4px', paddingBottom: '2px',minWidth: '50vw', minHeight: '50vh'}">
      <q-modal-layout>
        <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey;">
          <div class="text-center">
            <div class="col-sm-12 layout-padding ">
              <div style="margin: 0;font-size: 20px" class="light-paragraph">Détail du bourse de {{ etudiantBourseFullName }}</div>
            </div>
          </div>
          <q-btn flat round small @click="$refs.bourseModal.close()" style="position: absolute;top: 1em;right: 1em">
            <q-icon name="close" />
          </q-btn>
        </div>
        <div class="_modal-content">
          <div style="font-size: 18px;" class="text-grey-8 text-italic">Bourse d'étude</div>
          <br>
          <div class="row sm-gutter">
            <div class="col-md-4">
              <q-select
                style="font-size: 18px;"
                color="primary"
                float-label="Nature"
                v-model="nature"
                :options="natureOptions"
              />
            </div>
            <div class="col-md-4">
              <q-select
                style="font-size: 18px;"
                color="primary"
                float-label="Taux (en %)"
                v-model="bourse.taux"
                :options="tauxOptions"
              />
            </div>
            <div class="col-md-4">
              <q-input v-model="bourse.montant" type="number" suffix="Ar" float-label="Montant (Ar)" />
            </div>
          </div>
        </div>
        <div slot="footer" :class="'_no-shadow'" style="padding: 15px 100px 20px;">
          <form method="POST" enctype="multipart/form-data" id="formaModificationBourse">
            <div class="flex flex-center">
              <button class="q-btn row inline flex-center q-focusable q-hoverable relative-position q-btn-rectangle q-btn-standard bg-primary text-white" type="submit" id="btnSubmitBourseEtudiant">Valider</button>
            </div>
          </form>
        </div>
      </q-modal-layout>
    </q-modal>
  </div>
</template>

<script>
  /* eslint-disable indent,no-unused-expressions */
  import {
    QCard,
    QDataTable,
    QBtn,
    QIcon,
    Loading,
    // Dialog,
    Alert,
    QItem,
    QItemMain,
    QItemSide,
    QItemTile,
    QSelect,
    QTooltip,
    QFixedPosition,
    QCheckbox,
    QChip,
    QModal,
    QModalLayout,
    QInput,
    QFab
  } from 'quasar'

  import { map, last, first } from 'lodash'

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
      QItemMain,
      QItemSide,
      QItemTile,
      QSelect,
      QTooltip,
      QFixedPosition,
      QCheckbox,
      QChip,
      QModal,
      QModalLayout,
      QInput,
      QFab
    },
    data () {
      return {
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
          selection: 'single',
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
            label: 'Numero',
            field: 'matricule',
            width: '100px',
            filter: true,
            sort: true,
            type: 'number'
          },
          {
            label: 'Nom(s) et prénom(s)',
            field: 'fullName',
            width: '250px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Code de redoublement',
            field: 'code_redoublement',
            width: '100px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Année du Bacc',
            field: 'annee_bac',
            width: '100px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Montant',
            field: 'montant',
            width: '80px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Nature',
            field: 'nature',
            width: '80px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Taux',
            field: 'taux_bourse',
            width: '80px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Status',
            field: 'status',
            width: '100px',
            filter: true,
            sort: true,
            type: 'string'
          }
        ],
        anneeExcel: '',
        semestreExcel: [],
        mentionExcel: '',
        parcoursExcel: '',
        annee: '',
        anneeOptions: [],
        mention: '',
        mentionOptions: [],
        parcours: '',
        parcoursOptions: [],
        niveau: '',
        niveauOptions: [],
        bourseModal: false,
        openSupprimer: false,
        motif: '',
        semestreCode: '',
        mentionLibelle: '',
        parcoursLibelle: '',
        etudiantDetails: '',
        etudiantDetails2: '',
        etudiantToDelete: '',
        etudiantBourseFullName: '',
        composant: '',
        bourse: {
          taux: '',
          montant: ''
        },
        nature: '',
        natureOptions: [
          {label: 'Boursier', value: 'Oui'},
          {label: 'Non boursier', value: 'Non'}
        ],
        tauxOptions: [
          {label: '100%', value: '1'},
          {label: '50%', value: '0.5'},
          {label: '25%', value: '0.25'}
        ]
      }
    },
    computed: {
      allFormFill: function () {
        return this.annee !== '' && this.mention !== '' && this.parcours !== '' && this.semestre !== ''
      },
      compoundProperty () {
        this.annee
        this.semestre
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
        this.$store.dispatch('niveau/getAllNiveau')
          .then((res) => {
            this.niveauOptions = []
            map(res, n => {
              let niveau = {
                label: n.code,
                value: n.id,
                icon: 'today'
              }
              this.niveauOptions.push(niveau)
            })
            this.niveau = first(res).id
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
      niveau: function () {
        this.refresh()
      },
      parcours: function (parcours) {
        this.$store.dispatch('parcours/getParcoursById', parcours)
          .then((res) => {
            this.parcoursLibelle = res.libelle
          })
          .catch((err) => {
            console.log(err)
          })
      },
      nature: function (nature) {
        if (nature === 'Oui') {
          console.log('yes')
        }
        else {
          console.log('no')
          }
      },
      compoundProperty () {
        if (this.annee !== '' && this.mention !== '' && this.parcours !== '' && this.niveau !== '') {
          this.refresh(() => {
            console.log('Init finished')
          })
        }
      }
    },
    methods: {
      initModal () {
      },
      printExcelInfosMinimEtudiant () {
        let sm
        if (this.niveau === 1) {
            sm = 1
        }
        else if (this.niveau === 2) {
            sm = 3
        }
        else if (this.niveau === 3) {
            sm = 5
        }
        else if (this.niveau === 4) {
            sm = 7
        }
        else {
            sm = 9
        }
        let queryOptions = {
          annee: this.annee,
          mention: this.mention,
          parcours: this.parcours,
          semestre: sm
        }
        if (queryOptions.annee !== undefined && queryOptions.parcours !== undefined && queryOptions.semestre !== undefined) {
          Loading.show()
          this.$store.dispatch('bourse/printExcelInfosMinimEtudiant', queryOptions)
            .then((res) => {
              let tab = window.open(process.env.API_BASE_URL + res.url, '_blank')
              if (tab) {
                Loading.hide()
                tab.focus()
              }
              else {
                Loading.hide()
                console.log('please allow pop up for this site')
              }
            })
            .catch((err) => {
              Loading.hide()
              console.log(err)
            })
        }
      },
      printExcelInfosMaximEtudiant () {
        let sm
        if (this.niveau === 1) {
            sm = 1
        }
        else if (this.niveau === 2) {
            sm = 3
        }
        else if (this.niveau === 3) {
            sm = 5
        }
        else if (this.niveau === 4) {
            sm = 7
        }
        else {
            sm = 9
        }
        let queryOptions = {
          annee: this.annee,
          mention: this.mention,
          parcours: this.parcours,
          semestre: sm
        }
        if (queryOptions.annee !== undefined && queryOptions.parcours !== undefined && queryOptions.semestre !== undefined) {
          Loading.show()
          this.$store.dispatch('bourse/printExcelInfosMaximEtudiant', queryOptions)
            .then((res) => {
              let tab = window.open(process.env.API_BASE_URL + res.url, '_blank')
              if (tab) {
                Loading.hide()
                tab.focus()
              }
              else {
                Loading.hide()
                console.log('please allow pop up for this site')
              }
            })
            .catch((err) => {
              Loading.hide()
              console.log(err)
            })
        }
      },
      modifBourseEtudiant () {
        $('#btnSubmitBourseEtudiant').click((event) => {
          event.preventDefault()
          this.modifInscriptionAdministrative()
        })
      },
      modifInscriptionAdministrative () {
        let data = {}
        if (this.nature === 'Oui') {
          data = {
            nature: this.nature,
            montant: this.bourse.montant,
            taux: this.bourse.taux,
            idEtudiant: this.etudiantDetails.etudiant.id
          }
        }
        else {
          data = {
            nature: this.nature,
            montant: 0,
            taux: 0,
            idEtudiant: this.etudiantDetails.etudiant.id
          }
        }
        this.$store.dispatch('bourse/modifInscriptionAdministrative', data)
          .then((res) => {
            this.$refs.bourseModal.close()
            this.$alert.success('Le bourse de l\'etudiant a été bien modifié')
          })
          .catch((err) => {
            this.$refs.bourseModal.close()
            console.log(err)
            this.$alert.success('Le bourse de l\'etudiant a été bien modifié')
          })
          this.refresh()
      },
      setProps () {
        this.etudiantDetails2 = this.etudiantDetails
      },
      refresh (done) {
        Loading.show()
        let sm
        if (this.niveau === 1) {
            sm = 1
        }
        else if (this.niveau === 2) {
            sm = 3
        }
        else if (this.niveau === 3) {
            sm = 5
        }
        else if (this.niveau === 4) {
            sm = 7
        }
        else {
            sm = 9
        }
        setTimeout(() => {
          let field = {
            annee: this.annee,
            parcours: this.parcours,
            semestre: sm,
            ue: 0
          }
          this.$store.dispatch('bourse/getInfosInscriptionAdministrativeByInscriptionPedagogique', field)
            .then((res) => {
              this.etudiants = []
              map(res, (et) => {
                console.log(et)
                et.annee_bac = et.etudiant.idPersonne.infoBaccCollection[0].annee
                et.fullName = et.etudiant.idPersonne.nom + ' ' + et.etudiant.idPersonne.prenom
                et.matricule = et.etudiant.numeroMatricule
                et.code_redoublement = et.coderedoublement
                if (et.bourseMontant === 0) {
                  et.montant = ''
                }
                else {
                  et.montant = et.bourseMontant
                }
                if (et.bourseTaux === 1) {
                  et.taux_bourse = '100%'
                }
                else if (et.bourseTaux === 0.5) {
                  et.taux_bourse = '50%'
                }
                else if (et.bourseTaux === 0.25) {
                  et.taux_bourse = '25%'
                }
                else {
                  et.taux_bourse = ''
                }
                if (et.bourseNature === null || et.bourseNature === '') {
                  et.status = 'A traiter'
                  /* et.status = '<span class="status-danger">A traiter</span>' */
                }
                else {
                  et.status = 'Traité'
                  /* et.status = '<span class="status-success">Traité</span>' */
                }
                if (et.bourseNature === 'Oui') {
                  et.nature = 'Boursier'
                  /* et.status = '<span class="status-danger">A traiter</span>' */
                }
                else if (et.bourseNature === 'Non') {
                  et.nature = 'Non boursier'
                }
                else {
                  et.nature = ''
                }
                this.etudiants.push(et)
              })
              Loading.hide()
            })
            .catch((err) => {
              console.log(err)
              Loading.hide()
            })
          done()
        }, 1000)
      },
      detailsBourses (selection) {
        this.initModal()
        this.etudiantDetails = selection.rows[0].data
        this.etudiantBourseFullName = selection.rows[0].data.fullName
        this.nature = selection.rows[0].data.bourseNature
        this.bourse.taux = selection.rows[0].data.bourseTaux
        this.bourse.montant = selection.rows[0].data.bourseMontant
        this.bourseModal = true
      }
    },
    mounted () {
      this.modifBourseEtudiant()
      this.$store.dispatch('anneeuniversitaire/getAllAnneeUniversitaire')
        .then((res) => {
          map(res, a => {
            let annee = {
              label: a.code,
              value: a.id,
              icon: 'date_range'
            }
            this.anneeOptions.push(annee)
          })
          this.annee = last(res).id
        })
        .catch((err) => {
          console.log('err', err)
        })
      this.$store.dispatch('getFonction')
        .then((fonction) => {
          const {composant} = fonction.vars
          this.composant = composant.id
          this.$store.dispatch('mention/getAllMentionByComposant', this.composant)
            .then((res) => {
              map(res, m => {
                let mention = {
                  label: m.libelle,
                  value: m.id,
                  icon: 'extension'
                }
                this.mentionOptions.push(mention)
              })
              this.mention = first(res).id
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
  ._no-padding
    padding 0 !important
    .q-item
      padding-left 0

  ._deleteModal
    .layout-header
      box-shadow none

    .layout-footer
      box-shadow none

  .inputfile {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

  .inputfile + label {
    max-width: 80%;
    font-size: 1.25rem;
    /* 20px */
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    display: inline-block;
    overflow: hidden;
    padding: 0.625rem 1.25rem;
    /* 10px 20px */
  }

  .no-js .inputfile + label {
    display: none;
  }

  .inputfile:focus + label,
  .inputfile.has-focus + label {
    outline: 1px dotted #000;
    outline: -webkit-focus-ring-color auto 5px;
  }

  .inputfile + label * {
    /* pointer-events: none; */
    /* in case of FastClick lib use */
  }

  .inputfile + label svg {
    width: 1em;
    height: 1em;
    vertical-align: middle;
    fill: currentColor;
    margin-top: -0.25em;
    /* 4px */
    margin-right: 0.25em;
    /* 4px */
  }

  .status-danger{
    color: red;
  }
  .status-success{
    color: #027be3;
  }


  .box {
    background-color: #dfc8ca;
    padding: 1.25rem 1.25rem;
  }

  /* style 4 */

  .inputfile-4 + label {
    color: #d3394c;
  }

  .inputfile-4:focus + label,
  .inputfile-4.has-focus + label,
  .inputfile-4 + label:hover {
    color: #722040;
  }

  .inputfile-4 + label figure {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #d3394c;
    display: block;
    padding: 20px;
    margin: 0 auto 10px;
  }

  .inputfile-4:focus + label figure,
  .inputfile-4.has-focus + label figure,
  .inputfile-4 + label:hover figure {
    background-color: #722040;
  }

  .inputfile-4 + label svg {
    width: 100%;
    height: 100%;
    fill: #f1e5e6;
  }

</style>

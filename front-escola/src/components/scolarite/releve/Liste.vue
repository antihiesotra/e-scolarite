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
          <q-btn color="primary" @click="printPdfCertificats(selection)">
            <q-icon name="print" />
            <span class="gt-sm">Certificat de scolarité</span>            
          </q-btn>
          <q-btn color="primary" @click="printStudentCard(selection)">
            <q-icon name="print" />
            <span class="gt-sm">Carte d'étudiant</span>            
          </q-btn>
          <q-btn color="primary" @click="printPdfAttestation(selection)">
            <q-icon name="print" />
            <span class="gt-sm">Attestation</span>            
          </q-btn>
          <q-btn color="primary" @click="releve(selection)">
            <q-icon name="print" />
            <span class="gt-sm">Relevé des notes</span>            
          </q-btn>
          <q-btn color="primary" icon="assignment_ind" @click="detailsEtudiant(selection)">
            <span class="gt-sm">Details</span>
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
          @click="printPdfFichePresence()"
          class="animate-pop"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Imprimer une Fiche de presence</q-tooltip>
          <q-icon name="print" />
        </q-btn>        
        <q-btn
          round
          color="primary"
          @click="printStudentsCard()"
          class="animate-pop"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Imprimer les cartes d'etudiants</q-tooltip>
          <q-icon name="print" />
        </q-btn>
      </q-fab>
    </q-fixed-position>

    <!-- Modal Upload Excel -->
    <q-modal ref="uploadExcelModal" :content-css="{minWidth: '40vw', minHeight: '40vh'}">
      <div class="content-center">
        <h5 class="text-center">Importer fichier excel</h5>
        <div style="padding: 30px">
          <q-select
            style="margin-top: 0;"
            color="primary"
            float-label="Année universitaire"
            v-model="anneeExcel"
            :options="anneeOptions"
          />
          <q-select
            style="margin-top: 0;"
            color="primary"
            float-label="Semestre "
            v-model="semestreExcel"
            :options="semestreOptions"
          />
          <q-select
            style="margin-top: 0;"
            color="primary"
            float-label="Mention"
            v-model="mentionExcel"
            :options="mentionOptions"
          />
          <q-select
            style="margin-top: 0;"
            color="primary"
            float-label="Parcours"
            v-model="parcoursExcel"
            :options="parcoursOptions"
          />     
        </div>
      </div>
      <div class="_modal-content">
        <form method="POST" enctype="multipart/form-data" id="fileUploadForm">
          <div class="box text-center content-center">
            <input type="file" name="uploadfile" id="upload_file" class="inputfile inputfile-4" data-multiple-caption="{count} files selected" multiple />
            <label for="upload_file"><figure><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg></figure> <span>Choisir un fichier&hellip;</span></label>
          </div>
        </form>
      </div>
      <div class="layout-padding text-center content-center" style="margin-top: 40px">
        <button class="q-btn row inline flex-center q-focusable q-hoverable relative-position q-btn-rectangle q-btn-standard bg-primary text-white" type="submit" id="btnSubmit">Importer</button>
        <q-btn @click="$refs.uploadExcelModal.close()">Annuler</q-btn>
      </div>
    </q-modal>
    <q-modal @open="setProps()" ref="voirDetails" maximized v-model="openDetailsEtudiantModal">
      <voir-details ref="voirDetailsModal" :etudiantDetails="etudiantDetails"></voir-details>
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

  import VoirDetails from '../etudiant/VoirDetailsModal.vue'
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
      VoirDetails,
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
            width: '70px',
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
            label: 'Sexe',
            field: 'sexe',
            width: '55px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Adresse',
            field: 'adresse',
            width: '200px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Contact',
            field: 'tel',
            width: '125px',
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
        semestre: '',
        semestreOptions: [],
        openDetailsEtudiantModal: false,
        openSupprimer: false,
        motif: '',
        semestreCode: '',
        mentionLibelle: '',
        parcoursLibelle: '',
        etudiantDetails: '',
        etudiantDetails2: '',
        etudiantToDelete: '',
        etudiantToDeleteFullName: '',
        composant: ''
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
            this.config.title = '<span style="color: rgba(0,0,0,0.54);font-weight: bold;font-size: 95%;">Listes des étudiants inscrits en ' + this.semestreCode + ' de l\'année ' + this.anneeCode + '</span>'
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
      },
      compoundProperty () {
        if (this.annee !== '' && this.mention !== '' && this.parcours !== '' && this.semestre !== '' && this.ue !== '') {
          this.refresh(() => {
            console.log('Init finished')
          })
        }
      }
    },
    methods: {
      sendToServer () {
        this.$refs.uploadExcelModal.close()
        Loading.show()
        var form = $('#fileUploadForm')[0]
        var data = new FormData(form)
        data.append('annee', this.anneeExcel)
        data.append('semestre', this.semestreExcel)
        data.append('mention', this.mentionExcel)
        data.append('parcours', this.parcoursExcel)
        data.append('composant', this.composant)
        this.$store.dispatch('upload/uploadExcelInscription', data)
          .then((res) => {
            if (res === 'Uploaded') {
              this.refresh(() => {
                Loading.hide()
              })
              this.$refs.uploadExcelModal.close()
              this.$alert.success('Importation réussie')
            }
            else {
              Loading.hide()
              this.$refs.uploadExcelModal.close()
              this.$alert.error('Une erreur est survenue lors de l\'importation')
            }
          })
          .catch((err) => {
            Loading.hide()
            console.log('ERROR', err)
            this.$refs.uploadExcelModal.close()
            this.$alert.error('Une erreur est survenue')
          })
      },
      InituploadExcel () {
        $('#btnSubmit').click((event) => {
          event.preventDefault()
          this.sendToServer()
        })
        let input = document.getElementById('upload_file')
        let label = input.nextElementSibling
        let labelVal = label.innerHTML
        input.addEventListener('change', (e) => {
          let fileName = ''
          if (this.files && this.files.length > 1) {
            fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length)
          }
          else {
            fileName = e.target.value.split('\\').pop()
          }

          if (fileName) {
            label.querySelector('span').innerHTML = fileName
          }
          else {
            label.innerHTML = labelVal
          }
        })
        // Firefox bug fix
        input.addEventListener('focus', function () { input.classList.add('has-focus') })
        input.addEventListener('blur', function () { input.classList.remove('has-focus') })
      },
      setProps () {
        this.etudiantDetails2 = this.etudiantDetails
      },
      refresh (done) {
        Loading.show()
        setTimeout(() => {
          let field = {
            annee: this.annee,
            parcours: this.parcours,
            semestre: this.semestre,
            ue: 0
          }
          console.log(field)
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
              Loading.hide()
            })
            .catch((err) => {
              console.log(err)
              Loading.hide()
            })
          done()
        }, 1000)
      },
      detailsEtudiant (selection) {
        this.openDetailsEtudiantModal = true
        this.etudiantDetails = selection.rows[0].data
      },
      printStudentCard (selection) {
        let queryOptions = {
          idEtudiant: selection.rows[0].data.etudiant.id,
          annee: this.annee,
          parcours: this.parcours,
          semestre: this.semestre
        }
        if (queryOptions.annee !== undefined && queryOptions.parcours !== undefined && queryOptions.semestre !== undefined && queryOptions.idEtudiant !== undefined) {
          Loading.show()
          this.$store.dispatch('etudiant/printStudentCard', queryOptions)
            .then((res) => {
              console.log("pdf's url :", process.env.API_BASE_URL + res.url)
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
      printPdfCertificats (selection) {
        let queryOptions = {
          idEtudiant: selection.rows[0].data.etudiant.id,
          annee: this.annee,
          parcours: this.parcours,
          semestre: this.semestre
        }
        if (queryOptions.annee !== undefined && queryOptions.parcours !== undefined && queryOptions.semestre !== undefined && queryOptions.idEtudiant !== undefined) {
          Loading.show()
          this.$store.dispatch('etudiant/printPdfCertificats', queryOptions)
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
              this.$alert.error("Verifier les informations de l'étudiant")
              console.log(err)
            })
        }
      },
      releve (selection) {
        let queryOptions = {
          idEtudiant: selection.rows[0].data.etudiant.id,
          annee: this.annee,
          parcours: this.parcours,
          semestre: this.semestre
        }
        if (queryOptions.annee !== undefined && queryOptions.parcours !== undefined && queryOptions.semestre !== undefined) {
          Loading.show()
          this.$store.dispatch('etudiant/releve', queryOptions)
            .then((res) => {
              console.log("pdf's url :", process.env.API_BASE_URL + res.url)
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
              this.$alert.error('Toutes les notes doivent être validées par les enseignants')
              console.log(err)
            })
        }
      },
      printStudentsCard () {
        let qOptions = {
          annee: this.annee,
          parcours: this.parcours,
          semestre: this.semestre
        }
        if (qOptions.annee !== undefined && qOptions.parcours !== undefined && qOptions.semestre !== undefined) {
          Loading.show()
          this.$store.dispatch('etudiant/printStudentsCard', qOptions)
            .then((res) => {
              console.log("pdf's url :", process.env.API_BASE_URL + res.url)
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
      printPdfAttestation (selection) {
        let queryOptions = {
          idEtudiant: selection.rows[0].data.etudiant.id,
          annee: this.annee,
          parcours: this.parcours,
          semestre: this.semestre
        }
        if (queryOptions.annee !== undefined && queryOptions.parcours !== undefined && queryOptions.semestre !== undefined) {
          Loading.show()
          this.$store.dispatch('etudiant/printAttestation', queryOptions)
            .then((res) => {
              console.log("pdf's url :", process.env.API_BASE_URL + res.url)
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
              this.$alert.error("Cet étudiant ne peut pas avoir d'Attestation de Réussite")
              console.log(err)
            })
        }
      },
      printPdfFichePresence () {
        let queryOptions = {
          annee: this.annee,
          mention: this.mention,
          parcours: this.parcours,
          semestre: this.semestre
        }
        if (queryOptions.annee !== undefined && queryOptions.parcours !== undefined && queryOptions.semestre !== undefined) {
          Loading.show()
          this.$store.dispatch('etudiant/printFichePresence', queryOptions)
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
      }
    },
    mounted () {
      this.InituploadExcel()
      this.$refs.voirDetailsModal.$on('close', () => {
        this.openDetailsEtudiantModal = false
      })
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

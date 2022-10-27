<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div class="layout-padding">
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
          <q-btn color="primary" icon="assignment" @click="openModalReinscription(selection)">
            <span class="gt-sm">Réinscrire </span>
          </q-btn>
          <!--<q-btn color="secondary" icon="assignment_ind" @click="voirDetailEtudiant(selection)">-->
            <!--<span class="gt-sm">Voir details</span>-->
          <!--</q-btn>-->
        </template>

        <!--<template slot="col-etat" slot-scope="item">
          <q-chip v-if="item.data === 'Disponible'" tag color="green">Disponible</q-chip>
          <q-chip v-else tag color="red">Non Disponible</q-chip>
        </template>-->

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
                <div style="margin: 0;font-size: 24px" class="light-paragraph">Réinscription de  {{ etudiant.fullName }}</div>
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
                  v-model="annee"
                  :options="anneeOptions"
                />
              </div>
              <div class="col-md-6">
                <q-select
                  multiple
                  style="margin-top: 0;"
                  color="primary"
                  float-label="Semestre *"
                  v-model="semestres"
                  :options="semestreOptions"
                />
              </div>
            </div>
            <div class="row sm-gutter">
              <div class="col-md-6">
                <q-select
                  style="margin-top: 0;"
                  color="primary"
                  float-label="Mention *"
                  v-model="mention"
                  :options="mentionOptions"
                />
              </div>
              <div class="col-md-6">
                <q-select
                  style="margin-top: 0;"
                  color="primary"
                  float-label="Parcours *"
                  v-model="parcours"
                  :options="parcoursOptions"
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
            <div class="flex flex-center">
              <q-btn :disable="!allFormFill" color="primary" style="height: 50px;" rounded push class="col-md-7 col-sm-12 col-12"
                     @click="reInscrireEtudiant()">Réinscrire l'étudiant
              </q-btn>
            </div>
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
  import { map, last, pick } from 'lodash'
  import { required, between } from 'vuelidate/lib/validators'
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
        semestres: [],
        semestreOptions: [],
        semestreCode: '',
        parcours: '',
        parcoursOptions: [],
        mentionLibelle: '',
        // toogling all selection in datatable
        selectAll: false,
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
    computed: {
      allFormFill: function () {
        return this.annee !== '' && this.mention !== '' && this.parcours !== '' && this.semestres !== []
      }
    },
    watch: {
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
                // console.log('Parcours', parcours)
                this.parcoursOptions.push(parcours)
              })
            })
            .catch((err) => {
              console.log(err)
            })
        }
      },
      annee: function (annee) {
        this.refresh(() => {
          // console.log('Refresh finished')
        }, annee)
        this.$store.dispatch('anneeuniversitaire/getAnneeUniversitaireById', annee)
          .then((res) => {
            this.anneeCode = res.code
          })
          .catch((err) => {
            console.log(err)
          })
        this.$store.dispatch('semestre/getSemestreByIdAnneeUniversitaire', annee)
          .then((res) => {
            // console.log('semestre', res)
            this.semestreOptions = []
            map(res, s => {
              let semestre = {
                label: s.code,
                value: s.semestrePK.id,
                icon: 'today'
              }
              this.semestreOptions.push(semestre)
            })
          })
      }
    },
    methods: {
      refresh (done, annee) {
        setTimeout(() => {
          this.$store.dispatch('inscription/getAllInscriptionAdministrativeByAnneeUniversitaire', annee)
            .then((res) => {
              // console.log(res)
              this.etudiants = []
              map(res, (et) => {
                et.adresse = et.etudiant.idPersonne.adresse
                et.tel = et.etudiant.idPersonne.tel
                et.sexe = et.etudiant.idPersonne.sexe
                et.fullName = et.etudiant.idPersonne.nom + ' ' + et.etudiant.idPersonne.prenom
                et.matricule = et.etudiant.numeroMatricule
                et.photo = et.etudiant.idPersonne.urlPhoto
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
        console.log('Selection', selection)
        this.initModal()
        let etudiantInscrire = map(selection.rows, (row) => pick(row, 'data'))
        console.log('Inscription', etudiantInscrire[0].data)
        this.etudiant = etudiantInscrire[0].data
        console.log('Etudiant selectionne', this.etudiant.etudiant.id)
        this.reinscriptionModal = true
      },
      reInscrireEtudiant () {
        if (this.allFormFill) {
          let field = {
            idAnneeUniversitaire: this.annee,
            idParcours: this.parcours,
            tabIdSemestre: this.semestres,
            idEtudiant: this.etudiant.etudiant.id
          }
          console.log('Field', field)
          this.$store.dispatch('inscription/findInscriptionEtudiantPedagogique', field)
            .then((res) => {
              console.log('Resultat check etudiant', res)
              if (res.length !== 0) {
                this.$alert.error('Cet étudiant est déjà inscrit dans ce semestre')
                this.reinscriptionModal = false
                return false
              }
              else {
                this.dossier = this.quitus.sport && this.quitus.logement && this.quitus.bibliotheque
                let reInscription = {
                  bordereauNumero: this.bordereau.numero,
                  bordereauDate: this.bordereau.date,
                  bordereauMontant: this.bordereau.montant,
                  dossierComplet: this.dossier,
                  bourseNature: this.bourse.nature,
                  bourseMontant: this.bourse.montant,
                  bourseTaux: this.bourse.taux,
                  dateInscription: new Date(),
                  idAnneeUniversitaire: this.annee,
                  idParcours: this.parcours,
                  tabIdSemestre: this.semestres,
                  idEtudiant: this.etudiant.etudiant.id
                }
                // console.log('Reinscription', reInscription)
                this.$store.dispatch('inscription/reInscrireEtudiant', reInscription)
                  .then((reInscription) => {
                    // console.log('Inscription créée', reInscription)
                    this.$alert.success('L\'étudiant a bien étéréinscrit')
                    this.reinscriptionModal = false
                    // this.$router.push('/scolarite/inscription')
                  })
                  .catch((err) => {
                    console.log(err)
                    this.$alert.error('Erreur lors de la réinscription de l\'étudiant')
                  })
              }
            })
            .catch((err) => {
              console.log(err)
            })
        }
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
      this.refresh(() => {
        // console.log('Init finished')
      }, this.annee)
      this.$store.dispatch('anneeuniversitaire/getAllAnneeUniversitaire')
        .then((res) => {
          map(res, a => {
            let annee = {
              label: a.code,
              value: a.id,
              icon: 'date_range'
            }
            this.anneeOptions.push(annee)
            this.annee = last(res).id
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

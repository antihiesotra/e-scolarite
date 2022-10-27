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
          <q-btn color="primary" icon="assignment" @click="openInscriptionModal(selection)">
            <span class="gt-sm">Inscrire </span>
          </q-btn>
          <q-btn color="secondary" icon="assignment_ind" @click="detailsEtudiant(selection)">
            <span class="gt-sm">Voir details</span>
          </q-btn>
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
          @click="$router.push('/inscription/administrative')"
          class="animate-pop"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Revenir à la liste des étudiants inscrits dans le composant</q-tooltip>
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
    <q-modal @open="setProps()" ref="voirDetails" maximized v-model="openDetailsEtudiantModal">
      <details-inscription ref="voirDetailsModal" :etudiantDetails="etudiantDetails2"></details-inscription>
    </q-modal>
    <q-modal ref="inscriptionModal" class="_inscriptionModal" v-model="inscriptionModal"
             :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '50vw', minHeight: '85vh'}">
      <q-modal-layout>
        <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey;">
          <div class="text-center">
            <div class="col-sm-12 layout-padding ">
              <div style="margin: 0;font-size: 24px" class="light-paragraph">Inscription  {{ etudiant.fullName }}</div>
            </div>
          </div>
          <q-btn flat round small @click="$refs.inscriptionModal.close()" style="position: absolute;top: 1em;right: 1em">
            <q-icon name="close" />
          </q-btn>
        </div>
        <div class="_modal-content">
          <div style="font-size: 18px;" class="text-grey-8 text-italic">Identification</div>
          <!--<div class="q-item-sublabel text-italic">Numéro matricule attribuer automatiquement</div>-->
          <!--<q-input v-model="email" type="email" float-label="Numéro matricule de l'étudiant" clearable/>-->
          <h5>MATRICULE #{{ etudiant.numeroMatricule }}</h5>
          <q-select
            color="primary"
            float-label="Année universitaire"
            v-model="annee"
            :options="anneeOptions"
              />
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
            <q-btn color="primary" :disabled="etudiantInscrit" style="height: 50px;" rounded push class="col-md-7 col-sm-12 col-12"
                   @click="inscrireEtudiant()">Inscrire
            </q-btn>
          </div>
        </div>
      </q-modal-layout>
    </q-modal>
  </div>
</template>

<script>
  /* eslint-disable no-sequences */

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
    QModal,
    QModalLayout,
    QInput,
    QField,
    QDatetime,
    QFab
  } from 'quasar'
  import DetailsInscription from './details/DetailsInscription'
  import { map, pick } from 'lodash'
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
      QModal,
      QModalLayout,
      QInput,
      QField,
      QDatetime,
      QFab,
      DetailsInscription
    },
    data () {
      return {
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        dayNames: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        inscriptionModal: false,
        etudiants: [],
        etudiant: '',
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
        // Data for modal
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
        // toogling all selection in datatable
        selectAll: false,
        annee: '',
        anneeOptions: [],
        etudiantInscrit: false,
        openDetailsEtudiantModal: false,
        etudiantDetails: '',
        etudiantDetails2: ''
      }
    },
    methods: {
      setProps () {
        this.etudiantDetails2 = this.etudiantDetails
      },
      refresh (done) {
        setTimeout(() => {
          this.$store.dispatch('getFonction')
            .then((fonction) => {
              const {composant} = fonction.vars
              this.config.title = '<span style="color: rgba(0,0,0,0.54);font-weight: bold;font-size: 95%;">Liste des étudiants autorisés à s\'inscrire administrativement dans le composant ' + composant.libelle + '</span>'
            })
            .catch((err) => {
              console.log('Storage composant error ', err)
            })
          this.$store.dispatch('inscription/getAllEtudiants')
            .then((res) => {
              console.log(res)
              this.etudiants = []
              map(res, (et) => {
                et.adresse = et.idPersonne.adresse
                et.tel = et.idPersonne.tel
                et.sexe = et.idPersonne.sexe
                et.fullName = et.idPersonne.nom + ' ' + et.idPersonne.prenom
                et.photo = et.idPersonne.urlPhoto
                this.etudiants.push(et)
              })
            })
            .catch((err) => {
              console.log(err)
            })
          done()
        }, 1000)
      },
      openInscriptionModal (selection) {
        this.initModal()
        let etudiantInscrire = map(selection.rows, (row) => pick(row, 'data'))
        console.log('Inscription', etudiantInscrire[0].data)
        this.etudiant = etudiantInscrire[0].data
        this.inscriptionModal = true
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
      inscrireEtudiant () {
        let inscription = {
          inscriptionAdministrativePK: {
            idEtudiant: this.etudiant.id,
            idAnneeUniversitaire: this.annee
          },
          bordereauNumero: this.bordereau.numero,
          bordereauDate: this.bordereau.date,
          bordereauMontant: this.bordereau.montant,
          quitusSport: this.quitus.sport,
          quitusLogement: this.quitus.logement,
          quitusBibliotheque: this.quitus.bibliotheque,
          bourseNature: this.bourse.nature,
          bourseMontant: this.bourse.montant,
          bourseTaux: this.bourse.taux,
          dateInscription: new Date(),
          anneeUniversitaire: this.annee,
          etudiant: this.etudiant.id
        }
        this.$store.dispatch('inscription/inscrireEtudiantAdministrativement', inscription)
          .then((inscription) => {
            console.log('Inscription créée', inscription)
            this.$alert.success('L\'étudiant a été bien inscrit')
            this.inscriptionModal = false
            this.$router.push('/scolarite/inscription/administrative')
          })
          .catch((err) => {
            console.log(err)
            this.$alert.error('Erreur lors de l\'inscription de l\'étudiant')
          })
      },
      detailsEtudiant (selection) {
        console.log('Etudiant', selection.rows[0].data)
        this.openDetailsEtudiantModal = true
        this.etudiantDetails = selection.rows[0].data
      },
      toggleSelect () {
        for (let i = 0; i < this.$refs.datatable.rowSelection.length; i++) {
          this.$set(this.$refs.datatable.rowSelection, i, !this.selectAll)
        }
        this.selectAll = !this.selectAll
      },
      initModal () {
        // eslint-disable-next-line no-unused-expressions
        this.numeroMatricule = '',
        this.bordereau.numero = '',
        this.bordereau.date = '',
        this.bordereau.montant = '',
        this.bourse.nature = '',
        this.bourse.taux = '',
        this.bourse.montant = '',
        this.quitus.logement = false,
        this.quitus.sport = false,
        this.quitus.bibliotheque = false,
        this.annee = '',
        this.etudiantInscrit = false
      }
    },
    watch: {
      annee: function (annee) {
        let field = {
          annee: annee,
          etudiant: this.etudiant.id
        }
        this.$store.dispatch('inscription/isInscritAdmnistrativeEtudiant', field)
          .then((res) => {
            if (res !== null) {
              let alert = Alert.create({
                html: 'L\'étudiant est déjà inscrit dans cette année universitaire',
                enter: 'bounceInLeft',
                leave: 'bounceOutRight',
                color: 'red',
                position: 'top-right',
                icon: 'warning'
              })
              setTimeout(function () {
                alert.dismiss()
              }, 4000)
              this.etudiantInscrit = true
            }
            else {
              this.etudiantInscrit = false
            }
          })
          .catch((err) => {
            if (err) this.etudiantInscrit = false
          })
      }
    },
    mounted () {
      this.refresh(() => {
        console.log('Init finished')
      })
      this.$store.dispatch('anneeuniversitaire/getAllAnneeUniversitaire')
        .then((res) => {
          map(res, (a) => {
            let annee = {
              label: a.code,
              value: a.id,
              icon: 'date_range'
            }
            this.anneeOptions.push(annee)
          })
        })
        .catch((err) => {
          console.log(err)
        })
      this.$refs.voirDetailsModal.$on('close', () => {
        this.openDetailsEtudiantModal = false
      })
      /* this.$store.dispatch('listEtudiants') */
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

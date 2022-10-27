<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div class="layout-padding">
    <div class="layout-view">
      <div v-if="isReady">
        <!-- your content -->
        <div style="padding-left: 10px;padding-right: 10px;">
          <q-select
            color="primary"
            float-label="Année universitaire"
            v-model="annee"
            :options="anneeOptions"
          />
        </div>
        <q-card class="animate-fade">
          <q-data-table
            :data="etudiants"
            :config="config"
            :columns="columns"
            :refresh="refresh"
            class="bg-white"
          >
            <!-- Custom renderer when user selected one or more rows -->
            <template slot="selection" slot-scope="selection">
              <q-btn color="primary" icon="assignment_ind" @click="detailsEtudiant(selection)">
                <span class="gt-sm">Voir details</span>
              </q-btn>
              <q-btn color="negative" icon="delete" @click="supprimerEtudiant(selection)">
                <span class="gt-sm">Supprimer</span>
              </q-btn>
            </template>

            <!--<template slot="col-etat" slot-scope="item">
              <q-chip v-if="item.data === 'Disponible'" tag color="green">Disponible</q-chip>
              <q-chip v-else tag color="red">Non Disponible</q-chip>
            </template>-->

            <template slot="col-photo" slot-scope="item">
              <q-item>
                <q-item-side avatar="statics/photovide.png" />
                <q-item-side right icon="file_upload" />
              </q-item>
            </template>
            <template slot="col-dossier" slot-scope="item">
              <q-chip v-if="item.data" tag color="green" style="font-weight: bold;">Complet</q-chip>
              <q-chip v-else tag color="orange" style="font-weight: bold;">Incomplet</q-chip>
            </template>
          </q-data-table>
        </q-card>
        <q-fixed-position corner="bottom-left" :offset="[18, 18]">
          <q-fab color="primary" push icon="settings" direction="right">
            <q-btn
              round
              color="primary"
              @click="$router.push('/scolarite/etudiant/ajout')"
              class="animate-pop"
            >
              <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Ajouter un étudiant</q-tooltip>
              <q-icon name="person_add" />
            </q-btn>
            <q-btn
              round
              color="primary"
              @click="$router.push('/scolarite/inscription/administrative/ajout')"
              class="animate-pop"
            >
              <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Inscrire un étudiant</q-tooltip>
              <q-icon name="assignment ind" />
            </q-btn>
          </q-fab>
        </q-fixed-position>
      </div>
      <template v-else>
        <div style="height: 80vh" class="row justify-center items-center">
          <q-spinner
            color="primary"
            size="100"
          />
        </div>
      </template>
      <q-modal @open="setProps()" ref="voirDetails" maximized v-model="openDetailsEtudiantModal">
        <voir-details ref="voirDetailsModal" :etudiantDetails="etudiantDetails2"></voir-details>
      </q-modal>
      <q-modal ref="deleteModal" class="_deleteModal" v-model="openSupprimer"
               :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '50vw', minHeight: '45vh'}">
        <q-modal-layout>
          <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey">
            <div class="">
              <div class="col-sm-12 layout-padding ">
                <div style="margin: 0;font-size: 24px" class="text-negative">Supprimer l'étudiant ?</div>
              </div>
            </div>
            <q-btn flat round small @click="$refs.deleteModal.close()" style="position: absolute;top: 1em;right: 1em">
              <q-icon name="close" />
            </q-btn>
          </div>
          <div class="layout-padding">
            <div class="text-grey text-italic">Voulez vous vraiment annuler l'inscription de cet étudiant ?</div>
            <div class="text-grey text-italic">RAKOTOARISOA Jean</div>
            <q-input
              v-model="motif"
              color="tertiary"
              type="textarea"
              float-label="Motif de l'annulation de l'inscription"
              :min-rows="5"
            />
          </div>
          <div slot="footer" :class="'_no-shadow'" style="padding: 15px 20px;">
            <div class="flex justify-end">
              <q-btn color="tertiary" style="height: 45px;" rounded class=" col-md-3 col-sm-12 col-12"
                     @click="$refs.deleteModal.close()">Non
              </q-btn>&nbsp;&nbsp;
              <q-btn color="negative" style="height: 45px;" rounded class="col-md-3 col-sm-12 col-12"
                     @click="deleteEtudiant()">Oui
              </q-btn>
            </div>
          </div>
        </q-modal-layout>
      </q-modal>
    </div>
  </div>
</template>

<script>
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
    QFab,
    QSpinner
  } from 'quasar'

  import VoirDetails from '../../etudiant/VoirDetailsModal.vue'
  import { map, last } from 'lodash'

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
      QFab,
      VoirDetails,
      QSpinner
    },
    data () {
      return {
        etudiants: [],
        annee: '',
        anneeCode: '',
        anneeOptions: [],
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
          },
          {
            label: 'Dossier',
            field: 'dossier',
            width: '100px',
            filter: true,
            sort: true,
            type: 'string'
          }
        ],
        openDetailsEtudiantModal: false,
        openSupprimer: false,
        motif: '',
        isReady: false,
        etudiantDetails: '',
        etudiantDetails2: ''
      }
    },
    methods: {
      setProps () {
        this.etudiantDetails2 = this.etudiantDetails
      },
      refresh (done, annee) {
        setTimeout(() => {
          this.$store.dispatch('inscription/getAllInscriptionAdministrativeByAnneeUniversitaire', annee)
            .then((res) => {
              console.log(res)
              this.isReady = true
              this.etudiants = []
              map(res, (et) => {
                et.adresse = et.etudiant.idPersonne.adresse
                et.tel = et.etudiant.idPersonne.tel
                et.sexe = et.etudiant.idPersonne.sexe
                et.fullName = et.etudiant.idPersonne.nom + ' ' + et.etudiant.idPersonne.prenom
                et.matricule = et.etudiant.numeroMatricule
                et.dossier = (et.quitusSport && et.quitusLogement && et.quitusSport)
                this.etudiants.push(et)
              })
            })
            .catch((err) => {
              console.log(err)
            })
          done()
        }, 1000)
      },
      detailsEtudiant (selection) {
        this.openDetailsEtudiantModal = true
        this.etudiantDetails = selection.rows[0].data
      },
      supprimerEtudiant (selection) {
        this.openSupprimer = true
        /* Dialog.create({
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
        }) */
      }
    },
    watch: {
      annee: function (annee) {
        this.refresh(() => {
          console.log('Refresh finished')
        }, annee)
        this.$store.dispatch('anneeuniversitaire/getAnneeUniversitaireById', annee)
          .then((res) => {
            this.anneeCode = res.code
            this.config.title = '<span style="color: rgba(0,0,0,0.54);font-weight: bold;font-size: 95%;">Listes des étudiants inscrits dans l\'année unversitaire ' + this.anneeCode + '</span>'
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    mounted () {
      this.refresh(() => {
        console.log('Init finished')
      }, this.annee)
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
          this.annee = last(res).id
        })
        .catch((err) => {
          console.log(err)
        })
      this.$refs.voirDetailsModal.$on('close', () => {
        this.openDetailsEtudiantModal = false
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

</style>

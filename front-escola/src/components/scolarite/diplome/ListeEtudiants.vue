<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div class="layout-padding">
    <div class="layout-view">
      <!-- your content -->
      <q-card v-if="isReady">
        <q-data-table
          :data="etudiants"
          :config="config"
          :columns="columns"
          :refresh="refresh"
          class="bg-white"
        >
          <template slot="selection" slot-scope="selection">
            <q-btn color="primary" icon="school" @click="openAttributionModal(selection)">
              <span class="gt-sm">Attribuer un diplôme</span>
            </q-btn>
          </template>
          <template slot="col-photo" slot-scope="item">
            <q-item>
              <q-item-side :avatar="item.row.photo"></q-item-side>
            </q-item>
          </template>
        </q-data-table>
      </q-card>

      <template v-else>
        <div style="height: 80vh" class="row justify-center items-center">
          <q-spinner
            color="primary"
            size="100"
          ></q-spinner>
        </div>
      </template>

      <!-- Modal attribution -->
      <q-modal v-model="attributionModal"
               ref="attributionModal"
               :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '50vw', minHeight: '45vh'}">
        <q-modal-layout>
          <div slot="header">
            <div class="col-sm-12 layout-padding ">
              <div style="margin: 0;font-size: 24px;" class="text-primary">Liste des diplômes attribuables</div>
            </div>
          </div>
          <div class="layout-padding">
            <div v-if="diplomesAttribuables.length === 0">
              Aucune diplome attribuable pour cet étudiant. Veuillez vérifier son cursus pour voir ce qui manque
            </div>
            <div v-else class="row justify-around">
              <div v-for="diplome in diplomesAttribuables">
                <q-btn color="primary" @click="openInfoAttributionModal(diplome.id)">{{ diplome.libelle }}</q-btn>
              </div>
            </div>
          </div>
          <div slot="footer">
            <q-btn @click="$refs.attributionModal.close()" class="float-right" color="negative">Fermer</q-btn>
          </div>
        </q-modal-layout>
      </q-modal>

      <!-- Modal info attribution -->
      <q-modal v-model="infoAttributionModal"
               ref="infoAttributionModal"
               :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '50vw', minHeight: '45vh'}">
        <q-modal-layout>
          <div slot="header">
            <div class="col-sm-12 layout-padding ">
              <div style="margin: 0;font-size: 24px;" class="text-primary">Informations du diplôme</div>
            </div>
          </div>
          <div class="layout-padding">
            <q-datetime v-model="diplomeInfo.session" type="date" float-label="Session"></q-datetime>
            <q-input v-model="diplomeInfo.reference" type="text" float-label="Rérerence"></q-input>
            <q-input v-model="diplomeInfo.observation" type="text" float-label="Observation"></q-input>
            <q-input v-model="diplomeInfo.numeroDOrdre" type="text" float-label="Numéro d'ordre"></q-input>

          </div>
          <div slot="footer" class="row">
            <q-btn color="primary" @click="attribuerDiplome()">Attribuer</q-btn>
            <q-btn color="negative" @click="$refs.infoAttributionModal.close()">Fermer</q-btn>
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
    Alert,
    QItem,
    QItemSide,
    QSelect,
    QTooltip,
    QFixedPosition,
    QModal,
    QModalLayout,
    QInput,
    QDatetime,
    QSpinner,
    QFab
  } from 'quasar'
  import { map } from 'lodash'
  import Axios from '../../../configs/axios'

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
      QSelect,
      QTooltip,
      QFixedPosition,
      QModal,
      QModalLayout,
      QInput,
      QDatetime,
      QSpinner,
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
              singular: 'étudiant séléctionné.',
              plural: 'étudiants séléctionnés.'
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
            width: '150px',
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
            width: '50px',
            filter: true,
            sort: true,
            type: 'string'
          }
        ],
        isReady: false,
        attributionModal: false,
        infoAttributionModal: false,
        diplomesAttribuables: [],
        selectedEtudiant: {},
        selectedDiplomeId: '',
        diplomeInfo: {
          session: '',
          reference: '',
          observation: '',
          numeroDOrdre: ''
        }
      }
    },
    computed: {
    },
    methods: {
      refresh (done) {
        this.$store.dispatch('getFonction')
          .then((fonction) => {
            const {composant} = fonction.vars
            this.config.title = '<span style="color: rgba(0,0,0,0.54);font-weight: bold;font-size: 95%;">Listes des étudiants du composant ' + composant.libelle + '</span>'
            this.$store.dispatch('etudiant/getAllEtudiantByComposant', composant.id)
              .then((res) => {
                this.isReady = true
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
          })
          .catch((err) => {
            console.log(err)
          })
        done()
      },
      openAttributionModal (etudiant) {
        // idEtudiant: etudiant.rows[0].data.id
        console.log('Etudiant séléctionné: ', etudiant.rows[0].data)
        Axios.get(`/api/delivrance-diplomes/etudiant/${etudiant.rows[0].data.id}/attribuables`)
          .then((res) => {
            this.diplomesAttribuables = res.data
            this.attributionModal = true
            this.selectedEtudiant = etudiant.rows[0].data
          })
          .catch((err) => {
            console.log('Une erreur est survenue' + err)
          })
      },
      attribuerDiplome () {
        Axios.post(`/api/delivrance-diplomes/etudiant/${this.selectedEtudiant.id}/diplome/${this.selectedDiplomeId}`, this.diplomeInfo)
          .then((res) => {
            this.$refs.infoAttributionModal.close()
            this.$refs.attributionModal.close()
            this.$alert.success('L\'attribution a été effectué avec succès')
            console.log('SUCCESS', res)
          })
          .catch((err) => {
            this.$alert.error('Echec lors de l\'attribution')
            console.log('ERROR', err)
          })
      },

      openInfoAttributionModal (idDiplome) {
        this.selectedDiplomeId = idDiplome
        this.infoAttributionModal = true
      }
    },
    mounted () {
      this.refresh(() => {
        console.log('Init finished')
      })

      // Action a effectuer lors de la fermeture du modal attribution diplôme
      this.$refs.attributionModal.$on('close', () => {
        // Quand le modal est fermé, on vide la liste des diplomes attribuables
        this.diplomesAttribuables = []
        this.selectedEtudiant = {}
      })

      // Action a effectuer lors de la fermeture du modal attribution diplôme
      this.$refs.infoAttributionModal.$on('close', () => {
        // Quand le modal est fermé, on vide le diplome selectionné et les autres informations à propos de l'attribution
        this.selectedDiplomeId = ''
        this.diplomeInfo.session = ''
        this.diplomeInfo.reference = ''
        this.diplomeInfo.observation = ''
        this.diplomeInfo.numeroDOrdre = ''
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

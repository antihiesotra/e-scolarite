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
        <!-- Custom renderer when user selected one or more rows -->
        <template slot="selection" slot-scope="selection">
          <q-btn color="primary" icon="assignment" @click="openModalReinscription(selection)">
            <span class="gt-sm">Réinscription administrative</span>
          </q-btn>          
          <q-btn color="primary" icon="assignment" @click="openModalPedagogique(selection)">
            <span class="gt-sm">Réinscription pédagogique</span>
          </q-btn>
          <q-btn color="secondary" icon="assignment_ind" @click="detailsEtudiant(selection)">
            <span class="gt-sm">Voir details</span>
          </q-btn>
          <q-btn color="negative" icon="delete" @click="supprimerEtudiant(selection)">
            <span class="gt-sm">Supprimer</span>
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
          @click="$router.push('/scolarite/etudiant/ajout')"
          class="animate-pop"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Inscription</q-tooltip>
          <q-icon name="person_add" />
        </q-btn>
        <q-btn
          round
          color="primary"
          @click="$router.push('/scolarite/inscription/pedagogique/ajout')"
          class="animate-pop"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Réinscription multiple</q-tooltip>
          <q-icon name="assignment ind" />
        </q-btn>
        <q-btn
          round
          color="primary"
          @click="$refs.uploadExcelModal.open()"
          class="animate-pop"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Inscription administrative multiple</q-tooltip>
          <q-icon name="fa-file-excel-o" />
        </q-btn>
        <q-btn
          round
          color="primary"
          @click="$refs.uploadPExcelModal.open()"
          class="animate-pop"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Inscription pedagogique multiple</q-tooltip>
          <q-icon name="fa-file-excel-o" />
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
            :options="parcoursOptionsExcel"
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

    <!-- Modal Upload Excel pedagogique -->
    <q-modal ref="uploadPExcelModal" :content-css="{minWidth: '40vw', minHeight: '40vh'}">
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
            :options="parcoursOptionsExcel"
          />        
        </div>
      </div>
      <div class="_modal-content">
        <form method="POST" enctype="multipart/form-data" id="filePUploadForm">
          <div class="box text-center content-center">
            <input type="file" name="uploadPfile" id="uploadP_file" class="inputfile inputfile-4" data-multiple-caption="{count} files selected" multiple />
            <label for="uploadP_file"><figure><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg></figure> <span>Choisir un fichier&hellip;</span></label>
          </div>
        </form>
      </div>
      <div class="layout-padding text-center content-center" style="margin-top: 40px">
        <button class="q-btn row inline flex-center q-focusable q-hoverable relative-position q-btn-rectangle q-btn-standard bg-primary text-white" type="submit" id="btnPSubmit">Importer</button>
        <q-btn @click="$refs.uploadPExcelModal.close()">Annuler</q-btn>
      </div>
    </q-modal>

    <q-modal @open="setProps()" ref="voirDetails" maximized v-model="openDetailsEtudiantModal">
      <voir-details ref="voirDetailsModal" :etudiantDetails="etudiantDetails"></voir-details>
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
          <div class="text-grey text-italic">{{ etudiantToDeleteFullName }}</div>
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
    <q-modal ref="reinscriptionModal" class="_inscriptionModal" v-model="reinscriptionModal"
              :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '50vw', minHeight: '85vh'}">
      <q-modal-layout>
        <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey;">
          <div class="text-center">
            <div class="col-sm-12 layout-padding ">
              <div style="margin: 0;font-size: 24px" class="light-paragraph">Réinscription de  {{ etudiantTorReinscrireFullName }}</div>
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
          <div class="row sm-gutter">
            <div class="col-sm-6">
              <div style="font-size: 18px;" class="text-grey-8 text-italic">Redoublement</div>
            </div>
            <div class="col-sm-6">
              <q-select
                style="margin-top: 0;"
                color="primary"
                float-label="Code de redoublement"
                v-model="codeRedoublement"
                :options="codeRedoublementOptions"
              />
            </div>
          </div>
        </div>
        <!--<div class="_modal-content">
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
        </div> -->
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
              <div style="margin: 0;font-size: 24px" class="light-paragraph">Réinscription pedagogique de  {{ etudiantTorReinscrireFullName }}</div>
            </div>
          </div>
          <q-btn flat round small @click="$refs.reinscriptionPedagogiqueModal.close()" style="position: absolute;top: 1em;right: 1em">
            <q-icon name="close" />
          </q-btn>
        </div>
        <div class="_modal-content">
          <div class="content-center">
            <div style="font-size: 18px;" class="text-grey-8 text-italic">Scolarité - Réinscription</div>
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
    QFab,
    QDatetime,
    QField,
    QList,
    QListHeader
  } from 'quasar'

  import VoirDetails from '../../etudiant/VoirDetailsModal.vue'
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
      QFab,
      QDatetime,
      QField,
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
        ueExcels: [],
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
        ue: '',
        ueOptions: [],
        ueExcel: [],
        parcoursOptionsExcel: [],
        openDetailsEtudiantModal: false,
        openSupprimer: false,
        motif: '',
        semestreCode: '',
        semestreCodeR: '',
        mentionLibelle: '',
        mentionLibelleA: '',
        anneeReinsciptionA: '',
        anneeOptionsA: [],
        semestresReinscriptionA: '',
        semestreOptionsA: [],
        mentionReinscriptionA: '',
        mentionOptionsA: [],
        parcoursReinscriptionA: '',
        parcoursOptionsA: [],
        uesReinscriptionA: [],
        ueOptionsA: [],
        parcoursLibelle: '',
        etudiantDetails: '',
        etudiantDetails2: '',
        etudiantToDelete: '',
        etudiantToDeleteFullName: '',
        etudiantTorReinscrireFullName: '',
        composant: '',
        reinscriptionPedagogiqueModal: false,
        reinscriptionModal: false,
        semestres: [],
        ues: [],
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
        codeRedoublement: '',
        codeRedoublementOptions: [
          {label: 'N', value: 'N'},
          {label: 'R', value: 'R'},
          {label: 'T+', value: 'T+'}
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
        this.ueOptions = [{
          label: 'Tous',
          value: 0,
          icon: 'date_range'
        }]
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
      anneeExcel: function (anneeExcel) {
        this.$store.dispatch('anneeuniversitaire/getAnneeUniversitaireById', anneeExcel)
          .then((res) => {
            this.anneeCode = res.code
          })
          .catch((err) => {
            console.log(err)
          })
        this.$store.dispatch('semestre/getSemestreByIdAnneeUniversitaire', anneeExcel)
          .then((res) => {
            this.semestreOptions = []
            map(res, s => {
              let semestreR = {
                label: s.code,
                value: s.semestrePK.id,
                icon: 'today'
              }
              this.semestreOptions.push(semestreR)
            })
            this.semestreExcel = first(res).semestrePK.id
          })
      },
      semestreExcel: function () {
        let semestrePk = {
          id: this.semestreExcel,
          idAnneeUniversitaire: this.anneeExcel
        }
        this.$store.dispatch('semestre/getSemestreBySemestrePk', semestrePk)
          .then((res) => {
            this.semestreCodeR = res.code
          })
          .catch((err) => {
            console.log(err)
          })
      },
      mentionExcel: function (mentionExcel) {
        if (mentionExcel !== '') {
          this.parcoursOptionsExcel = []
          this.$store.dispatch('mention/getMentionById', mentionExcel)
            .then((res) => {
              this.mentionLibelleA = res.libelle
              this.mentionExcel = res.id
            })
            .catch((err) => {
              console.log(err)
            })
          this.$store.dispatch('parcours/getParcoursByMention', mentionExcel)
            .then((res) => {
              map(res, p => {
                let parcoursR = {
                  label: p.libelle,
                  value: p.id,
                  icon: 'bubble_chart'
                }
                this.parcoursOptionsExcel.push(parcoursR)
              })
              this.parcoursExcel = first(res).id
            })
            .catch((err) => {
              console.log(err)
            })
        }
      },
      parcoursExcel: function (parcoursExcel) {
        this.ueOptions = []
        this.$store.dispatch('parcours/getParcoursById', parcoursExcel)
          .then((res) => {
            this.parcoursLibelle = res.libelle
            this.parcoursExcel = res.id
          })
          .catch((err) => {
            console.log(err)
          })
        let paramsUe = {
          idParcours: this.parcoursExcel,
          idSemestre: this.semestreExcel,
          idAnneeUniversitaire: this.anneeExcel
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
      input (newVal) {
        console.log('newval')
        /* if (newVal.find(item => item === 'all')) {
          if (this.selected.find(item => item === 'all')) {
            newVal.splice(newVal.indexOf('all'), 1)
            this.selected = newVal
          }
          else {
            this.selected = this.options.map(option => option.value)
          }
        }
        else {
          if (this.selected.find(item => item === 'all')) {
            this.selected = []
          }
          else {
            if (newVal.length === this.options.length - 1) {
              this.selected = this.options.map(option => option.value)
            }
            else {
              this.selected = newVal
            }
          }
        } */
      },
      sendDataReinscriptionAdministrative () {
        this.$refs.reinscriptionModal.close()
        Loading.show()
        var form = $('#formaReinscriptionAdministrative')[0]
        var data = new FormData(form)
        data.append('idAnneeUniversitaire', this.anneeReinsciptionA)
        data.append('idParcours', this.parcoursReinscriptionA)
        data.append('idSemestre', this.semestresReinscriptionA)
        data.append('idEtudiant', this.etudiantToDelete.rows[0].data.etudiant.id)
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
              dataInscriptionPedagogique.append('codeRedoublement', this.codeRedoublement)
              /* dataInscriptionPedagogique.append('bourseNature', this.bourse.nature)
              dataInscriptionPedagogique.append('bourseMontant', this.bourse.montant)
              dataInscriptionPedagogique.append('bourseTaux', this.bourse.taux) */
              dataInscriptionPedagogique.append('idAnneeUniversitaire', this.anneeReinsciptionA)
              dataInscriptionPedagogique.append('idParcours', this.parcoursReinscriptionA)
              dataInscriptionPedagogique.append('idSemestre', this.semestresReinscriptionA)
              dataInscriptionPedagogique.append('idEtudiant', this.etudiantToDelete.rows[0].data.etudiant.id)
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
        this.$refs.reinscriptionPedagogiqueModal.close()
        Loading.show()
        var form = $('#formaReinscriptionPedagogique')[0]
        var data = new FormData(form)
        data.append('idAnneeUniversitaire', this.anneeReinsciptionA)
        data.append('idParcours', this.parcoursReinscriptionA)
        data.append('idSemestre', this.semestresReinscriptionA)
        data.append('idEtudiant', this.etudiantToDelete.rows[0].data.etudiant.id)
        this.$store.dispatch('inscription/findInscriptionUeEtudiantPedagogique', data)
          .then((res) => {
            console.log('if')
            if (res.length !== 0) {
              Loading.hide()
              this.$alert.error('Cet étudiant est déjà inscrit dans ce parcours')
              this.reinscriptionPedagogiqueModal = false
              return false
            }
            else {
              var formDataReinscriptionPedagogique = $('#formaReinscriptionPedagogique')[0]
              var dataReinscriptionPedagogique = new FormData(formDataReinscriptionPedagogique)
              dataReinscriptionPedagogique.append('idAnneeUniversitaire', this.anneeReinsciptionA)
              dataReinscriptionPedagogique.append('idParcours', this.parcoursReinscriptionA)
              dataReinscriptionPedagogique.append('idSemestre', this.semestresReinscriptionA)
              dataReinscriptionPedagogique.append('idEtudiant', this.etudiantToDelete.rows[0].data.etudiant.id)
              this.$store.dispatch('inscription/reInscrireEtudiantPedagogiquementUe', dataReinscriptionPedagogique)
                .then((res) => {
                  console.log('retour venant api', res)
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
            }
          })
          .catch((err) => {
            console.log(err)
          })
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
      },
      openModalReinscription (selection) {
        this.initModal()
        this.etudiantDetails = selection.rows[0].data
        this.reinscriptionModal = true
        this.etudiantToDelete = selection
        this.etudiantTorReinscrireFullName = selection.rows[0].data.fullName
      },
      openModalPedagogique (selection) {
        this.initModal()
        this.reinscriptionPedagogiqueModal = true
        this.etudiantToDelete = selection
        this.etudiantDetails = selection.rows[0].data
        this.etudiantTorReinscrireFullName = selection.rows[0].data.fullName
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
              // Envoi mail par etudiant
              this.$store.dispatch('inscription/getAllInscriptionAdministrativeByAnneeUniversitaire', this.anneeExcel)
                .then((res) => {
                  console.log(res)
                  this.isReady = true
                  this.etudiants = []
                  map(res, (et) => {
                    // Get id_personne et email dans inscriptionAdministrative
                    et.id_personne = et.etudiant.idPersonne.id
                    et.email = et.etudiant.idPersonne.email
                    console.log('et.email----:' + et.email)
                    // envoi mail
                    this.$store.dispatch('utilisateur/envoimailbymail', et.email)
                      .then((resmail) => {
                        Alert.create({enter: 'bounceInRight', leave: 'bounceOutRight', color: 'positive', html: 'L\'email a été envoyé avec succès'})
                      })
                      .catch((error) => {
                        this.$alert.error('Veuillez bien vérifier votre connexion Internet et l\'adresse email saisie pour l\'envoi d\'email.')
                        console.log('Liste.vue envoi mail', error)
                      })
                  })
                })
                .catch((err) => {
                  console.log(err)
                })
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
      sendPToServer () {
        this.$refs.uploadExcelModal.close()
        Loading.show()
        var form = $('#filePUploadForm')[0]
        var data = new FormData(form)
        data.append('annee', this.anneeExcel)
        data.append('semestre', this.semestreExcel)
        data.append('mention', this.mentionExcel)
        data.append('parcours', this.parcoursExcel)
        data.append('composant', this.composant)
        console.log('annee', this.anneeExcel)
        console.log('semestre', this.semestreExcel)
        console.log('mention', this.mentionExcel)
        console.log('parcours', this.parcoursExcel)
        console.log('composant', this.composant)
        this.$store.dispatch('upload/uploadPExcelInscription', data)
          .then((res) => {
            if (res === 'Uploaded') {
              this.refresh(() => {
                Loading.hide()
              })
              this.$refs.uploadPExcelModal.close()
              this.$alert.success('Importation réussie')
            }
            else {
              Loading.hide()
              this.$refs.uploadPExcelModal.close()
              this.$alert.error('Une erreur est survenue lors de l\'importation')
            }
          })
          .catch((err) => {
            Loading.hide()
            console.log('ERROR', err)
            this.$refs.uploadPExcelModal.close()
            this.$alert.error('Une erreur est survenue')
          })
      },
      InituploadExcel () {
        $('#btnSubmit').click((event) => {
          event.preventDefault()
          this.sendToServer()
        })
        $('#btnPSubmit').click((event) => {
          event.preventDefault()
          this.sendPToServer()
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
        let inputP = document.getElementById('uploadP_file')
        let labelP = inputP.nextElementSibling
        let labelValP = label.innerHTML
        inputP.addEventListener('change', (e) => {
          let fileName = ''
          if (this.files && this.files.length > 1) {
            fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length)
          }
          else {
            fileName = e.target.value.split('\\').pop()
          }

          if (fileName) {
            labelP.querySelector('span').innerHTML = fileName
          }
          else {
            labelP.innerHTML = labelValP
          }
        })
        // Firefox bug fix
        inputP.addEventListener('focus', function () { inputP.classList.add('has-focus') })
        inputP.addEventListener('blur', function () { inputP.classList.remove('has-focus') })
      },
      setProps () {
        this.etudiantDetails2 = this.etudiantDetails
      },
      refresh (done) {
        Loading.show()
        setTimeout(() => {
          let field = {
            annee: this.annee,
            semestre: this.semestre,
            parcours: this.parcours
          }
          console.log('Field----------' + field.ue)
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
        this.etudiantToDelete = selection
        this.etudiantToDeleteFullName = selection.rows[0].data.fullName
      },
      deleteEtudiant () {
        let etudiants = this.etudiantToDelete.rows[0].data
        etudiants.motifSuppr = this.motif
        etudiants.supprime = true
        delete etudiants.fullName
        this.$store.dispatch('inscription/deleteEtudiant', etudiants)
          .then((res) => {
            let alert = Alert.create({
              html: 'L\'étudiant ' + etudiants.numeroMatricule + ' est supprimé',
              enter: 'bounceInLeft',
              leave: 'bounceOutRight',
              color: 'green',
              position: 'top-right',
              icon: 'check'
            })
            this.refresh()
            this.openSupprimer = false
            setTimeout(function () {
              alert.dismiss()
            }, 4000)
          })
          .catch((err) => {
            if (err) {
              let alert = Alert.create({
                html: 'L\'étudiant ne peut pas être supprimé',
                enter: 'bounceInLeft',
                leave: 'bounceOutRight',
                color: 'red',
                position: 'top-right',
                icon: 'warning'
              })
              setTimeout(function () {
                alert.dismiss()
              }, 2000)
            }
          })
      }
    },
    mounted () {
      this.InituploadExcel()
      this.$refs.voirDetailsModal.$on('close', () => {
        this.openDetailsEtudiantModal = false
      })
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
          })
          this.annee = last(res).id
          this.anneeReinsciptionA = last(res).id
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
                this.mentionOptionsA.push(mention)
              })
              this.mention = first(res).id
              this.mentionReinscriptionA = first(res).id
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

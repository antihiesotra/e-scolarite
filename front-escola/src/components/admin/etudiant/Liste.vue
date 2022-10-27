<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div class="layout-padding">
    <div class="row" style="padding-left: 10px;padding-right: 10px;">
      <div class="col-sm-3">
        <q-select
          style="margin-top: 0;"
          color="primary"
          float-label="Composant"
          v-model="composant"
          :options="composantOptions"
        />
      </div>
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
          <!-- Custom renderer when user selected one or more rows -->
          <template slot="selection" slot-scope="selection">
            <q-btn color="amber" icon="warning" @click="sanctionnerEtudiant(selection)">
              <span class="gt-sm">Sanctionner</span>
            </q-btn>
            <q-btn color="primary" icon="edit" @click="modifierEtudiant(selection)">
              <span class="gt-sm">Modifier</span>
            </q-btn>
            <q-btn color="negative" icon="delete" @click="supprimerEtudiant(selection)">
              <span class="gt-sm">Supprimer</span>
            </q-btn>
          </template>

          <template slot="col-photo" slot-scope="item">
            <q-item>
              <q-item-side :avatar="item.row.photo" />
              <q-item-side style="cursor:pointer" right icon="file_upload" @click="changeImage()"/>
            </q-item>
          </template>
        </q-data-table>
      </q-card>

      <template v-else>
        <div style="height: 80vh" class="row justify-center items-center">
          <q-spinner
            color="primary"
            size="100"
          />
        </div>
      </template>
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
            <div class="text-grey text-italic">Voulez vous vraiment supprimer cet étudiant ?</div>
            <div class="text-grey text-italic">{{ etudiantToDeleteFullName }}</div>
            <q-input
              v-model="motif"
              color="tertiary"
              type="textarea"
              float-label="Motif de la suppresion"
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
      <q-modal @open="setProps()" ref="sanctionEtudiant" maximized v-model="openSanctionnerEtudiantModal">
        <sanction-etudiant ref="sanctionnerEtudiantModal" :etudiantToEdit="etudiantToSanction"></sanction-etudiant>
      </q-modal>
      <q-modal @open="setProps()" ref="modifEtudiant" maximized v-model="openModifierEtudiantModal">
        <modif-etudiant ref="modifierEtudiantModal" :etudiantToEdit="etudiantToEdit2"></modif-etudiant>
      </q-modal>
      <q-modal ref="openModifierEtudiantModal" class="_deleteModal" v-model="openModifierEtudiantModal"
               :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '100vw', minHeight: '100vh'}">
        <q-modal-layout>
          <div>
            <q-toolbar color="" class="shadow-0" style="border-bottom: 1px solid ghostwhite;padding-top: 0;padding-bottom: 0;">
            <q-item>
              <q-item-side avatar="statics/etablissement/fianarantsoa.png" />
            </q-item>
            <q-toolbar-title>
              {{ this.fullName }}
              <span slot="subtitle">Modification de l' étudiant</span>
            </q-toolbar-title>

            <q-btn color="" icon="close" class="within-iframe-hide" flat @click="$router.go(-1)" style="margin-right: 15px;padding-right: 10px;">
              Fermer
            </q-btn>
          </q-toolbar>
          <!-- if you want automatic padding use "layout-padding" class -->
          <div class="layout-padding">
            <!-- your content -->
            <div class="row">
              <div class="col-sm-12 col-md-4">
                <q-card >
                  <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
                    Photo
                    <span slot="subtitle">Cliquer l'image pour changer la photo</span>
                  </q-card-title>
                  <q-card-separator />
                  <q-card-main style="margin-top: 0; padding: 20px 50px;">
                    <div class="_image-upload">
                      <div v-ripple="" style="overflow: hidden;cursor: pointer;padding-bottom: 0;margin-bottom: 0;font-size: 0;width: 100%;" class="relative-position flex flex-center items-center">
                        <label for="image-input">
                          <img class="responsive" :src="avatarImage" style=""/>
                        </label>
                      </div>
                      <input id="image-input" ref="imageInput" @change="changerImage()" type="file"/>
                    </div>
                  </q-card-main>
                </q-card>
                <q-card >
                  <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
                    Informations
                  </q-card-title>
                  <q-card-separator />
                  <q-card-main style="margin-top: 0;padding-top: 0;padding-bottom: 0;">
                    <q-input v-model="etudiantToEdit.matricule" type="text" float-label="Numéro matricule" disabled/>
                    <q-input v-model="etudiantToEdit.nom" type="text" float-label="Nom"/>
                    <q-input v-model="etudiantToEdit.prenom" type="text" float-label="Prénom(s)"/>
                    <q-list style="padding: 16px;padding-top: 10px;padding-bottom: 10px;margin-top: 32px;">
                      <q-radio v-model="etudiantToEdit.sexe" val="Homme" color="primary" class="text-grey" label="Homme" />
                      <q-radio v-model="etudiantToEdit.sexe" val="Femme" color="primary" class="text-grey" label="Femme" style="margin-left: 10px" />
                    </q-list>
                    <q-input v-model="etudiantToEdit.adresse" type="text" float-label="Adresse"/>
                    <q-input v-model="etudiantToEdit.email" type="text" float-label="Email"/>
                    <q-input v-model="etudiantToEdit.tel" type="text" float-label="Contact"/>
                    <br/>
                  </q-card-main>
                </q-card>
                <q-card >
                  <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
                    Naissance
                  </q-card-title>
                  <q-card-separator />
                  <q-card-main style="margin-top: 0;padding-top: 0;">
                    <q-datetime float-label="Née le" format="DD MMMM YYYY"  :month-names="monthNames" :day-names="dayNames" cancel-label="" ok-label="Selectionner" clear-label="Effacer"  v-model="etudiantToEdit.dateNais" type="date" />
                    <q-input v-model="etudiantToEdit.lieuNais" type="text" float-label="Née à"/>
                    <q-input v-model="etudiantToEdit.nationalite" type="text" float-label="Nationalité"/>
                    <q-input v-model="etudiantToEdit.pays" type="text" float-label="Pays"/>
                    <br/>
                  </q-card-main>
                </q-card>
              </div>

              <div class="col-sm-12 col-md-4">
                <q-card >
                  <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
                    Parents
                  </q-card-title>
                  <q-card-separator />
                  <q-card-main style="margin-top: 0;">

                    <q-list link style="padding-top: 0; padding-bottom: 0">
                      <q-item tag="label">
                        <q-item-side>
                          <q-checkbox color="primary" v-model="etudiantToEdit.orphPere" />
                        </q-item-side>
                        <q-item-main>
                          <q-item-tile class="text-grey" label>Orphelin père</q-item-tile>
                        </q-item-main>
                      </q-item>
                    </q-list>

                    <q-input v-model="etudiantToEdit.nomPere" type="text" float-label="Nom du père"/>
                    <q-input v-model="etudiantToEdit.profPere" type="text" float-label="Profession du père"/>
                    <q-list link style="margin-top: 32px;padding-top: 0; padding-bottom: 0">
                      <q-item tag="label">
                        <q-item-side>
                          <q-checkbox color="primary" v-model="etudiantToEdit.orphMere" />
                        </q-item-side>
                        <q-item-main>
                          <q-item-tile class="text-grey" label>Orphelin mère</q-item-tile>
                        </q-item-main>
                      </q-item>
                    </q-list>
                    <q-input v-model="etudiantToEdit.nomMere" type="text" float-label="Nom de la mère"/>
                    <q-input v-model="etudiantToEdit.profMere" type="text" float-label="Profession de la mère"/>
                    <q-input v-model="etudiantToEdit.adresseParent" type="text" float-label="Adresse des parents"/>
                    <q-input v-model="etudiantToEdit.telParent" type="text" float-label="N° telephone des parents"/>
                    <q-input v-model="etudiantToEdit.nbFrere" type="number" :min="0" :max="100" :step="1" float-label="Nombre de frère(s)"/>
                    <q-input v-model="etudiantToEdit.nbSoeur" type="number" :min="0" :max="100" :step="1" float-label="Nombre de soeur(s)"/>
                    <br/>
                  </q-card-main>
                </q-card>
                <q-card >
                  <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
                    Tuteur
                  </q-card-title>
                  <q-card-separator />
                  <q-card-main style="margin-top: 0;padding-top: 0;padding-bottom: 0;">
                    <q-input v-model="etudiantToEdit.nomTuteur" type="text" float-label="Nom du tuteur"/>
                    <q-input v-model="etudiantToEdit.profTuteur" type="text" float-label="Profession du tuteur"/>
                    <q-input v-model="etudiantToEdit.telTuteur" type="text" float-label="N° telephone du tuteur"/>
                    <q-input v-model="etudiantToEdit.adresseTuteur" type="text" float-label="Adresse du tuteur"/>
                    <br/>
                  </q-card-main>
                </q-card>

                <q-card >
                  <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
                    Situation matrimoniale
                  </q-card-title>
                  <q-card-separator />
                  <q-card-main style="margin-top: 0;">
                    <q-list link style="padding-top: 0; padding-bottom: 0">
                      <q-item tag="label">
                        <q-item-side>
                          <q-radio color="primary" v-model="etudiantToEdit.situation" val="célibataire" />
                        </q-item-side>
                        <q-item-main>
                          <q-item-tile class="text-grey" label>Célibataire</q-item-tile>
                        </q-item-main>
                      </q-item>
                      <q-item tag="label">
                        <q-item-side>
                          <q-radio color="primary" v-model="etudiantToEdit.situation" val="marié(e)" />
                        </q-item-side>
                        <q-item-main>
                          <q-item-tile class="text-grey" label>Marié(e)</q-item-tile>
                        </q-item-main>
                      </q-item>
                      <q-item multiline tag="label">
                        <q-item-side>
                          <q-radio color="primary" v-model="etudiantToEdit.situation" val="divorcé(e)" />
                        </q-item-side>
                        <q-item-main>
                          <q-item-tile class="text-grey" label>Divorcé(e)</q-item-tile>
                        </q-item-main>
                      </q-item>
                      <q-item multiline tag="label">
                        <q-item-side>
                          <q-radio color="primary" v-model="etudiantToEdit.situation" val="veuf(ve)" />
                        </q-item-side>
                        <q-item-main>
                          <q-item-tile class="text-grey" label>Veuf(ve)</q-item-tile>
                        </q-item-main>
                      </q-item>
                    </q-list>
                    <br/>
                  </q-card-main>
                </q-card>
              </div>

              <div class="col-sm-12 col-md-4">
                <q-card >
                  <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
                    Titre Accès (Bacc)
                  </q-card-title>
                  <q-card-separator />
                  <q-card-main style="margin-top: 0;padding-top: 0;padding-bottom: 0;">
                    <q-input v-model="etudiantToEdit.numBacc" type="text" float-label="Numero Bacc"/>
                    <q-input v-model="etudiantToEdit.anneeBacc" type="number" float-label="Obtenu en"/>
                    <q-input v-model="etudiantToEdit.lyceeBacc" type="text" float-label="Lycée"/>
                    <q-input v-model="etudiantToEdit.provinceBacc" type="text" float-label="Province"/>
                    <q-input v-model="etudiantToEdit.bacc" type="text" float-label="Bacc série"/>
                    <br/>
                  </q-card-main>
                </q-card>
                <q-card >
                  <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
                    Carte d'identité nationale / Passeport
                  </q-card-title>
                  <q-card-separator />
                  <q-card-main style="margin-top: 0;padding-top: 0;">
                    <q-input v-model="etudiantToEdit.numCin" type="text" float-label="Numero CIN / Passeport"/>
                    <q-input v-model="etudiantToEdit.lieuCin" type="text" float-label="Fait à "/>
                    <q-datetime float-label="Fait le" format="DD MMMM YYYY"
                                :month-names="monthNames" :day-names="dayNames" cancel-label="" ok-label="Selectionner"
                                clear-label="Effacer"  v-model="etudiantToEdit.dateCin" type="date" />
                    <q-datetime float-label="Date duplicata" format="DD MMMM YYYY"
                                :month-names="monthNames" :day-names="dayNames" cancel-label="" ok-label="Selectionner"
                                clear-label="Effacer"  v-model="etudiantToEdit.duplicataCin" type="date" />
                    <br/>
                  </q-card-main>
                </q-card>
                <q-card >
                  <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
                    Valider
                  </q-card-title>
                  <q-card-separator />
                  <q-card-main style="margin-top: 0; padding: 20px 50px;">
                    <q-btn rounded push color="primary" style="width: 100%;height: 50px;" @click="updateEtudiant()">Mettre à jour les informations</q-btn>
                  </q-card-main>
                </q-card>

              </div>
            </div>
          </div>
          </div>
        </q-modal-layout>
    </q-modal>
    <q-modal ref="openSanctionnerEtudiantModal" class="_deleteModal" v-model="openSanctionnerEtudiantModal"
               :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '100vw', minHeight: '100vh'}">
        <q-modal-layout>
          <div>
            <q-toolbar color="" class="shadow-0" style="border-bottom: 1px solid ghostwhite;padding-top: 0;padding-bottom: 0;">
              <q-item>
                <q-item-side avatar="statics/etablissement/fianarantsoa.png" />
              </q-item>
              <q-toolbar-title>
                {{ etudiantToEdit.fullName }}
                <span slot="subtitle">Sanction de l' étudiant</span>
              </q-toolbar-title>

              <q-btn color="" icon="close" class="within-iframe-hide" flat @click="$router.go(-1)" style="margin-right: 15px;padding-right: 10px;">
                Fermer
              </q-btn>
            </q-toolbar>
            <!-- if you want automatic padding use "layout-padding" class -->
            <div class="layout-padding">
              <!-- your content -->
              <div class="row"><div class="col-8 offset-2 text-center content-center">Nouvel sanction pour {{ etudiantToEdit.fullName }}</div></div>
              <br>
              <div class="row">
                <div class="col-sm-12 col-md-4">
                  <q-card >
                    <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
                      Option semestrielle
                    </q-card-title>
                    <q-card-separator />
                    <q-card-main style="margin-top: 0;padding-top: 0;padding-bottom: 0;">
                      <q-select
                        style="margin-top: 0;"
                        color="primary"
                        float-label="Année universitaire"
                        v-model="form.annee"
                        :options="anneeOptions"
                      />
                      <q-select
                        style="margin-top: 0;"
                        color="primary"
                        float-label="Semestre "
                        v-model="form.semestre"
                        :options="semestreOptions"
                      />
                    </q-card-main>
                  </q-card>
                </div>
                <div class="col-sm-12 col-md-5">
                  <q-card >
                    <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
                      Mesure
                    </q-card-title>
                    <q-card-separator />
                    <q-card-main style="margin-top: 0;padding-top: 0;padding-bottom: 0;">
                      <q-select
                        style="margin-top: 0;"
                        color="primary"
                        float-label="Mesure "
                        v-model="form.mesure"
                        :options="mesureOptions"
                      />
                      <q-datetime float-label="Date décision" format="DD MMMM YYYY"  :month-names="monthNames" :day-names="dayNames" cancel-label="" ok-label="Selectionner" clear-label="Effacer"  v-model="form.dateMesure" type="date" />
                      <br/>
                      <q-input type="textarea" v-model="form.commentaire" float-label="Commentaire"/>
                      <br/>
                    </q-card-main>
                  </q-card>
                </div>
                <div class="col-sm-12 col-md-3">
                  <q-card >
                    <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
                      Réference
                    </q-card-title>
                    <q-card-separator />
                    <q-card-main style="margin-top: 0;padding-top: 0;">
                      <div class="text-center">
                        <form method="POST" enctype="multipart/form-data" id="sanctionForm">
                          <input type="file" name="uploadfile" id="upload_file" class="inputfile inputfile-4" data-multiple-caption="{count} files selected" multiple />
                          <label for="upload_file"><figure><svg xmlns="http://www.w3.org/2000/svg" width="20" height="45" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg></figure> <span>Choisir un fichier de référence&hellip;</span></label>
                        </form> 
                      </div>
                      <div class="text-center"> 
                        <q-card-separator />
                        <q-card-main style="margin-top: 0; padding: 20px 50px;">
                          <q-btn rounded push color="primary" style="width: 150%;height: 50px;" @click="InituploadExcel()">Enregistrer</q-btn>
                        </q-card-main>
                      </div>
                    </q-card-main>
                  </q-card>
                </div>
              </div>
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
    QCardMedia,
    QCardTitle,
    QCardSeparator,
    QCardMain,
    QCardActions,
    QDataTable,
    QRadio,
    QBtn,
    QList,
    QIcon,
    Loading,
    Alert,
    QItem,
    QItemSide,
    QItemMain,
    QSelect,
    QTooltip,
    QItemTile,
    QCheckbox,
    QDatetime,
    QField,
    Ripple,
    QFixedPosition,
    QCollapsible,
    QModal,
    QModalLayout,
    QInput,
    QSpinner,
    QToolbar,
    QFab,
    QChip,
    QListHeader,
    QToolbarTitle
  } from 'quasar'
  import ModifEtudiant from './ModifierModal.vue'
  import SanctionEtudiant from './SanctionnerModal.vue'
  import { map, first, last } from 'lodash'
  import jQuery from 'jquery'
  let $ = jQuery

  export default {
    directives: {
      Ripple
    },
    components: {
      QCard,
      QCardMedia,
      QCardTitle,
      QCardSeparator,
      QCardMain,
      QCardActions,
      QDataTable,
      QRadio,
      QBtn,
      QList,
      QIcon,
      Loading,
      Alert,
      QItem,
      QItemSide,
      QItemMain,
      QSelect,
      QTooltip,
      QItemTile,
      QCheckbox,
      QDatetime,
      QField,
      Ripple,
      QFixedPosition,
      QCollapsible,
      QModal,
      QModalLayout,
      QInput,
      QSpinner,
      QToolbar,
      QFab,
      QChip,
      QListHeader,
      QToolbarTitle,
      ModifEtudiant,
      SanctionEtudiant
    },
    data () {
      return {
        form: {
          profTuteur: '',
          telTuteur: '',
          adresseTuteur: ''
        },
        mesureOptions: [],
        mesure: '',
        identifiant: '',
        id: '',
        idPere: '',
        idMere: '',
        idTuteur: '',
        idBacc: '',
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        dayNames: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        fullName: '',
        avatarImage: 'statics/photovide.jpg',
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
            label: 'Email',
            field: 'email',
            width: '150px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Adresse',
            field: 'adresse',
            width: '120px',
            filter: true,
            sort: true,
            type: 'string'
          }
        ],
        openSupprimer: false,
        openModifierEtudiantModal: false,
        openSanctionnerEtudiantModal: false,
        motif: '',
        isReady: false,
        etudiantToDelete: '',
        etudiantToSanction: '',
        etudiantToEdit2: '',
        etudiantToEdit: {
          matricule: '',
          nom: '',
          prenom: '',
          sexe: '',
          adresse: '',
          tel: '',
          email: '',
          dateNais: '',
          lieuNais: '',
          nationalite: '',
          pays: '',
          situation: '',
          numCin: '',
          dateCin: '',
          lieuCin: '',
          duplicataCin: '',
          numBacc: '',
          anneeBacc: '',
          provinceBacc: '',
          lyceeBacc: '',
          bacc: '',
          orphPere: false,
          nomPere: '',
          profPere: '',
          orphMere: false,
          nomMere: '',
          profMere: '',
          adresseParent: '',
          telParent: '',
          nbFrere: 0,
          nbSoeur: 0,
          nomTuteur: '',
          profTuteur: '',
          telTuteur: '',
          adresseTuteur: ''
        },
        etudiantToDeleteFullName: '',
        mention: '',
        mentionOptions: [],
        annee: '',
        anneeOptions: [],
        composant: '',
        composantOptions: [
          {
            label: 'Tous',
            value: 0
          }
        ],
        parcours: '',
        parcoursOptions: [],
        semestre: '',
        semestreOptions: []
      }
    },
    computed: {
    },
    props: {
      etudiantModif: ''
    },
    watch: {
      mention: function (mention, composant) {
        console.log('id composant for mention :' + composant)
        this.parcoursOptions = []
        this.$store.dispatch('mention/getAllMentionByComposant', composant)
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
        this.refresh()
      },
      composant: function (composant) {
        this.mentionOptions = []
        console.log('composant value :' + composant)
        /* let field = {
          annee: 2,
          semestre: 1,
          parcours: 1,
          ue: 0
        } */
        if (composant !== 0) {
          this.$store.dispatch('composant/getComposantById', composant)
            .then((res) => {
              this.composant = res.id
            })
            .catch((err) => {
              console.log('err', err)
            })
          this.$store.dispatch('mention/getAllMentionByComposant', this.composant)
            .then((res) => {
              console.log('composant : ' + this.composant)
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
        }
        this.refresh()
      },
      etudiantModif: function (newVal, oldVal) {
        console.log('new val', newVal)
        this.id = ''
        this.idPersonne = ''
        this.etudiantToEdit.matricule = newVal.numeroMatricule
        this.etudiantToEdit.nom = newVal.idPersonne.nom
        this.etudiantToEdit.prenom = newVal.idPersonne.prenom
        this.etudiantToEdit.sexe = newVal.idPersonne.sexe
        this.etudiantToEdit.adresse = newVal.idPersonne.adresse
        this.etudiantToEdit.email = newVal.idPersonne.email
        this.etudiantToEdit.tel = newVal.idPersonne.tel
        this.etudiantToEdit.dateNais = newVal.idPersonne.dateNais
        this.etudiantToEdit.lieuNais = newVal.idPersonne.lieuNais
        this.etudiantToEdit.nationalite = newVal.idPersonne.nationalite
        this.etudiantToEdit.pays = newVal.idPersonne.pays
        this.etudiantToEdit.situation = newVal.idPersonne.situation
        this.etudiantToEdit.numCin = newVal.idPersonne.cin
        this.etudiantToEdit.dateCin = newVal.idPersonne.dateCin
        this.etudiantToEdit.lieuCin = newVal.idPersonne.lieuCin
        this.etudiantToEdit.duplicataCin = newVal.idPersonne.duplicataCin
        this.etudiantToEdit.orphPere = newVal.idPersonne.orphelinPere
        this.etudiantToEdit.orphMere = newVal.idPersonne.orphelinMere
        this.etudiantToEdit.nbFrere = newVal.idPersonne.nbFrere
        this.etudiantToEdit.nbSoeur = newVal.idPersonne.nbSoeur
        this.etudiantToEdit.bacc = newVal.idPersonne.infoBaccCollection[0].serie
        this.etudiantToEdit.numBacc = newVal.idPersonne.infoBaccCollection[0].numBacc
        this.etudiantToEdit.anneeBacc = newVal.idPersonne.infoBaccCollection[0].annee
        this.etudiantToEdit.provinceBacc = newVal.idPersonne.infoBaccCollection[0].province
        this.etudiantToEdit.lyceeBacc = newVal.idPersonne.infoBaccCollection[0].lycee
        // this.id = newVal.idPersonne.id
        this.idBacc = newVal.idPersonne.infoBaccCollection[0].id
        this.fullName = newVal.fullName
        this.avatarImage = newVal.idPersonne.urlPhoto
        map(newVal.idPersonne.parentCollection, (parent) => {
          if (parent.role === 'père') {
            this.etudiantToEdit.nomPere = parent.nom
            this.etudiantToEdit.profPere = parent.profession
            this.etudiantToEdit.adresseParent = parent.adresse
            this.etudiantToEdit.telParent = parent.tel
            this.idPere = parent.id
          }
          else if (parent.role === 'mère') {
            this.etudiantToEdit.nomMere = parent.nom
            this.etudiantToEdit.profMere = parent.profession
            this.etudiantToEdit.adresseParent = parent.adresse
            this.etudiantToEdit.telParent = parent.tel
            this.idMere = parent.id
          }
          else {
            this.etudiantToEdit.nomTuteur = parent.nom
            this.etudiantToEdit.profTuteur = parent.profession
            this.etudiantToEdit.telTuteur = parent.tel
            this.etudiantToEdit.adresseTuteur = parent.adresse
            this.idTuteur = parent.id
          }
        })
      },
      annee: function (annee) {
        console.log('ATO am annee')
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
        this.refresh()
      },
      parcours: function (parcours, selection) {
        this.$store.dispatch('parcours/getParcoursById', parcours)
          .then((res) => {
            this.parcoursLibelle = res.libelle
          })
          .catch((err) => {
            console.log(err)
          })
        this.refresh()
      },
      semestre: function (semestre) {
        console.log('ATO am semestre')
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
        this.refresh()
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
      setProps () {
        this.etudiantToSanction = this.etudiantToEdit
        this.etudiantToEdit2 = this.etudiantToEdit
      },
      refresh (done) {
        setTimeout(() => {
          let field = {
            annee: this.annee,
            semestre: this.semestre,
            parcours: this.parcours,
            ue: 0
          }
          console.log('Annee----------' + field.annee)
          console.log('semestre----------' + field.semestre)
          console.log('parcours----------' + field.parcours)
          this.$store.dispatch('inscription/getAllInscriptionPedagogique', field)
            .then((res) => {
              this.isReady = true
              this.etudiants = []
              map(res, (et) => {
                et.adresse = et.etudiant.idPersonne.adresse
                et.tel = et.etudiant.idPersonne.tel
                et.sexe = et.etudiant.idPersonne.sexe
                et.fullName = et.etudiant.idPersonne.nom + ' ' + et.etudiant.idPersonne.prenom
                et.photo = et.etudiant.idPersonne.urlPhoto
                et.nom = et.etudiant.idPersonne.nom
                et.matricule = et.etudiant.numeroMatricule
                et.prenom = et.etudiant.idPersonne.prenom
                et.email = et.etudiant.idPersonne.email
                et.dateNais = et.etudiant.idPersonne.dateNais
                et.lieuNais = et.etudiant.idPersonne.lieuNais
                et.nationalite = et.etudiant.idPersonne.nationalite
                et.pays = et.etudiant.idPersonne.pays
                et.situation = et.etudiant.idPersonne.situation
                et.numCin = et.etudiant.idPersonne.numCin
                et.dateCin = et.etudiant.idPersonne.dateCin
                et.lieuCin = et.etudiant.idPersonne.lieuCin
                et.duplicataCin = et.etudiant.idPersonne.duplicataCin
                et.orphPere = et.etudiant.idPersonne.orphPere
                et.orphMere = et.etudiant.idPersonne.orphMere
                et.nbFrere = et.etudiant.idPersonne.nbFrere
                et.nbSoeur = et.etudiant.idPersonne.nbSoeur
                this.etudiants.push(et)
              })
            })
            .catch((err) => {
              console.log(err)
            })
          // done()
        }, 1000)
      },
      InituploadExcel () {
        event.preventDefault()
        this.sendToServer()
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
      sendToServer () {
        var form = $('#sanctionForm')[0]
        var sanctionData = new FormData(form)
        console.log('TAFIDITRA lg 931 :' + this.identifiant)
        sanctionData.append('idPersonne', this.identifiant)
        sanctionData.append('idMesure', this.form.mesure)
        sanctionData.append('mesure_date', this.form.dateMesure)
        sanctionData.append('commentaire', this.form.commentaire)
        sanctionData.append('id_semestre', this.form.semestre)
        sanctionData.append('id_annee_universitaire', this.form.annee)
        console.log('data', sanctionData)
        this.$store.dispatch('sanction/addNew', sanctionData)
          .then((res) => {
            console.log('result', res)
            this.$alert.success('Sanction enregistrer avec succés')
            this.$router.go(-1)
          })
          .catch((err) => {
            if (err) this.$alert.error('Une erreur est survenue lors de l\'enregistrement')
          })
      },
      sanctionnerEtudiant (selection) {
        console.log(' ID ---:' + selection.rows[0].data.etudiant.idPersonne.id)
        this.identifiant = selection.rows[0].data.etudiant.idPersonne.id
        this.openSanctionnerEtudiantModal = true
        this.etudiantToEdit = selection.rows[0].data
        /* this.$store.dispatch('anneeuniversitaire/getAllAnneeUniversitaire')
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
          }) */
        this.$store.dispatch('mesure/getAllTypeMesure')
          .then((res) => {
            map(res, m => {
              let mesureOpt = {
                label: m.libelle,
                value: m.id,
                icon: 'bubble_chart'
              }
              this.mesureOptions.push(mesureOpt)
            })
          })
          .catch((err) => {
            console.log('err', err)
          })
      },
      modifierEtudiant (selection) {
        console.log(' ID ---:' + selection.rows[0].data.etudiant.idPersonne.id)
        this.identifiant = selection.rows[0].data.etudiant.idPersonne.id
        this.openModifierEtudiantModal = true
        this.etudiantToEdit = selection.rows[0].data
      },
      supprimerEtudiant (selection) {
        this.openSupprimer = true
        this.etudiantToDelete = selection
        this.etudiantToDeleteFullName = selection.rows[0].data.fullName
      },
      deleteEtudiant () {
        let etudiant = this.etudiantToDelete.rows[0].data
        etudiant.motifSuppr = this.motif
        etudiant.supprime = true
        delete etudiant.fullName
        this.$store.dispatch('etudiant/deleteEtudiant', etudiant)
          .then((res) => {
            let alert = Alert.create({
              html: 'L\'étudiant ' + etudiant.numeroMatricule + ' est supprimé',
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
      },
      changeImage () {
        alert('Fonction pour changer l\'image ...')
      },
      updateEtudiant () {
        console.log('UPDATE :' + this.identifiant)
        console.log('UPDATE3 :' + this.etudiantToEdit.nom)
        let etudiant = {
          id: this.identifiant,
          nom: this.etudiantToEdit.nom,
          prenom: this.etudiantToEdit.prenom,
          dateNais: this.etudiantToEdit.dateNais,
          lieuNais: this.etudiantToEdit.lieuNais,
          nationalite: this.etudiantToEdit.nationalite,
          pays: this.etudiantToEdit.pays,
          sexe: this.etudiantToEdit.sexe,
          situation: this.etudiantToEdit.situation,
          orphelinPere: this.etudiantToEdit.orphPere,
          orphelinMere: this.etudiantToEdit.orphMere,
          nbFrere: this.etudiantToEdit.nbFrere,
          nbSoeur: this.etudiantToEdit.nbSoeur,
          cin: this.etudiantToEdit.cin,
          dateCin: this.etudiantToEdit.dateCin,
          lieuCin: this.etudiantToEdit.lieuCin,
          duplicataCin: this.etudiantToEdit.duplicataCin,
          passePort: this.etudiantToEdit.passePort,
          email: this.etudiantToEdit.email,
          tel: this.etudiantToEdit.tel,
          adresse: this.etudiantToEdit.adresse,
          urlPhoto: this.avatarImage
        /*  parentCollection: [
            {
              id: this.idPere,
              nom: this.etudiantToEdit.nomPere,
              profession: this.etudiantToEdit.profPere,
              tel: this.etudiantToEdit.telParent,
              role: 'père',
              idPersonne: this.id
            },
            {
              id: this.idMere,
              nom: this.etudiantToEdit.nomMere,
              profession: this.etudiantToEdit.profMere,
              adresse: this.etudiantToEdit.adresseParent,
              tel: this.etudiantToEdit.telParent,
              role: 'mère',
              idPersonne: this.id
            },
            {
              id: this.idTuteur,
              nom: this.etudiantToEdit.nomTuteur,
              profession: this.etudiantToEdit.profTuteur,
              adresse: this.etudiantToEdit.adresseTuteur,
              tel: this.etudiantToEdit.telTuteur,
              role: 'tuteur',
              idPersonne: this.id
            }
          ],
          infoBaccCollection: [
            {
              id: this.idBacc,
              serie: this.etudiantToEdit.bacc,
              numBacc: this.etudiantToEdit.numBacc,
              annee: this.etudiantToEdit.anneeBacc,
              lycee: this.etudiantToEdit.lyceeBacc,
              province: this.etudiantToEdit.provinceBacc,
              idPersonne: this.id
            }
          ] */
        }
        this.$store.dispatch('etudiant/updateEtudiant', etudiant)
          .then((res) => {
            this.$alert.success('Les informations ont été mises à jour')
            this.$router.go(-1)
          })
          .catch((err) => {
            if (err) this.$alert.error('Erreur lors de la mise à jour')
          })
      }
    },
    mounted () {
      console.log('ATO :' + this.composant)
      this.refresh()
      this.$refs.modifierEtudiantModal.$on('close', () => {
        this.openModifierEtudiantModal = false
        this.refresh(() => {
          // console.log('Init finished')
        })
      })
      this.$refs.sanctionnerEtudiantModal.$on('close', () => {
        this.openSanctionnerEtudiantModal = false
        this.refresh(() => {
          // console.log('Init finished')
        })
      })
      this.$store.dispatch('composant/getAllComposants')
        .then((res) => {
          map(res, a => {
            let composant = {
              label: a.libelle,
              value: a.id,
              icon: 'date_range'
            }
            this.composantOptions.push(composant)
          })
          this.composant = last(res).id
        })
        .catch((err) => {
          console.log('err', err)
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

<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div class="layout-padding">
    <!-- your content -->
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
          <q-btn color="primary" icon="assignment" @click="sanctionnerEtudiant(selection)">
            <span class="gt-sm">Sanctionner</span>
          </q-btn>
          <q-btn color="primary" icon="assignment" @click="modifierEtudiant(selection)">
            <span class="gt-sm">Modifier</span>
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
            <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Inscrire un étudiant</q-tooltip>
            <q-icon name="person_add" />
          </q-btn>
          <q-btn
            round
            color="primary"
            @click="$router.push('/scolarite/etudiant/supprime')"
            class="animate-pop"
          >
            <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Etudiant(s) supprimé(s)</q-tooltip>
            <q-icon name="delete" />
          </q-btn>
          <q-btn
            round
            color="primary"
            @click="$router.push('/scolarite/etudiant/personnes')"
            class="animate-pop"
          >
            <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Liste de tous les étudiants de tous les établissements</q-tooltip>
            <q-icon name="assignment" />
          </q-btn>
      </q-fab>
    </q-fixed-position>
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
          <q-select
            multiple
            style="margin-top: 0;"
            color="primary"
            float-label="Unité d'Enseignement "
            v-model="ueExcels"
            :options="ueOptions"
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

    <q-modal @open="setProps()" ref="voirDetails" maximized v-model="voirDetails">
      <voir-details ref="voirDetailsModal" :etudiantDetails="etudiantDetails"></voir-details>
    </q-modal>
    <q-modal @open="setProps()" ref="modifEtudiant" maximized v-model="openModifierEtudiantModal">
        <modif-etudiant ref="modifierEtudiantModal" :etudiantToEdit="etudiantToEdit2"></modif-etudiant>
    </q-modal>
    <q-modal @open="setProps()" ref="sanctionEtudiant" maximized v-model="openSanctionnerEtudiantModal">
        <sanction-etudiant ref="sanctionnerEtudiantModal" :etudiantToEdit="etudiantToSanction"></sanction-etudiant>
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
    <q-modal ref="voirDetails" class="_deleteModal" v-model="voirDetails"
               :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '100vw', minHeight: '100vh'}">
      <div>
        <q-toolbar color="" class="shadow-0" style="border-bottom: 1px solid ghostwhite;padding-top: 0;padding-bottom: 0;">
          <q-item>
            <q-item-side avatar="statics/etablissement/fianarantsoa.png" />
          </q-item>
          <q-toolbar-title>
            {{ this.fullName }}
            <span slot="subtitle">Détails</span>
          </q-toolbar-title>
          <q-btn color="" icon="close" class="within-iframe-hide" flat @click="$router.go(-1)" style="margin-right: 15px;padding-right: 10px;">
          Fermer
          </q-btn>
        </q-toolbar>
        <q-card v-for="(cursus, index) in cursusArray" :key="index" style="margin-top:0;">
          <q-card-main >
            <div class="row">
              <div class="col-md-6"><!--<h6>Mention:</h6> <i>??</i>--><h6>Parcours:</h6> <i>{{cursus.parcours.libelle}} ({{cursus.resultat.semestre.code}})</i>
              </div>
              <div class="col-md-6 flex items-start justify-end">
                <q-chip style="padding-top: 10px;padding-bottom: 10px;" tag square color="primary">
                  <b><i>Total crédit:</i>&nbsp;&nbsp;</b> {{cursus.resultat.creditSemestre}}&nbsp;&nbsp;
                </q-chip>
              </div>
            </div>
            <br/>
            <table  class="q-table cell-separator" style="width: 100%;">
              <!--<thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-right">Price</th>
                <th class="text-right">In Stock</th>
              </tr>
              </thead>-->
              <tbody>
              <template v-for="(noteUe, index) in cursus.resultat.noteParUe">
                <tr v-bind:key="index" class="_ue">
                  <td class="text-left">UE: {{noteUe.ueInfo.code}}</td>
                  <td class="text-right">{{noteUe.ueInfo.creditUe}}</td>
                </tr>
                <tr v-for="(noteEc, i) in noteUe.noteEcList" :key="i">
                  <td class="text-left">{{noteEc.ecInfo.libelle}}</td>
                  <td class="text-right">{{noteEc.note}}</td>
                </tr>
              </template>
              </tbody>
            </table>
            <br />
            <table class="q-table" style="width: 100%;">
            </table>
            <br />
            <div class="col-md-6 flex items-start justify-end">
              <q-chip style="padding-top: 10px;padding-bottom: 10px;" tag :color="cursus.resultat.status === 'VALIDE' ? 'positive' : 'negative'">
                <b><i>Observations: </i>&nbsp;&nbsp; {{cursus.resultat.status}}&nbsp;&nbsp;</b>
              </q-chip>
            </div>
          </q-card-main>
        </q-card>
        <div v-if="!voirDetails" class="flex justify-center" style="height: 75vh">
          <div class="flex-center flex col-sm-12">
            <img src="statics/presentation.png" style=""/>
          </div>
          <p class="text-italic text-grey text-center light-paragraph" style="width: 75%;">
            Cliquez sur voir details pour afficher la formation suivit par l'étudiant lors de l'année universitaire</p>
        </div>
      </div>
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
</template>

<script>
  /* eslint-disable indent,no-unused-expressions */
  import {
    QCard,
    QCardMedia,
    QCardTitle,
    QCardSeparator,
    QCardMain,
    QCardActions,
    QRadio,
    QDataTable,
    QCollapsible,
    Ripple,
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
    QListHeader,
    QToolbar,
    QToolbarTitle
  } from 'quasar'

  import VoirDetails from './VoirDetailsModal.vue'
  import ModifEtudiant from './ModifierModal.vue'
  import SanctionEtudiant from './SanctionnerModal.vue'
  import { map, last, first } from 'lodash'
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
      QRadio,
      QDataTable,
      QCollapsible,
      Ripple,
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
      QListHeader,
      QToolbar,
      QToolbarTitle,
      VoirDetails,
      ModifEtudiant,
      SanctionEtudiant
    },
    data () {
      return {
        cursusArray: [],
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        dayNames: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        form: {
          profTuteur: '',
          telTuteur: '',
          adresseTuteur: ''
        },
        mesureOptions: [],
        mesure: '',
        etudiants: [],
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
            noDataAfterFiltering: 'Veuillez patienter quelques instants s\'il vous plait'
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
        id: '',
        idPere: '',
        avatarImage: 'statics/photovide.jpg',
        idMere: '',
        idTuteur: '',
        idBacc: '',
        fullName: '',
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
        etudiantToSanction: '',
        etudiantToDelete: '',
        etudiantToDeleteFullName: '',
        etudiantTorReinscrireFullName: '',
        composant: '',
        reinscriptionPedagogiqueModal: false,
        reinscriptionModal: false,
        openModifierEtudiantModal: false,
        voirDetails: false,
        etudiantToEdit2: '',
        openSanctionnerEtudiantModal: false,
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
        }
      }
    },
    computed: {
    },
    props: {
      etudiantModif: ''
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
      compoundProperty () {
        if (this.annee !== '' && this.mention !== '' && this.parcours !== '' && this.semestre !== '' && this.ue !== '') {
          this.refresh(() => {
            console.log('Init finished')
          })
        }
      }
    },
    methods: {
      filter (selection) {
        this.$store.dispatch('etudiant/filter', selection)
          .then((selection) => {
            this.etudiants = selection
          })
          .catch((error) => {
            console.log('Erreur filter', error)
          })
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
        console.log('TAFIDITRA lg 954 :' + this.etudiantToEdit.id)
        sanctionData.append('idPersonne', this.etudiantToEdit.id)
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
      changerImage () {
        let reader = new FileReader()
        let self = this
        reader.onload = function (e) {
          self.avatarImage = e.target.result
        }
        reader.readAsDataURL(document.getElementById('image-input').files[0])
      },
      closeThisModal () {
        this.$emit('close')
      },
      updateEtudiant () {
        console.log('UPDATE :' + this.etudiantToEdit.id)
        let etudiant = {
          id: this.etudiantToEdit.id,
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
      },
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
      setProps () {
        this.etudiantDetails2 = this.etudiantDetails
        this.etudiantToEdit2 = this.etudiantToEdit
        this.etudiantToSanction = this.etudiantToEdit
      },
      refresh (done) {
        Loading.show()
        this.$store.dispatch('getFonction')
          .then((fonction) => {
          let {composant} = fonction.vars
          this.$store.dispatch('etudiant/getAllEtudiantByComposant', composant.id)
          // this.$store.dispatch('etudiant/getAllEtudiants')
            .then((res) => {
              this.isReady = true
              this.etudiants = []
              map(res, (et) => {
                /* et.adresse = et.idPersonne.adresse
                et.tel = et.idPersonne.tel
                et.sexe = et.idPersonne.sexe
                et.fullName = et.idPersonne.nom + ' ' + et.idPersonne.prenom
                et.photo = et.idPersonne.urlPhoto */
                et.adresse = et.idPersonne.adresse
                et.tel = et.idPersonne.tel
                et.sexe = et.idPersonne.sexe
                et.fullName = et.idPersonne.nom + ' ' + et.idPersonne.prenom
                et.matricule = et.numeroMatricule
                et.nom = et.idPersonne.nom
                et.prenom = et.idPersonne.prenom
                et.email = et.idPersonne.email
                et.dateNais = et.idPersonne.dateNais
                et.lieuNais = et.idPersonne.lieuNais
                et.nationalite = et.idPersonne.nationalite
                et.pays = et.idPersonne.pays
                et.situation = et.idPersonne.situation
                et.numCin = et.idPersonne.numCin
                et.dateCin = et.idPersonne.dateCin
                et.lieuCin = et.idPersonne.lieuCin
                et.duplicataCin = et.idPersonne.duplicataCin
                et.orphPere = et.idPersonne.orphPere
                et.orphMere = et.idPersonne.orphMere
                et.nbFrere = et.idPersonne.nbFrere
                et.nbSoeur = et.idPersonne.nbSoeur
                et.bacc = et.idPersonne.infoBaccCollection[0].serie
                et.numBacc = et.idPersonne.infoBaccCollection[0].numBacc
                et.anneeBacc = et.idPersonne.infoBaccCollection[0].annee
                et.provinceBacc = et.idPersonne.infoBaccCollection[0].province
                et.lyceeBacc = et.idPersonne.infoBaccCollection[0].lycee
                et.idBacc = et.idPersonne.infoBaccCollection[0].id
                et.avatarImage = et.idPersonne.urlPhoto
                this.etudiants.push(et)
              })
              Loading.hide()
            })
            .catch((err) => {
              console.log(err)
            })
        })
        /* this.$store.dispatch('utilisateur/getAllUtilisateurs')
          .then((utilisateurs) => {
            this.utilisateurs = utilisateurs
          })
          .catch((error) => {
            console.log('mention/Liste.vue mounted ', error)
          })
        if (done) done() */
      },
      detailsEtudiant (selection) {
        console.log(' ID ---:' + selection.rows[0].data.idPersonne.id)
        // this.openDetailsEtudiantModal = true
        // this.etudiantDetails = selection.rows[0].data
        this.voirDetails = true
        this.$store
          .dispatch('getEtudiantCursus', selection.rows[0].data.idPersonne.id)
          .then((resultat) => {
            console.log('cursus', resultat)
            this.cursusArray = []
            for (let i = 0; i < resultat.length; i++) {
              this.cursusArray.push(resultat[i])
            }
          })
          .catch((error) => {
            console.log('error', error)
          })
      },
      supprimerEtudiant (selection) {
        this.openSupprimer = true
        this.etudiantToDelete = selection
        this.etudiantToDeleteFullName = selection.rows[0].data.fullName
      },
      modifierEtudiant (selection) {
        this.openModifierEtudiantModal = true
        this.etudiantToEdit = selection.rows[0].data
      },
      sanctionnerEtudiant (selection) {
        this.openSanctionnerEtudiantModal = true
        this.etudiantToEdit = selection.rows[0].data
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
      this.refresh()
      this.$refs.voirDetailsModal.$on('close', () => {
        this.openDetailsEtudiantModal = false
      })
      this.$store.dispatch('anneeuniversitaire/getAllAnneeUniversitaire')
        .then((res) => {
          map(res, a => {
            // this.anneeOptions.push(annee)
            // this.anneeOptionsA.push(annee)
          })
          this.annee = last(res).id
         // this.anneeReinsciptionA = last(res).id
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
  }
</script>

<style lang="stylus">
  @import '~variables'
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


  .q-item.active, .q-item.router-link-active, .q-item:focus
    color $primary

    .q-item-side
      color $primary
    .q-item-main .q-item-sublabel
      font-style italic

  ._voir-details
    .q-item.active, .q-item.router-link-active, .q-item:focus
      border-left 2px solid $primary

  .q-item
    cursor pointer
    .q-popover .q-item-image {
      min-width: 55px;
      max-width: 55px;
      max-height: 55px;
    }

  ._image-upload > input
  {
    display: none;
  }

  ._modal-content
    padding 15px 70px
    border-bottom 1px solid whitesmoke

  @media only screen and (max-width: 500px) {
    ._modal-content {
      padding: 10px 10px;
      border-bottom: 1px solid whitesmoke;
    }
  }
</style>
<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div class="layout-padding">
    <!-- your content -->
    <div class="row" style="padding-left: 10px;padding-right: 10px;">
      <div class="col-md col-sm-12">
        <q-select
          style="margin-top: 0;"
          color="primary"
          float-label="Année universitaire"
          v-model="annee"
          :options="anneeOptions"
        />
      </div>
      <div class="col-md col-sm-12">
        <q-select
          style="margin-top: 0;"
          color="primary"
          float-label="Semestre "
          v-model="semestre"
          :options="semestreOptions"
        />
      </div>
      <div class="col-md col-sm-12">
        <q-select
          style="margin-top: 0;"
          color="primary"
          float-label="Mention"
          v-model="mention"
          :options="mentionOptions"
        />
      </div>
      <div class="col-md col-sm-12">
        <q-select
          style="margin-top: 0;"
          color="primary"
          float-label="Parcours"
          v-model="parcours"
          :options="parcoursOptions"
        />
      </div>
      <div class="col-md col-sm-12">
        <q-select
          style="margin-top: 0;"
          color="primary"
          float-label="Session "
          v-model="session"
          :options="sessionOptions"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 col-md-3">
        <q-card v-if="ue.length">
          <q-card-title style=" padding-bottom: 10px;padding-top: 10px;">
            <h6>Unités d'enseignements</h6>
          </q-card-title>
          <q-list separator>
            <q-collapsible v-for="u in ue" :key="u.id" group="somegroup" icon="explore" :label="u.libelle">
              <div v-for="ec in u.ecCollection" :key="ec.id">
                <q-btn flat :color="selectedEc.id === ec.id ? 'negative' : 'primary'" class="q-btn-no-uppercase"  @click="setSelectedEc(ec)">
                  <q-item >
                    <q-item-side icon="assignment" />
                    <q-item-main :label="ec.libelle" :sublabel="ec.typeEc.libelle"/>
                  </q-item>
                </q-btn>
              </div>
            </q-collapsible>
          </q-list>
        </q-card>
      </div>
      <div class="col-sm-12 col-md-9">
        <q-card v-if="selectedEc.id">
          <q-data-table
            :data="etudiants"
            :config="config"
            :columns="columns"
            :refresh="getNotesByFilter"
            class="bg-white"
            ref="datatable"
          >
            <!-- Custom renderer when user selected one or more rows -->
            <template slot="selection" slot-scope="selection">
              <q-btn color="primary" icon="assignment" v-if="!isNoteSessionValide" @click="openUpdateNoteModal(selection)">
                <span class="gt-sm">Modifier note </span>
              </q-btn>
              <q-btn color="primary" icon="assignment" v-if="isNoteSessionValide" @click="openCompenserNoteModal(selection)">
                <span class="gt-sm">Compenser </span>
              </q-btn>
              <q-btn color="negative" icon="assignment" v-if="!isNoteSessionValide" @click="deleteNote(selection)">
                <span class="gt-sm">Supprimer note </span>
              </q-btn>
              <!-- q-btn color="secondary" icon="assignment_ind" v-if="!isNoteSessionValide" @click="voirDetailEtudiant(selection)">
                <span class="gt-sm">Voir details</span>
              </q-btn -->
            </template>

            <!--<template slot="col-etat" slot-scope="item">
              <q-chip v-if="item.data === 'Disponible'" tag color="green">Disponible</q-chip>
              <q-chip v-else tag color="red">Non Disponible</q-chip>
            </template>-->

            <template slot="col-photo" slot-scope="item">
              <q-item>
                <q-item-side avatar="statics/photovide.png" />
              </q-item>
            </template>
          </q-data-table>
        </q-card>
      </div>
    </div>

    <q-fixed-position corner="bottom-left" :offset="[18, 18]" v-if="selectedEc.id">
      <q-fab color="primary" push icon="settings" direction="right">
        <q-btn
          round
          color="primary"
          @click="printNoteEtudiants()"
          class="animate-pop"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Imprimer la liste des notes</q-tooltip>
          <q-icon name="print" />
        </q-btn>
        <q-btn
          round
          color="primary"
          @click="showHitoryModal()"
          class="animate-pop"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Historique des modifications de note</q-tooltip>
          <q-icon name="history" />
        </q-btn>
        <q-btn
          round
          color="primary"
          @click="openNoteModal()"
          class="animate-pop"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Ajouter une note</q-tooltip>
          <q-icon name="add" />
        </q-btn>
        <q-btn
          round
          color="primary"
          @click="$refs.uploadExcelModal.open()"
          class="animate-pop"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Importer un fichier excel</q-tooltip>
          <q-icon name="fa-file-excel-o" />
        </q-btn>
      </q-fab>
    </q-fixed-position>
    <!-- Modal Upload Excel -->
    <q-modal v-if="!isNoteSessionValide" ref="uploadExcelModal" :content-css="{minWidth: '40vw', minHeight: '40vh'}">
      <div class="text-center content-center">
        <h5>Importer fichier excel</h5>
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

    <!-- Modal add Note -->
    <q-modal v-if="!isNoteSessionValide" ref="noteModal" class="_noteModal" v-model="noteModal" @open="actionModalOpen()"
            :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '40vw', minHeight: '80vh'}">
      <q-modal-layout>
        <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey;">
          <div class="text-center">
            <div class="col-sm-12 layout-padding ">
              <div style="margin: 0;font-size: 24px" class="light-paragraph">Ajout d'une note</div>
            </div>
          </div>
          <q-btn flat round small @click="$refs.noteModal.close()" style="position: absolute;top: 1em;right: 1em">
            <q-icon name="close" />
          </q-btn>
        </div>
        <div v-if="!(etudiantsFiltred.length === 0 && !previous)">
        <div class="_modal-content">
          <div class="row sm-gutter">
            <div class="col-md-7">
              <q-field
                icon="account_circle"
                label=""
                helper="numéro Matricule de l'étudiant"
              >
                <q-input v-model="etudiant.numero" @blur="checkEtudiant()" @change="checkEtudiant2()" float-label="Matricule" id="matricule" @keyup.enter="focusToNote()">
                  <q-autocomplete
                    @search="search"
                    @selected="selected"
                  />
                </q-input>
              </q-field>
            </div>
          </div>
        </div>
        <div class="_modal-content" style="border-bottom: none; margin-top: -30px">
          <div class="row sm-gutter">
            <div class="col-md-7">
              <q-field
                icon="rate_review"
                label=""
                helper="Insérer la note de l'étudiant"
              >
                <q-input ref="note" v-model="etudiant.note" float-label="Note" id="note" @keyup.enter="addToNoteToBeSend(etudiant)"/>
              </q-field>
            </div>
          </div>
        </div>
        <div class="_modal-content" style="border-bottom: none;">
          <div class="row">
            <div class="col">
              <q-btn class="shadow-0" flat color="primary" :disable="indexArrayEtudiant === -1 || (previous && indexArrayEtudiant === 0)" icon="chevron_left" @click="showPreviousNotes()">
                Precedent
              </q-btn>
            </div>
            <div class="col flex justify-end">
              <q-btn id="btn_suivant" class="shadow-0" flat color="primary" :disable="etudiantsFiltred.length === 0 && !previous" @click="addToNoteToBeSend(etudiant)" icon-right="chevron_right">
                Suivant
              </q-btn>
            </div>
          </div>
        </div>
        <div class="_modal-content">
          <div style="font-size: 18px;" class="text-grey-8 text-italic">Résumé</div>
          <div class="q-item-sublabel text-italic">Note de {{ selectedEc.libelle }}</div><br />
          <div class="row sm-gutter">
            <div class="col-md-8">
              <!--<q-input v-model="email" type="email" float-label="Numéro matricule de l'étudiant" clearable/>-->
              <div class="text-grey-8 text-italic" style="font-size: 23px">{{ etudiant.nom }} {{ etudiant.prenom }}</div>
              <div class="text-italic text-grey">Matricule : <b>{{ etudiant.numero }}</b></div>
            </div>
          </div>
        </div>
        </div>
        <div class="text-center content-center _modal-content" style="margin-top: 20px" v-else>
          <div class="_modal-content">
          <div class="row sm-gutter">
            <div class="col-md-7">
              <q-field
                icon="account_circle"
                label=""
                helper="numéro Matricule de l'étudiant"
              >
                <q-input v-model="etudiant.numero" @blur="checkEtudiant()" @change="checkEtudiant2()" float-label="Matricule" id="matricule" @keyup.enter="focusToNote()">
                  <q-autocomplete
                    @search="search"
                    @selected="selected"
                  />
                </q-input>
              </q-field>
            </div>
          </div>
        </div>
        <div class="_modal-content" style="border-bottom: none; margin-top: -30px">
          <div class="row sm-gutter">
            <div class="col-md-7">
              <q-field
                icon="rate_review"
                label=""
                helper="Insérer la note de l'étudiant"
              >
                <q-input ref="note" v-model="etudiant.note" float-label="Note" id="note" @keyup.enter="addToNoteToBeSend(etudiant)"/>
              </q-field>
            </div>
          </div>
        </div>
        <div class="_modal-content" style="border-bottom: none;">
          <div class="row">
            <div class="col">
              <q-btn class="shadow-0" flat color="primary" :disable="indexArrayEtudiant === -1 || (previous && indexArrayEtudiant === 0)" icon="chevron_left" @click="showPreviousNotes()">
                Precedent
              </q-btn>
            </div>
            <div class="col flex justify-end">
              <q-btn id="btn_suivant" class="shadow-0" flat color="primary" :disable="etudiantsFiltred.length === 0 && !previous" @click="addToNoteToBeSend(etudiant)" icon-right="chevron_right">
                Suivant
              </q-btn>
            </div>
          </div>
        </div>
          <blockquote>
            <p>
              Vous avez ajouté toutes les notes
            </p>
            <small v-if="etudiants.length !== etudiantsFiltredSave.length"><cite title="Quasar Framework"><a @click="previous = true">modifier</a></cite></small>
          </blockquote>
        </div>
        <div slot="footer" :class="'_no-shadow'" style="padding: 15px 100px 20px;">
          <div class="flex flex-center">
            <q-btn color="primary" style="height: 50px;" rounded push class="col-md-7 col-sm-12 col-12"
                  @click="insererEtudiant()">Ajouter
            </q-btn>
          </div>
        </div>
      </q-modal-layout>
    </q-modal>
    <!-- Modal Historique Notes -->
    <q-modal ref="historiqueNote" class="_noteModal" v-model="historiqueNote"
             :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '70vw', minHeight: '80vh'}">
      <q-modal-layout>
        <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey;">
          <div class="text-center">
            <div class="col-sm-12 layout-padding ">
              <div style="margin: 0;font-size: 24px" class="light-paragraph">Historique des modifications de note</div>
            </div>
          </div>
          <q-btn flat round small @click="$refs.historiqueNote.close()" style="position: absolute;top: 1em;right: 1em">
            <q-icon name="close" />
          </q-btn>
        </div>
        <div class="row justify-center" style="margin-top: 20px">
            <table class="q-table bordered cell-separator striped-odd">
            <thead>
            <tr>
              <th class="text-left">Matricule</th>
              <th class="text-left">Etudiant</th>
              <th class="text-right">Ancienne note</th>
              <th class="text-right">Nouvelle note</th>
              <th class="text-right">Motif</th>
              <th class="text-right">Responable</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="m in modif" :key="m.id">
              <td class="text-left">{{ m.etudiant.numeroMatricule }}</td>
              <td class="text-left">{{ m.etudiant.idPersonne.nom }} {{ m.etudiant.idPersonne.prenom }}</td>
              <td class="text-left">{{ m.oldNote }}</td>
              <td class="text-left">{{ m.newNote }}</td>
              <td class="text-left">
                <span v-if="m.motif === 'Modification anormale'" style="color:red">{{ m.motif }}</span>
                <span v-else-if="m.motif === 'Compensation'" style="color:green">{{ m.motif }}</span>
                <span v-else>{{ m.motif }}</span>
              </td>
              <td class="text-left">{{ m.utilisateur.nom }} {{ m.utilisateur.prenom }}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div slot="footer" :class="'_no-shadow'" style="padding: 15px 100px 20px;">
          <div class="flex flex-center">
            <q-btn color="primary" style="height: 50px;" rounded push class="col-md-7 col-sm-12 col-12"
                   @click="$refs.historiqueNote.close()">Fermer
            </q-btn>
          </div>
        </div>
      </q-modal-layout>
    </q-modal>

    <!--Modal update Note-->
    <q-modal ref="modalUpdateNote" class="_noteModal" v-model="modalUpdateNote"
             :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '40vw', minHeight: '70vh'}">
      <q-modal-layout>
        <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey;">
          <div class="text-center">
            <div class="col-sm-12 layout-padding ">
              <div style="margin: 0;font-size: 24px" class="light-paragraph">Modification d'une note</div>
            </div>
          </div>
          <q-btn flat round small @click="$refs.modalUpdateNote.close()" style="position: absolute;top: 1em;right: 1em">
            <q-icon name="close" />
          </q-btn>
        </div>
        <div>
        <div class="_modal-content">
          <div class="row sm-gutter">
            <div class="col-md-7">
              <q-field
                icon="account_circle"
                label=""
                helper="numéro Matricule de l'étudiant"
              >
                <q-input v-model="selectedNoteUpdate.etudiant.numeroMatricule" float-label="Matricule" disable>
                </q-input>
              </q-field>
            </div>
          </div>
        </div>
        <div class="_modal-content" style="border-bottom: none; margin-top: -30px">
          <div class="row sm-gutter">
            <div class="col-md-7">
              <q-field
                icon="rate_review"
                label=""
                helper="Insérer la note de l'étudiant"
              >
                <q-input ref="note" v-model="selectedNoteUpdate.noteEc" float-label="Note"/>
              </q-field>
            </div>
            <div class="col-md-7">
              <q-field
                icon="note_add"
                label=""
                helper="motif de la modification"
              >            
              <q-field
                :error="$v.motif.$error"
                error-label="Le motif est obligatoire"
              >
                <q-input v-model="motif" type="textarea" :max-height="100" :min-rows="4" @input="$v.motif.$touch" :error="$v.motif.$error" float-label="Motif *"/>
              </q-field>
              </q-field>
            </div>
          </div>
        </div>
        <div class="_modal-content">
          <div style="font-size: 18px;" class="text-grey-8 text-italic">Résumé</div>
          <div class="q-item-sublabel text-italic">Note de {{ selectedEc.libelle }}</div><br />
          <div class="row sm-gutter">
            <div class="col-md-8">
              <!--<q-input v-model="email" type="email" float-label="Numéro matricule de l'étudiant" clearable/>-->
              <div class="text-grey-8 text-italic" style="font-size: 23px">{{ selectedNoteUpdate.etudiant.idPersonne.nom }} {{ selectedNoteUpdate.etudiant.idPersonne.prenom }}</div>
              <div class="text-italic text-grey">Matricule : <b>{{ selectedNoteUpdate.etudiant.numeroMatricule }}</b></div>
            </div>
          </div>
        </div>
        </div>
        <div slot="footer" :class="'_no-shadow'" style="padding: 15px 100px 20px;">
          <div class="flex flex-center">
            <q-btn color="primary" style="height: 50px; margin-right: 10px" class=""
                   @click="updateNote()">Modifier
            </q-btn>
            <q-btn color="white" style="height: 50px;" class="text-black"
                   @click="resetNoteValue()">Annuler
            </q-btn>
          </div>
        </div>
      </q-modal-layout>
    </q-modal>

    <!--Modal compensation Note-->
    <q-modal ref="modalCompenserNote" class="_noteModal" v-model="modalCompenserNote"
             :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '40vw', minHeight: '70vh'}">
      <q-modal-layout>
        <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey;">
          <div class="text-center">
            <div class="col-sm-12 layout-padding ">
              <div style="margin: 0;font-size: 24px" class="light-paragraph">Compensation</div>
            </div>
          </div>
          <q-btn flat round small @click="$refs.modalCompenserNote.close()" style="position: absolute;top: 1em;right: 1em">
            <q-icon name="close" />
          </q-btn>
        </div>
        <div>
        <div class="_modal-content">
          <div class="row sm-gutter">
            <div class="col-md-7">
              <q-field
                icon="account_circle"
                label=""
                helper="numéro Matricule de l'étudiant"
              >
                <q-input v-model="selectedNoteCompense.etudiant.numeroMatricule" float-label="Matricule" disable>
                </q-input>
              </q-field>
            </div>
          </div>
        </div>
        <div class="_modal-content" style="border-bottom: none; margin-top: -30px">
          <div class="row sm-gutter">
            <div class="col-md-7">
              <q-field
                icon="rate_review"
                label=""
                helper="Insérer la note de l'étudiant"
              >
                <q-input ref="note" v-model="selectedNoteCompense.noteEc" float-label="Note"/>
              </q-field>
            </div>
            <div class="col-md-7">
               <div class="q-item-sublabel text-italic">Vous êtes entrain de compenser cette note</div>
            </div>
          </div>
        </div>
        <div class="_modal-content">
          <div style="font-size: 18px;" class="text-grey-8 text-italic">Résumé</div>
          <div class="q-item-sublabel text-italic">Note de {{ selectedEc.libelle }}</div><br />
          <div class="row sm-gutter">
            <div class="col-md-8">
              <!--<q-input v-model="email" type="email" float-label="Numéro matricule de l'étudiant" clearable/>-->
              <div class="text-grey-8 text-italic" style="font-size: 23px">{{ selectedNoteCompense.etudiant.idPersonne.nom }} {{ selectedNoteCompense.etudiant.idPersonne.prenom }}</div>
              <div class="text-italic text-grey">Matricule : <b>{{ selectedNoteCompense.etudiant.numeroMatricule }}</b></div>
            </div>
          </div>
        </div>
        </div>
        <div slot="footer" :class="'_no-shadow'" style="padding: 15px 100px 20px;">
          <div class="flex flex-center">
            <q-btn color="primary" style="height: 50px; margin-right: 10px" class=""
                   @click="compenserNote()">Compenser
            </q-btn>
            <q-btn color="white" style="height: 50px;" class="text-black"
                   @click="resetNoteCompenser()">Annuler
            </q-btn>
          </div>
        </div>
      </q-modal-layout>
    </q-modal>

    <q-modal @close="previous = true" ref="verificationModal" v-model="verificationModal" class="_verificationModal"  :content-css="{borderRadius: '4px', paddingBottom: '20px',minWidth: '40vw', minHeight: '80vh'}">
      <q-modal-layout>
        <div slot="header" class="text-grey-8" style="border-bottom: 1px solid lightgrey;">
          <div class="text-center">
            <div class="col-sm-12 layout-padding ">
              <div style="margin: 0;font-size: 24px" class="light-paragraph">Liste des notes</div>
            </div>
          </div>
          <q-btn flat round small @click="$refs.verificationModal.close()" style="position: absolute;top: 1em;right: 1em">
            <q-icon name="close" />
          </q-btn>
        </div>
        <div class="_modal-content">
          <pre class="">
            <code class="language-javascript">
              {{ notesToSend }}
            </code>
          </pre>
        </div>
        <div slot="footer" :class="'_no-shadow'" style="padding: 15px 100px 20px;">
          <div class="text-center content-center">
            <q-btn color="secondary" style="height: 50px;" rounded push class="col-md-7 col-sm-12 col-12"
                   @click="insererNotesEtudiants()">Valider
            </q-btn>
            <q-btn color="white" style="height: 50px;" rounded push class="col-md-7 col-sm-12 col-12 text-black"
                   @click="$refs.verificationModal.close()">Modifier
            </q-btn>
          </div>
        </div>
      </q-modal-layout>
    </q-modal>
    <q-modal ref="voirDetails" maximized v-model="openDetailsEtudiantModal">
      <voir-details ref="voirDetailsModal"></voir-details>
    </q-modal>
  </div>
</template>

<script>
  import {
    QCard,
    QCardTitle,
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
    QFab,
    QCollapsible,
    QList,
    QSideLink,
    Toast,
    QAutocomplete,
    LocalStorage

  } from 'quasar'

  import VoirDetails from '../etudiant/VoirDetailsModal.vue'
  import { map, filter, first, last } from 'lodash'
  import { required, between } from 'vuelidate/lib/validators'
  import 'quasar-extras/animate/bounceInRight.css'
  import 'quasar-extras/animate/bounceOutRight.css'

  import jQuery from 'jquery'
  let $ = jQuery

  export default {
    components: {
      QCard,
      QCardTitle,
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
      QCollapsible,
      QList,
      QSideLink,
      VoirDetails,
      QAutocomplete
    },
    data () {
      return {
        searchEc: [],
        modif: [],
        historiqueNote: false,
        sessionString: '',
        oldNote: null,
        motif: '',
        isNoteSessionValide: false,
        modalUpdateNote: false,
        modalCompenserNote: false,
        OldselectedNoteUpdate: null,
        OldselectedNoteCompense: null,
        selectedNoteUpdate: {
          etudiant: {
            idPersonne: {
            }
          }
        },
        selectedNoteCompense: {
          etudiant: {
            idPersonne: {
            }
          }
        },
        focus: false,
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        dayNames: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        messageAjoutInscription: false,
        noteModal: false,
        etudiants: [],
        config: {
          rowHeight: '60px',
          title: '<span style="color: rgba(0,0,0,0.54);font-weight: bold;font-size: 95%;">Listes des notes</span>',
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
            width: '50px',
            type: 'number',
            filter: true
          },
          {
            label: 'Nom',
            field: 'nom',
            width: '75px',
            filter: true,
            type: 'string'
          },
          {
            label: 'Prénoms',
            field: 'prenom',
            width: '100px',
            filter: true,
            type: 'string'
          },
          {
            label: 'Note',
            field: 'noteEc',
            width: '50px',
            filter: true,
            sort: true,
            type: 'number'
          }
        ],
        ue: [],
        annee: '',
        anneeOptions: [],
        mention: '',
        mentionOptions: [],
        parcours: '',
        parcoursOptions: [],
        semestre: '',
        semestreOptions: [],
        session: '',
        sessionOptions: [],
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
        openDetailsEtudiantModal: false,
        numAuto: false,
        verificationModal: false,
        oldEtudiant: null,
        etudiant: {
          id: null,
          numero: '',
          note: '',
          nom: '',
          prenom: ''
        },
        notes: [],
        selectedEc: '',
        etudiantsFiltred: [],
        etudiantsFiltredSave: [],
        notesToSend: [],
        notesWrapper: null,
        indexArrayEtudiant: -1,
        arrayEtudiantModal: [],
        previous: false,
        isSelectedEtudiant: false,
        motifDerne: 'Modification anormale'
      }
    },
    validations: {
      motif: { required },
      etudiant: {
        numero: { required },
        note: { required, between: between(0, 20) }
      }
    },
    computed: {
      allFormFill: function () {
        return this.annee !== '' && this.mention !== '' && this.parcours !== '' && this.semestre !== '' && this.session !== ''
      },
      allRequiredFieldModifNote: function () {
        return this.motif !== ''
      }
    },
    watch: {
      allFormFill: function (val) {
        if (val) {
          this.findPlanFormation()
        }
      },
      mention: function (val) {
        if (val) {
          this.parcoursOptions = []
          this.$store.dispatch('parcours/getParcoursByMention', this.mention.id)
            .then((res) => {
              this.parcoursOptions = []
              map(res, p => {
                let parcours = {
                  label: p.libelle,
                  value: p.id,
                  icon: 'bubble_chart'
                }
                this.parcoursOptions.push(parcours)
              })
              this.parcours = last(res).id
            })
            .catch((err) => {
              console.log(err)
            })
        }
      },
      selectedEc: function (val) {
        if (val.id) {
          Loading.show()
          this.getNotesByFilter(val)
          this.checkIfNoteSessionValide()
        }
      },
      noteModal: function (val) {
        if (!val) {
          this.getNotesByFilter(this.selectedEc)
          this.arrayEtudiantModal = []
          this.notesToSend = []
          this.oldEtudiant = null
          this.indexArrayEtudiant = -1
          this.previous = false
        }
        this.etudiant = {
          id: null,
          numero: '',
          note: '',
          nom: '',
          prenom: ''
        }
      },
      session: function (val) {
        let session = filter(this.sessionOptions, (s) => {
          return s.value === val
        })
        this.sessionString = session[0].label
        if (this.allFormFill) {
          this.findPlanFormation()
        }
      },
      annee: function (val) {
        if (val) {
          this.fillSemestre(val)
        }
      },
      semestre: function (val) {
        if (this.allFormFill) {
          this.findPlanFormation()
        }
      },
      parcours: function (val) {
        if (this.allFormFill) {
          this.findPlanFormation()
        }
      }
    },
    methods: {
      showHitoryModal () {
        this.historiqueNote = true
        let params = {
          idEc: this.selectedEc.id,
          idAnneeUniversitaire: this.annee,
          idSemestre: this.semestre
        }
        this.$store.dispatch('historiquenotes/getByFilter', params)
          .then((res) => {
            this.modif = res
          })
          .catch((err) => {
            console.log('Err get historiques', err)
          })
      },
      fillSemestre (id) {
        this.$store.dispatch('semestre/getSemestreByIdAnneeUniversitaire', id)
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
      sendToServer () {
        Loading.show()
        var form = $('#fileUploadForm')[0]
        var data = new FormData(form)
        console.log('for jeho', data)
        data.append('idEc', this.selectedEc.id)
        data.append('idAnneeUniversitaire', this.annee)
        data.append('idSemestre', this.semestre)
        data.append('idSession', this.session)
        this.$refs.uploadExcelModal.close()

        this.$store.dispatch('upload/uploadExcel', data)
          .then((res) => {
            console.log('retour aprés upload excel note : ', res)
            if (res === 'Uploaded') {
              Loading.hide()
              this.$alert.success('Importation réussie')
              this.getNotesByFilter(this.selectedEc)
              data = null
            }
            else {
              Loading.hide()
              this.$refs.uploadExcelModal.close()
              this.$alert.error('Une erreur est survenue lors de l\'importation')
            }
          })
          .catch((err) => {
            console.log('ERROR', err)
            Loading.hide()
            this.$refs.uploadExcelModal.close()
            this.$alert.error('Une erreur est survenue')
          })
      },
      deleteNote (selection) {
        let params = {
          idEc: this.selectedEc.id,
          idAnneeUniversitaire: this.annee,
          idEtudiant: selection.rows[0].data.etudiant.id,
          idSemestre: this.semestre,
          idSession: this.session,
          etudiant: selection.rows[0].data.etudiant.id,
          noteEc: selection.rows[0].data.noteEc
        }
        console.log('note to be deleted', params)
        Dialog.create({
          title: '<div style="color: red;">Suppression</div>',
          message: `Voulez-vous vraiment supprimer cette note ?`,
          buttons: [
            'Annuler',
            {
              label: '<div style="color: red;">Oui, supprimer définitivement</div>',
              handler: () => {
                this.$store.dispatch('note/deleteNote', params)
                  .then((res) => {
                    console.log('Res Delete Note', res)
                    this.getNotesByFilter(this.selectedEc)
                    this.$alert.success('Suppression réussie')
                  })
                  .catch((err) => {
                    console.log('Error Delete Note', err)
                    this.$alert.error('Une erreur est survenue lors de la suppression')
                  })
              }
            }
          ]
        })
      },
      resetNoteValue () {
        let compareId = (at) => {
          return at.etudiant.numeroMatricule === this.OldselectedNoteUpdate.etudiant.numeroMatricule
        }
        let index = this.etudiants.findIndex(compareId)
        this.etudiants.splice(index, 1, this.OldselectedNoteUpdate)
        this.selectedNoteUpdate = this.OldselectedNoteUpdate
        this.modalUpdateNote = false
      },
      resetNoteCompenser () {
        this.modalCompenserNote = false
      },
      compenserNote () {
        let params = {
          idEc: this.selectedEc.id,
          idAnneeUniversitaire: this.annee,
          idEtudiant: this.selectedNoteCompense.etudiant.id,
          idSemestre: this.semestre,
          etudiant: this.selectedNoteCompense.etudiant.id,
          noteEc: this.selectedNoteCompense.noteEc
        }
        let params2 = {
          oldNote: this.oldNote,
          newNote: this.selectedNoteCompense.noteEc,
          motif: 'Compensation',
          ec: this.selectedEc.id,
          anneeUniversitaire: this.annee,
          semestre: this.semestre,
          sessionString: this.sessionString,
          etudiant: this.selectedNoteCompense.etudiant.id,
          utilisateur: JSON.parse(LocalStorage.get.item('user')).id
        }
        this.$store.dispatch('note/compenserNote', params)
          .then((res) => {
            console.log(res)
            this.modalCompenserNote = false
            this.$alert.success('Compensation avec succès')
            this.$store.dispatch('historiquenotes/addHistoriqueNotes', params2)
              .then((res) => {
                console.log('DONE!!!!')
              })
              .catch((err) => {
                console.log('ERR', err)
              })
          })
          .catch((err) => {
            console.log('Error Update Notes', err)
            this.$alert.error('Une erreur est survenue lors de la suppression')
          })
      },
      updateNote () {
        console.log('required', this.allRequiredFieldModifNote)
        if (this.allRequiredFieldModifNote) {
          let params = {
            idEc: this.selectedEc.id,
            idAnneeUniversitaire: this.annee,
            idEtudiant: this.selectedNoteUpdate.etudiant.id,
            idSemestre: this.semestre,
            idSession: this.session,
            etudiant: this.selectedNoteUpdate.etudiant.id,
            noteEc: this.selectedNoteUpdate.noteEc
          }
          if (this.motif === 'Compensation' || this.motif === '') {
            this.motif = this.motifDerne
          }
          let params2 = {
            oldNote: this.oldNote,
            newNote: this.selectedNoteUpdate.noteEc,
            motif: this.motif,
            ec: this.selectedEc.id,
            anneeUniversitaire: this.annee,
            semestre: this.semestre,
            sessionString: this.sessionString,
            etudiant: this.selectedNoteUpdate.etudiant.id,
            utilisateur: JSON.parse(LocalStorage.get.item('user')).id
          }
          console.log('Add Note params', params)
          this.$store.dispatch('note/updateNote', params)
            .then((res) => {
              console.log(res)
              this.modalUpdateNote = false
              this.$alert.success('Modifié avec succès')
              this.$store.dispatch('historiquenotes/addHistoriqueNotes', params2)
                .then((res) => {
                  console.log('DONE!!!!')
                })
                .catch((err) => {
                  console.log('ERR', err)
                })
            })
            .catch((err) => {
              console.log('Error Update Notes', err)
              this.$alert.error('Une erreur est survenue lors de la suppression')
            })
        }
      },
      openUpdateNoteModal (selection) {
        this.selectedNoteUpdate = selection.rows[0].data
        this.OldselectedNoteUpdate = JSON.parse(JSON.stringify(selection.rows[0].data))
        this.modalUpdateNote = true
        this.oldNote = this.selectedNoteUpdate.noteEc
      },
      openCompenserNoteModal (selection) {
        this.selectedNoteCompense = selection.rows[0].data
        this.OldselectedNoteCompense = JSON.parse(JSON.stringify(selection.rows[0].data))
        this.modalCompenserNote = true
        this.oldNote = this.selectedNoteCompense.noteEc
      },
      actionModalOpen () {
        if (this.etudiantsFiltred.length > 0) {
          document.getElementById('matricule').firstElementChild.children[1].focus()
        }
      },
      checkEtudiant () {
        if (!this.isSelectedEtudiant && this.etudiantsFiltred.length > 0) {
          this.etudiant.numero = ''
        }
      },
      checkEtudiant2 () {
        if (this.etudiant.id !== null) {
          console.log('MIDITRA ATO')
          this.etudiant = {
            id: null,
            numero: '',
            note: this.oldEtudiant.note,
            nom: '',
            prenom: ''
          }
          let etudiant = filter(this.etudiantsFiltredSave, (o) => {
            console.log('compare ' + o.label + 'avec' + this.oldEtudiant.numero)
            return o.label === this.oldEtudiant.numero
          })
          this.etudiantsFiltred.push(etudiant[0])
        }
        else {
        }
      },
      focusToNote () {
        document.getElementById('note').firstElementChild.children[1].focus()
      },
      showPreviousNotes () {
        if (!this.previous) {
          this.previous = true
        }
        else {
          this.indexArrayEtudiant--
        }
        let previous = this.arrayEtudiantModal[this.indexArrayEtudiant]
        this.etudiant = previous
        this.oldEtudiant = JSON.parse(JSON.stringify(previous))
      },
      addToNoteToBeSend (etudiant) {
        console.log(etudiant)
        this.$v.etudiant.$touch()
        if (this.$v.etudiant.$error) {
          if (!this.$v.etudiant.between) {
            this.$alert.error('Veuillez saisir un note entre 0 et 20')
          }
          else {
            this.$alert.error('Veuillez vérifier tous les champs')
          }
        }
        else {
          document.getElementById('matricule').firstElementChild.children[1].focus()
          if (this.previous) {
            console.log('ato eh')
            let var1 = this.arrayEtudiantModal.length - 1
            let var2 = var1 - this.indexArrayEtudiant
            console.log('var2', var2)
            if (var2 > 0) {
              this.arrayEtudiantModal.splice(this.indexArrayEtudiant, 1, this.etudiant)
              this.indexArrayEtudiant++
              this.etudiant = this.arrayEtudiantModal[this.indexArrayEtudiant]
            }
            else if (var2 === 0) {
              this.arrayEtudiantModal.splice(this.indexArrayEtudiant, 1, this.etudiant)
              if (this.etudiantsFiltred.length > 0) {
                this.etudiant = {
                  id: null,
                  numero: '',
                  note: '',
                  nom: '',
                  prenom: ''
                }
              }
              this.previous = false
            }
            else {
              console.log('PREMIER ADD')
              this.addTheNote(etudiant)
            }
          }
          else {
            console.log('SECOND ADD')
            this.previous = false
            this.addTheNote(etudiant)
          }
        }
      },
      addTheNote (etudiant) {
        this.isSelectedEtudiant = false
        this.arrayEtudiantModal.push(etudiant)
        this.indexArrayEtudiant++
        console.log('ilay etudiant', etudiant)
        let compareId = (at) => {
          return at.value.id === etudiant.id
        }
        let index = this.etudiantsFiltred.findIndex(compareId)
        this.etudiantsFiltred.splice(index, 1)
        if (this.etudiantsFiltred.length > 0) {
          this.etudiant = {
            id: null,
            numero: '',
            note: '',
            nom: '',
            prenom: ''
          }
        }
      },
      search (terms, done) {
        console.log('terms', terms)
        setTimeout(() => {
          done(this.etudiantsFiltred.filter(etudiant => {
            return (etudiant.value.numeroMatricule).match(terms)
          }))
        }, 100)
      },
      selected (item) {
        this.isSelectedEtudiant = true
        console.log(item)
        Toast.create(item.value.idPersonne.nom + ' ' + item.value.idPersonne.prenom)
        this.etudiant.numero = item.value.numeroMatricule
        this.etudiant.nom = item.value.idPersonne.nom
        this.etudiant.prenom = item.value.idPersonne.prenom
        this.etudiant.id = item.value.id
      },
      getEtudiantByFilter (notes) {
        let params = {
          idParcours: this.parcours,
          idSemestre: this.semestre,
          idAnneeUniversitaire: this.annee
        }
        this.$store.dispatch('note/getEtudiantByFilter', params)
          .then((res) => {
            this.etudiantsFiltredSave = []
            this.etudiantsFiltred = []
            map(res, e => {
              let etudiant = {
                label: e.numeroMatricule,
                value: e
              }
              this.etudiantsFiltredSave.push(etudiant)
              this.etudiantsFiltred.push(etudiant)
            })
            notes.forEach((n) => {
              this.etudiantsFiltred = this.etudiantsFiltred.filter(e => e.value.numeroMatricule !== n.etudiant.numeroMatricule)
            })
            console.log('consoleLog après map', this.etudiantsFiltred)
          })
          .catch((err) => {
            console.log('error get etudiant by filter', err)
          })
      },
      getNotesByFilter (ec) {
        let params = {
          idEc: ec.id,
          idAnneeUniversitaire: this.annee,
          idSemestre: this.semestre,
          idSession: this.session
        }
        this.$store.dispatch('note/getNotesByFilter', params)
          .then((res) => {
            Loading.show()
            setTimeout(() => {
              this.etudiants = []
              map(res, (et) => {
                et.noteEc = et.noteEc
                et.nom = et.etudiant.idPersonne.nom
                et.prenom = et.etudiant.idPersonne.prenom
                et.matricule = et.etudiant.numeroMatricule
                this.etudiants.push(et)
              })
              this.getEtudiantByFilter(res)
              Loading.hide()
            }, 1000)
          })
          .catch((err) => {
            console.log('error when trying to get filtered etudiants', err)
          })
      },
      printNoteEtudiants () {
        let params = {
          idEc: this.selectedEc.id,
          idAnneeUniversitaire: this.annee,
          idSemestre: this.semestre,
          idParcours: this.parcours,
          idSession: this.session
        }
        if (params.idEc !== undefined && params.idAnneeUniversitaire !== undefined && params.idSemestre !== undefined && params.idParcours !== undefined && params.idSession !== undefined) {
          Loading.show()
          this.$store.dispatch('note/printNoteEtudiants', params)
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
              this.$alert.error('Une erreur est survenue. Recharger la page')
              console.log(err)
            })
        }
      },
      setSelectedEc (ec) {
        this.selectedEc = ec
      },
      findPlanFormation () {
        this.etudiants = []
        this.selectedEc = ''
        let params = {
          idParcours: this.parcours,
          idSemestre: this.semestre,
          idAnneeUniversitaire: this.annee
        }
        Loading.show()
        this.$store.dispatch('planformation/getPlanDeFormation', params)
          .then((ues) => {
            Loading.hide()
            for (var i = ues.length - 1; i >= 0; i--) {
              ues[i].ecCollection = []
              let id = ues[i].id
              this.$store.dispatch('ec/getAllEcOfUe', id)
                .then(ecs => {
                  let ue = this.ue.find(ue => ue.id === id)
                  ue.ecCollection = ecs
                })
            }
            this.ue = ues
          })
          .catch((err) => {
            console.log('err', err)
          })
      },
      getInfoSelectFilter () {
        this.$store.dispatch('anneeuniversitaire/getAllAnneeUniversitaire')
          .then((res) => {
            map(res, (a, i) => {
              let annee = {
                label: a.code,
                value: a.id,
                icon: 'date_range',
                semestre: a.semestre
              }
              this.anneeOptions.push(annee)
            })
            this.annee = last(this.anneeOptions).value
          })
          .catch((err) => {
            console.log('err', err)
          })
        this.$store.dispatch('getFonction')
          .then((fonction) => {
            const {composant} = fonction.vars
            this.$store.dispatch('mention/getAllMentionByComposant', composant.id)
              .then((res) => {
                map(res, m => {
                  let mention = {
                    label: m.libelle,
                    value: m,
                    icon: 'extension'
                  }
                  this.mentionOptions.push(mention)
                })
                this.mention = first(this.mentionOptions).value
              })
              .catch((err) => {
                console.log('err', err)
              })
          })
          .catch((err) => {
            console.log('Cannot get mentions', err)
          })
        this.$store.dispatch('session/getAllSession')
          .then((res) => {
            map(res, s => {
              let session = {
                label: s.libelle,
                value: s.id,
                icon: 'insert_invitation'
              }
              this.sessionOptions.push(session)
            })
            this.session = first(this.sessionOptions).value
          })
          .catch((err) => {
            console.log('err', err)
          })
      },
      openNoteModal () {
        this.noteModal = true
        /* setTimeout(() => {
          let element = document.getElementById('matricule').firstElementChild.children[1].focus()
          console.log('element', element)
        }, 100) */
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
      insererEtudiant () {
        // this.notesToSend = []
        // addToNoteToBeSend(this.etudiant)
        let etudiant = this.etudiant
        console.log(etudiant)
        this.$v.etudiant.$touch()
        if (this.$v.etudiant.$error) {
          if (!this.$v.etudiant.between) {
            this.$alert.error('Veuillez saisir un note entre 0 et 20')
          }
          else {
            this.$alert.error('Veuillez vérifier tous les champs')
          }
        }
        else {
          document.getElementById('matricule').firstElementChild.children[1].focus()
          if (this.previous) {
            console.log('ato eh')
            let var1 = this.arrayEtudiantModal.length - 1
            let var2 = var1 - this.indexArrayEtudiant
            console.log('var2', var2)
            if (var2 > 0) {
              this.arrayEtudiantModal.splice(this.indexArrayEtudiant, 1, this.etudiant)
              this.indexArrayEtudiant++
              this.etudiant = this.arrayEtudiantModal[this.indexArrayEtudiant]
            }
            else if (var2 === 0) {
              this.arrayEtudiantModal.splice(this.indexArrayEtudiant, 1, this.etudiant)
              if (this.etudiantsFiltred.length > 0) {
                this.etudiant = {
                  id: null,
                  numero: '',
                  note: '',
                  nom: '',
                  prenom: ''
                }
              }
              this.previous = false
            }
            else {
              console.log('PREMIER ADD')
              this.addTheNote(etudiant)
            }
          }
          else {
            console.log('SECOND ADD')
            this.previous = false
            this.addTheNote(etudiant)
          }
        }
        let ueChoisi = ''
        this.$store.dispatch('note/addNoteByIdEc', this.selectedEc.id)
          .then((res) => {
            console.log('0--- :' + res)
            let idUeoptChoisi = 0
            this.addTheNote(etudiant)
            if (res === -1) {
              this.$store.dispatch('ueoptionnel/getInfosByIdEc', this.selectedEc.id)
                .then((libelleUeChoisi) => {
                  ueChoisi = libelleUeChoisi
                  console.log('LABEL ' + ueChoisi)
                  this.$alert.error('Impossible d\'insérer une note pour cet EC car UE optionnelle choisie est :' + ueChoisi)
                })
            }
            else if (res === 0) {
              idUeoptChoisi = res
              map(this.arrayEtudiantModal, e => {
                let note = []
                note = {
                  presenceSessionPK: {
                    idEc: this.selectedEc.id,
                    idSemestre: this.semestre,
                    idAnneeUniversitaire: this.annee,
                    idEtudiant: e.id,
                    idSession: this.session
                  },
                  noteEc: e.note
                }
                this.$store.dispatch('note/getNoteByIdEc', this.selectedEc.id)
                  .then((noteChoisi) => {
                    console.log('noteECChoisi ' + noteChoisi)
                    if (noteChoisi === '') {
                      this.notesToSend.push(note)
                      Alert.create({enter: 'bounceInRight', leave: 'bounceOutRight', color: 'positive', html: 'La note a bien été ajoutée'})
                    }
                    else {
                      this.$alert.error('Impossible d\'insérer une note pour cet EC car il a déjà une note')
                    }
                  })
              })
              this.notesWrapper = {
                tabPresenceSession: this.notesToSend
              }
              this.verificationModal = true
            }
            else if (res > 0) {
              idUeoptChoisi = res
              this.$store.dispatch('ec/getAllEcOfUeOptionnel', idUeoptChoisi)
                .then((idEcSelectable) => {
                  console.log('idEcSelectable :' + idEcSelectable)
                  let identEc = 0
                  map(idEcSelectable, (a, i) => {
                    console.log('2--- :' + a.id)
                    identEc = {
                      id: a.id
                    }
                    if (identEc.id === this.selectedEc.id) {
                      map(this.arrayEtudiantModal, e => {
                        console.log('Valeur de UE optionnelle choisie :' + idUeoptChoisi)
                        this.$store.dispatch('ueoptionnel/getInfosByIdUe', idUeoptChoisi)
                          .then((libelleUeChoisi) => {
                            ueChoisi = libelleUeChoisi
                            console.log('LABEL ' + ueChoisi)
                            Alert.create({enter: 'bounceInRight', leave: 'bounceOutRight', color: 'positive', html: 'Unité d\'Enseignement optionnelle choisie :' + ueChoisi})
                          })
                        let note = []
                        note = {
                          presenceSessionPK: {
                            idEc: this.selectedEc.id,
                            idSemestre: this.semestre,
                            idAnneeUniversitaire: this.annee,
                            idEtudiant: e.id,
                            idSession: this.session
                          },
                          noteEc: e.note
                        }
                        this.$store.dispatch('note/getNoteByIdEc', this.selectedEc.id)
                          .then((noteChoisi) => {
                            console.log('noteECChoisi ' + noteChoisi)
                            if (noteChoisi === '') {
                              this.notesToSend.push(note)
                              Alert.create({enter: 'bounceInRight', leave: 'bounceOutRight', color: 'positive', html: 'La note a bien été ajoutée'})
                            }
                            else {
                              this.$alert.error('Impossible d\'insérer une note pour cet EC car il a déjà une note')
                            }
                          })
                      })
                      this.notesWrapper = {
                        tabPresenceSession: this.notesToSend
                      }
                      this.verificationModal = true
                    }
                  })
                })
                .catch((error) => {
                  console.log('Ec not found', error)
                })
            }
          })
          .catch((error) => {
            console.log('Ajout.vue ajouter Note', error)
          })
      },
      voirDetailEtudiant () {
        this.openDetailsEtudiantModal = true
      },
      toggleSelect () {
        for (let i = 0; i < this.$refs.datatable.rowSelection.length; i++) {
          this.$set(this.$refs.datatable.rowSelection, i, !this.selectAll)
        }
        this.selectAll = !this.selectAll
      },
      insererNotesEtudiants () {
        this.$store.dispatch('note/addAllNotes', this.notesWrapper)
          .then((res) => {
            console.log('res Add All', res)
            this.verificationModal = false
            this.noteModal = false
            this.getNotesByFilter(this.selectedEc)
            this.$alert.success('Ajout avec succès')
          })
          .catch((err) => {
            console.log('err add All Notes', err)
            this.$alert.error('Une erreur est survenue lors de l\'ajout')
          })
      },
      checkIfNoteSessionValide () {
        this.$store.dispatch('checkNoteEcSessionValide', {
          idAnnee: this.annee,
          idSemestre: this.semestre,
          idSession: this.session,
          idEc: this.selectedEc.id
        })
          .then((res) => {
            this.isNoteSessionValide = res
            console.log('Session valide: ', res)
            if (this.isNoteSessionValide) {
              console.log('Ec Session VALIDE')
            }
            else {
              console.log('Ec Session NON VALIDE')
            }
          })
          .catch((err) => {
            console.log('Erreur session valide: ', err)
          })
      }
    },
    mounted () {
      this.InituploadExcel()
      this.getInfoSelectFilter()
      this.$refs.voirDetailsModal.$on('close', () => {
        this.openDetailsEtudiantModal = false
      })
    }
  }
</script>

<style>
  ._no-padding {
    padding: 0 !important;
  }

  ._modal-content {
    padding: 15px 70px;
    border-bottom: 1px solid whitesmoke;

  }

  ._noteModal, ._verificationModal
    .layout-header {
    box-shadow: none;
  }


  .layout-footer {
    box-shadow: none;
    border-top: 1px solid lightgrey;
  }

  @media only screen and (max-width: 500px) {
    ._modal-content {
      padding: 10px 10px;
      border-bottom: 1px solid whitesmoke;
    }
  }

  pre {
    padding: 10px;
    background: #fafafa;
    font: 12px/18px Consolas,monospace,serif;
    color: #444;
    -moz-tab-size: 4;
    tab-size: 4;
    overflow: auto;
    border: 1px solid #ddd;
    border-radius: 3px;
  }

  ._modal-content {
    padding: 15px 70px;
    border-bottom: 1px solid whitesmoke;
  }

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
    padding: 6.25rem 1.25rem;
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

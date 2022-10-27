<template>
  <div>
    <div class="layout-padding">
      <!-- Data table liste des personnes -->
      <q-data-table
        :data="personne"
        :config="config"
        :columns="columns"
        @refresh="refresh"
      >
        <!-- Custom renderer when user selected one or more rows -->
        <template slot="selection" slot-scope="selection">
          <q-btn color="primary" icon="edit" @click="openModalModifier(selection)">
            <span class="gt-sm">Modifier</span>
          </q-btn>
          <q-btn color="negative" icon="delete" @click="deletePersonne(selection)">
            <span class="gt-sm">Supprimer</span>
          </q-btn>
        </template>
      </q-data-table>
      <q-btn
        round
        color="primary"
        @click="createModal = true"
        class="fixed"
        icon="add"
      />
    </div>
    <q-modal v-model="createModal" :content-css="{padding: '20px', minWidth: '40vw', minHeight: '40vh'}" >
      <h6 class="text-center">Ajout d'une personne</h6>
      <q-input v-model="newPersonne.nom" float-label="Nom" placeholder="" />
      <q-input v-model="newPersonne.prenoms" float-label="Prénoms" placeholder="" />
      <q-input v-model="newPersonne.age" float-label="Age" placeholder="" />
      <q-btn color="primary" @click="createPersonne()">Enregistrer</q-btn>
      <q-btn @click="createModal = false">Annuler</q-btn>
    </q-modal>
    <q-modal v-model="updateModal" :content-css="{minWidth: '40vw', minHeight: '40vh'}" >
      <h6 class="text-center">Modification d'une personne</h6>
      <q-input v-model="selectedPersonne.nom" float-label="Nom" placeholder="" />
      <q-input v-model="selectedPersonne.prenoms" float-label="Prénoms" placeholder="" />
      <q-input v-model="selectedPersonne.age" float-label="Age" placeholder="" />
      <q-btn color="primary" @click="updatePersonne()">Enregistrer</q-btn>
      <q-btn @click="createModal = false">Annuler</q-btn>
    </q-modal>
  </div>
</template>

<script>
  import {
    QDataTable,
    QBtn,
    QModal,
    QInput,
    Dialog
  } from 'quasar'

  import axios from 'axios'

  export default {
    components: {
      QDataTable,
      QBtn,
      QModal,
      QInput
    },
    data () {
      return {
        createModal: false,
        updateModal: false,
        personne: [],
        config: {
          // [REQUIRED] Set the row height
          rowHeight: '50px',
          // (optional) Title to display
          title: 'Liste des personnes',
          // (optional) No columns header
          noHeader: false,
          // (optional) Display refresh button
          refresh: true,
          // (optional)
          // User will be able to choose which columns
          // should be displayed
          columnPicker: true,
          // (optional) How many columns from the left are sticky
          leftStickyColumns: 0,
          // (optional) How many columns from the right are sticky
          rightStickyColumns: 2,
          // (optional)
          // Styling the body of the data table;
          // "minHeight", "maxHeight" or "height" are important
          bodyStyle: {
            maxHeight: '500px'
          },
          // (optional) By default, Data Table is responsive,
          // but you can disable this by setting the property to "false"
          responsive: true,
          // (optional) Use pagination. Set how many rows per page
          // and also specify an additional optional parameter ("options")
          // which forces user to make a selection of how many rows per
          // page he wants from a specific list
          pagination: {
            rowsPerPage: 15,
            options: [5, 10, 15, 30, 50, 500]
          },
          // (optional) Select one or more rows for an action
          // "single" adds a column with radio buttons for single row selection
          // "multiple" adds a column with checkboxes for multiple row selection
          // omitting the property will result in no selection column at all
          selection: 'single',
          // (optional) Override default messages when no data is available
          // or the user filtering returned no results.
          messages: {
            noData: 'Aucune données dans la base de données',
            noDataAfterFiltering: 'Aucun résultat. Veuillez raffiner les termes de votre recherche.'
          },
          labels: {
            columns: 'Colonnes',
            allCols: 'Toutes',
            rows: 'Lignes',
            selected: {
              singular: 'personne séléctionné.',
              plural: 'personne séléctionnés.'
            },
            clear: 'Annuler',
            search: 'Recherche',
            all: 'Tous'
          }
        },
        columns: [
          {
            label: 'Nom',
            field: 'nom',
            width: '100px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Prenoms',
            field: 'prenoms',
            width: '100px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Age',
            field: 'age',
            width: '100px',
            filter: true,
            sort: true,
            type: 'int'
          }
        ],
        newPersonne: {
          nom: '',
          prenoms: '',
          age: ''
        },
        selectedPersonne: []
      }
    },
    methods: {
      getAllPersonne () {
        axios.get('http://localhost:3000/personne')
          .then((response) => {
            this.personne = response.data
            console.log(response)
          })
          .catch((error) => {
            console.log(error)
          })
      },
      createPersonne () {
        axios.post('http://localhost:3000/personne', {
          nom: this.newPersonne.nom,
          prenoms: this.newPersonne.prenoms,
          age: this.newPersonne.age
        })
          .then((response) => {
            console.log(response)
            this.getAllPersonne()
          })
          .catch((error) => {
            console.log(error)
          })
        this.createModal = false
      },
      openModalUpdate (selection) {
        this.selectedPersonne = selection.rows[0].data
        this.updateModal = true
      },
      updatePersonne () {
        axios.put('http://localhost:3000/personne/' + this.selectedPersonne.id, {
          nom: this.selectedPersonne.nom,
          prenoms: this.selectedPersonne.prenoms,
          age: this.selectedPersonne.age
        })
          .then((response) => {
            console.log(response)
            this.getAllPersonne()
          })
          .catch((error) => {
            console.log(error)
          })
        this.updateModal = false
      },
      deletePersonne (selection) {
        this.selectedPersonne = selection.rows[0].data
        Dialog.create({
          title: '<div style="color: red;">Suppression</div>',
          message: `Voulez-vous vraiment supprimer cette personne ?`,
          buttons: [
            'Annuler',
            {
              label: '<div style="color: red;">Oui, supprimer définitivement</div>',
              handler: () => {
                axios.delete('http://localhost:3000/personne/' + this.selectedPersonne.id)
                  .then((response) => {
                    console.log(response)
                    this.getAllPersonne()
                  })
                  .catch((error) => {
                    console.log(error)
                  })
              }
            }
          ]
        })
      },
      refresh () {
        alert('balbalbla')
      }
    },
    mounted () {
      this.getAllPersonne()
    }
  }
</script>

<style>
</style>

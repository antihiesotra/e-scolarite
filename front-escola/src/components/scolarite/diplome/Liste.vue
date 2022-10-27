<template>
  <div class="layout-padding">
    <div class="row" v-if="!showTable">
      <q-card class="col-sm-12 col-md">
        <q-card-title>License</q-card-title>
        <div class="flex flex-center"><img src="statics/icons/school-1/004-mortarboard.png" width="80" /></div>
        <q-card-main>
          <div class="text-justify">
            En France, la licence est un diplôme national et un grade universitaire de premier cycle de l’enseignement supérieur, validant trois années d’études après le baccalauréat. L’obtention de la licence permet la poursuite d’études universitaires vers le grade de master, ou l’insertion dans la vie professionnelle. Une personne diplômée du grade de licence, par exemple en sciences, est « licenciée ès sciences ».
            La licence ne peut être délivrée que par une université habilitée, contrairement à un bachelor.
          </div>
        </q-card-main>
        <q-card-actions>
          <q-btn @click="toggleShowTable()" flat color="primary">Voir la liste des diplômés</q-btn>
        </q-card-actions>
      </q-card>
      <q-card class="col-sm-12 col-md">
        <q-card-title class="">Master</q-card-title>
        <div class="flex flex-center"><img src="statics/icons/school-1/004-mortarboard.png" width="80" /></div>
        <q-card-main>
          <div class="text-justify">
            Dans le système éducatif français, le master est un diplôme national et un grade de l’enseignement supérieur, validant un deuxième cycle de l’enseignement supérieur soit cinq années d’études après le baccalauréat.

            Le grade de master est délivré par des formations variées de l’enseignement supérieur, telles les écoles d’ingénieurs, les écoles de commerce ou les universités. Le diplôme national de master est délivré par un établissement public telle une université, deux ans après l’obtention d'une licence. Il confère le grade du même nom.

            Le nom « master » s’inspire du master’s degree c’est-à-dire la maîtrise dans les systèmes universitaires anglo-saxons.
          </div>
        </q-card-main>
        <q-card-actions>
          <q-btn @click="toggleShowTable()" flat color="primary">Voir la liste des diplômés</q-btn>
        </q-card-actions>
      </q-card>
      <q-card class="col-sm-12 col-md">
        <q-card-title>Doctorat</q-card-title>
        <!--<div class="flex flex-center"><q-icon style="font-size: 5em;" color="grey" name="school"/></div>-->
        <div class="flex flex-center"><img src="statics/icons/school-1/004-mortarboard.png" width="80" /></div>
        <q-card-main>
          <div class="text-justify">En France, le doctorat est le plus élevé des quatre grades universitaires. Il correspond au grade de docteur et sa collation est attestée par un diplôme national. Celui-ci peut être délivré, au nom de l'État, par les universités ou par d'autres établissements d'enseignement supérieur habilités à cet effet. Le grade de doctorat donne droit à l'usage du titre de docteur (ou Dr)1.

            Le doctorat est conféré, en principe, après trois années de recherche postérieures à l'obtention du grade de master et à la suite de la soutenance d'une thèse portant sur la réalisation de travaux scientifiques originaux. La préparation du doctorat constitue le troisième cycle de l'enseignement supérieur. Il sanctionne « une formation par la recherche, à la recherche et à l'innovation » et « une expérience professionnelle de recherche »2. C'est le grade universitaire généralement nécessaire pour devenir maître de conférences ou chercheur dans un établissement public.</div>
        </q-card-main>
        <q-card-actions>
          <q-btn @click="toggleShowTable()" flat color="primary">Voir la liste des diplômés</q-btn>
        </q-card-actions>
      </q-card>
    </div>
    <div class="row" v-if="showTable">
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
          </template>
          <template slot="col-decision" slot-scope="item">
            <q-chip v-if="item.data === 'Valide'" tag color="green">Valide</q-chip>
            <q-chip v-else tag color="orange">Non valide</q-chip>
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
      <!--<q-fixed-position corner="bottom-left" :offset="[18, 18]">-->
        <!--<q-btn-->
          <!--round-->
          <!--color="primary"-->
          <!--@click="toggleShowTable()"-->
          <!--class="animate-pop"-->
        <!--&gt;-->
          <!--<q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Retourner vers le choix des diplômes</q-tooltip>-->
          <!--<q-icon name="reply" />-->
        <!--</q-btn>-->
      <!--</q-fixed-position>-->
    </div>
    <div class="row">
      <q-fixed-position corner="bottom-left" :offset="[18, 18]">
        <q-btn
          round
          color="primary"
          @click="$router.push('/scolarite/diplome/etudiants')"
          class="animate-pop"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Attribuer un dipôme à un étudiant</q-tooltip>
          <q-icon name="add"></q-icon>
        </q-btn>
      </q-fixed-position>
    </div>
  </div>
</template>

<script>
  import {
    QCard,
    QCardTitle,
    QCardMain,
    QIcon,
    QBtn,
    QCardActions,
    QDataTable,
    QFixedPosition,
    QTooltip
  } from 'quasar'

  export default {
    components: {
      QCard,
      QCardTitle,
      QCardMain,
      QIcon,
      QBtn,
      QCardActions,
      QDataTable,
      QFixedPosition,
      QTooltip
    },
    data () {
      return {
        showTable: true,
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        dayNames: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        messageAjoutInscription: false,
        inscriptionModal: false,
        etudiants: [],
        config: {
          rowHeight: '60px',
          title: '<span style="color: rgba(0,0,0,0.54);font-weight: bold;font-size: 95%;">Listes des étudiants diplômés</span>',
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
            label: 'référence',
            field: 'reference',
            width: '50px',
            type: 'number',
            filter: true,
            sort: true
          },
          {
            label: 'Numero d\'ordre',
            field: 'numOrdre',
            width: '50px',
            type: 'number',
            filter: true,
            sort: true
          },
          {
            label: 'Nom',
            field: 'nom',
            width: '75px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Prénoms',
            field: 'prenom',
            width: '150px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Diplôme',
            field: 'diplome',
            width: '50px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Observation',
            field: 'observation',
            width: '50px',
            filter: true,
            sort: true,
            type: 'string'
          },
          {
            label: 'Reçu le',
            field: 'dateDelivrance',
            width: '50px',
            filter: true,
            sort: true,
            type: 'string'
          }
        ],
        // toogling all selection in datatable
        selectAll: false
      }
    },
    methods: {
      refresh (done) {
        this.getDiplomeAttribuesByComposant()
      },
      toggleShowTable () {
        this.showTable = !this.showTable
      },

      getDiplomeAttribuesByComposant () {
        this.$store.dispatch('getFonction')
          .then((fonction) => {
            const {composant} = fonction.vars
            this.$store.dispatch('diplome/getDiplomeAttribuesByComposant', composant.id)
              .then((res) => {
                this.etudiants = res.map((dipl) => {
                  let temp = {}
                  temp.reference = dipl.reference
                  temp.numOrdre = dipl.numeroDOrdre
                  temp.numMatr = dipl.diplome.libelle
                  temp.nom = dipl.personne.nom
                  temp.prenom = dipl.personne.prenom
                  temp.diplome = dipl.diplome.libelle
                  temp.observation = dipl.observation
                  temp.dateDelivrance = dipl.dateDeDelivrance
                  return temp
                })
              })
          })
      }
    },
    mounted () {
      this.refresh(() => {
        console.log('Init finished')
      })
    }
  }
</script>

<style>
</style>

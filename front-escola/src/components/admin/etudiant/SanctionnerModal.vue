<template>
  <div>
    <q-toolbar color="" class="shadow-0" style="border-bottom: 1px solid ghostwhite;padding-top: 0;padding-bottom: 0;">
      <q-item>
        <q-item-side avatar="statics/etablissement/fianarantsoa.png" />
      </q-item>
      <q-toolbar-title>
        {{ this.fullName }}
        <span slot="subtitle">Sanction de l' étudiant</span>
      </q-toolbar-title>

      <q-btn color="" icon="close" class="within-iframe-hide" flat @click="closeThisModal()" style="margin-right: 15px;padding-right: 10px;">
        Fermer
      </q-btn>
    </q-toolbar>
    <!-- if you want automatic padding use "layout-padding" class -->
    <div class="layout-padding">
      <!-- your content -->
      <div class="row"><div class="col-8 offset-2 text-center content-center">Nouvel sanction pour {{ this.fullName }}</div></div>
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
                <button class="q-btn row inline flex-center q-focusable q-hoverable relative-position q-btn-rectangle q-btn-standard bg-primary text-white" type="submit" id="btnSubmit">Enregistrer</button>
              </div>
            </q-card-main>
          </q-card>
        </div>
      </div>
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
    QSelect,
    QBtn,
    QInput,
    QRadio,
    QList,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
    QCheckbox,
    QField,
    QDatetime,
    Ripple,
    QCollapsible,
    Alert,
    QToolbar,
    QToolbarTitle
  } from 'quasar'

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
      QSelect,
      QBtn,
      QInput,
      QRadio,
      QList,
      QItem,
      QItemSide,
      QItemMain,
      QItemTile,
      QCheckbox,
      QField,
      QDatetime,
      QCollapsible,
      Alert,
      QToolbar,
      QToolbarTitle
    },
    data () {
      return {
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        dayNames: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        form: {
          profTuteur: '',
          telTuteur: '',
          adresseTuteur: ''
        },
        id: '',
        fullName: '',
        mesureOptions: [],
        mesure: '',
        annee: '',
        anneeOptions: [],
        semestre: '',
        semestreOptions: []
      }
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
        console.log('oldVal', oldVal)
        console.log('new val', newVal)
        this.id = newVal.idPersonne.id
        this.fullName = newVal.fullName
        map(newVal.idPersonne.parentCollection, (parent) => {
        })
      }
    },
    methods: {
      changerImage () {
        let reader = new FileReader()
        let self = this
        reader.onload = function (e) {
          self.avatarImage = e.target.result
        }
        reader.readAsDataURL(document.getElementById('image-input').files[0])
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
      closeThisModal () {
        this.$emit('close')
      },
      sendToServer () {
        var form = $('#sanctionForm')[0]
        var sanctionData = new FormData(form)
        sanctionData.append('idPersonne', this.id)
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
            this.closeThisModal()
          })
          .catch((err) => {
            if (err) this.$alert.error('Une erreur est survenue lors de l\'enregistrement')
          })
      }
    },
    mounted () {
      this.InituploadExcel()
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
    }
  }
</script>

<style lang="stylus">
  @import '~variables'

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

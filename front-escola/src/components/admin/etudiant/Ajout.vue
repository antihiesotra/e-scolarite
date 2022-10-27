<template>
  <!-- if you want automatic padding use "layout-padding" class -->
  <div class="layout-padding">
    <!-- your content -->
    <q-stepper flat ref="stepper" v-model="step" color="primary" alternative-labels contractable>
      <q-step name="etat_civil" title="Etat civil">
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
                <q-field
                  :error="$v.form.matricule.$error"
                  error-label="Le numéro matricule est obligatoire"
                >
                  <q-input v-model="form.matricule" type="text" @input="$v.form.matricule.$touch" :error="$v.form.matricule.$error" float-label="Numéro matricule *"/>
                </q-field>
                <q-field
                  :error="$v.form.nom.$error"
                  error-label="Le nom est obligatoire"
                >
                  <q-input v-model="form.nom" type="text" @input="$v.form.nom.$touch" :error="$v.form.nom.$error" float-label="Nom *"/>
                </q-field>
                <q-input v-model="form.prenom" type="text" float-label="Prénom(s)"/>
                <q-list style="padding: 16px;padding-top: 10px;padding-bottom: 10px;margin-top: 32px;">
                  <q-radio v-model="form.sexe" val="Homme" color="primary" class="text-grey" label="Homme" />
                  <q-radio v-model="form.sexe" val="Femme" color="primary" class="text-grey" label="Femme" style="margin-left: 10px" />
                </q-list>
                <q-field
                  :error="$v.form.adresse.$error"
                  error-label="L'adresse est obligatoire"
                >
                  <q-input v-model="form.adresse" type="text" @input="$v.form.adresse.$touch" :error="$v.form.adresse.$error" float-label="Adresse *"/>
                </q-field>
                <q-field
                  :error="$v.form.tel.$error"
                  error-label="Le contact est obligatoire"
                >
                  <q-input v-model="form.tel" type="text" @input="$v.form.tel.$touch" :error="$v.form.tel.$error" float-label="Contact *"/>
                </q-field>
                <q-input v-model="form.email" type="text" float-label="Email"/>
                <br/>
              </q-card-main>
            </q-card>
            <q-card >
              <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
                Mot de passe
              </q-card-title>
              <q-card-separator />
              <q-card-main style="margin-top: 0;padding-top: 0;">
                <q-input
                  float-label="Mot de passe"
                  v-model="form.password"
                  type="password"
                  no-pass-toogle="false"
                />
                <q-input
                  float-label="Répéter votre mot de passe"
                  v-model="form.passwordRepeat"
                  type="password"
                  no-pass-toogle="false"
                />
              </q-card-main>
            </q-card>
            <q-card >
              <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
                Naissance
              </q-card-title>
              <q-card-separator />
              <q-card-main style="margin-top: 0;padding-top: 0;">
                <q-datetime float-label="Née le *" format="DD MMMM YYYY"  :month-names="monthNames" :day-names="dayNames" cancel-label="" ok-label="Selectionner" clear-label="Effacer"  v-model="form.dateNais" type="date" />
                <q-field
                  :error="$v.form.lieuNais.$error"
                  error-label="Le lieu de naissance est obligatoire"
                >
                  <q-input v-model="form.lieuNais" type="text" @input="$v.form.lieuNais.$touch" :error="$v.form.lieuNais.$error" float-label="Née à *"/>
                </q-field>
                <q-field
                  :error="$v.form.nationalite.$error"
                  error-label="La nationalité est obligatoire"
                >
                  <q-input v-model="form.nationalite" type="text" @input="$v.form.nationalite.$touch" :error="$v.form.nationalite.$error" float-label="Nationalité *"/>
                </q-field>
                <q-field
                  :error="$v.form.pays.$error"
                  error-label="Le pays d'origine est obligatoire"
                >
                  <q-input v-model="form.pays" type="text" @input="$v.form.pays.$touch" :error="$v.form.pays.$error" float-label="Pays *"/>
                </q-field>
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
                      <q-checkbox color="primary" v-model="form.orphPere" />
                    </q-item-side>
                    <q-item-main>
                      <q-item-tile class="text-grey" label>Orphelin père</q-item-tile>
                    </q-item-main>
                  </q-item>
                </q-list>

                <q-input v-model="form.nomPere" type="text" float-label="Nom du père"/>
                <q-input v-model="form.profPere" type="text" float-label="Profession du père"/>
                <q-list link style="margin-top: 32px;padding-top: 0; padding-bottom: 0">
                  <q-item tag="label">
                    <q-item-side>
                      <q-checkbox color="primary" v-model="form.orphMere" />
                    </q-item-side>
                    <q-item-main>
                      <q-item-tile class="text-grey" label>Orphelin mère</q-item-tile>
                    </q-item-main>
                  </q-item>
                </q-list>
                <q-input v-model="form.nomMere" type="text" float-label="Nom de la mère"/>
                <q-input v-model="form.profMere" type="text" float-label="Profession de la mère"/>
                <q-input v-model="form.adresseParent" type="text" float-label="Adresse des parents"/>
                <q-input v-model="form.telParent" type="text" float-label="N° telephone des parents"/>
                <q-input v-model="form.nbFrere" type="number" :min="0" :max="100" :step="1" float-label="Nombre de frère(s)"/>
                <q-input v-model="form.nbSoeur" type="number" :min="0" :max="100" :step="1" float-label="Nombre de soeur(s)"/>
                <br/>
              </q-card-main>
            </q-card>
            <q-card >
              <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
                Tuteur
              </q-card-title>
              <q-card-separator />
              <q-card-main style="margin-top: 0;padding-top: 0;padding-bottom: 0;">
                <q-input v-model="form.nomTuteur" type="text" float-label="Nom du tuteur"/>
                <q-input v-model="form.profTuteur" type="text" float-label="Profession du tuteur"/>
                <q-input v-model="form.telTuteur" type="text" float-label="N° telephone du tuteur"/>
                <q-input v-model="form.adresseTuteur" type="text" float-label="Adresse du tuteur"/>
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
                      <q-radio color="primary" v-model="form.situation" val="célibataire" />
                    </q-item-side>
                    <q-item-main>
                      <q-item-tile class="text-grey" label>Célibataire</q-item-tile>
                    </q-item-main>
                  </q-item>
                  <q-item tag="label">
                    <q-item-side>
                      <q-radio color="primary" v-model="form.situation" val="marié(e)" />
                    </q-item-side>
                    <q-item-main>
                      <q-item-tile class="text-grey" label>Marié(e)</q-item-tile>
                    </q-item-main>
                  </q-item>
                  <q-item multiline tag="label">
                    <q-item-side>
                      <q-radio color="primary" v-model="form.situation" val="divorcé(e)" />
                    </q-item-side>
                    <q-item-main>
                      <q-item-tile class="text-grey" label>Divorcé(e)</q-item-tile>
                    </q-item-main>
                  </q-item>
                  <q-item multiline tag="label">
                    <q-item-side>
                      <q-radio color="primary" v-model="form.situation" val="veuf(ve)" />
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
                <q-field
                  :error="$v.form.numBacc.$error"
                  error-label="Le numéro baccalauréat est obligatoire"
                >
                  <q-input v-model="form.numBacc" type="text" @input="$v.form.numBacc.$touch" :error="$v.form.numBacc.$error" float-label="Numero Bacc *"/>
                </q-field>
                <q-field
                  :error="$v.form.anneeBacc.$error"
                  error-label="L'année d'obtention du bacc est obligatoire"
                >
                  <q-input v-model="form.anneeBacc" type="text" @input="$v.form.anneeBacc.$touch" :error="$v.form.anneeBacc.$error" float-label="Obtenu en *"/>
                </q-field>
                <q-input v-model="form.lyceeBacc" type="text" float-label="Lycée"/>
                <q-field
                  :error="$v.form.provinceBacc.$error"
                  error-label="Le province d'obtention du bacc est obligatoire"
                >
                  <q-input v-model="form.provinceBacc" type="text" @input="$v.form.provinceBacc.$touch" :error="$v.form.provinceBacc.$error" float-label="Province *"/>
                </q-field>
                <q-field
                  :error="$v.form.bacc.$error"
                  error-label="La série du bacc est obligatoire"
                >
                  <q-input v-model="form.bacc" type="text" @input="$v.form.bacc.$touch" :error="$v.form.bacc.$error" float-label="Bacc série *"/>
                </q-field>
                <br/>
              </q-card-main>
            </q-card>
            <q-card >
              <q-card-title style="padding-top: 10px;padding-bottom: 10px;">
                Carte d'identité nationale / Passeport
              </q-card-title>
              <q-card-separator />
              <q-card-main style="margin-top: 0;padding-top: 0;">
                <q-input v-model="form.numCin" type="text" float-label="Numero CIN / Passeport"/>
                <q-input v-model="form.lieuCin" type="text" float-label="Fait à "/>
                <q-datetime float-label="Fait le" format="DD MMMM YYYY"
                            :month-names="monthNames" :day-names="dayNames" cancel-label="" ok-label="Selectionner"
                            clear-label="Effacer"  v-model="form.dateCin" type="date" />
                <q-datetime float-label="Date duplicata" format="DD MMMM YYYY"
                            :month-names="monthNames" :day-names="dayNames" cancel-label="" ok-label="Selectionner"
                            clear-label="Effacer"  v-model="form.dateDuplicata" type="date" />
                <br/>
              </q-card-main>
            </q-card>
          </div>
        </div>
      </q-step>
      <q-step name="inscription" title="Inscription">
        <div class="row">
          <q-card class="col-sm-12 col-md">
            <q-card-title>
              Inscrire l'étudiant dans un parcours
            </q-card-title>
            <q-card-separator/>
            <q-card-main>
              <q-select
                style="margin-top: 0;"
                color="primary"
                float-label="Année universitaire"
                v-model="annee"
                :options="anneeOptions"
              />
              <q-select
                style="margin-top: 0;"
                color="primary"
                float-label="Semestre "
                v-model="semestre"
                :options="semestreOptions"
              />
              <q-select
                style="margin-top: 0;"
                color="primary"
                float-label="Mention"
                v-model="mention"
                :options="mentionOptions"
              />
              <q-select
                style="margin-top: 0;"
                color="primary"
                float-label="Parcours"
                v-model="parcours"
                :options="parcoursOptions"
              />
              <q-select
                multiple
                style="margin-top: 0;"
                color="primary"
                float-label="Unité d'Enseignement "
                v-model="ueExcel"
                :options="ueOptions"
              />
            </q-card-main>
          </q-card>
          <q-card class="col-sm-12 col-md">
            <q-card-title>
              Quittance droit d'inscription
            </q-card-title>
            <q-card-separator/>
            <q-card-main>
              <q-input v-model="form.bordereau.numero" type="text" float-label="Bordereau N°" />
              <q-datetime v-model="form.bordereau.date" float-label="Date bordereau" format="DD MMMM YYYY"  :month-names="monthNames" :day-names="dayNames" cancel-label="" ok-label="Selectionner" clear-label="Effacer" type="date" />
              <q-input v-model="form.bordereau.montant" type="text" suffix="Ar" float-label="Montant" />
              <br>
              <q-item tag="label" style="padding-left: 0;">
                <q-item-side>
                  <q-checkbox color="primary" v-model="form.dossierComplet" />
                </q-item-side>
                <q-item-main>
                  <q-item-tile class="text-grey text-italic" label>Dossier complet</q-item-tile>
                </q-item-main>
              </q-item>
            </q-card-main>
          </q-card>
        </div>
      </q-step>
      <q-stepper-navigation>
        <q-btn
          v-if="step !== 'etat_civil'"
          color="primary"
          flat
          @click="$refs.stepper.previous()"
        >
          Revenir
        </q-btn>
        <div v-if="step === 'inscription'">
          <q-btn color="primary" @click="inscrireEtudiant()">
            Terminer
          </q-btn>
        </div>
        <div v-else>
          <q-btn color="primary" @click="goToStep2()">
            Suivant
          </q-btn>
        </div>
      </q-stepper-navigation>
    </q-stepper>
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
    QModal,
    Alert,
    QStepper,
    QStep,
    QStepperNavigation
  } from 'quasar'
  import { map, last, first } from 'lodash'
  import { required } from 'vuelidate/lib/validators'
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
      QModal,
      Alert,
      QStepper,
      QStep,
      QStepperNavigation
    },
    data () {
      return {
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        dayNames: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        form: {
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
          numBacc: '',
          anneeBacc: '',
          provinceBacc: '',
          lyceeBacc: '',
          bacc: '',
          situation: 'célibataire',
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
          adresseTuteur: '',
          numCin: '',
          dateCin: '',
          lieuCin: '',
          dateDuplicata: '',
          dossierComplet: false,
          bordereau: {
            numero: '',
            date: '',
            montant: ''
          }
        },
        avatarImage: 'statics/photovide.jpg',
        step: '',
        annee: '',
        anneeOptions: [],
        mention: '',
        mentionOptions: [],
        semestre: [],
        semestreOptions: [],
        parcours: '',
        parcoursOptions: [],
        ueOptions: [],
        ueExcel: []
      }
    },
    validations: {
      form: {
        matricule: { required },
        nom: { required },
        pays: { required },
        dateNais: { required },
        lieuNais: { required },
        nationalite: { required },
        adresse: { required },
        tel: { required },
        numBacc: { required },
        anneeBacc: { required },
        provinceBacc: { required },
        bacc: { required }
      }
    },
    computed: {
      allRequiredFieldStepOneFill: function () {
        return this.form.sexe !== '' && this.form.matricule !== '' && this.form.nom !== '' && this.form.pays !== '' && this.form.dateNais !== '' && this.form.lieuNais !== '' && this.form.nationalite !== '' && this.form.adresse !== '' && this.form.tel !== '' && this.form.numBacc !== '' && this.form.anneeBacc !== '' && this.form.provinceBacc !== '' && this.form.bacc
      },
      allRequiredFieldStepTwoFill: function () {
        return this.annee !== '' && this.mention !== '' && this.parcours !== '' && this.semestre !== []
      }
    },
    watch: {
      annee: function (val) {
        if (val) {
          this.fillSemestre(val)
        }
      },
      parcours: function (parcours) {
        this.ueOptions = []
        this.$store.dispatch('parcours/getParcoursById', parcours)
          .then((res) => {
            this.parcoursLibelle = res.libelle
          })
          .catch((err) => {
            console.log(err)
          })
        let paramUes = {
          idParcours: this.parcours,
          idSemestre: this.semestre,
          idAnneeUniversitaire: this.annee
        }
        this.$store.dispatch('ue/getUeByAndAnneeSemestreMentionParcours', paramUes)
          .then((res) => {
            map(res, u => {
              let ueData = {
                label: u.libelle,
                value: u.id,
                icon: 'date_range'
              }
              this.ueOptions.push(ueData)
            })
            this.ue = last(res).id
          })
          .catch((err) => {
            console.log(err)
          })
      },
      mention: function (mention) {
        if (mention !== '') {
          this.parcoursOptions = []
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
              this.parcours = first(this.parcoursOptions).value
            })
            .catch((err) => {
              console.log(err)
            })
        }
      }
    },
    mounted () {
      this.$store.dispatch('anneeuniversitaire/getAllAnneeUniversitaire')
        .then((res) => {
          map(res, a => {
            let annee = {
              label: a.code,
              value: a.id,
              icon: 'date_range'
            }
            this.anneeOptions.push(annee)
            this.annee = last(res).id
          })
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
                  value: m.id,
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
          console.log(err)
        })
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
      fillSemestre: function (id) {
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
            this.semestre = [this.semestreOptions[0].value, this.semestreOptions[1].value]
          })
      },
      inscrireEtudiant () {
        if (this.allRequiredFieldStepTwoFill) {
          this.$store.dispatch('getFonction')
            .then((fonction) => {
              const {composant} = fonction.vars
              let data = {
                etudiant: {
                  numeroMatricule: this.form.matricule,
                  idComposant: composant.id
                },
                utilisateur: {
                  email: this.form.email,
                  password: this.form.password
                },
                personne: {
                  nom: this.form.nom,
                  prenom: this.form.prenom,
                  dateNais: this.form.dateNais,
                  lieuNais: this.form.lieuNais,
                  nationalite: this.form.nationalite,
                  pays: this.form.pays,
                  sexe: this.form.sexe,
                  situation: this.form.situation,
                  orphelinPere: this.form.orphPere,
                  orphelinMere: this.form.orphMere,
                  nbFrere: this.form.nbFrere,
                  nbSoeur: this.form.nbSoeur,
                  cin: this.form.numCin,
                  dateCin: this.form.dateCin,
                  lieuCin: this.form.lieuCin,
                  duplicataCin: this.form.dateDuplicata,
                  passePort: this.form.passePort,
                  email: this.form.email,
                  tel: this.form.tel,
                  adresse: this.form.adresse,
                  urlPhoto: this.avatarImage
                },
                parents: [
                  {
                    nom: this.form.nomPere,
                    profession: this.form.profPere,
                    adresse: this.form.adresseParent,
                    tel: this.form.telParent,
                    role: 'père'
                  },
                  {
                    nom: this.form.nomMere,
                    profession: this.form.profMere,
                    adresse: this.form.adresseParent,
                    tel: this.form.telParent,
                    role: 'mère'
                  },
                  {
                    nom: this.form.nomTuteur,
                    profession: this.form.profTuteur,
                    adresse: this.form.adresseTuteur,
                    tel: this.form.telTuteur,
                    role: 'tuteur'
                  }
                ],
                infoBaccs: [
                  {
                    serie: this.form.bacc,
                    numBacc: this.form.numBacc,
                    annee: this.form.anneeBacc,
                    lycee: this.form.lyceeBacc,
                    province: this.form.provinceBacc
                  }
                ],
                bordereauNumero: this.form.bordereau.numero,
                bordereauDate: this.form.bordereau.date,
                bordereauMontant: this.form.bordereau.montant,
                dossierComplet: this.form.dossierComplet,
                dateInscription: new Date(),
                idAnneeUniversitaire: this.annee,
                idParcours: this.parcours,
                tabIdUe: this.ueExcel,
                idSemestre: this.semestre
              }
              this.$store.dispatch('inscription/inscrireEtudiant', data)
                .then((res) => {
                  this.$alert.success('L\' étudiant a été bien inscrit')
                  this.$router.push('/scolarite/inscription')
                })
                .catch((err) => {
                  if (err) {
                    this.$alert.error('Erreur lors de l\'inscription de l\'étudiant')
                    this.$router.push('/scolarite/etudiant')
                  }
                })
            })
            .catch((err) => {
              console.log('Erreur getFonction', err)
            })
        }
        else {
          this.$alert.error('Erreur lors de l\'ajout, veuillez vérifier les champs obligatoires')
        }
      },
      goToStep2 () {
        if (this.allRequiredFieldStepOneFill) {
          this.$refs.stepper.next()
        }
        else {
          this.$alert.error('Erreur lors de l\'ajout, veuillez vérifier les champs obligatoires')
        }
      }
    }
  }
</script>

<style lang="stylus">
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

<template>
  <div class="pf-editor">
    <div class="all-ues-parent">
      <div class="ue title">
        <div>Unités d'enseignements</div>
        <div>Eléments constitutifs</div>
      </div>
      <div class="all-ues">
        <div class="ue" v-for="(ue, i) in ues" :key="i">
          <div class="ue-container">
            <q-input :error="errors.includes(ue)" :after="getIcon(ue)" :prefix="ue.ecs.reduce((ac,ec)=>ec.credit+ac,0)+''" :otype="ue.type" readonly v-model="ue.libelle" @click="activate(ue)" :class="clf(ue)"/>
            <div v-if="i===ues.length-1" class='add-thing'>
              <q-btn @click="addUe()" outline color='brown-5' small icon="add"/>
            </div>
          </div>
          <div class="ecs">
            <q-input :error="errors.includes(ec)" :after="getIcon(ue, ec)" :prefix="(ec.credit || 0)+''" :otype="ec.type" readonly v-model="ec.libelle" @click="activate(ec)" :class="clf(ec)" v-for="(ec, j) in ue.ecs" :key="j"/>
            <div class='add-thing'>
              <q-btn @click="addEc(ue)" outline color='brown-5' small icon="add"/>
            </div>
          </div>
        </div>
        <div v-if="ues.length === 0" class="ue">
            <div class="ue-container">
              <div class='add-thing'>
                <q-btn @click="addUe()" outline color='brown-5' small icon="add"/>
              </div>
            </div>
        </div>
      </div>
    </div>
    <div v-if="selected" class="side">
      <q-card>
        <q-item>
          <label style="color: dodgerblue">Plus de détails</label>
        </q-item>
        <q-card-separator/>
        <q-item v-for="(item, i) in getItemsOfSelected()" :key="i">
          <q-input :max-length="item.maxL" :float-label="item.label" v-if="item.type!=='choice'" v-model="selected[item.key]" :type="item.type"/>
          <q-select
            v-if="item.type==='choice'"
            style="margin-top: 0; "
            color="primary"
            :float-label="item.label"
            v-model="selected[item.key]"
            :options="typeOptions"
          />
        </q-item>
        <q-item class="quit">
            <q-btn @click="activate(null)" outline color='brown-5'>Retour à la liste</q-btn>
        </q-item>
      </q-card>
    </div>
    <div class="fixed-button" style="left:18px">
        <input type="file" ref="jsonfile" style="display: none" @change="importFile()"/>
        <input type="file" ref="jsonfileAdd" style="display: none" @change="importFile(true)"/>
        <q-btn @click="$refs.jsonfile.click()" icon="insert_drive_file" round outline small color="brown-5" class="animate-pop">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Importer un PF</q-tooltip>
        </q-btn>
        <q-btn @click="$refs.jsonfileAdd.click()" icon="note_add" round outline small color="brown-5" class="animate-pop">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Ajouter un PF à l'actuel</q-tooltip>
        </q-btn>
        <q-btn @click="exportFile()" icon="save" round outline color="brown-5" class="animate-pop">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Exporter le PF</q-tooltip>
        </q-btn>
    </div>
    <div class="fixed-button inverser" style="right:18px">
        <q-btn @click="persistPF()" :canPersist="canPersist" icon="done" round outline color="brown-5" class="animate-pop persistPF">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Enregistrer le PF</q-tooltip>
        </q-btn>
        <q-btn @click="close()" icon="clear" round outline small color="brown-5" class="animate-pop">
          <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">Annuler</q-tooltip>
        </q-btn>
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
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
    QBtn,
    QInput,
    QCheckbox,
    QModal,
    QModalLayout,
    QIcon,
    QSelect,
    QFab,
    QTooltip,
    Alert
  } from 'quasar'
  import _ from 'lodash'

  export default {
    props: {
      identity: Object
    },
    components: {
      QCard,
      QCardMedia,
      QCardTitle,
      QCardSeparator,
      QCardMain,
      QCardActions,
      QItem,
      QItemSide,
      QItemMain,
      QItemTile,
      QBtn,
      QInput,
      QCheckbox,
      QModal,
      QModalLayout,
      QIcon,
      QSelect,
      QFab,
      QTooltip
    },
    data () {
      return {
        ues: [],
        data: null,
        selected: null,
        canPersist: false,
        typeOptions: [
          {label: 'Obligatoire', value: 'type-*-obl'},
          {label: 'Optionnel', value: 'type-*-opt'},
          {label: 'Facultatif', value: 'type-*-fac'},
          {label: 'Bonus', value: 'type-*-bonus'}
        ],
        errors: []
      }
    },
    watch: {
      identity: function (now) {
        const data = {
          semestre: now.semestre,
          anneeUniversitaire: now.annee,
          parcours: now.parcours
        }
        if (data.semestre && data.anneeUniversitaire && data.parcours) {
          if (!_.isEqual(data, this.data)) {
            this.data = data
            this.refreshUes()
          }
        }
      },
      ues: {
        deep: true,
        handler: function () {
          const getClone = () => {
            let ues = []
            const cln = o => {
              const {activated, ...others} = o
              if (o.ecs) others.ecs = []
              return others
            }
            for (let i = 0; i < this.ues.length; i++) {
              ues.push(cln(this.ues[i]))
              for (let j = 0; j < this.ues[i].ecs.length; j++) {
                ues[i].ecs.push(cln(this.ues[i].ecs[j]))
              }
            }
            return ues
          }
          this.canPersist = !_.isEqual(this.forCheck, getClone())
          console.log(this.canPersist)
        }
      }
    },
    methods: {
      clf: o => o.activated ? 'q-if-focused' : '',
      refreshUes: function () {
        this.$store.dispatch('planformation/getAdvancedPF', this.data)
          .then((res) => {
            this.setFromFile(res)
            this.forCheck = JSON.parse(JSON.stringify(this.ues))
          })
      },
      persistPF: function () {
        const ues = this.testUes()
        if (!ues) return
        this.$store.dispatch('planformation/saveAdvancedPF', {
          ...this.data,
          ues
        }).then((res) => {
          this.refreshUes()
        })
      },
      activate: function (o) {
        if (this.selected) this.selected.activated = false
        if (o) {
          o.activated = true
          this.errors = this.errors.filter(v => v !== o)
        }
        this.selected = o
      },
      getItemsOfSelected: function () {
        return Object.keys(this.selected).filter(n => {
          return ['ecs', 'activated'].indexOf(n) < 0
        }).map(n => this.getVue(n))
      },
      getVue: function (name) {
        const types = {
          'type': 'choice',
          'note_eliminatoire': 'number',
          'credit': 'number'
        }
        const labels = {
          'abreviation': 'Abréviation',
          'libelle': 'Libellé',
          'note_eliminatoire': 'Note éliminatoire',
          'credit': 'Crédit'
        }
        const maxL = {
          'abreviation': 10,
          'libelle': 50,
          'code': 20
        }
        const t = n => {
          let t = n.split('')
          t[0] = t[0].toUpperCase()
          return t.join('')
        }
        return {
          key: name,
          type: types[name] || 'text',
          label: labels[name] || t(name),
          maxL: maxL[name] || 200
        }
      },
      close () {
        this.$emit('close')
      },
      getTemplate: function (isEc = false) {
        let ue = {
          code: '',
          abreviation: '',
          libelle: 'Nouvelle UE',
          type: 'type-*-obl',
          activated: false
        }
        let ec = {
          ...ue,
          libelle: 'Nouvel EC',
          note_eliminatoire: null,
          credit: null
        }
        return isEc ? ec : {...ue, ecs: [ec]}
      },
      addUe: function () {
        this.ues.push(this.getTemplate())
      },
      addEc: function (ue) {
        const i = this.ues.indexOf(ue)
        this.ues[i].ecs.push(this.getTemplate(true))
      },
      setFromFile: function (data, concat = false) {
        const fct = o => {
          o.type = o.type.replace(o.ecs === undefined ? '-ec-' : '-ue-', '-*-')
          if (o.ecs) o.ecs.forEach(oo => fct(oo))
          else if (o.ecs === null) o.ecs = []
        }
        data.ues.forEach(o => fct(o))
        if (concat) {
          data.ues.forEach(ue => {
            this.ues.push(ue)
          })
        }
        else this.ues = data.ues
      },
      importFile: function (concat = false) {
        const file = concat ? this.$refs.jsonfileAdd.files[0] : this.$refs.jsonfile.files[0]
        let error = null
        if (file.size > 1000000) error = 'Le fichier ne devrait pas être aussi lourd'
        else if (file.type !== 'application/json') error = 'Le fichier doit être un fichier JSON'
        if (error) return alert(error)
        const reader = new FileReader()
        reader.onload = e => {
          try {
            const data = JSON.parse(e.target.result)
            if (data.type === 'PLAN DE FORMATION') {
              this.setFromFile(data, concat)
            }
            else alert('Une erreur est survenue pendant la lecture du fichier')
          }
          catch (error) {
            console.log(error)
            alert('Une erreur est survenue pendant la lecture du fichier')
          }
        }
        reader.readAsText(file)
      },
      testUes: function () {
        let ues = []
        this.errors = []
        const cln = o => {
          const {activated, ...others} = o
          if (o.ecs) others.ecs = []
          others.type = others.type.replace('*', o.ecs ? 'ue' : 'ec')
          return others
        }
        const err = o => {
          for (const key in o) {
            if (o[key] === '') {
              this.errors.push(o)
              break
            }
          }
          return o
        }
        for (let i = 0; i < this.ues.length; i++) {
          ues.push(cln(err(this.ues[i])))
          for (let j = 0; j < this.ues[i].ecs.length; j++) {
            ues[i].ecs.push(cln(err(this.ues[i].ecs[j])))
          }
        }
        ues = this.errors.length === 0 ? ues : false
        if (!ues) {
          Alert.create({
            html: 'Veuillez revoir les champs en rouge'
          })
        }
        return ues
      },
      exportFile () {
        const ues = this.testUes()
        if (!ues) return
        const p = v => v > 9 ? v : `0${v}`
        const date = new Date()
        const filename = prompt('Entrez le nom du fichier à exporter', `PF ${p(date.getDay())}-${p(date.getMonth())}-${date.getFullYear()}`)
        if (!filename) return
        var element = document.createElement('a')
        element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
          ues: ues,
          type: 'PLAN DE FORMATION'
        })))
        element.setAttribute('download', filename + '.json')
        element.style.display = 'none'
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
      },
      getIcon: function (ue, ec) {
        const i = this.ues.indexOf(ue)
        if ((ec && this.ues[i].ecs.length < 2) || (!ec && this.ues.length < 2)) return []
        return [{
          icon: 'delete',
          handler: () => {
            if (ec) {
              this.ues[i].ecs = this.ues[i].ecs.filter(v => v !== ec)
            }
            else this.ues = this.ues.filter(v => v !== ue)
          }
        }]
      }
    },
    mounted () {
      if (this.ues.length === 0) {
        this.addUe()
        this.addEc(this.ues[0])
      }
    }
  }
</script>
<style lang="stylus">
  .pf-editor
    position fixed
    top 0
    left 0
    width 100vw
    height 100vh
    background-color rgb(255, 255, 243)
    display grid
    grid-template-columns 600px 1fr
    grid-template-rows 100vh
    @media screen and (max-width:920px)
      grid-template-columns 1fr
      padding 0 .5em
      max-height 100vh
    .persistPF
      transition transform .3s ease
      transform scale(0)
      &[canPersist]
        transform scale(1)
    .all-ues-parent
      max-height 100%
      display flex
      flex-direction column
      padding-bottom 66px
    .all-ues
      flex 1
      overflow-y auto
    .ue
      display grid
      grid-template-columns 1fr 1fr
      @media screen and (max-width:920px)
        grid-template-columns 1fr
        box-shadow 0 0 0 1px brown inset
        padding-bottom .5em
        max-width 600px
        margin auto
        margin-bottom .5em
        border-radius: 3px
        position relative
        .ecs
          margin-top .5em
          padding-top .5em
          border-top 1px solid brown
        .ue-container
          .add-thing
            position absolute
            left 0
            width 100%
            top 100%
            .q-btn
              transform-origin 100% 0
              transform scale(1.2)
      &.title
        margin .5em 0
        padding .5em 0
        border-bottom 1px solid rgba(0,0,0,.1)
        @media screen and (max-width:920px)
          box-shadow none
        div
          color: dodgerblue
          text-align center
      .q-input
        width 95%
        margin auto
        margin-top 0.5em
        cursor pointer
        position relative
        .q-if-addon-left
          position relative
          bottom -.8em
          font-size 80%
          padding-right 0
          &:before
            content ''
            position absolute
            left 50%
            bottom 150%
            border-radius 100%
            margin-left -.25em
            width .5em
            height .5em
            opacity .8
        &[otype='F'] .q-if-addon-left:before
          background orange
        &.q-if-error .q-if-addon-left:before
          background red
          box-shadow 0 0 0 2px red
        input
          cursor pointer
          padding-left .5em
          color #999
      .add-thing
        padding-top .5em
        display flex
        justify-content flex-end
        width 95%
        margin auto
        i
          margin 0
    .side
      display flex
      justify-content center
      align-items center
      @media screen and (max-width:920px)
        z-index 2
        position fixed
        width 100vw
        overflow-y: auto
        height 100vh
        left 0
        top: 0
        background rgba(0,0,0,.3)
      .q-card
        min-width 320px
        background #fff
        margin-top 1em
        .quit
          display none !important
        @media screen and (max-width:920px)
          min-width 0
          width 95%
          .quit
            display grid !important
        .q-item
          display grid
    .fixed-button
      position fixed
      bottom 7px
      background-color inherit
      i
        transform scale(1.3)
</style>

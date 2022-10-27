<template>
  <div class='layout-padding' style="padding:0;">
    <!--<p v-if="isReady">Données chargées!</p>-->
    <h4 v-if="noComposant" style="height: 80vh" class="row justify-center items-center">Cette Etablissement ne possède pas encore de Composant.</h4>
    <template v-if="!isReady">
      <div style="height: 80vh" class="row justify-center items-center">
        <q-spinner
          color="primary"
          size="100"
        />
      </div>
    </template>
    <div id="tree"></div>
  </div>
</template>

<script>
  // native components
  import {
    QSpinner
  } from 'quasar'

  import {mapGetters} from 'vuex'
  /*eslint-disable */

  export default {
    components: {
      QSpinner
    },
    data () {
      return {
        treeData: {},
        isReady: false,
        noComposant: false
      }
    },
    computed: {
      ...mapGetters('etablissement', [
        'idTsiory'
      ])
    },
    mounted () {
      this.getTreeData()
    },
    methods: {
      getTreeData () {
        this.$store.dispatch('etablissement/getTreeData', this.idTsiory)
          .then(response => {
            if (response.children.length !== 0) {
              this.treeData = response
              this.arbre()
            }
            else {
              this.$alert.info('Manque de données pour construire l\'arborescence.')
              this.noComposant = true
            }
            // to hide spinner
            this.isReady = true
          })
          .catch(error => {
            this.$alert.error('Ne peut pas se connecter au serveur.')
            console.log('Erreur de récupération du TreeData: ', error)
          })
      },
      arbre () {
        // set the dimensions and margins of the diagram
        var margin = {top: 40, right: 0, bottom: 50, left: 0},
          width = 1300 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

        // declares a tree layout and assigns the size
        var treemap = this.$d3.tree()
          .size([width, height]);

        //  assigns the data to a hierarchy using parent-child relationships
        var nodes = this.$d3.hierarchy(this.treeData);

        // maps the node data to the tree layout
        nodes = treemap(nodes);

        // append the svg obgect to the #tree of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = this.$d3.select("#tree").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom),
          g = svg.append("g")
            .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

        // adds the links between the nodes
        var link = g.selectAll(".link")
          .data( nodes.descendants().slice(1))
          .enter().append("path")
          .attr("class", "link")
          .attr("d", function(d) {
            return "M" + d.x + "," + d.y
              + "C" + d.x + "," + (d.y + d.parent.y) / 2
              + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
              + " " + d.parent.x + "," + d.parent.y;
          });

        // adds each node as a group
        var node = g.selectAll(".node")
          .data(nodes.descendants())
          .enter().append("g")
          .attr("class", function(d) {
            return "node" +
              (d.children ? " node--internal" : " node--leaf"); })
          .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")"; });

        // adds the circle to the node
        node.append("circle")
          .attr("r", 5);

        // adds the text to the node
        node.append("text")
          .attr("dy", ".35em")
          .attr("y", function(d) { return d.children ? -20 : 20; })
          .style("text-anchor", "middle")
          .text(function(d) { return d.data.name; });
      }
    }
  }
</script>

<style>
  .node circle {
    fill: #fff;
    stroke: steelblue;
    stroke-width: 5px;
  }
  .node text { font: 12px sans-serif; }

  .node--internal text {
    text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff;
  }
  .link {
    fill: none;
    stroke: #ccc;
    stroke-width: 2px;
  }
  #tree{
    overflow-x: auto;
  }
</style>

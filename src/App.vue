<template>
<BaiduMap :customers = 'customers' :points = 'points'></BaiduMap>
<SearchTool/>
<ButtonTool/>
</template>

<script>
import BaiduMap from './components/BaiduMap.vue'
import ButtonTool from '@/components/ButtonTool.vue'
import SearchTool from '@/components/SearchTool.vue'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    BaiduMap,
    ButtonTool,
    SearchTool
  },
  data(){
    return{
      customers: [],
      points: []
    }
  },
  created(){
    axios.get('./customers.json')
    .then( response => {
        this.customers = response.data;
        window.console.log(response);
    }).catch( error => {
        console.log(error);
    });

    axios.get('./heatmap.json')
    .then( response => {
        this.points = response.data;
        console.log(response);
    }).catch( error => {
        console.log(error);
    });
  }
}
</script>

<style>
</style>

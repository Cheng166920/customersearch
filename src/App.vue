<template>
<BaiduMap></BaiduMap>
<SearchTool/>
<ButtonTool/>
</template>

<script>
import BaiduMap from './components/BaiduMap.vue'
import ButtonTool from '@/components/ButtonTool.vue'
import SearchTool from '@/components/SearchTool.vue'
import { heatmap } from '@/utils/heatmap.js'
import { createmarkers } from '@/utils/createmarkers.js'
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
  async created(){
    try {
      const customersRes = await axios.get('./customers.json');
      this.customers = customersRes.data;

      const pointsRes = await axios.get('./heatmap.json');
      this.points = pointsRes.data;

      createmarkers.allCustomers = this.customers;
      heatmap.points = this.points;

    } catch (error) {
      console.log(error);
    }
    
  }
}
</script>

<style>
</style>

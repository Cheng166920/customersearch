<template>
<div id="search" @mouseleave="hidePopContent" @mouseenter="showPopContent">
	<el-input @input="forceUpdate" v-model="input" placeholder="输入客户名称" clearable>
    <template #append><el-button icon="Search" @click="searchMarker" plain></el-button>
	  </template>
  </el-input>
  <PopContent :count="count" :showPop="showPop" ref="pop"></PopContent>
</div> 
</template>

<script>
import { createmarkers } from '@/utils/createmarkers.js'
import PopContent from './PopContent.vue'

export default {
  name: 'SearchTool',
  components: {
    PopContent
  },
  data(){
    return{
      showPop: {isShow: false, showNum: false},
      input:'',
      lastInfobox:'',
      searchCustomers: [],
      targets:[],
    }
  },
  methods:{
    forceUpdate(){
      // this.$forceUpdate();
      console.log("forceUpdate");
      this.targets = [];
      this.showPop.isShow = false;
      this.showPop.showNum = false;
    },
    searchMarker(){
      this.targets = [];
      createmarkers.searchCustomers(this.input);
      this.targets = createmarkers.targets;
      if(this.targets.length > 0){
        this.showPop.showNum = true;
        this.showPop.isShow = true;
        this.$refs.pop.initCustomerList(this.targets);
      } else {
        this.showPop.showNum = false;
        this.showPop.isShow = false;
      }
    },
    hidePopContent(){
      this.showPop.isShow = false;
    },
    showPopContent(){
      if(this.targets.length > 0){
        this.showPop.isShow = true;
      }
    }
  },
  computed: {
    count(){
      return this.targets.length;
    }
  }

}
</script>

<style>
#search{
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
}
input[type=text] {
 border-color: #68AEAA;
 width:360px;
 height: 40px;
 outline-style: none ;
}
.el-input-group__append {
  width:20px;
  background-color: #3385FF;
  color: #FFF;
  border-color: #3385FF;
  text-align: center; 
  font-size:16px;

 }
</style>
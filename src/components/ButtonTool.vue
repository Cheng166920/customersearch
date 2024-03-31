<template>
<div id="topic">
    <el-button-group>
    <el-button :type = "buttonAll" icon="UserFilled" @click="allCustomers">全部客户</el-button>
    <el-button :type = "buttonHeat" icon="Sunny" @click="heatMap()">热力图</el-button>
    </el-button-group>
</div> 
</template>

<script>
import { createmarkers } from '@/utils/createmarkers.js'
import { heatmap } from '@/utils/heatmap.js'
export default {
  name: 'ButtonTool',
    data(){
      return{
        buttonAll: 'plain',
        buttonHeat: 'plain',
        heatActive: false,
        allActive: false
      }
    },
    methods:{
      allCustomers(){
        this.allActive = !this.allActive;
        if(this.allActive){
            this.buttonAll = 'primary';
        } else {
            this.buttonAll = 'plain'
        }
        this.buttonHeat = 'plain';
        this.heatActive = false;
        setTimeout(()=>{
            console.log("触发客户显示")
            console.log(this.allActive)
            createmarkers.createCustomers(this.allActive);
        },0)
      },
      heatMap(){
        this.heatActive = !this.heatActive;
        if(this.heatActive){
            this.buttonHeat = 'primary';
        } else {
            this.buttonHeat = 'plain'
        }
        //this.$emit('heatMap', this.heatActive);
        console.log(this.heatActive)
        this.buttonAll = 'plain';
        this.allActive = false;
        setTimeout(()=>{
            console.log("触发热力图显示")
            heatmap.creatHeatmap(this.heatActive);
           
            
        },0)
        
      },
    }
}
</script>

<style>
#topic{
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
}
.el-button--plain:hover{
  background: #fff;
  border-color:rgb(230, 230, 230);
  color:grey
}
.el-button--plain:focus{
  background: #fff;
  border-color: rgb(230, 230, 230);
  color:grey
}

.el-button--primary {
  background: #3385FF;
  border-color: #3385FF;
  color:#FFF
}
.el-button--primary:hover {
  background: #3385FF;
  border-color: #3385FF;
  color:#FFF
}
.el-button--primary:focus {
  background: #3385FF;
  border-color: #3385FF;
  color:#FFF
}

</style>
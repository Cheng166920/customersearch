<template>
    <div id="map" style= {height:100%;}>
        <div id="allmap" ref="allmap"></div>
        <!-- <SearchTool/>
        <ButtonTool/> -->
    </div>
</template>

<script>
import { heatmap } from '@/utils/heatmap.js'
import { createmarkers } from '@/utils/createmarkers.js'

export default {
    name: "BaiduMap",
    props: {
        customers: Array,
        points: Array
    },
    data() {
    return {
        Map:'',
        drag: false,
    };
    },
    methods: {
        map() {
            let map = new window.BMap.Map(this.$refs.allmap,{minZoom:5}); // 创建Map实例
            this.Map = map;
            map.centerAndZoom(new window.BMap.Point(104.07, 30.67), 8); // 初始化地图,设置中心点坐标和地图级别
            map.addControl(
                new window.BMap.ScaleControl({offset:new window.BMap.Size(80, 5)})
            );
            map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
            map.enableDragging(); // 开启拖拽
            

        },
        initMapHeight() {
            var main = document.getElementById("map");
            main.style.height = window.innerHeight -20 + "px";
        },
    },

    mounted() {
        this.initMapHeight();
        this.map();
    },
    updated() {
        if(this.customers.length > 0) {
            createmarkers.allCustomers = this.customers;
            createmarkers.map = this.Map;
        }
        if(this.points.length > 0) {
            heatmap.points = this.points;
            heatmap.map = this.Map;
        }
    },
    
};
</script>

<style scoped>
#allmap {
    height: 100%;
    overflow: hidden;
}
</style>
    
    
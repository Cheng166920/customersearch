// Desc: 百度地图热力图

export const heatmap = {
    map: null,
    points:[],
    creatHeatmap(active) {
        let map = this.map;
        let points = this.points;
        try {
            map.clearOverlays();
            // 移除聚合点
            map.markerClusterer.clearMarkers(this.customers);
        } catch (error) {
            console.log('')
        }
        if(!active) return;
        map.centerAndZoom(new window.BMap.Point(105, 37), 5);
        var heatpoints = points;
        var heatmapOverlay = new window.BMapLib.HeatmapOverlay({"radius":20});
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data:heatpoints,max:8}); 
    }

}
// Desc: 渲染客户地图标记

import '../assets/infoBox.css'

export const createmarkers = {
    map: null,
    allCustomers:[],
    lastInfoBox: null,
    targets:[],
    
    searchCustomers(content) {
        let map = this.map;
        map.clearOverlays();
        try {
            // 移除聚合点
            map.markerClusterer.clearMarkers(this.targets);
        } catch (error) {
            console.log(error)
        }
        this.targets = [];
        console.log(map);
        console.log(content);
        let centerx = 0, centery = 0, sum = 0;
        var customers = this.allCustomers;
        var MAPMarkers = []
        for(var j = 0; j< customers.length; j++){
					
            let customer = customers[j];
            let str = customer.客户名称;
            if(content.length != 0)
            {
                if(str.match(content)){
                    this.targets.push(customer);
                    let marker = this.createmarker(map, customer);
                    if(this.targets.length < 500) {
                        map.addOverlay(marker);
                    }
                    MAPMarkers.push(marker);
                    centerx += Number(customer.bd09_lng);
                    centery += Number(customer.bd09_lat);
                    sum++;
                }
            }
        }
        if(sum){
            centerx = centerx/sum;
            centery = centery/sum;
            map.centerAndZoom(new window.BMap.Point(centerx, centery), 8);
        }
        else{
            map.clearOverlays();
            map.centerAndZoom(new window.BMap.Point(104.07, 30.67), 8);
        }
        if(this.targets.length > 500) {
            map.clearOverlays();
            map.markerClusterer = new window.BMapLib.MarkerClusterer(map, {markers: MAPMarkers});
        }
            
    },
    
    createCustomers(active) {
       
        let map = this.map;     
        try {
            map.clearOverlays();
            // 移除聚合点
            map.markerClusterer.clearMarkers(this.targets);
        } catch (error) {
            console.log(error)
        }
        if(!active) return;
        console.log("画图")
        map.centerAndZoom(new window.BMap.Point(105, 32), 6);
        var customers = this.allCustomers;
            //var myIcon = new window.BMap.Icon(Icon, new window.BMap.Size(28, 28));
        var MAPMarkers = []

        for(var j = 0; j< customers.length; j++){
            let customer = customers[j];
            let marker = this.createmarker(map, customer);
            MAPMarkers.push(marker);
        }
        // 使用点聚合
        if(customers.length > 500) map.markerClusterer = new window.BMapLib.MarkerClusterer(map, {markers: MAPMarkers});
    },

    createmarker(map, customer) {
        let LonAndLan = new window.BMap.Point(customer.bd09_lng,customer.bd09_lat);          
        let marker = new window.BMap.Marker(LonAndLan); 
        let html = "<div class='infoBoxContent'><div class= 'title'>" + "<location>"+ customer.客户名称 +"</location></div>";
                html += "<div class = 'list1'>客户资料</div><hr>"+"<div><table>" + "<tr><td><div><label>位置:" +"</label><span>"+ customer.bd09_lng + "E,"+ customer.bd09_lat +"N"+"</span></div></td></tr>" ;
        html += "<tr><td><div><label>辖区:"+"</label><span>"+ customer.辖区 + "</span></div></td>" + "<td><div><label>市及县:"+"</label><span>"+ customer.市及县 + "</span></div></td></tr>"
        html += "<tr><td><div><label>街道:"+"</label><span>"+ customer.街道 + "</span></div></td><tr>";
        html += "</table></div></div>"; 
        let infoBox = new window.BMapLib.InfoBox(map,html,{
            boxStyle:{
            background: "#ffffff",
            border:'1px solid #bac1c1',
            width: "auto",
            height: "auto",
            overflow_y:"auto"
        },
        closeIconUrl:require("../assets/close.png"),  //关闭信息窗口icon
        closeIconMargin: "1px 1px 0 0", //关闭按钮的位置
        enableAutoPan: true
        });
        let that = this;
        marker.addEventListener("click", function(){
            if(that.lastInfoBox){
                //判断上一个窗体是否存在，若存在则执行close
                that.lastInfoBox.close();
            }
            that.lastInfoBox = infoBox;
            infoBox.open(marker);
            console.log("上一个信息窗口",that.lastInfoBox);
            //开启信息窗口
        });
        return marker;
    }
 }
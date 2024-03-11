<template>
<div id="map" :style="{height:mapHeight}">
<div id="search">
	<el-input @input="forceUpdate" v-model="input" placeholder="输入客户名称" clearable>
    <template #append><el-button  icon="Search" @click="searchMarker" plain></el-button>
	</template></el-input>
    <div v-show ="showPop.isShow" id = "pop" class = "poplist">
    </div>
    <div v-show ="showNum" class = "popNum" @mouseover="showPopContent">
    <p>共找到<span id="popCount"></span>个搜索结果。</p>
    </div>
</div> 

<div id="topic">
    <el-button-group>
    <el-button :type = "buttonAll" icon="UserFilled" @click="allCustomers">全部客户</el-button>
    <el-button :type = "buttonHeat" icon="Sunny" @click="heatMap" plain>热力图</el-button>
    </el-button-group>
</div> 
	<div id="allmap" ref="allmap"></div>
</div>

</template>
<script>
import axios from "axios";
import geohash from "geohash"
//import Icon from '@/assets/marker.png'


	export default {
		name: "NewMap",
    
			data() {
			return {
				mapHeight: 800 + "px",
				region:'',
				customers:'',
				points:[],
                showPop: {isShow: false},
                showNum: false,
				Map:'',
				input:'',
				lastInfobox:'',
                all: 0,
                heat: 0,
                isActive: false,
                buttonAll:'plain',
                buttonHeat:'plain',
                count: 0,
                // 定义初始化数据
                page: 1, // 页码
                size: 20, // 每页条数
                
                preLoadNum: 3, // 同时展示载页数
                boxHeight: 600, // 容器高度
                //let paddingBottom = 50; // 底部留白高度
                listArr: [], // 用于存放列表数据
                nextHeight: 0,
                isGetting: false,
                searchCustomers: [],
                
			};
		},
		methods: {
            load() {
                this.count.value += 2
            },
			map() {
				let map = new window.BMap.Map(this.$refs.allmap); // 创建Map实例
				this.Map = map;
				map.centerAndZoom(new window.BMap.Point(104.07, 30.67), 8); // 初始化地图,设置中心点坐标和地图级别
				map.addControl(
                    new window.BMap.ScaleControl({offset:new window.BMap.Size(80, 5)})
				);
				map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
                map.enableDragging();
				// map.setMapStyleV2({     
				// 	styleId: 'df62fef33f0b1621e61931ddc25735ee'
				// 	});
                let that = this;
                map.addEventListener('dragstart', function() {
                    if(that.showPop.isShow == true){
                        that.showPop.isShow = false;
                        that.showNum = true;
                    }
                    
                   // this.index = 0;
                });
                this.searchControl();
				this.topicControl();
				
                },

            searchControl(){
                function ZoomControl() {
                this.defaultAnchor = window.BMAP_ANCHOR_TOP_LEFT;
                this.defaultOffset = new window.BMap.Size(20, 10);
                }
                ZoomControl.prototype = new window.BMap.Control();  // 通过JavaScript的prototype属性继承于BMap.Control
                ZoomControl.prototype.initialize = function(map){
               // 创建一个DOM元素
               var div = document.getElementById("search");
               //div.innerHTML = '<div id="r-result"><input type="text" id="suggestId" placeholder="输入点位"  /><button type="button" >搜索</button></div>';

                // 添加DOM元素到地图中
                map.getContainer().appendChild(div);
                // 将DOM元素返回
                return div;
            }

                // 创建控件
                var myZoomCtrl = new ZoomControl();
              // 添加到地图当中
                this.Map.addControl(myZoomCtrl);

            },

			topicControl(){
                function ZoomControl() {
                this.defaultAnchor = window.BMAP_ANCHOR_TOP_RIGHT;
                this.defaultOffset = new window.BMap.Size(10, 10);
                }
                ZoomControl.prototype = new window.BMap.Control();  // 通过JavaScript的prototype属性继承于BMap.Control
                ZoomControl.prototype.initialize = function(map){
               // 创建一个DOM元素
               var div = document.getElementById("topic");
               //div.innerHTML = '<div id="r-result"><input type="text" id="suggestId" placeholder="输入点位"  /><button type="button" >搜索</button></div>';

                // 添加DOM元素到地图中
                map.getContainer().appendChild(div);
                // 将DOM元素返回
                return div;
            }

                // 创建控件
                var myZoomCtrl = new ZoomControl();
              // 添加到地图当中
                this.Map.addControl(myZoomCtrl);

            },

            // popControl(){
            //     function ZoomControl() {
            //     this.defaultAnchor = window.BMAP_ANCHOR_TOP_RIGHT;
            //     this.defaultOffset = new window.BMap.Size(10, 10);
            //     }
            //     ZoomControl.prototype = new window.BMap.Control();  // 通过JavaScript的prototype属性继承于BMap.Control
            //     ZoomControl.prototype.initialize = function(map){
            //    // 创建一个DOM元素
            //    var div = document.getElementById("topic");
            //    //div.innerHTML = '<div id="r-result"><input type="text" id="suggestId" placeholder="输入点位"  /><button type="button" >搜索</button></div>';

            //     // 添加DOM元素到地图中
            //     map.getContainer().appendChild(div);
            //     // 将DOM元素返回
            //     return div;
            // }

            //     // 创建控件
            //     var myZoomCtrl = new ZoomControl();
            //   // 添加到地图当中
            //     this.Map.addControl(myZoomCtrl);

            // },


			reLoad(){
				//location.reload();
				this.Map.clearOverlays();
				this.Map.centerAndZoom(new window.BMap.Point(111.29, 30.7), 8); 

			},

			forceUpdate() {
				this.$forceUpdate()
			},
            
            allCustomers(){
                setTimeout(()=>{
                    //this.createList(this.customers);
                    this.initCustomerList(this.customers);
                },0)
                setTimeout(()=>{
                    this.customersMap();
                },0)
            },
            customersMap(){
                
                this.all++;
                //this.searchMarker();
                if(this.all % 2 == 0){
                    if (this.Map.markerClusterer) {
                  this.Map.markerClusterer.clearMarkers()
                 }
                    //this.Map.centerAndZoom(new window.BMap.Point(104.07, 30.67), 8); 
                    //location.reload();
                    this.all = 0;
                    this.buttonAll = 'plain';
                }
                else{
                    this.buttonAll = 'primary';
                    this.input = '';
                    this.createMarker();
                    this.heat = 0;
                    this.buttonHeat = 'plain';
                    //this.Map.centerAndZoom(new window.BMap.Point(105, 37), 5);
                    
                }	
				
            },
            
            // search(){
            //     setTimeout(()=>{
            //         this.createList(this.customers);
            //     },0)
            //     setTimeout(()=>{
            //         this.customersMap();
            //     },0)
            // },
			searchMarker(){
                const targets = [];
                 if (this.Map.markerClusterer) {
                  this.Map.markerClusterer.clearMarkers();
                  this.all = 0;
                  this.buttonAll = 'plain';
                 }
                this.heat = 0;
                this.buttonHeat = 'plain';
				var lastInfoBox = null;
				this.Map.clearOverlays();
                this.Map.centerAndZoom(new window.BMap.Point(104.07, 30.67), 8);
				//var content = this.input.toUpperCase();
				var content = this.input;
				let centerx = 0,centery = 0,sum = 0;
				//var myIcon = new window.BMap.Icon(Icon, new window.BMap.Size(28, 28));
                
				for(var j = 0; j<this.customers.length; j++){
					
                    let customer = this.customers[j];
                    let str = customer.客户名称;
                    if(content.length != 0)
                    {
						if(str.match(content)){
                            targets.push(customer);
					        let LonAndLan = new window.BMap.Point(customer.bd09_lng,customer.bd09_lat);
						    let marker = new window.BMap.Marker(LonAndLan); 
								
				            this.Map.addOverlay(marker);
							centerx += Number(customer.bd09_lng);
							centery += Number(customer.bd09_lat);
							sum ++;

                            let html = "<div class='infoBoxContent'><div class= 'title'>" + "<location>"+ this.customers[j].客户名称 +"</location></div>";
					        html += "<div class = 'list1'>客户资料</div><hr>"+"<div><table>" + "<tr><td><div><label>位置:" +"</label><span>"+ customer.bd09_lng + "E,"+ customer.bd09_lat +"N"+"</span></div></td></tr>" ;
                    html += "<tr><td><div><label>辖区:"+"</label><span>"+ customer.辖区 + "</span></div></td>" + "<td><div><label>市及县:"+"</label><span>"+ customer.市及县 + "</span></div></td></tr>"
					html += "<tr><td><div><label>街道:"+"</label><span>"+ customer.街道 + "</span></div></td><tr>";
                    html += "</table></div></div>"; 


				    let infoBox = new window.BMapLib.InfoBox(this.Map,html,{
                    boxStyle:{
                    background: "#ffffff",
	                border:'1px solid #bac1c1',
                    width: "auto",
                    height: "auto",
					overflow_y:"auto"
                },
	                closeIconUrl:require("../assets/close.png"),  //关闭信息窗口icon
                    closeIconMargin: "1px 1px 0 0", //关闭按钮的位置
                    enableAutoPan: true,
                });
                    marker.addEventListener("click", function(){
					if(lastInfoBox){
				//判断上一个窗体是否存在，若存在则执行close
                    lastInfoBox.close();
                }
				    lastInfoBox = infoBox;
					infoBox.open(marker);
                   //开启信息窗口
                    });
                }
                    }
                

				
				}
                if(targets.length != 0){
                  //  this.createList(targets);
                  this.initCustomerList(targets);
                }else{
                    this.showPop.isShow = false;
                    this.showNum = false;
                }
                //this.showNum = false;
				if(sum){
					centerx = centerx/sum;
				    centery = centery/sum;
				    this.Map.centerAndZoom(new window.BMap.Point(centerx, centery), 8);
				}
				else{
                    this.Map.clearOverlays();
					this.Map.centerAndZoom(new window.BMap.Point(104.07, 30.67), 8);
				}
				
			},
            showPopContent(){
                this.showPop.isShow = true;
                this.showNum = false;
            },
            
            initCustomerList(targets){
                // 定义初始化数据
                this.page = 1; // 页码
                this.size = 20; // 每页条数
                //const height = 50; // 每条高度
                //const  preLoadNum = 3; // 同时展示载页数
               // const boxHeight = 600; // 容器高度
                //let paddingBottom = 50; // 底部留白高度
                this.listArr = []; // 用于存放列表数据
                this.isGetting = false;
                var popCount = document.getElementById("popCount");
                popCount.innerHTML = targets.length;

                var pop = document.getElementById("pop");
                // 将滚动位置归位到顶部
                pop.scrollTo({
                    top: 0,
                    behavior: 'smooth' // 使用平滑滚动
                });
                // 初始化时删除所有子元素
                while (pop.hasChildNodes()) {
                    pop.removeChild(pop.firstChild);
                    console.log("remove");
                }
                // if(targets.length <= size){
                //     this.createList(targets);
                //     return;
                // }
                // 初始化第一页
                const {fragment, ul: ulli} = this.createLists(this.page,this.size,targets);
                pop.appendChild(fragment);
                //console.log(ul);
                console.log(ulli);

                //console.log(document.body.contains(list));
                setTimeout(()=>{
                    const list = document.querySelector(`.page_${this.page}`);
                    console.log(list.clientHeight);
                    const listHeight = list.clientHeight;
                    this.listArr.push({list, height: listHeight});
                    this.nextHeight = listHeight - this.boxHeight;
                },0);
                
                this.searchCustomers = targets;
                // const list = document.querySelector(`.page_${page}`);
                // console.log(list.clientHeight);
                //console.log(this.listArr);
            },

            scrollChange(e){
                const scrollTop = e.target.scrollTop;
                console.log(scrollTop);
                var pop = document.getElementById("pop");
                if(scrollTop >= this.nextHeight){
                    if(this.isGetting) return;
                    this.isGetting = true;
                    this.page++;
                    let fragment;
                    let pushObj;
                    console.log(pushObj);
                    if(this.page * this.size > this.searchCustomers.length){
                        this.page--;
                        this.isGetting = false;
                        return;
                    }
                    if(!this.listArr[this.page - 1]){
                        const {fragment: element, ul} = this.createLists(this.page, this.size, this.searchCustomers);
                        fragment = element;
                        console.log(element);
                        console.log(ul);
                        pushObj = {ul};
                    } else {
                        const {uiList, height} = this.listArr[this.page - 1];
                        fragment = uiList;
                        console.log(height);
                    }
                    pop.appendChild(fragment);

                    this.nextHeight = pop.clientHeight - this.boxHeight;
                    if(pushObj){
                        const listHeight = document.querySelector(`.page_${this.page}`).clientHeight;
                        console.log("需要验证" + listHeight);
                        pushObj.height = listHeight;
                        this.listArr.push(pushObj);

                    }
                    const hideElem = document.querySelector(`.page_${this.page - this.preLoadNum}`);
                    if(hideElem){
                        pop.removeChild(hideElem);
                    }
                }else if(scrollTop <= this.nextHeight - this.listArr[this.listArr.length - 1].height && this.page > this.preLoadNum){
                    this.page--;
                    const { ulli } = this.listArr[this.page - this.preLoadNum];
                    pop.insertBefore(ulli, pop.childNodes[0]);

                    const hideElem = document.querySelector(`.page_${this.page + 1}`);
                    if(hideElem){
                        pop.removeChild(hideElem);
                    this.nextHeight = pop.clientHeight - this.boxHeight;
                    }
                }
                this.isGetting = false;
            },

            createLists(page, size, targets){
                this.showPop.isShow = true;
                // if(targets.lenght <= size){
                //     size = targets.length;
                // }
                const fragment = document.createDocumentFragment();
                const ul = document.createElement("ul");
                ul.className = `page_${page}`;
                ul.setAttribute("style", "list-style: none; padding-left: 0px;");
                for(var i = (page - 1) * size; i < targets.length && i < page * size; i++){
                    const li = document.createElement("li");
                    li.setAttribute("style","margin-top:10px;");
                    li.innerHTML = "<div class='infoBoxContent'><div class= 'title'>" + "<location>"+ targets[i].客户名称 +"</location></div>";
                    li.innerHTML += "<div class = 'list1'>客户资料</div><hr>"+"<div><table>" + "<tr><td><div><label>位置:" +"</label><span>"+ targets[i].bd09_lng + "E,"+ targets[i].bd09_lat +"N"+"</span></div></td></tr>" ;
                    li.innerHTML += "<tr><td><div><label>辖区:"+"</label><span>"+ targets[i].辖区 + "</span></div></td>" + "<td><div><label>市及县:"+"</label><span>"+ targets[i].市及县 + "</span></div></td></tr>"
                    li.innerHTML += "<tr><td><div><label>街道:"+"</label><span>"+ targets[i].街道 + "</span></div></td><tr>";
                    li.innerHTML += "</table></div></div>";
                    ul.appendChild(li);
                }
                fragment.appendChild(ul);
                // console.log(fragment);
                // console.log(ul);
                return {fragment, ul};

            },


            createList(targets){
                this.showPop.isShow = true;
                var popCount = document.getElementById("popCount");
                popCount.innerHTML = targets.length;
                var list = document.getElementById("list");
                
                //document.getElementById("poplist").addEventListener('scroll', this.scrollChange, true)
                //console.log(document.getElementById("pop").offsetHeight);
                list.innerHTML = "";
                for(var i = 0; i < targets.length; i++){
                    var li = document.createElement("li");
                    li.setAttribute("style","margin-top:10px;");
                    //li.innerHTML = targets[i].客户名称;
                    li.innerHTML = "<div class='infoBoxContent'><div class= 'title'>" + "<location>"+ targets[i].客户名称 +"</location></div>";
					li.innerHTML += "<div class = 'list1'>客户资料</div><hr>"+"<div><table>" + "<tr><td><div><label>位置:" +"</label><span>"+ targets[i].bd09_lng + "E,"+ targets[i].bd09_lat +"N"+"</span></div></td></tr>" ;
                    li.innerHTML += "<tr><td><div><label>辖区:"+"</label><span>"+ targets[i].辖区 + "</span></div></td>" + "<td><div><label>市及县:"+"</label><span>"+ targets[i].市及县 + "</span></div></td></tr>"
                    li.innerHTML += "<tr><td><div><label>街道:"+"</label><span>"+ targets[i].街道 + "</span></div></td><tr>";
                    li.innerHTML += "</table></div></div>"; 
                    list.appendChild(li);
                }
            
            },
            
            createMarker(){
               	var lastInfoBox = null;
				this.Map.clearOverlays();
                this.Map.centerAndZoom(new window.BMap.Point(105, 32), 6);
				//var myIcon = new window.BMap.Icon(Icon, new window.BMap.Size(28, 28));
                var MAPMarkers = []

				for(var j = 0; j< this.customers.length; j++){
					
                    let customer = this.customers[j];
                    
					let LonAndLan = new window.BMap.Point(customer.bd09_lng,customer.bd09_lat);
                          
					let marker = new window.BMap.Marker(LonAndLan); 
                    let html = "<div class='infoBoxContent'><div class= 'title'>" + "<location>"+ this.customers[j].客户名称 +"</location></div>";
					        html += "<div class = 'list1'>客户资料</div><hr>"+"<div><table>" + "<tr><td><div><label>位置:" +"</label><span>"+ customer.bd09_lng + "E,"+ customer.bd09_lat +"N"+"</span></div></td></tr>" ;
                    html += "<tr><td><div><label>辖区:"+"</label><span>"+ customer.辖区 + "</span></div></td>" + "<td><div><label>市及县:"+"</label><span>"+ customer.市及县 + "</span></div></td></tr>"
					html += "<tr><td><div><label>街道:"+"</label><span>"+ customer.街道 + "</span></div></td><tr>";
                    html += "</table></div></div>"; 


				    let infoBox = new window.BMapLib.InfoBox(this.Map,html,{
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
                    marker.addEventListener("click", function(){
					if(lastInfoBox){
				//判断上一个窗体是否存在，若存在则执行close
                    lastInfoBox.close();
                }
				    lastInfoBox = infoBox;
					infoBox.open(marker);
                   //开启信息窗口
                    });
                    MAPMarkers.push(marker);

			
				}
               
                // 使用点聚合
                 this.Map.markerClusterer = new window.BMapLib.MarkerClusterer(this.Map, {
                markers: MAPMarkers})


	
            },

            heatMap(){
                this.showPop.isShow = false;
                this.showNum = false;
                 if (this.Map.markerClusterer) {
                  this.Map.markerClusterer.clearMarkers();
                  this.all = 0;
                  this.buttonAll = 'plain';
                 }
                this.Map.clearOverlays();
                this.heat++;
                this.Map.centerAndZoom(new window.BMap.Point(105, 37), 5);
                var heatpoints = [];
                heatpoints = this.points;
                var heatmapOverlay = new window.BMapLib.HeatmapOverlay({"radius":20});
                this.Map.addOverlay(heatmapOverlay);
	            heatmapOverlay.setDataSet({data:heatpoints,max:8}); 
                this.buttonHeat = 'primary';
                //heatmapOverlay.setOptions({"maxOpacity":1,"minOpacity":0.3});
                //heatmapOverlay.show();
                
                if(this.heat % 2 == 0){

                this.heat = 0;
                this.buttonHeat = 'plain';
                this.Map.clearOverlays();
                //heatmapOverlay.setOptions({"visible":false})
                }


            },

			initMapHeight() {
				var main = document.getElementById("map");
				main.style.height = window.innerHeight -20 + "px";
			},
        },
		
	
	
		mounted() {   

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
			this.initMapHeight();
			this.map();
			this.visible = false;
			window.onInfoWindowClick = function() {

        }
			window.onresize = () => {
				return (() => {
					this.mapHeight = window.innerHeight + 'px';
				})();
			};	
            console.log(geohash.GeoHash.encodeGeoHash(40.119239,116.651846)); 
            var el = document.getElementById("pop");
            if(el) {
                var timeout = null,
                startTime = Date.parse(new Date); // 开始时间
                el.addEventListener('scroll', (e) => {
                    if(timeout !== null) clearTimeout(timeout);
                    var curTime = Date.parse(new Date);
                    if(curTime - startTime > 1000){
                        this.scrollChange(e);
                        startTime = curTime;
                    } else {
                        timeout = setTimeout(() => {
                            this.scrollChange(e);
                        }, 300);
                    }
                    
                }, true);
            }
		},
        
	};
</script>
<style >
	#allmap {
		height: 100%;
		overflow: hidden;
	}
    input[type=text] {
 border-color: #68AEAA;
 width:360px;
 height: 40px;
 outline-style: none ;
}
.poplist {
    width:360px;
    height: 600px;
    top:10px;
    background-color: #fff;
    overflow: auto;
}
.popNum {
    width:350px;
    
    background-color: #fff;
    padding: 5px;
    font-size: 14px;
    color: #000;
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
 .el-input-group__append {
  width:20px;
  background-color: #3385FF;
  color: #FFF;
  border-color: #3385FF;
  text-align: center; 
  font-size:16px;

 }
hr{
	height:1px;border:none;border-top:1px dashed #3385FF;width:auto;
}
.infoBoxContent{overflow: auto;}
.infoBoxContent .title{background-color: #3385FF;color:#fff;padding:5px;font-size:14px;font-weight: bold;}
.infoBoxContent .title location{font-size:16px;line-height:30px;padding:6px 18px 6px 5px;white-space: nowrap;}
.infoBoxContent .title .point{color:#FFFF00;font-size:10px;padding:6px 10px 6px 25px;}
.infoBoxContent .list1{background:#fff;font-size:13px;padding:8px 10px 0}
.infoBoxContent .list2{background:#fff;font-size:13px;padding:0px 10px 1px }
.infoBoxContent .list3{background:#fff;font-size:12px;padding:8px 0px 0}
.infoBoxContent table{ padding:0px 0px 8px 0px;}
.infoBoxContent tr td {font-size:12px;padding:0px 10px 0;white-space: nowrap;}
.infoBoxContent tr td label {font-size:12px;font-weight: 600;white-space: nowrap;}
.infoBoxContent .title a {padding:6px 10px 6px 120px;font-size:10px;text-decoration:underline;}
.infoBoxContent .title button {background-color:#3385FF;color:#FFF; position: absolute;right:20px;top:10px; padding:5px;font-size:10px;}

</style>


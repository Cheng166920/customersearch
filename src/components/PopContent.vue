<template>
<div id ='pop'>
    <div v-show ="showPop.isShow" class = "poplist" ref="popContent">
    </div>
    <div v-show ="showPop.showNum" class = "popNum">
    <p>共找到<span id="popCount">{{ count }}</span>个搜索结果。</p>
    </div>
</div>
</template>

<script>
 
export default {
    name: 'PopContent',
    props: {
        count: Number,
        showPop: Object,
        // searchCustomers: Array
    },
    data(){
        return{
            // 定义初始化数据
            page: 1, // 页码
            size: 20, // 每页条数
            boxHeight: 600, // 容器高度
            listArr: [], // 用于存放列表数据
            nextHeight: 0,
            isGetting: false,
            searchCustomers: []
        }
    },
    methods:{
        initCustomerList(targets){
            // 定义初始化数据
            this.page = 1; // 页码
            this.size = 20; // 每页条数
            this.listArr = []; // 用于存放列表数据
            this.isGetting = false;

            var pop = this.$refs.popContent;
            // 将滚动位置归位到顶部
            console.log("滚动位置scroll")
            
            // 初始化时删除所有子元素
            while (pop.hasChildNodes()) {
                pop.removeChild(pop.firstChild);
                console.log("remove");
            }

            // 初始化第一页
            const {fragment, ul: ulli} = this.createLists(this.page,this.size,targets);
            pop.appendChild(fragment);
            console.log(ulli);
            setTimeout(()=>{
                const list = document.querySelector(`.page_${this.page}`);
                console.log(list.clientHeight);
                const listHeight = list.clientHeight * this.page;
                this.listArr.push({list, height: listHeight});
                this.nextHeight = listHeight - this.boxHeight;
                this.scrollTop();
            },0);
            
            this.searchCustomers = targets;
        },
        createLists(page, size, targets){
                const fragment = document.createDocumentFragment();
                const ul = document.createElement("ul");
                ul.className = `page_${page}`;
                ul.setAttribute("style", "list-style: none; padding-left: 0px;");
                console.log("滚动", page, size);
                for(var i = (page - 1) * size; i < targets.length && i < page * size; i++){
                    const li = document.createElement("li");
                    li.setAttribute("style","margin-top:10px;");
                    li.innerHTML = "<div class='infoBoxContent'><div class= 'title'>" + "<location>"+ i +"</location></div>";
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

        // 滚动事件
        scrollChange(e){
            if(this.isGetting || this.searchCustomers.length === 0) return;
            const scrollTop = e.target.scrollTop;
            console.log(scrollTop, this.nextHeight);
            if(scrollTop >= this.nextHeight){
                this.isGetting = true;
                this.page++;
                const {fragment, ul: ulli} = this.createLists(this.page,this.size,this.searchCustomers);
                console.log(ulli);
                this.$refs.popContent.appendChild(fragment);
                setTimeout(()=>{
                    const list = document.querySelector(`.page_${this.page}`);
                    const listHeight = list.clientHeight;
                    this.listArr.push({list, height: listHeight});
                    // 获取this.listArr中所有list的高度之和
                    const listHeights = this.listArr.reduce((prev, curr) => prev + curr.height, 0);
                    this.nextHeight = listHeights - this.boxHeight;
                    this.isGetting = false;
                },0);
            } 
        },
         
        scrollTop(){
            // 将滚动位置归位到顶部
            this.$refs.popContent.scrollTo({
                top: 0,
                behavior: 'smooth' // 使用平滑滚动
            });
        }
 
    },
    
    updated(){
        var el = this.$refs.popContent;
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

<style>
#pop{
    z-index: 1000;
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

</style>
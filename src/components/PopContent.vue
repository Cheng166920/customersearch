<template>
<div id ='pop'>
    <div v-show ="showPop.isShow" id = "popContent" class = "poplist">
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
        targets: Array,
        // searchCustomers: Array
    },
    data(){
        return{
            // 定义初始化数据
            page: 1, // 页码
            size: 20, // 每页条数
            preLoadNum: 3, // 同时展示载页数
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

            var pop = document.getElementById("popContent");
            // 将滚动位置归位到顶部
            // pop.scrollTo({
            //     top: 0,
            //     behavior: 'smooth' // 使用平滑滚动
            // });
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
            console.log(ulli);
            setTimeout(()=>{
                const list = document.querySelector(`.page_${this.page}`);
                console.log(list.clientHeight);
                const listHeight = list.clientHeight;
                this.listArr.push({list, height: listHeight});
                this.nextHeight = listHeight - this.boxHeight;
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
        scrollChange(e){
            const scrollTop = e.target.scrollTop;
            console.log(scrollTop);
            var pop = document.getElementById("popContent");
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

           
    },
    watch:{
        'showPop.showNum'(oldValue, newValue){
            if(oldValue == false && newValue == true){
                var pop = document.getElementById("popContent");
            // 将滚动位置归位到顶部
                pop.scrollTo({
                    top: 0,
                    behavior: 'smooth' // 使用平滑滚动
                });
            }
        },
            
    },
 
    updated(){
        if(this.targets.length > 0){
            this.initCustomerList(this.targets);
        }
        var el = document.getElementById("popContent");
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
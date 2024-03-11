import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import axios from 'axios'
//import BaiduMap from 'vue-baidu-map'
import * as ElIcons from '@element-plus/icons-vue'

const app = createApp(App)

for(let iconName in ElIcons){
    app.component(iconName,ElIcons[iconName])
}

app.use(ElementPlus)
app.mount('#app')
app.config.globalProperties.$axios = axios





import { createApp } from 'vue'
import ElementPlus, { ElMessage } from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import store from './store'
import App from './App.vue'

const app = createApp(App)

app.config.globalProperties.$message = ElMessage

app.use(ElementPlus)
  .use(store)
  .mount('#app')

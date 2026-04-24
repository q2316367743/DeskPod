import '@/assets/style/global.less'
import 'virtual:uno.css'
import { createApp } from 'vue'
import App from './App.vue'
import { router } from '@/nested/setting/router'

createApp(App).use(router).mount('#app')

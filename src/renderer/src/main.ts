import '@/assets/style/global.less'
import 'virtual:uno.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

createApp(App).use(createPinia()).mount('#app')

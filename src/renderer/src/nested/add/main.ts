import '@/assets/style/global.less'
import 'virtual:uno.css'

import { createApp } from 'vue'
import App from './App.vue'
import { registerMonacoLanguages } from '@/global/monaco'

registerMonacoLanguages()

createApp(App).mount('#app')

import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './views/App.vue'
import router from './router'

const app = createApp(App)

// app.use() --> Vue 애플리케이션에 플러그인을 추가할 때 사용
app.use(createPinia())
app.use(router)

app.mount('#app')

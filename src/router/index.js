import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from "@/App.vue";
import {createApp} from "vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

const app = createApp(App) //app 객체 생성
app.use(VueAxios, axios) // app에 axios를 사용하겠다고 선언 ( 작성 안해줘도 됨 )

app.config.globalProperties.axios = axios; // axios를 전역화 ( 다른 컴포넌트에서 사용 가능하도록 )
export default router

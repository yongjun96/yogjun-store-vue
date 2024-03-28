import { createRouter, createWebHistory } from 'vue-router'
import CreatePost from '../views/CreatePost.vue'
import Post from '../views/Post.vue'
import Login from '../views/Login.vue'
import App from '../views/App.vue'
import Home from '../views/Home.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import {createApp} from "vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },

    {
      path: '/createPost',
      name: 'CreatePost',
      component: CreatePost, meta: { requiresAuth: true } // 예시 로그인이 필요한 페이지 설정
    },

    {
      path: '/post',
      name: 'Post',
      component: Post
    },

    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

// 네비게이션 가드를 사용하여 페이지가 변경될 때마다 로그인 상태를 확인합니다.
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('accessToken') !== null;
  console.log("네비게이션 가드 실행됨");


  // 로그인이 필요한 페이지인 경우, 로그인하지 않은 경우 로그인 페이지로 리다이렉트합니다.
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login'); // 로그인 페이지로 리다이렉트
  } else {
    next(); // 그 외의 경우에는 정상적으로 페이지 이동
  }



});


const app = createApp(App) //app 객체 생성
app.use(VueAxios, axios) // app에 axios를 사용하겠다고 선언 ( 작성 안해줘도 됨 )

app.config.globalProperties.axios = axios; // axios를 전역화 ( 다른 컴포넌트에서 사용 가능하도록 )

export default router

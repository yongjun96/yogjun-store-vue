<template>
  <header>
    <!-- 헤더 내용 -->
    <h1 id="headerTitle">헤더</h1>
    <nav>
      <router-link to="/">메인</router-link>
      <router-link to="/createPost">글작성</router-link>
      <router-link to="/post">글목록</router-link>

      <!-- 로그인/로그아웃 링크를 동적으로 표시 -->
      <router-link v-if="isLoggedIn" @click="logout" to="/login">로그아웃</router-link>
      <router-link v-else to="/login"  class="login-button">로그인</router-link>
    </nav>


  </header>

</template>
<script>

import axios from "axios";

export default {

  data() {
    return {
      refreshHeader: false // 헤더 새로고침 상태를 관리합니다.
    };
  },

  computed: {
    isLoggedIn() {
      // 로컬 스토리지에서 accessToken을 가져와서 null이 아닌지 확인하여 로그인 상태를 판단
      return localStorage.getItem('accessToken') !== null;
    }
  },
  methods: {
    logout() {
      // 로컬 스토리지에서 accessToken을 제거
      localStorage.removeItem('accessToken');

      // 캐시를 비우고 로그인 페이지로 이동
      this.clearCacheAndRedirectToLogin();
    },
    clearCacheAndRedirectToLogin() {
      // 캐시를 비우고 로그인 페이지로 이동
      window.location.href = '/login'; // 로그인 페이지로 이동
    }
  },



}



// export default {
//   computed: {
//     isLoggedIn() {
//       // 로컬 스토리지에서 accessToken을 가져와서 null이 아닌지 확인하여 로그인 상태를 판단
//       return localStorage.getItem('accessToken') !== null;
//     }
//   },
//   methods: {
//     logout() {
//       // 로그아웃 처리
//       localStorage.removeItem('accessToken'); // 로컬 스토리지에서 accessToken 제거
//       location.reload();
//       this.$router.push('/login'); // 로그인 페이지로 이동
//     }
//   }
// }
</script>

<style>

</style>
<script>

export default {

  data() {
    return {
      refreshHeader: false, // 헤더 새로고침 상태를 관리합니다.
      isMenuOpen: false, // 메뉴가 열려 있는지 여부를 나타내는 상태
    };
  },

  computed: {
    isLoggedIn() {
      // 로컬 스토리지에서 accessToken을 가져와서 null이 아닌지 확인하여 로그인 상태를 판단
      return localStorage.getItem('accessToken') !== null;
    }

  },

  methods: {

    // 햄버거 버튼 클릭 시 메뉴 토글
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },

    logout() {

      this.toggleMenu();

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

</script>

<template>
  <header>
    <!-- 헤더 내용 -->
    <h1 id="headerTitle">방장</h1>

    <!-- 햄버거 버튼 -->
    <button class="hamburger-button" @click="toggleMenu">
      <!-- 햄버거 아이콘 -->
      <span></span>
      <span></span>
      <span></span>
    </button>

    <nav :class="{ 'is-active': isMenuOpen }">
      <router-link @click="toggleMenu" to="/">메인</router-link>
      <router-link @click="toggleMenu" to="/create-post">글작성</router-link>
      <router-link @click="toggleMenu" :to="{ path: '/post-list', query: { page: 1 } }">글목록</router-link>

      <!-- 로그인/로그아웃 링크를 동적으로 표시 -->
      <router-link @click="logout" v-if="isLoggedIn" to="#">로그아웃</router-link>
      <router-link @click="toggleMenu" v-if="isLoggedIn" to="/profile">회원정보</router-link>
      <router-link @click="toggleMenu" v-else to="/login"  class="login-button">로그인</router-link>
      <router-link @click="toggleMenu" to="/signup">회원가입</router-link>
    </nav>

  </header>
</template>


<style>
/* 햄버거 버튼 스타일 */
.hamburger-button {
  position: absolute;
  top: 15px; /* 헤더의 상단에 배치 */
  right: 10px; /* 헤더의 오른쪽에 배치 */
  background: none;
  border: none;
  cursor: pointer;
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.hamburger-button span {
  width: 25px;
  height: 2px;
  background-color: white;
  margin: 4px 0;

}

/* 내비게이션 스타일 */
nav {
  display: flex;
  justify-content: center;
  gap: 20px;
}

/* 내비게이션 메뉴의 링크 스타일 */
nav a {
  color: white;
  padding: 10px;
}

/* 내비게이션 링크 호버 시 스타일 */
nav a:hover {
  background-color: #444;
}

/* 모바일 화면에 적용할 미디어 쿼리 */
@media (max-width: 767px) {
  /* 모바일 화면에서는 내비게이션 메뉴를 숨깁니다 */
  nav {
    display: none;
  }

  /* 햄버거 버튼 스타일 */
  .hamburger-button {
    position: absolute;
    top: 7px; /* 헤더의 상단에 배치 */
    right: 10px; /* 헤더의 오른쪽에 배치 */
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  /* 메뉴가 열려 있을 때는 메뉴를 표시합니다 */
  nav.is-active {
    display: block;
    background-color: #333;
    padding: 10px;
    position: absolute;
    top: 60px;
    right: 10px;
    z-index: 9999;
    border-radius: 5px;
  }

  /* 메뉴 항목 스타일 */
  nav a {
    display: block;
    padding: 10px;
    color: white;
    text-align: center;
  }

  nav a:hover {
    background-color: #444;
  }

  header {
    padding: 10px; /* 내부 여백 */
    height: 50px;
  }

}
</style>
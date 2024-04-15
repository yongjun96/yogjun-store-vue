<script>

import axios from "axios";

export default {

  data() {
    return {
      postData: {
        email: '',
        password: ''
      },
      emailErrorMessage: '',
      passwordErrorMessage: ''
    }
  },

  mounted() {
  },


  methods: {

    memberLogin() {
      axios.post(import.meta.env.VITE_APP_API_URL+'/auth/login', this.postData)

          .then(response => {
            console.log(response.data);

            // 로그인이 성공하면 발급 받은 엑세스 토큰을 저장
            const accessToken = response.data.accessToken;
            // 여기에서 발급 받은 엑세스 토큰을 어떻게 사용할지 구현
            console.log('로그인 성공! 엑세스 토큰:', accessToken);
            localStorage.setItem('accessToken', accessToken); // 발급된 엑세스 토큰을 로컬 스토리지에 저장
            // 로그인 성공 후 필요한 작업 수행 (예: 홈 페이지로 리다이렉트)
            this.$router.push('/'); // 홈 페이지로 이동

            this.clearCacheAndRedirectToLogin();
          })
          .catch(error => {
            console.log(error.response.data.code);

            if (error.response.data.code == 'M004') {
              this.emailErrorMessage = error.response.data.message;
              return;
            }

            if (error.response.data.code == 'M003') {
              this.passwordErrorMessage = error.response.data.message;
              return;
            }


            console.error('Error fetching data:', error);
          })
    },

    clearCacheAndRedirectToLogin() {
      // 캐시를 비우고 로그인 페이지로 이동
      window.location.href = '/'; // 로그인 페이지로 이동
    },

    getGoogleAuthUrl() {
      return `${import.meta.env.VITE_APP_API_URL}/oauth2/authorization/google`;
    },


  }
}

</script>

<template>

  <div class="login-container">
    <h2>로그인</h2>
    <div class="input-group">
      <label for="email">이메일:</label>
      <input type="text" id="email" v-model="postData.email" placeholder="이메일을 입력해주세요."/>
      <p v-if="emailErrorMessage">{{ emailErrorMessage }}</p>
    </div>
    <div class="input-group">
      <label for="password">비밀번호:</label>
      <input type="password" id="password" v-model="postData.password" placeholder="비밀번호를 입력해주세요."/>
      <p v-if="passwordErrorMessage">{{ passwordErrorMessage }}</p>
    </div>
    <button class="loginBtn" @click="memberLogin">로그인</button>

    <!-- 구글 로그인 추가 -->
    <div>
      <a id="google-signin-button" class="google-signin-button" :href="getGoogleAuthUrl()">
        <span class="google-icon"></span>
        <span class="button-text">구글 로그인</span>
      </a>
    </div>

  </div>

</template>

<style scoped>

.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
}

.login-container h2 {
  margin-bottom: 20px;
  color: #007bff;
}

.input-group {
  margin-bottom: 15px;
  text-align: left;
}

.input-group label {
  display: inline-block;
  width: 80px;
  font-weight: bold;
}

.input-group input {
  width: calc(100% - 110px); /* 레이블을 제외한 너비 */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.loginBtn {
  padding: 10px 20px;
  background-color: #007bff; /* 배경색 */
  color: #fff; /* 글자색 */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s; /* 배경색 변화 효과 */
  margin: 10px;
}

.loginBtn:hover {
  background-color: #0056b3; /* 호버 시 배경색 변경 */
}

.input-group p {
  text-align: center;
  margin: 4px 0 0;
  color: red; /* 에러 메시지 색상 */
}

/*--------------------------------------------------------------------------------------------------------------*/

.google-signin-button {
  display: inline-block;
  background-color: #ffffff;
  border: 1px solid #dadce0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.54);
  padding: 0 18px;
  height: 36px;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
  text-decoration: none; /* 아래 밑줄 제거 */
  line-height: 30px; /* 버튼 세로 가운데 정렬을 위해 추가 */
}

.google-signin-button:hover {
  background-color: #f1f3f4;
}

.google-signin-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.3);
}

.google-icon {
  display: inline-block;
  vertical-align: middle;
  padding-bottom: 20px;
  width: 20px;
  background-image: url('/googleLogo.png');
  background-size: cover;
}

.button-text {
  vertical-align: middle;
  display: inline;
  color: #3273dc;
}

</style>
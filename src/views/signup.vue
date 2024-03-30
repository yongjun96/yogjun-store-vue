<script>
import axios from "axios";

export default {

  data() {
    return {
      signUpDto: {
        email: '',
        password: '',
        name: '',
        role: 'MEMBER'
      },
      showModal: false,
      errorMessage: '',
      emailValid: '',
      passwordValid: '',
      nameValid: '',
      signupMessageOne: '',
      signupMessageTwo: '',
    };
  },

  methods: {

    findMember() {
      axios.post(import.meta.env.VITE_APP_API_URL + '/auth/signup', this.signUpDto)

          .then(response => {
            console.log(response.status);
            console.log('회원가입 성공!!');

            this.signupMessageOne = '회원가입이 완료되었습니다!!';
            this.signupMessageTwo = '가입한 이메일로 로그인 해주세요';
            this.openModal();

          })
          .catch(error => {
            this.emailValid = error.response.data.email;
            this.passwordValid = error.response.data.password;
            this.nameValid = error.response.data.name;


            if (error.response.data.code == 'M002') {
              this.errorMessage = error.response.data.message;

              console.log(this.errorMessage);
              this.signupMessageOne = '이미 회원으로 등록된 이메일입니다.';
              this.signupMessageTwo = '이메일을 확인 후, 다시 가입해주세요.';
              this.openModal();
              return;
            }
            console.error('Error fetching data:', error);
          })
    },

      openModal() {
        this.showModal = true; // 모달 열기
      },
      closeModal() {
        this.showModal = false; // 모달 닫기
      }


  }


}

</script>



<template>

  <!-- 모달 -->
  <div class="modal" :class="{ 'is-active': showModal }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-content">
      <!-- 모달 내용 -->
      <div class="box">
        <p>{{signupMessageOne}}</p>
        <p>{{signupMessageTwo}}</p>
      </div>
    </div>
    <button class="modal-close is-large" @click="closeModal"></button>
  </div>
  <!-- 모달 끝 -->


  <div class="createPost" id="app">
    <h1>회원가입 페이지 입니다.</h1>
  </div>

  <table>
    <tr>
      <th><label for="email">이메일</label></th>
      <td>
        <input type="text" v-model="signUpDto.email" id="email" name="email" placeholder=" 회원가입하면 같은 email로 sns계정 가입을 할 수 없습니다!!">
        <span class="valid">{{emailValid}}</span>
      </td>
    </tr>

    <tr>
      <th><label for="password">비밀번호</label></th>
      <td>
        <input type="password" v-model="signUpDto.password" id="password" name="password" placeholder="최소 8자 이상, 하나 이상의 소문자, 숫자, 특수문자를 포함해야 합니다.">
        <span class="valid">{{passwordValid}}</span>
      </td>
    </tr>

    <tr>
      <th><label for="name">이름</label></th>
      <td>
        <input type="text" v-model="signUpDto.name" id="name" name="name" placeholder=" ex). 홍길동">
        <span class="valid">{{nameValid}}</span>
      </td>
    </tr>


    <!-- 추가 필드들을 여기에 추가할 수 있습니다 -->
  </table>
  <button class="subBtn" @click="findMember">회원가입</button>

</template>


<style>

table {
  width: 50%;
  margin: 0 auto 20px; /* 테이블을 가운데 정렬하고 아래쪽에 여백을 추가합니다. */
  border-collapse: collapse;
  border: 2px solid #ddd;
}

th, td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  width: 20%; /* 라벨 너비 조절 */
  text-align: center;
}

input[type="text"] {
  width: calc(100% - 16px); /* 입력 필드 너비 조절 */
  padding: 7px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

input[type="password"] {
  width: calc(100% - 16px); /* 입력 필드 너비 조절 */
  padding: 7px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.subBtn {
  display: block;
  width: 20%;
  margin: 0 auto;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  text-align: center;
}

/*-------------------------------------------------------------------------------------------------------------*/

.valid{
  display: block;
  color: red;
}

/*----------------------------------------------------------------------------------------------------------*/

.select-box {
  width: calc(100% - 16px); /* 입력 필드 너비 조절 */
  padding: 0px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}
.select-box select {
  width: 100%;
  padding: 8px;
  border: none;
  outline: none;
  background-color: transparent;
  appearance: none;
}
.select-box::after {
  content: '\25BC';
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
}

/*------------------------------------------------------------------------------------------------------------------*/

.upload-button {
  padding: 8px 16px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.upload-button:hover {
  background-color: #0056b3;
}

/*------------------------------------------------------------------------------------------------------------------*/

/* 모달 스타일 */
.modal {
  display: none;
}
.modal.is-active {
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-background {
  background-color: rgba(0, 0, 0, 0.75);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.modal-content {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  max-width: 400px;
  text-align: center;
  z-index: 999;
}
.modal-close {
  background-color: transparent;
  border: none;
  position: absolute;
  top: 15px;
  right: 15px;
  color: #fff;
}


</style>
<script setup>
</script>
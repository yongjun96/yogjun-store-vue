<script>

export default {

  data() {
    return{
      showModal: false,
      errorMessage: '' // 에러 메시지
    }
  },

  mounted() {

    console.log(import.meta.env.VITE_APP_API_URL);

    // 현재 URL에서 accessToken 파라미터 값을 가져옵니다.
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    const errorMessage = urlParams.get('errorMessage');

    // accessToken이 존재할 경우 localStorage에 저장합니다.
    if (accessToken) {
      // localStorage에 accessToken을 저장합니다.
      localStorage.setItem('accessToken', accessToken); // 발급된 엑세스 토큰을 로컬 스토리지에 저장
      // URI에서 accessToken을 제거합니다.
      urlParams.delete('accessToken');

      // URL에서 '?'를 제거한 뒤에 다시 설정합니다.
      const newUrl = window.location.pathname + urlParams.toString();
      window.history.replaceState({}, document.title, newUrl);

      // 토큰을 저장한 후에는 필요에 따라 다른 작업을 수행할 수 있습니다.
      window.location.reload();
      console.log('토큰이 localStorage에 저장되었습니다.');
    }

    if(errorMessage){
      console.log(errorMessage);
      console.log("이미 일반 회원으로 등록된 이메일입니다.");
      console.log("일반 회원으로 탈퇴 후, 소셜로그인 해주세요");

      this.openModal();
    }
  },

  methods: {
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
        <p>이미 일반 회원으로 등록된 이메일입니다.</p>
        <p>일반 회원 탈퇴 후, 소셜로그인 해주세요</p>
      </div>
    </div>
    <button class="modal-close is-large" @click="closeModal"></button>
  </div>
  <!-- 모달 끝 -->

  <h1>메인 입니다.</h1>




</template>

<style scoped>
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
.title {
  color: #3273dc; /* 제목 색상 */
}
.subtitle {
  color: #4a4a4a; /* 부제목 색상 */
}

/*------------------------------------------------------------------------------------------------------------------*/
</style>
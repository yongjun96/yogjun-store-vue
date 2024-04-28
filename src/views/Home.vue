<script>

export default {

  data() {
    return{
      showModal: false,
      errorMessage: '', // 에러 메시지

      images: [
        '../../public/main_images/main1.jpg',
        '../../public/main_images/main2.png',
        '../../public/main_images/main3.jpg',
      ],
      currentIndex: 0,
      intervalId: null,
      slideInterval: 5000, // 3초 간격

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

    this.startAutoSlide();
  },

  beforeUnmount() {
    this.stopAutoSlide();
  },

  methods: {
    openModal() {
      this.showModal = true; // 모달 열기
    },
    closeModal() {
      this.showModal = false; // 모달 닫기
    },

    prevSlide() {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },
    startAutoSlide() {
      this.intervalId = setInterval(this.nextSlide, this.slideInterval);
    },
    stopAutoSlide() {
      clearInterval(this.intervalId);
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


  <p class="welcome-text">방장에 오신걸 환영합니다.</p>
  <br>

  <div class="carousel-container">
    <div class="carousel">
      <img class="slide" :src="images[currentIndex]" :alt="images[currentIndex]">
      <button class="prev-button" @click="prevSlide">Left</button>
      <button class="next-button" @click="nextSlide">Right</button>
    </div>
  </div>




</template>

<style scoped>

.welcome-text {
  font-family: 'Arial', sans-serif; /* 글꼴 설정 */
  font-size: 24px; /* 글자 크기 */
  color: #000000; /* 글자 색상 */
  padding: 10px 20px; /* 패딩 */
  text-align: center; /* 텍스트 중앙 정렬 */
  transition: transform 0.3s ease-in-out; /* 트랜지션 효과 */
}

.welcome-text:hover {
  transform: scale(1.1); /* 마우스 호버 시 확대 */
}


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



.carousel-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.carousel {
  position: relative;
  width: 1000px;
  height: 600px;
  overflow: hidden;
}

.slide {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.prev-button, .next-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  cursor: pointer;
}

.prev-button {
  left: 10px;
}

.next-button {
  right: 10px;
}

/* 모바일 화면 대응 */
@media (max-width: 768px) {
  .carousel {
    width: 100%; /* 모바일 화면에서는 슬라이드 너비를 100%로 */
    height: 300px; /* 모바일 화면에서는 슬라이드 높이를 줄임 */
  }


  /* 모달의 너비를 모바일에 맞게 조정 */
  .modal-content {
    max-width: 90%; /* 모바일 화면에서는 모달의 너비를 줄임 */
  }

  /* 웰컴 텍스트의 크기 및 패딩 조정 */
  .welcome-text {
    font-size: 16px; /* 모바일 화면에서는 글자 크기를 줄임 */
    padding: 5px 10px; /* 모바일 화면에서는 패딩을 줄임 */
  }
}

</style>
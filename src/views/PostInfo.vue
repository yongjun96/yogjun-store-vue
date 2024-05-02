<script>
import axios from "axios";
import VueJwtDecode from "vue-jwt-decode";

export default {

  data() {
    return {
      showModal: false, // 모달의 가시성 상태
      url: `${import.meta.env.VITE_APP_API_URL}`,
      roomPost: {
        address: '',
        detailAddress: '',
        content: '',
        deposit: '',
        depositPrice: '',
        id: '',
        monthlyPrice: '',
        roomOwner: '',
        roomStatus: '',
        squareFootage: '',
        title: '',
        imagesList: [{
          id: '',
          name: '',
          path: ''
        }],
        member: {
          id: '',
          name: '',
          email: '',
          urlPath: ''
        },
      },
      delRoomPost: {
        roomPostId: '',
        memberId: ''
      },
      currentIndex: 0,
      token: '',
      tokenEmail: '',
      isLightboxOpen: false,
      currentImageIndex: 0,
      rotation: 0,
      scale: 1
    }
  },

  computed: {
    loginEmailCheck(){
      if(this.roomPost.member.email !== null ||
          this.roomPost.member.email !== ''){
        return this.tokenEmail == this.roomPost.member.email;
      }

      return null;
    }
  },


  mounted() {

    // 로컬 스토리지에서 accessToken을 가져와서 email 체크

    if(localStorage.getItem('accessToken') !== null) {

      const token = localStorage.getItem('accessToken');
      this.token = token;

      console.log(token);
      const decodedToken = VueJwtDecode.decode(token);

      this.tokenEmail = decodedToken.sub;

    }

    this.roomPost.id = this.$route.query.id;

    console.log("해당 글 번호 : "+this.roomPost.id); // 해당 글 번호

    this.getRoomPost();
  },

  methods: {

    getRoomPost() {
      axios.get(import.meta.env.VITE_APP_API_URL + '/room-post/posts/' + this.roomPost.id, {
        headers: {
          'Content-Type': 'application/json', // 요청의 Content-Type 설정
          //'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // 토큰을 포함한 헤더 설정
        }
      })

          .then(response => {
            console.log(response.data);
            const content = response.data;

            this.roomPost.id = content.id;
            this.roomPost.title = content.title;
            this.roomPost.address = content.address;
            this.roomPost.detailAddress = content.detailAddress;
            this.roomPost.content = content.content;
            this.roomPost.depositPrice = content.depositPrice;
            this.roomPost.deposit = content.deposit;
            this.roomPost.monthlyPrice = content.monthlyPrice;
            this.roomPost.squareFootage = content.squareFootage;
            this.roomPost.member.id = content.member.id;
            this.roomPost.member.name = content.member.name;
            this.roomPost.member.email = content.member.email;
            this.roomPost.roomOwner = content.member.name;

            this.roomPost.imagesList = content.imagesList.map(image => ({
              id: image.id,
              name: image.name,
              path: image.path,
              urlPath: `${image.name}`,
              // localhost path 의 경우
              //urlPath: `${this.url}/${image.path}/${image.name}`
            }));

          })
          .catch(error => {

            console.error('Error fetching data:', error);
          })
    },

    deleteRoomPost(){

      this.delRoomPost.roomPostId = this.roomPost.id;
      this.delRoomPost.memberId = this.roomPost.member.id;

      console.log("확인 : "+this.delRoomPost.roomPostId);
      console.log("확인 : "+this.delRoomPost.memberId);

        axios.patch(import.meta.env.VITE_APP_API_URL + '/room-post/soft-delete', this.delRoomPost, {
          headers: {
            'Content-Type': 'application/json', // 요청의 Content-Type 설정
            'Authorization': `Bearer ${this.token}` // 토큰을 포함한 헤더 설정
          }
        })
            .then(response => {
              console.log(response.data);
              //const content = response.data;
              this.$router.go(-1);

            })
            .catch(error => {

              console.error('Error fetching data:', error);
            })
    },

    nextSlide() {
      if (this.currentIndex < this.roomPost.imagesList.length - 1) {
        this.currentIndex++;
      }
    },
    prevSlide() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    },

    calculationPrice(price) {
      if (price >= 10000) {
        price = price / 10000;
        return price = price + "억";
      } else if (price <= 0) {
        price = "없음";
        return price;
      } else {
        return price + "만원";
      }
    },

    openModal() {
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
    },

    openLightbox(index) {
      this.currentImageIndex = index;
      this.isLightboxOpen = true;
      this.rotation = 0;
      this.scale = 1;
    },
    closeLightbox() {
      this.isLightboxOpen = false;
    },
    rotateLeft() {
      this.rotation -= 90;
    },
    rotateRight() {
      this.rotation += 90;
    },
    zoomIn() {
      this.scale += 0.3;
    },
    zoomOut() {
      this.scale -= 0.3;
    },

  }
}

</script>

<template>


  <div class="room-detail">
    <div class="info-image-slider">
      <div class="info-slide">
       <img class="image" :src="roomPost.imagesList[currentIndex].urlPath" :alt="roomPost.imagesList[currentIndex].name" @click="openLightbox(currentIndex)">
      </div>
    </div>
    <div class="btn-slide">
      <button class="prev-button" @click="prevSlide" :disabled="currentIndex === 0">Left</button>
      <button class="next-button" @click="nextSlide" :disabled="currentIndex === roomPost.imagesList.length - 1">Right</button>
    </div>

    <div class="room-info">
      <h1>{{ roomPost.title }}</h1>
      <br>
      <h3>{{ roomPost.content }}</h3>
      <br>
      <h3>{{"주소 : "+ roomPost.address }} {{ roomPost.detailAddress }}</h3>
      <br>

      <h3> {{ roomPost.deposit +" : "+calculationPrice(roomPost.depositPrice) }}</h3>
      <h3>{{ "보증금 및 월세 : "+ calculationPrice(roomPost.monthlyPrice) }}</h3>

      <h3>{{ "평수 : "+roomPost.squareFootage+"평" }}</h3>
      <h3>{{"작성자 : "+ roomPost.roomOwner }}</h3>
      <h3>{{"작성자 이메일 : "+ roomPost.member.email }}</h3>
    </div>
    <button v-if="loginEmailCheck" @click="deleteRoomPost" class="deleteBtn">글 삭제</button>
  </div>






  <!-- Lightbox 모달 -->
  <div v-if="isLightboxOpen" class="lightbox">
    <div class="lightbox-content">
      <img
          :src="roomPost.imagesList[currentIndex].urlPath"
          :alt="roomPost.imagesList[currentIndex].name"
          :style="{
            transform: 'rotate(' + rotation + 'deg) scale(' + scale + ')'
          }"
      />
    </div>

    <!-- 조작 버튼 -->
    <div class="controls">
      <button @click="rotateLeft">⤺ 회전 (왼쪽)</button>
      <button @click="rotateRight">⤻ 회전 (오른쪽)</button>
      <button @click="zoomIn">➕ 확대</button>
      <button @click="zoomOut">➖ 축소</button>
      <button @click="closeLightbox">❌ 닫기</button>
    </div>

  </div>


</template>

<style>

/* Lightbox 모달 */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

/* Lightbox 컨텐츠 */
.lightbox-content {
  max-width: 100%;
  max-height: 100%;
  overflow-y: auto; /* 세로 스크롤이 필요할 때만 스크롤이 나타나도록 설정 */
  overflow-x: auto; /* 세로 스크롤이 필요할 때만 스크롤이 나타나도록 설정 */
  transform-origin: center center;

}

/* Lightbox 이미지 */
.lightbox-content img {
  min-width: 1400px;
  min-height: 800px;
  width: 50%;
  height: 50%;
  transform-origin: center center;
}

/* Lightbox 조작 버튼 */
.controls {
  position: absolute;
  bottom: 20px; /* 화면 최하단으로 이동 */
  left: 50%; /* 수평 중앙 정렬 */
  transform: translateX(-50%); /* 수평 중앙 정렬을 위한 변환 */
  display: flex;
  gap: 10px; /* 버튼 간격 */
}

/* 조작 버튼 스타일 */
.controls button {
  padding: 5px 10px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}



/* 버튼 컨테이너 */
.btn-slide {
  position: relative; /* 이미지 하단에 위치 */
  top: 10px; /* 이미지 바로 아래에 위치하도록 조정 */
  display: flex; /* 수평으로 나란히 배치 */
  justify-content: center; /* 중앙 정렬 */
  gap: 20px; /* 버튼 간격 */
}

/* 버튼 스타일 */
.prev-button, .next-button {
  padding: 10px; /* 버튼에 여백 추가 */
  background-color: rgba(0, 0, 0, 0.5); /* 배경 색상 */
  color: white; /* 글자 색상 */
  border: none; /* 테두리 없음 */
  border-radius: 50%; /* 둥근 모양 */
  cursor: pointer; /* 커서 스타일 */
}

.prev-button {
  left: 20px; /* 왼쪽에서 10px 위치 조정 */
}

.next-button {
  right: 20px; /* 오른쪽에서 10px 위치 조정 */
}

/* 비활성화된 버튼 스타일 조정 */
.prev-button:disabled, .next-button:disabled {
  background-color: rgba(128, 128, 128, 0.5); /* 비활성화된 상태의 배경 색상 */
  color: rgba(255, 255, 255, 0.5); /* 비활성화된 상태의 글자 색상 */
  cursor: not-allowed; /* 마우스 커서를 비활성화된 상태로 설정 */
}


.room-detail {
  width: 100%;
  padding: 20px;
}

.info-image-slider {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.info-slide {
  position: relative;
  width: 1200px;
  height: 700px;

}

.info-slide img {
  max-width: 1200px;
  max-height: 700px;
  min-height: 700px;
}


.navigation button {
  margin: 0 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.navigation button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.room-info {
  margin-top: 20px;

  padding-top: 20px;
}

.room-info h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.room-info h3 {
  margin-bottom: 10px;
}

.room-info strong {
  margin-right: 10px;
}

.deleteBtn{
  margin: 0 10px;
  padding: 5px 10px;
  background-color: #c92323;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* 모바일 화면 대응 */
@media (max-width: 768px) {

  .info-slide {
    position: relative;
    width: 800px;
    height: 600px;

  }

  .info-slide img {
    max-width: 800px;
    max-height: 600px;
    min-height: 600px;
  }

  /* Lightbox 이미지 */
  .lightbox-content img {
    min-width: 800px;
    min-height: 600px;
    width: 50%;
    height: 50%;
    transform-origin: center center;
  }
}
</style>
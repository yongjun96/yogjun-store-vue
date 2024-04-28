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
        content: '',
        deposit: '',
        depositPrice: '',
        description: '',
        detail: '',
        id: '',
        monthlyPrice: '',
        roomName: '',
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
      return this.tokenEmail == this.roomPost.member.email;
    }
  },


  mounted() {

    // 로컬 스토리지에서 accessToken을 가져와서 email 체크
    const token = localStorage.getItem('accessToken');
    this.token = token;

    console.log(token);
    const decodedToken = VueJwtDecode.decode(token);

    this.tokenEmail = decodedToken.sub;

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
            this.roomPost.roomName = content.roomName;
            this.roomPost.address = content.address;
            this.roomPost.content = content.content;
            this.roomPost.depositPrice = content.depositPrice;
            this.roomPost.deposit = content.deposit;
            this.roomPost.monthlyPrice = content.monthlyPrice;
            this.roomPost.squareFootage = content.squareFootage;
            this.roomPost.member.id = content.member.id;
            this.roomPost.member.name = content.member.name;
            this.roomPost.member.email = content.member.email;
            this.roomPost.roomOwner = content.member.name;

            this.roomPost.description = content.description;
            this.roomPost.detail = content.detail;
            this.roomPost.imagesList = content.imagesList.map(image => ({
              id: image.id,
              name: image.name,
              path: image.path,
              urlPath: `${image.name}`,
              // localhost path의 경우
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
      this.scale += 0.1;
    },
    zoomOut() {
      this.scale -= 0.1;
    },

  }
}

</script>

<template>


  <div class="room-detail">
    <div class="room-header">
      <h1>{{ roomPost.title }}</h1>
    </div>
    <div class="info-image-slider">
      <div class="info-slide">
       <img class="image" :src="roomPost.imagesList[currentIndex].urlPath" :alt="roomPost.imagesList[currentIndex].name" @click="openLightbox(currentIndex)">
        <button class="prev-button" @click="prevSlide" :disabled="currentIndex === 0">Left</button>
        <button class="next-button" @click="nextSlide" :disabled="currentIndex === roomPost.imagesList.length - 1">Right</button>
      </div>
    </div>

    <div class="room-info">
      <h2>{{ roomPost.roomName }}</h2>
      <h3>{{"주소 : "+ roomPost.address }}</h3>
      <br>
      <h3>{{ roomPost.content }}</h3>
      <br>
      <h3>{{ roomPost.description }}</h3>
      <br>
      <h3>{{ roomPost.detail }}</h3>
      <br>

      <h3> {{ roomPost.deposit +" : "+calculationPrice(roomPost.depositPrice) }}</h3>
      <h3>{{ "보증금 및 월세 : "+ calculationPrice(roomPost.monthlyPrice) }}</h3>

      <h3>{{ "평수 : "+roomPost.squareFootage+"평" }}</h3>
      <h3>{{"작성자 : "+ roomPost.roomOwner }}</h3>
      <h3>{{"작성자 이메일 : "+ roomPost.member.email }}</h3>
    </div>
    <button v-if="loginEmailCheck" @click="deleteRoomPost" class="deleteBtn">글 삭제</button>
  </div>



    <!-- 이미지 목록 -->
    <div class="image-gallery">
      <img
          v-for="(image, index) in this.roomPost.imagesList"
          :key="index"
          :src="image.url"
          :alt="image.alt"
          @click="openLightbox(index)"
      />
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

    <!-- 모달 배경 -->
    <div class="lightbox-background" @click="closeLightbox"></div>
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
  position: relative;
  max-width: 80%;
  max-height: 80%;
}

/* Lightbox 이미지 */
.lightbox-content img {
  max-width: 100%;
  max-height: 100%;
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



/* 버튼을 이미지 안으로 배치하고 스타일 조정 */
.prev-button, .next-button {
  position: absolute; /* 버튼의 위치를 이미지 안으로 고정 */
  top: 50%; /* 이미지의 중간 높이로 위치 조정 */
  transform: translateY(-50%); /* 수직 중심으로 조정 */
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5); /* 배경 색상 */
  color: white; /* 글자 색상 */
  border: none; /* 테두리 없음 */
  border-radius: 50%; /* 둥근 모양으로 설정 */
  cursor: pointer;
  z-index: 1; /* z-index를 1로 설정하여 이미지 위에 배치 */
}

.prev-button {
  left: 10px; /* 왼쪽에서 10px 위치 조정 */
}

.next-button {
  right: 10px; /* 오른쪽에서 10px 위치 조정 */
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

.room-header {
  text-align: center;
  margin-bottom: 20px;
}

.info-image-slider {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.info-slide {
  position: relative;
  width: 800px;
  height: 600px;

}

.info-slide img {
  width: 100%;
  height: 100%;
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
  border-top: 2px solid #007bff;
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
    height: auto;

  }

  .info-slide img {
    width: 100%;
    height: auto;
  }

}
</style>
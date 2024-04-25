<script>
import axios from "axios";
import VueJwtDecode from "vue-jwt-decode";

export default {

  data() {
    return {
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
      tokenEmail: ''
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

  }
}

</script>

<template>


  <div class="room-detail">
    <div class="room-header">
      <h1>{{ roomPost.title }}</h1>
    </div>
    <div class="image-slider">
      <div class="slide">
        <img :src="roomPost.imagesList[currentIndex].urlPath" :alt="roomPost.imagesList[currentIndex].name">
      </div>
    </div>
    <div class="navigation">
      <button @click="prevSlide" :disabled="currentIndex === 0">Previous</button>
      <button @click="nextSlide" :disabled="currentIndex === roomPost.imagesList.length - 1">Next</button>
    </div>
    <div class="room-info">
      <h1>Room Information</h1>
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

</template>

<style>
.room-detail {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.room-header {
  text-align: center;
  margin-bottom: 20px;
}

.image-slider {
  position: relative;
  overflow: hidden;
}

.slide {
  text-align: center;
}

.slide img {
  max-width: 100%;
  height: 600px;
}

.navigation {
  margin-top: 10px;
  text-align: center;
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
</style>
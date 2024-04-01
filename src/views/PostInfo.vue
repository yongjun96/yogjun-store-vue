<script>
import axios from "axios";

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
      currentIndex: 0
    }
  },


  mounted() {
    this.roomPost.id = this.$route.query.id;
    console.log("해당 글 번호 : "+this.roomPost.id); // 해당 글 번호

    this.getRoomPost();
  },

  methods: {

    getRoomPost() {
      axios.get(import.meta.env.VITE_APP_API_URL + '/roomPost/posts/' + this.roomPost.id, {
        headers: {
          'Content-Type': 'application/json', // 요청의 Content-Type 설정
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // 토큰을 포함한 헤더 설정
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
            this.roomPost.imagesList = content.imagesList.map(image => ({
              id: image.id,
              name: image.name,
              path: image.path,
              urlPath: `${this.url}/${image.path}/${image.name}`
            }));

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
  }
}

</script>

<template>


  <div class="room-detail">
    <div class="room-header">
      <h1>{{ roomPost.title }}</h1>
      <p>{{ roomPost.address }}</p>
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

  </div>

</template>

<style>
.room-detail {
  max-width: 800px;
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
  max-width: 800px;
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
</style>
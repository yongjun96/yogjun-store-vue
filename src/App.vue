<script>
import axios from 'axios'
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';

export default {

  data() {
    return {
      postData: {
        email: 'practice960426@gmail.com',
        password: ''
      },
      modal: false,
      report: [0, 0, 0],
      menuBar: ['Home', 'Products', 'About'],
      product : ['역삼동원룸', '천호동원룸', '마포구원룸'],
      price: [1000, 5000, 2000],
      picture: ['./src/assets/역산동원룸.jpg', './src/assets/천호동원룸.jpg', './src/assets/마포구원룸.jpg']
    }
  },

  mounted() {

  },

  methods: {

    memberLogin() {
      axios.post('http://localhost:8080/member/login', this.postData)

          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          })
    },

    popup(){
      window.open("http://localhost:8080/oauth2/authorization/google", "_blank");
    },

    increase(i){
      this.report[i]++;
    },

    modalOpenAndClose(){
      if(this.modal == true){
        this.modal = false;
      }else {
        this.modal = true;
      }
    }


  },

  components: {

  }
}

</script>


<template>

  <div id="all">
    <Header />
  </div>

  <dev @click="memberLogin">l,m</dev>
  <a @click="popup">구글 로그인</a>

  <!-- 모달창 -->
  <div class="black-bg" v-if="modal == true">
    <div class="white-bg">
      <h2>상세 페이지 모달</h2>
      <p>응~~ 열렸어~~</p>
      <button @click="modalOpenAndClose">닫기</button>
    </div>
  </div>


  <body>
  <div v-for="(a,i) in product" :key="a">
    <img v-if="a" :src=picture[i] class="pictureClass" @click="modalOpenAndClose">
    <h2>{{ a }}</h2>
    <p>{{ price[i] }} 만원</p>
    <button @click="increase(i)">허위매물 신고 버튼</button>
    <span>신고수 : {{ report[i] }}</span>
  </div>


  <div>
    <label for="username">
      <span>username: </span>
      <input type="text" id="username"/>
    </label>
    <label for="password">
      <span>password: </span>
      <input type="password" id="password"/>
    </label>
    <button>로그인</button>
    <button>테스트</button>
  </div>

  </body>

  <Footer />

</template>


<style>

body{
  margin: 0;
}

div{
  box-sizing: border-box;
}

.black-bg{
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  position: fixed; padding: 20px;
}

.white-bg{
  width: 100%;
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.pictureClass{
  width: 300px;
  height: 200px;
}

.menu{
  background: darkslateblue;
  padding: 15px;
  border-radius: 5px;
  width: 100%;
}

.menu a{
  color: white;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>

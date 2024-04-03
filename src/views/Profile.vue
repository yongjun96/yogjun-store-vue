<script>
import VueJwtDecode from "vue-jwt-decode";
import axios from "axios";
import Pagination from "@/components/layout/ProfilePagination.vue";

export default {
  components: {Pagination},
  data() {
    return {
      member: {
        id: '',
        email:'',
        name:'',
        role:'',
        provider:'',
        providerId:''
      },
      authCheckRequest: {
        email:'',
        authNumber:''
      },
      passwordEditRequest: {
        email:'',
        password:'',
        passwordCheck:''
      },
      sendEmail: {
        email:'',
      },
      pageSize: '9',
      page: '',
      currentPage: 0, // 현재 페이지 번호
      totalPages: 0, // 페이징바 개수
      searchContent:'',
      searchOption: 'email',

      roomPost: [{
        id:'',
        title:'',
      }],
      emailErrorMessage:'',
      email:'',
      token:'',
      signupMessageOne: '',
      signupMessageTwo: '',
      showModal: false,
      isVisible: false,
      isLoading: false,
      delMemberShow: false,
      isPasswordChangeVisible: false,
    };
  },

  // 다른 페이지로 이동할 때 RoomPostListPage페이지 정보 저장
  beforeRouteLeave(to, from, next) {
    localStorage.setItem('RoomPostListPage', this.currentPage);
    next();
  },

  watch: {
    '$route.query.page'(newPage, oldPage) {
      localStorage.setItem('RoomPostListPage', this.currentPage);
      if(newPage !== oldPage){
        if (!newPage) {
          // 새 페이지 번호가 없는 경우 뒤로 가기로 인식됩니다.
          this.currentPage = localStorage.getItem('RoomPostListPage');
        }
      }
    }
  },

  computed: {
    googleAuthCheck() {
      // 로컬 스토리지에서 accessToken을 가져와서 null이 아닌지 확인하여 로그인 상태를 판단
      return this.member.providerId == null;
    }
  },

  mounted() {

    const savedPage = localStorage.getItem('RoomPostListPage');
    if (savedPage) {
      this.currentPage = parseInt(savedPage);
      localStorage.removeItem('RoomPostListPage'); // 페이지 번호를 가져온 후 로컬 스토리지에서 제거
    }

    // 토큰을 분석하여 페이로드를 가져옵니다.
    this.token = localStorage.getItem('accessToken');
    const decodedPayload = VueJwtDecode.decode(this.token);

    // 페이로드에서 필요한 정보를 추출합니다.
    this.email = decodedPayload.sub;

    console.log(this.email); // 토큰에 포함된 사용자 ID 출력

    this.findMyProfile();
    this.getRoomPostList();
  },


  methods: {
    findMyProfile() {
      axios.get(import.meta.env.VITE_APP_API_URL + '/member/find/myProfile/' + this.email,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // 토큰을 포함한 헤더 설정
            }
          })

          .then(response => {

            const profile = response.data;

            this.member.id = profile.id;
            this.member.name = profile.name;
            this.member.role = profile.role;
            this.member.email = profile.email;
            this.member.provider = profile.provider;
            this.member.providerId = profile.providerId;

            this.sendEmail.email = profile.email;
            this.authCheckRequest.email = profile.email;
            this.passwordEditRequest.email = profile.email;


          })
          .catch(error => {
            console.log(error.response.data.code);

            this.emailErrorMessage = error.response.data.message;
            console.log("에러 메세지 : "+this.emailErrorMessage);

            console.error('Error fetching data:', error);
          })
    },

    mailSend() {

      this.isLoading = true; // 로딩 중 상태로 설정

      axios.post(import.meta.env.VITE_APP_API_URL + '/mailSend',
          {
            email: this.sendEmail.email // 이메일 주소만 보내도록 수정
            },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // 토큰을 포함한 헤더 설정
            }
          })
          .then(() => {

            this.isLoading = false;

            this.signupMessageOne = '메일이 전송되었습니다.';
            this.openModal();

          })
          .catch(error => {
            console.log(error.response.data.code);

            // Valid
            if(error.response.data.email){
              this.signupMessageOne = error.response.data.email;
              this.openModal();
              console.log("에러 메세지 : "+this.signupMessageOne);

            }else{
              // Exception

              this.signupMessageOne = error.response.data.message;
              this.openModal();
              console.log("에러 메세지 : "+this.signupMessageOne);
            }

            console.error('Error fetching data:', error);
          })
    },

    authCheck() {
      axios.post(import.meta.env.VITE_APP_API_URL + '/authCheck',
          {
            authNumber: this.authCheckRequest.authNumber,
            email: this.authCheckRequest.email
            },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // 토큰을 포함한 헤더 설정
            }
          })

          .then(() => {

            this.signupMessageOne = '메일 인증이 완료되었습니다.';
            this.openModal();

            this.showPasswordChange();

          })
          .catch(error => {
            console.log(error.response.data.code);

            this.signupMessageOne = error.response.data.message;
            this.openModal();
            console.log("에러 메세지 : "+this.signupMessageOne);

            console.error('Error fetching data:', error);
          })
    },

    passwordEdit() {
      axios.patch(import.meta.env.VITE_APP_API_URL + '/auth/passwordEdit',
          {
            email: this.passwordEditRequest.email,
            password: this.passwordEditRequest.password,
            passwordCheck: this.passwordEditRequest.passwordCheck
          },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // 토큰을 포함한 헤더 설정
            }
          })

          .then(() => {

            this.signupMessageOne = '비밀번호 변경이 완료되었습니다. \n  변경된 비밀번호로 다시 로그인해 주세요.';
            this.openModal();


          })
          .catch(error => {
            console.log(error.response.data.code);

            this.signupMessageOne = error.response.data.message;
            this.openModal();
            console.log("에러 메세지 : "+this.signupMessageOne);

            console.error('Error fetching data:', error);
          })
    },

    memberResign() {
      axios.delete(import.meta.env.VITE_APP_API_URL + '/member/delete/'+this.member.email,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // 토큰을 포함한 헤더 설정
            }
          })

          .then(() => {

            localStorage.removeItem('accessToken');
            window.location.href = '/login';

          })
          .catch(error => {
            console.log(error.response.data.code);

            this.signupMessageOne = error.response.data.message;
            this.openModal();
            console.log("에러 메세지 : "+this.signupMessageOne);

            console.error('Error fetching data:', error);
          })
    },

    getRoomPostList() {
      axios.get(import.meta.env.VITE_APP_API_URL + '/roomPost/posts', {
        params: {
          searchContent: this.email,
          searchOption: this.searchOption,
          page: this.currentPage, // 현재 페이지 번호
          size: this.pageSize // 총 페이지 수

        },
        headers: {
          'Content-Type': 'application/json', // 요청의 Content-Type 설정
          //'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // 토큰을 포함한 헤더 설정
        }
      })

          .then(response => {
            console.log(response.data);

            const content = response.data.content;

            // 총 카운트
            this.totalPages = response.data.totalPages;
            console.log("총 카운트 : " + response.data.totalPages);


            this.roomPost = content.map(item => ({
              id: item.id,
              title: item.title,
            }));
          })
          .catch(error => {

            console.error('Error fetching data:', error);
          })
    },

    changePage(page) {
      this.currentPage = page;
      // 페이지 변경에 따른 추가적인 작업 수행 가능
      this.getRoomPostList();
    },

    movePostInfo(id) {
      this.$router.push({
        path: '/postInfo',
        query: {id: id,} // 전달할 데이터를 객체로 넘깁니다.
      });
    },

    delMember(){
      this.delMemberShow = true;
      this.signupMessageOne = '모든 정보가 삭제됩니다. 탈퇴하시겠습니까??';
      this.openModal();
    },

    googleMember(providerId){

      if(providerId !== null){
        return this.member.provider;
      }else{
        return "일반회원";
      }
    },

    openModal() {
      this.showModal = true; // 모달 열기
    },
    closeModal() {
      this.showModal = false; // 모달 닫기
      this.delMemberShow = false;
    },

    verificationDisplay(){
      this.isVisible = !this.isVisible;
    },

    showPasswordChange() {
      this.isPasswordChangeVisible = true;
    },

    truncateTitle(title) {
      const maxLength = 20; // 최대 길이 설정
      if (title.length > maxLength) {
        return title.substring(0, maxLength) + '...'; // 길이가 초과할 경우 "..." 추가하여 반환
      }
      return title;
    }
  }

};
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
        <button @click="memberResign" v-if="delMemberShow" class="deleteMemberBtn">탈퇴</button>
      </div>
    </div>
    <button class="modal-close is-large" @click="closeModal"></button>
  </div>
  <!-- 모달 끝 -->


  <div class="member-detail">
    <h1>회원 정보 조회</h1>
    <div class="info">
      <div><strong>이메일:</strong> {{ this.member.email }}</div>
      <div><strong>이름:</strong> {{ this.member.name }}</div>
      <div><strong>계정 타입:</strong> {{ googleMember(this.member.providerId) }}</div>



      <div class="post-list">
        <h1>작성한 글 목록</h1>
        <div v-if="roomPost.length > 0" class="post-container">
          <div v-for="item in roomPost" :key="item.id" class="post" @click="movePostInfo(item.id)">
            <p>{{ truncateTitle(item.title) }}</p>
          </div>
        </div>
        <div v-else>
          <p>작성한 글이 없습니다.</p>
        </div>
      </div>

      <div>
        <pagination :current-page="currentPage" :total-pages="totalPages" @page-change="changePage" />
      </div>


      <!-- 필요한 정보들 추가 -->
    </div>
    <div class="actions">
      <button v-if="googleAuthCheck" @click="verificationDisplay" class="editMemberBtn">비밀번호 수정</button>
      <button @click="delMember" class="deleteMemberBtn">회원 탈퇴</button>
    </div>
  </div>


  <div>
    <div v-if="isLoading" class="loading-overlay">
      <!-- 로딩 중일 때 표시할 내용 -->
      <div class="loading-message">로딩 중...</div>
    </div>

  <div class="email-verification" v-show="isVisible">
    <h2>이메일 인증</h2>
    <button @click="mailSend" class="authNumCheckBtn">메일받기</button>
    <p>이메일로 전송된 인증번호를 입력해주세요.</p>
    <div>
      <input type="text" placeholder="인증번호 입력" v-model="authCheckRequest.authNumber">
      <button class="authNumCheckBtn" @click="authCheck">확인</button>
    </div>
  </div>
  </div>



<br>
  <div class="password-change" v-show="isPasswordChangeVisible">
    <h2>비밀번호 변경</h2>
    <div class="input-group">
      <label for="new-password">새로운 비밀번호</label>
      <input id="new-password" v-model="passwordEditRequest.password" type="password" placeholder="새로운 비밀번호를 입력해주세요.">
    </div>
    <div class="input-group">
      <label for="confirm-password">비밀번호 확인</label>
      <input id="confirm-password" v-model="passwordEditRequest.passwordCheck" type="password" placeholder="비밀번호를 다시 입력해주세요.">
    </div>
    <button @click="passwordEdit">비밀번호 변경</button>
  </div>


</template>

<style scoped>

.modal-close{
  display: none;
}

.member-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.info {
  margin-bottom: 20px;
}

.info div {
  margin-bottom: 10px;
}

.actions button {
  padding: 10px 20px;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
}

.actions button:hover {
  background-color: #0056b3;
}

.editMemberBtn{
  background-color: #007bff;
}

.deleteMemberBtn {
  background-color: #be3939;
 }



.email-verification {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

.email-verification h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.email-verification p {
  margin-bottom: 20px;
  font-size: 16px;
  color: #666;
}


.authNumCheckBtn {
  padding: 10px 20px;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
}

.authNumCheckBtn:hover {
  background-color: #0056b3;
}

.authNumCheckBtn {
  background-color: #5694dc;
}



.password-change {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.password-change h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  font-size: 16px;
  margin-bottom: 5px;
}

.input-group input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}



.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8); /* 투명도 조절 가능 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-message {
  padding: 20px;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

button[disabled] {
  cursor: not-allowed;
}


.post-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.post-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 20px;
}

.post {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}

.post p {
  margin: 0;
}

</style>
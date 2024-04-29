<script>
import VueJwtDecode from "vue-jwt-decode";
import axios from "axios";

export default {
  data() {
    return {
      roomPostRequest: {
        id: '',
        title: '',
        roomName: '',
        deposit: '전세',
        depositPrice: '',
        monthlyPrice: '',
        description: '',
        roomOwner: '',
        detail: '',
        squareFootage: '',
        content: '',
        address: '',
        roomStatus: '임대',
        memberId: ''
      },
      roomPostError: {
        idError: '',
        title: '',
        roomNameError: '',
        depositError: '',
        depositPriceError: '',
        monthlyPriceError: '',
        descriptionError: '',
        roomOwnerError: '',
        detailError: '',
        squareFootageError: '',
        contentError: '',
        addressError: '',
        roomStatusError: '',
        memberIdError: ''
      },
      token: '',
      email: '',
      name: '',
      role: '',
      files: [],
      showModal: false,
      signupMessageOne: ''
    };
  },

  mounted() {

    // 페이지가 로드되었을 때 한 번 실행
    this.detectDevice();

    // 창 크기가 변경될 때마다 실행
    window.addEventListener('resize', this.detectDevice);

    // 토큰을 분석하여 페이로드를 가져옵니다.
    this.token = localStorage.getItem('accessToken');
    const decodedPayload = VueJwtDecode.decode(this.token);

    // 페이로드에서 필요한 정보를 추출합니다.
    this.email = decodedPayload.sub;
    this.role = decodedPayload.role;

    this.findMember();

    console.log(this.email); // 토큰에 포함된 사용자 ID 출력
    console.log(this.role); // 토큰에 포함된 사용자 유형 출력
  },

  created() {},

  methods: {

    detectDevice() {
      // 미디어 쿼리를 사용하여 화면 너비를 기준으로 모바일 여부 판별
      this.isMobile = window.matchMedia('(max-width: 768px)').matches;
    },

    findMember() {
      axios.get(import.meta.env.VITE_APP_API_URL+'/member/find/'+this.email,
           {
             headers: {
              'Authorization': `Bearer ${this.token}` // 토큰을 포함한 헤더 설정
            }
          })

          .then(response => {
            this.name = response.data.name;
            this.roomPostRequest.memberId = response.data.id;
          })
          .catch(error => {
            console.log(error.response.data.code);

            if (error.response.data.code == 'M001') {
              this.emailErrorMessage = error.response.data.message;
              return;
            }
            console.error('Error fetching data:', error);
          })
    },

    createRoomPost() {

      // 사진을 한장도 업로드 하지 않을 경우
      if(this.files.length <= 0){
        this.signupMessageOne = '사진을 한장 이상 등록해 주세요.';
        this.openModal();
        return;
      }

      // 사진이 10장 초과되는 경우
      else if(this.files.length > 10) {
        this.signupMessageOne = '사진은 10장 까지만 등록 가능합니다.';
        this.openModal();
        return;
      }

      this.roomPostRequest.roomOwner = this.name;

      const formData = new FormData();

      formData.append('roomPostRequest', JSON.stringify(this.roomPostRequest));

      // 업로드된 이미지 uploadImages 담기.
      for (let i = 0; i < this.files.length; i++) {
        formData.append('uploadImages', this.files[i]);
      }

      // 업로드 중 모달 표시
      this.signupMessageOne = '업로드 중...';
      this.openModal();

      axios.post(import.meta.env.VITE_APP_API_URL + '/room-post/create-s3', formData, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'multipart/form-data',
        }
      })
          .then(() => {
            console.log("방 글 작성 완료");
            this.$router.push('/post-list');
          })

          .catch(error => {

            if(error.response.data.message !== null){
              this.signupMessageOne = error.response.data.message;
              this.openModal();
            }
            else if(error.response.data !== null){
              this.roomPostError.titleError = error.response.data.title;
              this.roomPostError.roomNameError = error.response.data.roomName;
              this.roomPostError.depositError = error.response.data.deposit;
              this.roomPostError.depositPriceError = error.response.data.depositPrice;
              this.roomPostError.monthlyPriceError = error.response.data.monthlyPrice;
              this.roomPostError.roomOwnerError = error.response.data.roomOwner;
              this.roomPostError.squareFootageError = error.response.data.squareFootage;
              this.roomPostError.contentError = error.response.data.content;
              this.roomPostError.addressError = error.response.data.address;
              this.roomPostError.roomStatusError = error.response.data.roomStatus;
              console.log(error.response.data.memberId);
            }
            else {
              this.signupMessageOne = '서버 에러입니다. 다시 시도해 주세요.';
              this.openModal();
              console.error('Error fetching data:', error);
            }
          })
    },

    handleFileChange(event) {
      this.files = event.target.files;
      console.log(this.files);
    },

    openModal() {
      this.showModal = true; // 모달 열기
    },
    closeModal() {
      this.showModal = false; // 모달 닫기
    }


  },

  components: {}
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
      </div>
    </div>
    <button class="modal-close is-large" @click="closeModal"></button>
  </div>
  <!-- 모달 끝 -->



  <div class="mobile-form">
    <div class="form-container">
        <div class="form-group">
          <label for="title">제목</label>
          <input type="text" id="title" name="title" v-model="roomPostRequest.title" placeholder="제목">
          <span>{{ roomPostError.titleError }}</span>
        </div>
        <div class="form-group">
          <label for="roomName">방 이름</label>
          <input type="text" id="roomName" name="roomName" v-model="roomPostRequest.roomName" placeholder="방 이름">
          <span>{{ roomPostError.roomNameError }}</span>
        </div>
        <div class="form-group">
          <label for="deposit">전세 및 보증금</label>
          <div class="select-box">
            <select name="deposit" id="deposit" v-model="roomPostRequest.deposit">
              <option value="전세">전세</option>
              <option value="보증금">보증금</option>
            </select>
          </div>
          <span>{{ roomPostError.depositError }}</span>
        </div>
        <div class="form-group">
          <label for="depositPrice">전세 및 보증금 가격</label>
          <input type="number" id="depositPrice" name="depositPrice" v-model="roomPostRequest.depositPrice" placeholder="가격">
          <span>{{ roomPostError.depositPriceError }}</span>
        </div>
        <div class="form-group">
          <label for="monthlyPrice">월세</label>
          <input type="number" id="monthlyPrice" name="monthlyPrice" v-model="roomPostRequest.monthlyPrice" placeholder="월세">
          <span>{{ roomPostError.monthlyPriceError }}</span>
        </div>
        <div class="form-group">
          <label for="description">방 설명</label>
          <textarea id="description" name="description" v-model="roomPostRequest.description" placeholder="방 설명"></textarea>
          <span>{{ roomPostError.descriptionError }}</span>
        </div>
        <div class="form-group">
          <label for="roomOwner">방 주인</label>
          <input type="text" id="roomOwner" name="roomOwner" :value="name" disabled style="text-align: center;">
          <span>{{ roomPostError.roomOwnerError }}</span>
        </div>
        <div class="form-group">
          <label for="detail">방 세부 사항</label>
          <textarea id="detail" name="detail" v-model="roomPostRequest.detail" placeholder="세부 사항"></textarea>
          <span>{{ roomPostError.detailError }}</span>
        </div>
        <div class="form-group">
          <label for="squareFootage">평수</label>
          <input type="number" id="squareFootage" name="squareFootage" v-model="roomPostRequest.squareFootage" placeholder="평수">
          <span>{{ roomPostError.squareFootageError }}</span>
        </div>
        <div class="form-group">
          <label for="content">내용</label>
          <textarea id="content" name="content" v-model="roomPostRequest.content" placeholder="내용"></textarea>
          <span>{{ roomPostError.contentError }}</span>
        </div>
        <div class="form-group">
          <label for="address">주소</label>
          <input type="text" id="address" name="address" v-model="roomPostRequest.address" placeholder="주소">
          <span>{{ roomPostError.addressError }}</span>
        </div>
        <div class="form-group">
          <label for="roomStatus">상태</label>
          <div class="select-box">
            <select name="roomStatus" id="roomStatus" v-model="roomPostRequest.roomStatus">
              <option value="매매">매매</option>
              <option value="임대">임대</option>
              <option value="종료">종료</option>
            </select>
          </div>
          <span>{{ roomPostError.roomStatusError }}</span>
        </div>
        <div class="form-group">
          <label for="file">방 사진</label>
          <input type="file" @change="handleFileChange" multiple>
        </div>
        <button type="button" class="subBtn" @click="createRoomPost">제출</button>
    </div>
  </div>


</template>

<style>

/* 선택적으로 스타일링을 할 수 있습니다. */
textarea {
  width: calc(100% - 16px); /* 입력 필드 너비 조절 */
  height: 100px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none; /* 사용자가 크기를 조절할 수 없도록 설정 */
}


/* 모달 스타일 */
.modal {
  position: fixed; /* 고정 위치 */
  top: 25%; /* 화면 상단에서 50% 위치 */
  left: 50%; /* 화면 왼쪽에서 50% 위치 */
  width: 50%; /* 모달 너비 */
  height: 50%; /* 모달 높이 */
  margin-top: 0%; /* 모달 높이의 절반만큼 위로 이동하여 정 중앙으로 위치 */
  margin-left: -25%; /* 모달 너비의 절반만큼 왼쪽으로 이동하여 정 중앙으로 위치 */
  z-index: 9999; /* 다른 요소 위에 표시 */
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
  z-index: 999;
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


.mobile-form {

  .form-container {
    margin-bottom: 20px;
    width: 40%;
  }

  .form-group {
    margin-bottom: 10px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
  }

  .subBtn {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .subBtn:hover {
    background-color: #0056b3;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: none;
    align-items: center;
    justify-content: center;
  }

  .modal.is-active {
    display: flex;
  }

  .modal-content {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    max-width: 90%;
    max-height: 90%;
    overflow: auto;
  }

  .modal-close {
    background-color: transparent;
    border: none;
    position: absolute;
    top: 15px;
    right: 15px;
    color: #fff;
  }

  span {
    color: red;
    font-size: 1em;
  }

}

/* 미디어 쿼리 */
@media (min-width: 768px) {
  .mobile-form {
    margin: 0 auto; /* 수평 중앙 정렬을 위해 좌우 마진을 자동으로 설정 */
    display: flex; /* flexbox 레이아웃을 사용 */
    flex-direction: column; /* 요소를 세로 방향으로 배치 */
    justify-content: center; /* 수직 중앙 정렬 */
    align-items: center; /* 수평 중앙 정렬 */
    padding: 20px; /* 컨테이너 내부 패딩 */
  }
}

@media (max-width: 767px) {
  .mobile-form {
    .form-container {
      margin-bottom: 20px;
      width: 100%;
    }
  }
}

</style>

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
      isMobile: '',
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

    async createRoomPost() {

      // 사진을 한장도 업로드 하지 않을 경우
      if(this.files.length <= 0){
        this.signupMessageOne = '사진을 한장 이상 등록해 주세요.';
        this.openModal();
        return;
      }

      this.roomPostRequest.roomOwner = this.name;

      const formData = new FormData();

      // roomPostDto를 JSON으로 미리 변환해서 formData에 넣는다.
      for (const key in this.roomPostRequest) {
        if (Object.prototype.hasOwnProperty.call(this.roomPostRequest, key)) {
          formData.append(key, this.roomPostRequest[key]);
          console.log(this.roomPostRequest[key]);
        }
      }

      // 업로드된 이미지 uploadImages 담기.
      for (let i = 0; i < this.files.length; i++) {
        formData.append('uploadImages', this.files[i]);
      }


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

            if(error.response.data !== null){
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

            console.error('Error fetching data:', error);
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


  <!-- 모바일 화면용 폼 -->
  <div class="form-container mobile-form" v-if="isMobile">
    <div class="form-container">
      <form @submit.prevent="createRoomPost">
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
          <input type="text" id="roomOwner" name="roomOwner" :value="name" disabled>
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
        <button type="submit" class="subBtn" @click="createRoomPost">제출</button>
      </form>
    </div>
  </div>


  <!-- PC 화면용 폼 -->
  <div class="form-container pc-form" v-else>

  <table>
    <tr>
      <th><label for="title">제목</label></th>
      <td>
        <input type="text" id="title" name="title" v-model="roomPostRequest.title" placeholder=" ex). 제목">
        <span>{{this.roomPostError.titleError}}</span>
      </td>
    </tr>

    <tr>
      <th><label for="name">방 이름</label></th>
      <td>
        <input type="text" id="roomName" name="roomName" v-model="roomPostRequest.roomName" placeholder=" ex). 마포구 원룸">
        <span>{{this.roomPostError.roomNameError}}</span>
      </td>
    </tr>

    <tr>
      <th><label for="deposit">전세 및 보증금</label></th>
      <td>
        <div class="select-box">
        <select name="deposit" id="deposit" v-model="roomPostRequest.deposit">
          <option value="전세">전세</option>
          <option value="보증금">보증금</option>
        </select>
      </div>
        <span>{{this.roomPostError.depositError}}</span>
      </td>
    </tr>

    <tr>
      <th><label for="depositPrice">전세 및 보증금 가격</label></th>
      <td>
        <input type="number" id="depositPrice" name="depositPrice" v-model="roomPostRequest.depositPrice" placeholder=" ex). 5000">
        <span>{{this.roomPostError.depositPriceError}}</span>
      </td>
    </tr>

    <tr>
      <th><label for="monthlyPrice">월세</label></th>
      <td>
        <input type="number" id="monthlyPrice" name="monthlyPrice" v-model="roomPostRequest.monthlyPrice" placeholder=" ex). 50">
        <span>{{this.roomPostError.monthlyPriceError}}</span>
      </td>
    </tr>

    <tr>
      <th><label for="description">방설명</label></th>
      <td>
        <textarea id="description" name="description" type="text" v-model="roomPostRequest.description" placeholder=" ex). 마포구 가장 저렴하고 좋은 방"></textarea>
      </td>
    </tr>

    <tr>
      <th><label for="roomOwner">방 주인</label></th>
      <td>
        <input type="text" id="roomOwner" name="roomOwner" :value="name" disabled>
        <span>{{this.roomPostError.roomOwnerError}}</span>
      </td>
    </tr>

    <tr>
      <th><label for="detail">방 세부 사항</label></th>
      <td><textarea id="detail" name="detail" type="text" v-model="roomPostRequest.detail" placeholder=" ex). 남향, 역까지 걸어서 5분"></textarea></td>
    </tr>

    <tr>
      <th><label for="squareFootage">평수</label></th>
      <td>
        <input type="number" id="squareFootage" name="squareFootage" v-model="roomPostRequest.squareFootage" placeholder=" ex). 6평">
        <span>{{this.roomPostError.squareFootageError}}</span>
      </td>
    </tr>

    <tr>
      <th><label for="content">내용</label></th>
      <td>
        <textarea id="content" name="content" type="text" v-model="roomPostRequest.content" placeholder=" ex). 마포구에 위치한 좋은 방이고 관리비가 없으며, 필요사항 있으면 바로 처리해 드립니다."></textarea>
        <span>{{this.roomPostError.contentError}}</span>
      </td>
    </tr>

    <tr>
      <th><label for="address">주소</label></th>
      <td>
        <input type="text" id="address" name="address" v-model="roomPostRequest.address" placeholder=" ex). 마포구 월드컵북로 27길 78-571 마포빌라 101호">
        <span>{{this.roomPostError.addressError}}</span>
      </td>
    </tr>

    <tr>
      <th><label for="roomStatus">상태</label></th>
      <td>
        <div class="select-box">
          <select name="roomStatus" id="roomStatus" v-model="roomPostRequest.roomStatus">
            <option value="매매">매매</option>
            <option value="임대">임대</option>
            <option value="종료">종료</option>
          </select>
        </div>
        <span>{{this.roomPostError.roomStatusError}}</span>
      </td>
    </tr>


    <tr>
      <th><label for="file">방 사진</label></th>
      <td>
        <div>
          <input type="file" @change="handleFileChange" multiple>
        </div>
      </td>
    </tr>

  </table>
  <button class="subBtn" @click="createRoomPost">제출</button>

</div>

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

/* 입력 그룹 스타일링 */
.form-container {
  padding: 0 20px; /* 좌우 여백 추가 */
}

.input-group {
  margin-bottom: 20px; /* 입력 그룹 사이의 간격 설정 */
}

.input-group label {
  display: block; /* 라벨을 블록 요소로 설정하여 위아래로 배치 */
  margin-bottom: 5px; /* 라벨 아래 여백 추가 */
}

.input-group input,
.input-group textarea,
.input-group select {
  width: 100%; /* 입력 필드를 그룹의 너비에 맞게 설정 */
  padding: 7px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.subBtn {
  width: 100%; /* 제출 버튼을 그룹의 너비에 맞게 설정 */
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  text-align: center;
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

span {
  display: block;
  color: red;
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




/* 모바일 화면용 스타일 */
.mobile-form {
  /* 모바일에 맞게 스타일 조정 */
  .createPost {
    padding: 20px;
  }

  .form-container {
    margin-bottom: 20px;
  }

  .form-group {
    margin-bottom: 10px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
  }

  .form-group input,
  .form-group select,
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
    font-size: 0.8em;
  }

}

/* 미디어 쿼리 */
@media (min-width: 768px) {
  .mobile-form {
    display: none; /* 모바일 화면에서는 숨김 */
  }
}

@media (max-width: 767px) {
  .pc-form {
    display: none; /* PC 화면에서는 숨김 */
  }
}

</style>

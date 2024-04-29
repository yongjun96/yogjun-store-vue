<script>
import VueJwtDecode from "vue-jwt-decode";
import axios from "axios";

export default {
  data() {
    return {
      roomPostRequest: {
        id: '',
        title: '',
        deposit: '전세',
        depositPrice: '',
        monthlyPrice: '',
        roomOwner: '',
        squareFootage: '',
        content: '',
        address: '',
        detailAddress: '',
        roomStatus: '임대',
        memberId: ''
      },
      roomPostError: {
        idError: '',
        title: '',
        depositError: '',
        depositPriceError: '',
        monthlyPriceError: '',
        roomOwnerError: '',
        squareFootageError: '',
        contentError: '',
        addressError: '',
        detailAddressError: '',
        roomStatusError: '',
        memberIdError: ''
      },
      token: '',
      email: '',
      name: '',
      role: '',
      files: [],
      showModal: false,
      signupMessageOne: '',
      loading: false, // 로딩 중 상태
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

      // 조회된 회원을 roomOwner 에 넣어 줌
      this.roomPostRequest.roomOwner = this.name;

      const formData = new FormData();

      // roomPostRequest 를 formData 에 추가
      formData.append('roomPostRequest', JSON.stringify(this.roomPostRequest));

      // 업로드된 이미지 uploadImages 담기.
      for (let i = 0; i < this.files.length; i++) {
        formData.append('uploadImages', this.files[i]);
      }

      // 로딩 중 ...
      this.loading = true;

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

            this.loading = false;

             if(error.response.data !== null){
              this.roomPostError.titleError = error.response.data.title;
              this.roomPostError.depositError = error.response.data.deposit;
              this.roomPostError.depositPriceError = error.response.data.depositPrice;
              this.roomPostError.monthlyPriceError = error.response.data.monthlyPrice;
              this.roomPostError.roomOwnerError = error.response.data.roomOwner;
              this.roomPostError.squareFootageError = error.response.data.squareFootage;
              this.roomPostError.contentError = error.response.data.content;
              this.roomPostError.addressError = error.response.data.address;
              this.roomPostError.detailAddressError = error.response.data.detailAddress;
              this.roomPostError.roomStatusError = error.response.data.roomStatus;
              console.log(error.response.data.memberId);
            }
            else {

               console.error('Error fetching data:', error);

               if(error.response.data.message !== null){

                 this.signupMessageOne = error.response.data.message;
                 this.openModal();

               }else{

                 this.signupMessageOne = '서버 에러입니다. 다시 시도해 주세요.';
                 this.openModal();
               }
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
    },

    // 카카오 지도 주소
    openDaumPostcode() {
      new daum.Postcode({
        oncomplete: (data) => {
          // 각 주소의 노출 규칙에 따라 주소를 조합
          let addr = '';
          let extraAddr = '';

          // 사용자가 선택한 주소 타입에 따라 주소를 가져옴
          if (data.userSelectedType === 'R') { // 도로명 주소 선택
            addr = data.roadAddress;
          } else { // 지번 주소 선택
            addr = data.jibunAddress;
          }

          // 도로명 주소 선택 시 참고항목 조합
          if (data.userSelectedType === 'R') {
            if (data.bname && /[동|로|가]$/g.test(data.bname)) {
              extraAddr += data.bname;
            }
            if (data.buildingName && data.apartment === 'Y') {
              extraAddr += (extraAddr ? ', ' + data.buildingName : data.buildingName);
            }
            if (extraAddr) {
              extraAddr = ` (${extraAddr})`;
            }
          }

          // 필드에 우편번호, 주소, 상세주소, 참고항목 입력
          this.roomPostRequest.address = data.zonecode;
          this.roomPostRequest.address = addr;
          // 참고 사항은 사용 안함.
          //this.extraAddress = extraAddr;
          // 상세주소 필드에 커서 이동
          this.$nextTick(() => {
            this.$refs.roomPostRequest.detailAddress.focus();
          });
        },
      }).open();
    },


  },

  components: {}
}

</script>

<template>

  <!-- 로딩 중일 때 표시할 이미지 -->
  <div v-if="loading" class="loading-container">
    <img src="/images/loading.gif" alt="Loading...">
  </div>

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
          <label for="roomOwner">방 주인</label>
          <input type="text" id="roomOwner" name="roomOwner" :value="name" disabled style="text-align: center;">
          <span>{{ roomPostError.roomOwnerError }}</span>
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
            <input type="text" id="address" name="address" v-model="roomPostRequest.address" placeholder="주소" style="width: 50%;" disabled>
            <input type="text" id="detailAddress" name="detailAddress" v-model="roomPostRequest.detailAddress" placeholder="상세 주소" style="width: 30%;">
            <input type="button" @click="openDaumPostcode" value="주소 검색" style="width: 20%;">
            <span>{{ roomPostError.addressError }}</span> <span style="display: block;">{{ roomPostError.detailAddressError }}</span>
        </div>
        <div class="form-group">
          <label for="roomStatus">상태</label>
          <div class="select-box">
            <select name="roomStatus" id="roomStatus" v-model="roomPostRequest.roomStatus">
              <option value="매매">매매</option>
              <option value="임대">임대</option>
              <!--<option value="종료">종료</option>-->
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

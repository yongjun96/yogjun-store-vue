<script>
import VueJwtDecode from "vue-jwt-decode";
import axios from "axios";

export default {

  data() {
    return {
      room: {
        id: null,
        name: '',
        price: ''
        // 나머지 입력 항목들 초기화
      },

      token: '',
      email: '',
      name: '',
      role: ''
    };
  },

  mounted() {
    // 토큰을 분석하여 페이로드를 가져옵니다.
    this.token = localStorage.getItem('accessToken');
    const decodedPayload = VueJwtDecode.decode(this.token);

    // 페이로드에서 필요한 정보를 추출합니다.
    this.email = decodedPayload.sub;
    this.role = decodedPayload.role;

    console.log(this.email); // 토큰에 포함된 사용자 ID 출력
    console.log(this.role); // 토큰에 포함된 사용자 유형 출력

    this.findMember();
  },

  created() {},

  methods: {

    findMember() {
      axios.get(import.meta.env.VITE_APP_API_URL+'/member/find/'+this.email,
           {
             headers: {
              'Authorization': `Bearer ${this.token}` // 토큰을 포함한 헤더 설정
            }
          })

          .then(response => {
            console.log(response.data);

            this.email = response.data.email;
            this.name = response.data.name;
            this.role = response.data.role;

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

  },

  components: {}
}

</script>

<template>

  <div class="createPost" id="app">
    <h1>글작성 페이지 입니다.</h1>
  </div>

  <table>
    <tr>
      <th><label for="name">방 이름</label></th>
      <td><input type="text" id="name" name="name" placeholder=" ex). 마포구 원룸"></td>
    </tr>

    <tr>
      <th><label for="deposit">전세 및 보증금</label></th>
      <td>
        <div class="select-box">
        <select name="deposit" id="deposit">
          <option value="전세">전세</option>
          <option value="보증급">보증금</option>
        </select>
      </div>
      </td>
    </tr>

    <tr>
      <th><label for="depositPrice">전세 및 보증금 가격</label></th>
      <td><input type="text" id="depositPrice" name="depositPrice" placeholder=" ex). 5000"></td>
    </tr>

    <tr>
      <th><label for="monthlyPrice">월세</label></th>
      <td><input type="text" id="monthlyPrice" name="monthlyPrice" placeholder=" ex). 50"></td>
    </tr>

    <tr>
      <th><label for="monthlyPrice">방설명</label></th>
      <td><textarea id="monthlyPrice" name="monthlyPrice" type="text" placeholder=" ex). 마포구 가장 저렴하고 좋은 방"></textarea></td>
    </tr>

    <tr>
      <th><label for="mainPhoto">방 메인 사진</label></th>
      <td>
        <form action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="mainPhoto" id="mainPhoto">
        <button class="upload-button" type="submit">메인 사진 올리기</button>
        </form>
      </td>
    </tr>

    <tr>
      <th><label for="roomOwner">방 주인</label></th>
      <td><input type="text" id="roomOwner" name="roomOwner" :value="name" disabled></td>
    </tr>

    <tr>
      <th><label for="detail">방 세부 사항</label></th>
      <td><textarea id="detail" name="detail" type="text" placeholder=" ex). 남향, 역까지 걸어서 5분"></textarea></td>
    </tr>

    <tr>
      <th><label for="squareFootage">평수</label></th>
      <td><input type="text" id="squareFootage" name="squareFootage" placeholder=" ex). 6평"></td>
    </tr>

    <tr>
      <th><label for="content">내용</label></th>
      <td><textarea id="content" name="content" type="text" placeholder=" ex). 마포구에 위치한 좋은 방이고 관리비가 없으며, 필요사항 있으면 바로 처리해 드립니다."></textarea></td>
    </tr>

    <tr>
      <th><label for="address">주소</label></th>
      <td><input type="text" id="address" name="address" placeholder=" ex). 마포구 월드컵북로 27길 78-571 마포빌라 101호"></td>
    </tr>

    <tr>
      <th><label for="roomStatus">상태</label></th>
      <td>
        <div class="select-box">
          <select name="roomStatus" id="roomStatus">
            <option value="매매">매매</option>
            <option value="임대">임대</option>
            <option value="종료">종료</option>
          </select>
        </div>
      </td>
    </tr>

    <tr>
      <th><label for="mainPhoto">방 메인 사진</label></th>
      <td>
        <form action="/upload" method="post" enctype="multipart/form-data">
          <input type="file" name="mainPhoto" id="mainPhoto" multiple>
          <button class="upload-button" type="submit">서브 사진 여러장 올리기</button>
        </form>
      </td>
    </tr>



    <!-- 추가 필드들을 여기에 추가할 수 있습니다 -->
  </table>
  <button class="subBtn" type="submit">제출</button>

</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
    margin: 0 auto;
  }
}

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

/*----------------------------------------------------------------------------------------------------------------*/

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

/*------------------------------------------------------------------------------------------------------------------*/

.upload-button {
  padding: 8px 16px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.upload-button:hover {
  background-color: #0056b3;
}

</style>

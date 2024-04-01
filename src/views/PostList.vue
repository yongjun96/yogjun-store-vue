<script>
import Pagination from "@/components/layout/Pagination.vue";
import axios from "axios";

export default {

  components: {
    Pagination
  },

  data() {
    return {
      searchContent: '',
      searchOption: 'title',
      pageSize: '4',
      page: '',
      currentPage: 0, // 현재 페이지 번호
      totalPages: 1, // 총 페이지 수
      url : `${import.meta.env.VITE_APP_API_URL}`,
      roomPost: [{
        address:'',
        content:'',
        deposit:'',
        depositPrice:'',
        description:'',
        detail:'',
        id:'',
        monthlyPrice:'',
        roomName:'',
        roomOwner:'',
        roomStatus:'',
        squareFootage:'',
        title:'',
        imagesList:[{
          id:'',
          name:'',
          path:''
        }],
        member: {
          id:'',
          name:'',
          email:''
        },
        urlPath:''
      }]
    }
    },

  // 다른 페이지로 이동할 때 RoomPostListPage페이지 정보 저장
  beforeRouteLeave(to, from, next) {
    localStorage.setItem('RoomPostListPage', this.currentPage);
    next();
  },

  watch: {
    '$route.query.page'(newPage, oldPage) {
      if(newPage !== oldPage){
        if (!newPage) {
          // 새 페이지 번호가 없는 경우 뒤로 가기로 인식됩니다.
          this.currentPage = oldPage -1  || 1; // 이전 페이지 번호가 있으면 그 번호로, 없으면 1페이지로 설정
        } else {
          this.currentPage = newPage -1; // 새 페이지로 설정
        }
        this.getRoomPostList();
      }
    }
  },

  mounted() {
    const savedPage = localStorage.getItem('RoomPostListPage');
    if (savedPage) {
      this.currentPage = parseInt(savedPage);
      localStorage.removeItem('RoomPostListPage'); // 페이지 번호를 가져온 후 로컬 스토리지에서 제거
    }
    this.getRoomPostList();
  },

  methods: {

    getRoomPostList() {
      axios.get(import.meta.env.VITE_APP_API_URL + '/roomPost/posts', {
        params: {
          searchContent: this.searchContent,
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
              roomName: item.roomName,
              address: item.address,
              content: item.content,
              depositPrice: item.depositPrice,
              deposit: item.deposit,
              monthlyPrice: item.monthlyPrice,
              squareFootage: item.squareFootage,

              member: {
                email: item.member.email
              },

              urlPath: `${this.url}/${item.imagesList[0].path}/${item.imagesList[0].name}`,

              imagesList: item.imagesList.map(image => ({
                id: image.id,
                name: image.name,
                path: image.path
              }))
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

    movePostInfo(id) {
      this.$router.push({
        path: '/postInfo',
        query: {id: id,} // 전달할 데이터를 객체로 넘깁니다.
      });
    },
  }
};
</script>

<template>

  <div class="post-list">
    <h2 class="post-list-title">게시물 목록</h2>
    <div class="post-list-items">
      <div v-for="item in roomPost" :key="item.id" class="post-item" @click="movePostInfo(item.id)">
        <div class="thumbnail">
          <img :src="item.urlPath" alt="썸네일 이미지">

        </div>
        <div class="post-info">
          <h3 class="post-title">{{ item.title }}</h3>
          <p class="post-content">
            {{item.deposit +" : "+ this.calculationPrice(item.depositPrice) +" / 보증급 및 월세 : "+this.calculationPrice(item.monthlyPrice) }}
            <br>
            {{"방 : "+item.roomName+" / ["+item.squareFootage+"평]"}}
            <br>
            {{"주소 : "+item.address}}
          </p>
        </div>
      </div>
    </div>
  </div>


  <span class="search-container">

      <div class="select-box">
    <select name="deposit" id="deposit" v-model="this.searchOption">
      <option value="title">제목</option>
      <option value="titleContent">제목 + 내용</option>
      <option value="email">작성자 이메일</option>
      <option value="address">주소</option>
    </select>
  </div>

    <input type="text" placeholder="검색어를 입력하세요..." v-model="this.searchContent" @keyup.enter="getRoomPostList">
    <button type="submit" @click="getRoomPostList">검색</button>
  </span>

  <div>
    <pagination :current-page="currentPage" :total-pages="totalPages" @page-change="changePage" />
  </div>

</template>

<style scoped>
.post-list {
  padding: 20px;
}
.post-list-title {
  font-size: 24px;
  margin-bottom: 20px;
}
.post-list-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
  width: 80%; /* 컨텐츠 영역의 너비를 80%로 설정 */
  margin: 0 auto; /* 가운데 정렬을 위해 좌우 여백을 자동으로 조정 */
}
.post-item {
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  transition: transform 0.3s ease;
}
.post-item:hover {
  transform: translateY(-5px);
}
.thumbnail {
  width: 100%;
  height: 400px;
  overflow: hidden;
}
.thumbnail img {
  width: 100%;
  height: auto;
  object-fit: cover;
}
.post-info {
  padding: 10px;
}
.post-title {
  font-size: 18px;
  margin-bottom: 10px;
}
.post-content {
  color: #666;
}
.post-link {
  color: #007bff;
  text-decoration: none;
  display: inline-block;
  margin-top: 10px;
  font-weight: bold;
  transition: color 0.3s ease;
}
.post-link:hover {
  color: #0056b3;
}




.search-container {
  display: flex;
  max-width: 520px; /* 최대 너비 설정 */
  margin: 0 auto; /* 화면 가운데 정렬 */
}

.search-container input[type="text"] {
  flex: 1; /* 입력 필드가 남은 공간을 모두 차지하도록 설정 */
  padding: 7px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none; /* 포커스 시 테두리 제거 */
  margin-right: 10px;
}

.search-container button {
  padding: 7px 15px;
  background-color: #007bff; /* 배경색 */
  color: white; /* 글자색 */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  outline: none; /* 포커스 시 테두리 제거 */
}

/* 버튼에 마우스를 올렸을 때 스타일 변경 */
.search-container button:hover {
  background-color: #0056b3; /* 호버 시 배경색 변경 */
}


.select-box {
  width: calc(100% - 77%); /* 입력 필드 너비 조절 */
  padding: 0px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  margin-right: 10px;
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
</style>
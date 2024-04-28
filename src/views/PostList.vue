<script>
import Pagination from "@/components/layout/Pagination.vue";
import axios from "axios";

export default {

  components: {
    Pagination
  },

  data() {
    return {
      isMobile: false, // 모바일 화면 여부
      searchContent: '',
      searchOption: 'title',
      pageSize: '4',
      page: '',
      currentPage: 0, // 현재 페이지 번호
      totalPages: 0, // 페이징바 개수
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
      localStorage.setItem('RoomPostListPage', this.currentPage);
      if(newPage !== oldPage){
        if (!newPage) {
          // 새 페이지 번호가 없는 경우 뒤로 가기로 인식됩니다.
          this.currentPage = localStorage.getItem('RoomPostListPage');
        }
      }
    }
  },

  mounted() {

    this.detectMobile();
    window.addEventListener("resize", this.detectMobile); // 창 크기가 변경될 때마다 호출

    const savedPage = localStorage.getItem('RoomPostListPage');
    if (savedPage) {
      this.currentPage = parseInt(savedPage);
      localStorage.removeItem('RoomPostListPage'); // 페이지 번호를 가져온 후 로컬 스토리지에서 제거
    }
    this.getRoomPostList();

  },

  methods: {

    detectMobile() {
      this.isMobile = window.innerWidth <= 768; // 768px 이하일 때 모바일로 판단
    },

    getRoomPostList() {
      axios.get(import.meta.env.VITE_APP_API_URL + '/room-post/posts', {
        params: {
          searchContent: this.searchContent,
          searchOption: this.searchOption,
          page: this.currentPage, // 현재 페이지 번호
          size: this.pageSize // 한 페이지에 표시될 글 갯수

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

              // localhost path의 경우
              // urlPath: `${this.url}/${item.imagesList[0].path}/${item.imagesList[0].name}`,
              urlPath: `${item.imagesList[0].name}`,

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
        path: '/post-info',
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
          <img :src="item.urlPath" alt="썸네일 이미지" @click="movePostInfo(item.id)">
        </div>

        <div class="post-info">
          <p class="post-title">{{ item.title }}</p>
          <p class="post-content">{{item.deposit +" : "+ this.calculationPrice(item.depositPrice) }}</p>
          <p class="post-content">{{ "월세 : "+this.calculationPrice(item.monthlyPrice) }}</p>
          <p class="post-content">{{"["+ item.squareFootage +"평]"}}</p>
          <p class="post-content">{{item.address}}</p>
        </div>
      </div>
    </div>
  </div>

  <div class="mobile-search-container" v-if="isMobile">
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
  </div>


  <span v-else class="search-container" >

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
  width: 60%; /* 컨텐츠 영역의 너비를 60%로 설정 */
  margin: 0 auto; /* 가운데 정렬을 위해 좌우 여백을 자동으로 조정 */

  justify-content: center; /* 수평 가운데 정렬 */
  align-items: center; /* 수직 가운데 정렬 */
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
  max-height: 200px;

}
.post-title {
  font-size: 18px;
  margin-bottom: 10px;
}
.post-content {
  color: #666;
  text-overflow: ellipsis; /* 텍스트가 넘치면 줄임표(...)로 표시 */
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

span.search-container {
  color: #2c3e50;
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



/* 추가 미디어 쿼리 */
@media (max-width: 767px) {

  /* 게시물 목록 조정 */
  .post-list-items {
    display: grid;
    //grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    grid-template-columns: 1fr;
    gap: 20px;
    width: 80%; /* 컨텐츠 영역의 너비를 80%로 설정 */
    margin: 0 auto; /* 가운데 정렬을 위해 좌우 여백을 자동으로 조정 */
    justify-content: center; /* 수평 가운데 정렬 */
    align-items: center; /* 수직 가운데 정렬 */
  }

  .post-info {
    padding: 10px;
    max-height: 200px;

  }

  /* 썸네일 조정 */
  .thumbnail {
    height: auto; /* 썸네일 높이 조정 */
  }

  /* 검색 컨테이너 조정 */
  .search-container {
    flex-direction: column; /* 세로로 나열 */
    width: 100%; /* 전체 너비 */
  }

  .search-container input[type="text"],
  .search-container button {
    width: 100%; /* 전체 너비 */
    margin-bottom: 10px; /* 입력 필드와 버튼 사이 간격 */
  }

  /* 모바일 검색 컨테이너 조정 */
  .mobile-search-container .select-box,
  .mobile-search-container input[type="text"],
  .mobile-search-container button {
    width: 100%; /* 전체 너비 */
    margin-bottom: 10px; /* 요소 사이 간격 */
  }

  /* 모바일 검색 컨테이너 */
  .mobile-search-container {
    display: flex;
    flex-direction: column;
    width: 100%; /* 전체 너비 */
    align-items: stretch; /* 요소를 너비에 맞게 늘림 */
  }



}

</style>
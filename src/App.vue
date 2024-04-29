<script setup>
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";

</script>

<template>

  <body>
  <Header />
  <div class="container">
    <!-- 컨텐츠 영역 -->
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
  </body>

  <Footer class="footer"/>


</template>

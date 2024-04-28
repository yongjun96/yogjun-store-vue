<script setup>
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";

</script>

<template>

  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  </head>

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

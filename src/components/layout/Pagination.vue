<template>
  <div class="pagination">
    <button @click="prevPage" :disabled="currentPage === 0 || totalPages === 0">&lt;</button>
    <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="{ active: page === currentPage }">{{ page + 1 }}</button>
    <button @click="nextPage" :disabled="currentPage === totalPages - 1 || totalPages === 0">&gt;</button>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  },
  computed: {
    visiblePages() {
      const maxVisiblePages = Math.min(5, this.totalPages);
      const startPage = Math.max(0, Math.min(this.totalPages - maxVisiblePages, this.currentPage - Math.floor(maxVisiblePages / 2)));
      const endPage = Math.min(this.totalPages - 1, startPage + maxVisiblePages - 1);
      const pages = [];
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    }
  },

  methods: {
    goToPage(page) {
      this.$emit('page-change', page);

      this.$router.push({ path: '/postList', query: { page: page + 1 } });
    },
    prevPage() {
      if (this.currentPage > 0) {
        this.$emit('page-change', this.currentPage - 1);

        const page = this.currentPage - 1;

        this.$router.push({ path: '/postList', query: { page: page + 1} });
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        this.$emit('page-change', this.currentPage + 1);

        const page = this.currentPage + 1;

        this.$router.push({ path: '/postList', query: { page: page + 1} });
      }
    },

  }
};
</script>

<style>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  cursor: pointer;
  background-color: #fff;
}
.pagination button:hover {
  background-color: #f0f0f0;
}
.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.pagination button.active {
  font-weight: bold;
  color: blue;
}

</style>
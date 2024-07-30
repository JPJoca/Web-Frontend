<<script>
// @ is an alias to /src
import {mapActions, mapState} from "vuex";
import Article from "@/components/Article.vue";

export default {
  name: 'ArticleActivity',
  components: {
    Article
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 3,
      activityId: null
    };
  },
  computed: {
    ...mapState(['articles']),
    paginatedArticles() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.articles.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.articles.length / this.itemsPerPage);
    }
  },
  methods: {
    ...mapActions(['fetchArticlesForActivity']),
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  },
  watch: {
    '$route.params.id': {
      handler(newId) {
        this.activityId = parseInt(newId);
        this.fetchArticlesForActivity(this.activityId);
      },
      immediate: true
    }
  },
  mounted() {
    if (this.$route.params.id) {
      this.activityId = parseInt(this.$route.params.id);
      this.fetchArticlesForActivity(this.activityId);

    }
  },

};
</script>

<template>
  <div class="most-popular">
    <div class="articles-container">
      <div v-for="(item, index) in paginatedArticles" :key="index">
        <Article :article="item" />
      </div>
    </div>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">&lt;</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">&gt;</button>
    </div>
  </div>
</template>


<style scoped>


.articles-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center; /* Centriranje članaka */
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center; /* Centriranje paginacije */
  align-items: center;
  gap: 10px;
}

.pagination button {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>

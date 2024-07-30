<template>
  <div class="articles">
    <h2>Članci</h2>
    <button class="add-button" @click="navigateToAddArticle">Dodaj novi članak</button>
    <div v-if="paginatedArticles && paginatedArticles.length">
      <table class="article-table">
        <thead>
        <tr>
          <th>Naslov</th>
          <th>Autor</th>
          <th>Datum kreiranja</th>
          <th>Akcije</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="article in paginatedArticles" :key="article.id">
          <td class="click" @click="openArticle(article.id)">{{ article.title }}</td>
          <td>{{ author(article.authorId) }}</td>
          <td>{{ new Date(article.published).toDateString()}}<br>{{ new Date(article.published).toLocaleTimeString()}}</td>
          <td class="actions-cell">
            <button class="action-button edit" @click="editArticle(article.id)">Izmeni</button>
            <button class="action-button delete" @click="deleteArticle(article.id)">Obriši</button>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">&lt;</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">&gt;</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      currentPage: 1,
      articlesPerPage: 3,
    };
  },
  async created() {
    await this.fetchArticles();
    const authorIds = this.articles.map(article => article.authorId);
    await Promise.all(authorIds.map(id => this.fetchUsersById(id)));
  },
  computed: {
    ...mapState(['articles','users']),
    paginatedArticles() {
      const start = (this.currentPage - 1) * this.articlesPerPage;
      const end = start + this.articlesPerPage;
      return this.articles.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.articles.length / this.articlesPerPage);
    }
  },
  methods: {
    ...mapActions(['fetchArticles', 'deleteArticle','fetchUsersById']),
    openArticle(articleId) {
      const url = `http://localhost:8080/#/article/${articleId}`;
      window.open(url, '_blank'); // Opens the URL in a new tab or window
    },
    navigateToAddArticle() {
      this.$router.push('/add-article');
    },
    editArticle(id) {
      this.$router.push(`/edit-article/${id}`);
    },
    author(id){
      if (!this.users[id]) {
        this.fetchUsersById(id);
      }
      return this.users[id] ? this.users[id].firstName : 'Loading...';
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
  },
};
</script>

<style scoped>
.articles {
  padding: 20px;
}

.article-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  font-family: Arial, sans-serif;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:nth-child(odd) {
  background-color: #ffffff;
}

tr:hover {
  background-color: #e1e1e1; /* Light gray background on hover */
}

.article-table th, .article-table td {
  padding: 15px;
  border: 1px solid #ccc;
}

.article-table th {
  font-weight: bold;
  background-color: #2c3e50;
  color: #f9f9f9;
}

.article-table td {
  max-width: 700px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.actions-cell {
  text-align: right;
  width: 100px;
}

button {
  cursor: pointer;
  padding: 10px 15px;
  font-size: 14px;
  margin: 5px;
  border: none;
  border-radius: 4px;
}

.add-button {
  background-color: #5cc910;
  color: white;
}

.action-button {
  padding: 5px 10px;
}

.action-button.edit {
  background-color: #5cc910;
  color: white;
}

.action-button.delete {
  background-color: #dc3545;
  color: white;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  background-color: #5cc910;
  color: white;
  margin: 0 5px;
}

.pagination span {
  margin: 0 10px;
}
.pagination button:disabled {
  background-color: #cccccc;
  color: #666666;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 10px;
}
.click{
  cursor: pointer;
}
.click:hover{
  color: #66f605;
}
</style>

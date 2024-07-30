
<template>
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
    <tr v-for="article in articles" :key="article.id">
      <td>{{ article.title }}</td>
      <td>{{ author(article.authorId) }}</td>
      <td>{{ new Date(article.published).toDateString()}}<br>{{ new Date(article.published).toLocaleTimeString()}}</td>
      <td class="actions-cell">
        <button class="action-button edit" @click="editArticle(article.id)">Izmeni</button>
        <button class="action-button delete" @click="deleteArticle(article.id)">Obriši</button>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['articles', 'users']),
  },
  methods: {
    ...mapActions(['fetchArticlesDestination', 'deleteArticle','fetchUsersById']),

    editArticle(id) {
      this.$router.push(`/edit-article/${id}`);
    },
    author(id){
      if (!this.users[id]) {
        this.fetchUsersById(id);
      }
      return this.users[id] ? this.users[id].firstName : 'Loading...';
    },
  },
  async created() {
    await this.fetchArticlesDestination(this.$route.params.id);
    const authorIds = this.articles.map(article => article.authorId);
    await Promise.all(authorIds.map(id => this.fetchUsersById(id)));
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
  background-color: #ccc;
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
</style>

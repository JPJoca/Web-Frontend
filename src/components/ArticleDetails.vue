<template>
  <div class="container">
    <h1>{{ article.title }}</h1>
    <h2>{{ destinationName }}</h2>
    <p>{{ article.text }}</p>
    <p>{{ new Date(article.published).toDateString() }} {{ new Date(article.published).toLocaleTimeString() }}</p>
    <p>Author: {{ article.numberOfVisits }}</p>
    <h3>Activities:</h3>
    <ul>
      <li class="clickable" v-for="activity in activities2" :key="activity.id" @click="openActivity(activity.id)">{{ activity.name }}</li>
    </ul>
    <h3>Comments:</h3>
    <ul>
      <li v-for="comment in this.comments" :key="comment.id">
        <p>Author: {{ comment.author }}</p>
        <p>{{ comment.text }}</p>
        <p>{{ new Date(comment.date).toDateString() }} {{ new Date(comment.date).toLocaleTimeString() }}</p>
      </li>
    </ul>
    <h3>Add a Comment:</h3>
    <form @submit.prevent="addComments">
      <div>
        <label for="name">Name:</label>
        <input type="text" v-model="newComment.author" required />
      </div>
      <div>
        <label for="text">Comment:</label>
        <textarea v-model="newComment.text" required></textarea>
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  props: ['id'],
  data() {
    return {
      destinationName: '',
      newComment: {
        articleId: this.id,
        date: null,
        author: '',
        text: ''
      }
    };
  },
  computed: {
    ...mapState(['article','activities2','comments']),

  },
  methods: {
    ...mapActions(['getArticleById', 'fetchActivitiesForArticle', 'fetchComments', 'addComment']),
    async getDestination(id) {
      try {
        const response = await fetch(`http://localhost:8081/api/destination/${id}`);
        const data = await response.json();
        this.destinationName = data.name;
      } catch (error) {
        console.error('Error fetching destination:', error);
      }
    },
    async getAuthor(id) {
      try {
        const response = await fetch(`http://localhost:8081/api/users/${id}`);
        const data = await response.json();
        this.authorName = `${data.firstName} ${data.lastName}`;
      } catch (error) {
        console.error('Error fetching author:', error);
      }
    },
    async fetchArticleDetails() {
      await this.getArticleById(this.id);
      this.getDestination(this.article.destinationId);
      this.fetchActivitiesForArticle(this.id);
      this.fetchComments(this.id);


    },
    async addComments() {
      this.newComment.date = Date.now();

      this.addComment(this.newComment)
      this.newComment = {
        articleId: this.id,
        date: null,
        author: '',
        text: ''
      }
    },
    openActivity(id){
      this.$router.push(`/activity/${id}`);
    }
  },
  async created() {
    await this.fetchArticleDetails();
  }
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  background-color: #f9f9f9;
  color: #333;
  margin: 0;
  padding: 20px;
}
.clickable{
  cursor: pointer;

}
.clickable:hover{
  background-color: #5cc910;

}
h1 {
  font-size: 2.5em;
  margin-bottom: 0.5em;
  color: #2c3e50;
}

h2 {
  font-size: 2em;
  margin-bottom: 0.5em;
  color: #34495e;
}

h3 {
  font-size: 1.5em;
  margin-top: 2em;
  margin-bottom: 0.5em;
  color: #16a085;
}

p {
  margin: 0.5em 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background: #ecf0f1;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
}

form {
  margin-top: 1em;
}

form div {
  margin-bottom: 0.5em;
}

label {
  display: block;
  margin-bottom: 0.2em;
  font-weight: bold;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 10px;
  margin-top: 0.2em;
  border: 1px solid #bdc3c7;
  border-radius: 5px;
  box-sizing: border-box;
}

button {
  padding: 10px 15px;
  color: #fff;
  background-color: #2980b9;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
}

button:hover {
  background-color: #3498db;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

@media (max-width: 600px) {
  h1 {
    font-size: 2em;
  }

  h2 {
    font-size: 1.5em;
  }

  h3 {
    font-size: 1.2em;
  }

  button {
    width: 100%;
  }
}
</style>



<template>
  <div>
    <form @submit.prevent="update">
      <div>
        <label for="title">Naslov</label>
        <input type="text" v-model="article.title" id="title" required />
      </div>
      <div>
        <label for="destination">Destinacija</label>
        <select v-model="article.destinationId" id="destination" required>
          <option v-for="destination in destinations" :key="destination.id" :value="destination.id">
            {{ destination.name }}
          </option>
        </select>
      </div>
      <div>
        <label for="content">Tekst</label>
        <textarea v-model="article.text" id="content" required></textarea>
      </div>
      <div>
        <table class="activity-table">
          <thead>
          <tr>
            <th>Aktivnost</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="activity in activities2" :key="activity.id">
            <td>{{ activity.name }}</td>
            <td class="actions-cell">
              <button class="action-button delete" @click.prevent="removeActivity(activity.id,activity)">Obriši</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <br>
      <div>
        <table class="activity-table">
          <thead>
          <tr>
            <th>Dodaj Aktivnost</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="activity in activitiesToAdd" :key="activity.id">
            <td>{{ activity.name }}</td>
            <td class="actions-cell">
              <button class="action-button add" @click.prevent="addAA(activity.id,activity)">Dodaj</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <button type="submit">Sačuvaj</button>
    </form>
    <div>
      <label for="activities">Dodaj Aktivnost</label>
      <form @submit.prevent="add">
        <label for="name">Name:</label>
        <input type="text" v-model="newActivity.name" required />
        <label for="name">Description:</label>
        <input type="text" v-model="newActivity.description" required />
        <br>
        <button type="submit" class="form-button">Add</button>

      </form>
      <ul>
        <li v-for="(activity, index) in article.activities" :key="index">
          {{ activity }} <button @click="removeActivity(index)">Ukloni</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapActions, mapMutations, mapState} from 'vuex';

export default {
  data() {
    return {
      newActivity: {
        name: '',
        description: ''
      },
      articleId : this.$route.params.id,
      activity:[]
    };
  },
  computed: {
    ...mapState(['destinations', 'article','activities1','activities2']),
    activitiesToAdd() {
      // Filter activities1 to exclude those already in activities2
      return this.activities1.filter(activity1 => {
        // Check if activity1.id is not in activities2
        return !this.activities2.some(activity2 => activity2.id === activity1.id);
      });
    }
  },
  methods: {
    ...mapActions(['addArticleActivity','fetchAllActivities',
      'deleteArticleActivity','addArticle', 'updateArticle', 'fetchDestinations',
      'getArticleById',"fetchActivitiesForArticle",'addActivity','doadajArtikal'
    ]),
    ...mapMutations(['REMOVE_ACTIVITY1','REMOVE_ACTIVITY2','ADD_ACTIVITY1',"ADD_ACTIVITY2"]),

    async add() {
     await this.addActivity(this.newActivity)

      this.newActivity.name = '';
      this.newActivity.description = '';

    },
    async addAA(activityId,activity){
      let articleId = this.articleId;
      try {
        const currentRoute = this.$route.fullPath;
        if (currentRoute !== '/add-article') {
          await this.addArticleActivity({articleId, activityId})
        }else{
          this.activity.push(activityId)
        }
        this.ADD_ACTIVITY2(activity)
    } catch (error) {
      console.error('Error handling adding:', error);
      // Dodajte logiku za prikazivanje greške korisniku
    }
    }
    ,
   async removeActivity(activityId,activity) {
      const articleId = this.$route.params.id;
      try {
        const currentRoute = this.$route.fullPath;
        if (currentRoute !== '/add-article') {
          await this.deleteArticleActivity({ articleId, activityId });
        }else{
         this.activity = this.activity.filter(activity => activity !== activityId);
        }
        this.REMOVE_ACTIVITY2(activity)
        this.ADD_ACTIVITY1(activity)

     } catch (error) {
        console.error('Error handling delete:', error);
        // Dodajte logiku za prikazivanje greške korisniku
      }

    },
    update(){
      const currentRoute = this.$route.fullPath;
      if (currentRoute !== '/add-article') {
        console.log(this.article);
        this.updateArticle(this.article);
        this.$router.back();
      }
      else{
        this.article.published = Date.now();
        this.article.authorId = parseInt(localStorage.getItem('userID'));
        console.log(JSON.stringify(this.article));
        let article = this.article;
        let activity = this.activity;
        this.addArticle({article,activity});
        console.log(this.activity)
        this.$router.back();
      }
    }
  },
  created() {
    console.log("pozvan sam")
    const currentRoute = this.$route.fullPath;
    console.log(this.$route)// Pretpostavimo da imate definisana imena ruta
    if (currentRoute !== '/add-article') {
      console.log("Aaaa")
      this.fetchDestinations();
      if (this.articleId) {
        this.getArticleById(this.articleId);
      }
      this.fetchAllActivities();
      this.fetchActivitiesForArticle(this.articleId);
      console.log(this.articleId);
    } else{
      this.fetchDestinations();
      this.fetchAllActivities();
      this.doadajArtikal()
    }
  },
};
</script>

<style>
form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"],
textarea,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

textarea {
  height: 150px;
  resize: vertical;
}

button {
  display: inline-block;
  padding: 10px 20px;
  color: #fff;
  background-color: #007BFF;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #ccc;
}

ul li button {
  background-color: #ff4d4d;
  padding: 5px 10px;
  border-radius: 4px;
}

ul li button:hover {
  background-color: #cc0000;
}
.activity-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 18px;
  text-align: left;
}

.activity-table thead tr {
  background-color: #f2f2f2;
  color: #333;
  text-align: left;
  font-weight: bold;
}

.activity-table th,
.activity-table td {
  padding: 12px 15px;
}

.activity-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.actions-cell {
  text-align: center;
}

.delete {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.delete:hover {
  background-color: #cc0000;
}


.add {
  background-color: #5cc910;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.add:hover {
  background-color: #66f605;
}
</style>
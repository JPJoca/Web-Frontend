<template>
  <div @click="openArticle" class="clickable-card">
    <b-card :title="article.title" :sub-title="getName(article.destinationId)" class="custom-card">
      <b-card-text>
        {{ article.text.length > 200 ? article.text.substring(0, 200) + '...' : article.text }}
      </b-card-text>

      <b-card-text>{{ new Date(article.published).toDateString()}}<br>{{ new Date(article.published).toLocaleTimeString()}}</b-card-text>
    </b-card>
  </div>
</template>

<script>
import { BCard } from 'bootstrap-vue';
import {mapActions, mapMutations, mapState} from "vuex";

export default {
  components: {
    BCard
  },
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      destinationName: ''
    };
  },
  computed:{
    ...mapState['destination']
  },
  methods: {
    ...mapActions( ['fetchDestination','updateArticle']),
    async getDestination(id) {
      try {
        const response = await fetch(`http://localhost:8081/api/destination/${id}`);
        const data = await response.json();
        this.destinationName = data.name;
      } catch (error) {
        console.error('Error fetching destination:', error);
      }
    },
    getName(id){
      this.getDestination(id);
      return this.destinationName;
    },
    openArticle() {
      this.article.numberOfVisits = this.article.numberOfVisits + 1;
      this.updateArticle(this.article);

      this.$router.push({ path: `/article/${this.article.id}` });
    }
  },
  async mounted() {

  }
};
</script>

<style scoped>
.custom-card {
  width: 200px;
  height: 400px;
  margin: 20px;
}
.clickable-card {
  cursor: pointer;
}
</style>

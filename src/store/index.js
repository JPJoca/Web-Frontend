import Vue from 'vue'
import Vuex from 'vuex'
import {jwtDecode} from "jwt-decode";

Vue.use(Vuex)
const initialState = {
  article: {
    title: '',
    text: '',
    published: '',
    authorId: null,
    numberOfVisits: 0,
    destinationId: null
  }
};
export default new Vuex.Store({
  state: {
    isLoggedIn: !!localStorage.getItem('jwt'),
    isGuest: !!localStorage.getItem('guest'),
    userType: localStorage.getItem('user'),
    email: localStorage.getItem('email'),
    username: localStorage.getItem('username')||'',
    userID: localStorage.getItem('userID'),
    destinations: [],
    destination: {
      description: '',
      id: null,
      name: ''
    },
    activities1: [],
    activities2: [],
    articles: [],
    article : JSON.parse(JSON.stringify(initialState.article)),
    activity: {
      id: null,
      name: '',
      description:''
    },
    users: [],
    newUser: {
      firstName:'',
      lastName:'',
      email: '',
      userType:'',
      status:'active',
      hashedPassword:''
    },
    currentUser: null,
    user:null,
    comments: [],
  },
  getters: {
  },
  mutations: {
    setEmail(state, email) {
      state.email = email;
      localStorage.setItem('email', state.email);
    },
    setUserID(state, userID) {
      state.userID = userID;
      localStorage.setItem('userID', state.userID);
    },
    setLoggedIn(state, payload) {
      state.isLoggedIn = payload;
    },
    setGuest(state, payload) {
      state.isGuest = payload;
      localStorage.setItem('guest','a')
    },
    setUserType(state, userType) {
      state.userType = userType;
      localStorage.setItem('user', state.userType);

    },
    setDestinations(state, destinations){
      state.destinations = destinations;
    },
    setDestination(state, destination){
      state.destination = destination;
    },
    addDestination(state, destinations){
      state.destinations.push(destinations);
    },
    deleteDestination(state, id){
      state.destinations = state.destinations.filter(destination => destination.id !== id)
    },
    updateDestination(state, updateDestination){
      console.log("nesto se desilo");
      const  index = state.destinations.findIndex(destination => destination.id === updateDestination.id)
      if(index > -1){
        Vue.set(state.destinations,index,updateDestination);
      }
    },
    setArticles(state, articles) {
      state.articles = articles;
    },
    setArticle(state, article) {
      state.article = article;

    },
    addArticles(state, article) {
      state.articles.push(article);
    },
    updateArticles(state, updatedArticle) {
      const index = state.articles.findIndex(article => article.id === updatedArticle.id);
      if (index !== -1) {
        Vue.set(state.articles, index, updatedArticle);
      }
    },
    deleteArticles(state, articleId) {
      state.articles = state.articles.filter(article => article.id !== articleId);
    },
    SET_ACTIVITIES1(state, activities) {
      state.activities1 = activities;
    },
    SET_ACTIVITIES2(state, activities) {
      state.activities2 = activities;
    },
    SET_ARTICLE(state, article) {
      state.article = article;
    },
    RESET_ARTICLE(state) {
      state.article = JSON.parse(JSON.stringify(initialState.article));
    }
    ,
    ADD_ACTIVITY1(state, activity) {
      state.activities1.push(activity);
    },
    ADD_ACTIVITY2(state, activity) {
      state.activities2.push(activity);
    },
    REMOVE_ACTIVITY1(state, activityId) {
      state.activities1 = state.activities1.filter(activity => activity.id !== activityId);
    },
    REMOVE_ACTIVITY2(state, activity) {
      const index = state.activities2.findIndex(act => act.id === activity.id);
      if (index !== -1) {
        Vue.delete(state.activities2, index);
      }
    },
    SET_USERS(state, users) {
      state.users = users;
      console.log(users)
    },
    SET_USER(state, users) {
      Vue.set(state.users, users.id, users);
      console.log(users)
    },
    SET_NEW_USER(state, newUser) {
      state.newUser = newUser;
    },
    SET_CURRENT_USER(state, user) {
      state.currentUser = user;
    },
    clearNewUser(state) {
      state.newUser = { firstName:'',
        lastName:'',
        email: '',
        userType:'',
        status:'active',
        hashedPassword:'' };
    },
    addUser(state, users){
      state.users.push(users);
    },
    setComments(state, comments) {
      state.comments = comments;
    },
    addComment(state, comment) {
      state.comments.push(comment);
    },
    deleteComment(state, commentId) {
      state.comments = state.comments.filter(comment => comment.id !== commentId);
    },
    deleteCommentForArticle(state, articleId) {
      state.comments = state.comments.filter(comment => comment.articleId !== articleId);
    },

  },
  actions: {
    guest({ commit }){
      commit('setGuest', true);
    //  localStorage.setItem('destinacije',store.state.destinacije);

    },
    login({ commit }, jwt) {
      localStorage.setItem('jwt', jwt);
      const decoded = jwtDecode(jwt);
     // localStorage.setItem('user',decoded.userType);
      console.log(decoded);
      commit('setLoggedIn', true);
      commit('setUserType', decoded.userType);
      commit('setEmail', decoded.sub);
      commit('setUserID',decoded.id)

    },
    logout({ commit }) {
      localStorage.removeItem('jwt');
      localStorage.removeItem('email');
      localStorage.removeItem('userType');
      localStorage.removeItem('guest')
      commit('setLoggedIn', false);
      commit('setUserType', null);
      commit('setEmail', null);
      commit('setGuest', false);

    },
    destinacije(destinacije){
      localStorage.setItem('destinacije',destinacije)
    },
    doadajArtikal({ commit }){
      commit("RESET_ARTICLE")
      commit("SET_ACTIVITIES2", []);
    },
    async fetchDestinations({ commit }) {
      const response = await fetch('http://localhost:8081/api/destination/all');
      const data = await response.json();
      commit('setDestinations', data);
    },
    async fetchDestination({ commit },id) {
      const response = await fetch(`http://localhost:8081/api/destination/${id}`);
      const data = await response.json();
      commit('setDestination', data);
    },
    async addDestination({ commit }, newDestination) {
      console.log(newDestination);
      const response = await fetch('http://localhost:8081/api/destination/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDestination)
      });
      const data = await response.json();
      commit('addDestination', data);
    },
    async updateDestination({ commit }, updatedDestination) {
      try {
        const response = await fetch(`http://localhost:8081/api/destination/update/${updatedDestination.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedDestination)
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Ako je sve u redu, možete nastaviti sa izvršavanjem drugih akcija
        // const data = await response.json();
         commit('updateDestination', data);
      } catch (error) {
        console.error('Greška pri ažuriranju destinacije:', error);
        // Možete dodati logiku za rukovanje greškama ovde
      }
    },
    async deleteDestination({ commit }, id) {

      await fetch(`http://localhost:8081/api/destination/${id}`, {
        method: 'DELETE'
      });
      commit('deleteDestination', id);
    },
    async fetchArticles({ commit }) {
      try {
        const response = await fetch('http://localhost:8081/api/article/all');
        const data = await response.json();
        commit('setArticles', data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    },
    async fetchMostViewedArticles({ commit }) {
      try {
        const response = await fetch(`http://localhost:8081/api/article/viewed`);
        const data = await response.json();
        commit('setArticles', data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    },
    async fetchArticlesDestination({ commit },id) {
      try {
        const response = await fetch(`http://localhost:8081/api/article/all/${id}`);
        const data = await response.json();
        commit('setArticles', data);
        console.log(data)
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    },
    async getArticleById({ commit },id) {
      try {
        const response = await fetch(`http://localhost:8081/api/article/${id}`);
        const data = await response.json();
        commit('setArticle', data);
        console.log(data)
      } catch (error) {
        console.error('Error getting article :', error);
      }
    },
    async addArticle({ commit }, {article,activity}) {
      console.log(JSON.stringify(article))
      try {
        const response = await fetch('http://localhost:8081/api/article/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(article),
        });
        const data = await response.json();
        activity.forEach(id => {
           fetch(`http://localhost:8081/api/article_activity/${data.id}/${id}`, {
            method: 'POST'
          });
        })
        commit('addArticles', data);
        console.log(data)
      } catch (error) {
        console.error('Error adding article:', error);
      }
    },
    async updateArticle({ commit }, article) {
      try {
        const response = await fetch(`http://localhost:8081/api/article/update/${article.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(article),
        });
        const data = await response.json();
        commit('updateArticles', data);
      } catch (error) {
        console.error('Error updating article:', error);
      }
    },
    async deleteArticle({ commit }, articleId) {
      try {
        await fetch(`http://localhost:8081/api/article/${articleId}`, {
          method: 'DELETE',
        });
        commit('deleteArticles', articleId);
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    },
    async fetchUsers({ commit }) {
      fetch('http://localhost:8081/api/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': 'application/json'
        }
      })
          .then(response => response.json())
          .then(data => commit('SET_USERS', data),)
          .catch(error => console.error('Error:', error));
    },
    async fetchUsersById({ commit },id) {
      fetch(`http://localhost:8081/api/users/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': 'application/json'
        }
      })
          .then(response => response.json())
          .then(data => commit('SET_USER', data),)
          .catch(error => console.error('Error:', error));
    },
    async addUser({ dispatch, state , commit}, confirmPassword) {
      if (state.newUser.hashedPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

         fetch('http://localhost:8081/api/users/admin/adduser', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(state.newUser)
        })
             .then(response => response.json())
            .then(data => commit('addUser', data),)
            .catch(error => console.error('Error:', error));
      commit("clearNewUser");

    },
    editUser({ commit }, user) {
      commit('SET_CURRENT_USER', { ...user });
    },
    updateUser({ dispatch, state }) {
      console.log(JSON.stringify(state.currentUser));
      fetch(`http://localhost:8081/api/users/admin/updateuser/${state.currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': 'application/json' },
        body: JSON.stringify(state.currentUser)
      })
          .then(() => {
            dispatch('fetchUsers');
          });
    },
    toggleUserStatus({ dispatch }, userId) {

      fetch(`http://localhost:8081/api/users/admin/updatestatus/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': 'application/json'
        }
      })
          .then(() => dispatch('fetchUsers'));
    },
    async fetchAllActivities({ commit }) {
      try {
        const response = await fetch('http://localhost:8081/api/activities');
        const data = await response.json();
        commit('SET_ACTIVITIES1', data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    },
    async fetchActivityById({ commit }, id) {
      try {
        const response = await fetch(`http://localhost:8081/api/activities/${id}`);
        const data = await response.json();
        commit('SET_ACTIVITY', data);
      } catch (error) {
        console.error('Error fetching activity:', error);
      }
    },
    async addActivity({ commit }, activity) {
      try {
        const response = await fetch('http://localhost:8081/api/activities/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(activity)
        });
        const data = await response.json();
        commit('ADD_ACTIVITY1', data);
      } catch (error) {
        console.error('Error adding activity:', error);
      }
    },
    async deleteActivity({ commit }, id) {
      try {
        await fetch(`http://localhost:8081/api/activities/${id}`, {
          method: 'DELETE'
        });
        commit('REMOVE_ACTIVITY', id);
      } catch (error) {
        console.error('Error deleting activity:', error);
      }
    },
    async fetchActivitiesForArticle({ commit }, articleId) {
      try {
        const response = await fetch(`http://localhost:8081/api/article_activity/${articleId}`);
        const data = await response.json();
        commit('SET_ACTIVITIES2', data);
      } catch (error) {
        console.error('Error fetching activities for article:', error);
      }
    },
    async fetchArticlesForActivity({ commit }, activityId) {
      try {
        const response = await fetch(`http://localhost:8081/api/article_activity/activity/${activityId}`);
        const data = await response.json();
        console.log(data)
        commit('setArticles', data);
      } catch (error) {
        console.error('Error fetching articles for activity:', error);
      }
    },
    async addArticleActivity({ commit },  {articleId, activityId} ) {
      console.log(articleId)
      console.log(activityId)
      try {
        await fetch(`http://localhost:8081/api/article_activity/${articleId}/${activityId}`, {
          method: 'POST'
        });
      } catch (error) {
        console.error('Error adding article activity:', error);
      }
    },
    async deleteArticleActivity({ commit },  {articleId, activityId} ) {
      console.log(articleId)
      console.log(activityId)
      try {
        await fetch(`http://localhost:8081/api/article_activity/${articleId}/${activityId}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error deleting article activity:', error);
      }
    },
    async fetchComments({ commit }, articleId) {
      try {
        const response = await fetch(`http://localhost:8081/api/comments/${articleId}`);
        const data = await response.json();
        commit('setComments', data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },
    async addComment({ commit }, comment) {
      console.log(comment)
      try {
        const response = await fetch('http://localhost:8081/api/comments/addcomment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(comment),
        });
        const data = await response.json();
        commit('addComment', data);
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    },
    async deleteComment({ commit }, commentId) {
      try {
        await fetch(`http://localhost:8081/api/comments/${commentId}`, {
          method: 'DELETE',
        });
        commit('deleteComment', commentId);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    },
    async deleteCommentsForArticle({ commit }, articleId) {
      try {
        await fetch(`http://localhost:8081/api/comments/deletecommentsforarticle/${articleId}`, {
          method: 'DELETE',
        });
        commit('deleteCommentForArticle', articleId);
      } catch (error) {
        console.error('Error deleting comments for article:', error);
      }
    },
  },
  modules: {
  },


})

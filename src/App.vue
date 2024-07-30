<template>
  <div id="app">
    <header v-if="isLoggedIn || isGuest">
      <nav>
        <div v-if="isLoggedIn" class="nav">

            <img src="./assets/logo.png">

            <li><router-link to="/destinations">Destinations</router-link></li>
            <li><router-link to="/articles">Articles</router-link></li>
            <li v-if="this.$store.state.userType === 'admin'"><router-link to="/users">Users</router-link></li>
            <li class="logo">{{email}}</li>
            <button class='logout' @click='logOut'>Logout</button>

        </div>
        <div v-else class="nav">

          <img src="./assets/logo.png">
          <li><router-link to="/home">Home</router-link></li>
          <li><router-link to="/most-popular">Most Popular</router-link></li>


            <li class="dropdown">
              <span class="dropdown-trigger">Destinations</span>
              <ul class="dropdown-content">
                <li v-for="route in dropdownRoutes" :key="route.path">
                  <router-link :to="route.path">{{ route.name }}</router-link>
                </li>
              </ul>
            </li>

          <button class='logout' @click='logOut'>Login</button>
        </div>
      </nav>
    </header>
    <main>
      <router-view/>
    </main>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex';

export default {

  computed: {
    ...mapState(['isLoggedIn', 'userType',"email",'isGuest','destinations']),
    dropdownRoutes (){
      return this.destinations.map(destination => ({
        path: '/destinacija/' + destination.id,
        name: destination.name
      }));
    }
  },
  methods: {
    ...mapActions(['logout','fetchDestinations',]),
    logOut(){
      this.logout()
      this.$router.push('/login').then(() => {
        console.log('Preusmeravanje na login stranicu je uspešno.');
      }).catch(err => {
        console.error('Greška prilikom preusmeravanja:', err);
      });
    }
  },
  watch: {
    isLoggedIn(newVal) {
      console.log('Stanje logovanja se promenilo:', newVal);
    },
    userType(newVal) {
      console.log('Tip korisnika se promenio:', newVal);
    }
  },
  async beforeMount() {
    try {
      await this.fetchDestinations();
      console.log('Destinacije su preuzete:', this.dropdownRoutes);
    } catch (err) {
      console.error('Greška prilikom preuzimanja destinacija:', err);
    }
  }
};
</script>
<style>

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #2c3e50;
  color: whitesmoke;
}



.dropdown-trigger {
  cursor: pointer;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #2c3e50;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  list-style-type: none;
  padding: 0;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content li {
  padding: 8px 12px;
}

.dropdown-content li:hover {
  background-color: #f1f1f1;
}
.logo {
  font-size: large;
  padding: 30px;
  color: #6c757d;
}

img {
  height: 80px;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2c3e50;
}

.nav {
  display: flex;
  justify-content: space-between;
  width: 100%;gap: 20px;
}

.left, .right {
  display: flex;
  align-items: start;
}

.left {
  gap: 20px;
}

.right {
  gap: 20px;
}

nav a {
  font-size: large;
  font-weight: bold;
  color: lightgray;
  text-decoration: none;
  transition: color 0.3s;
}

nav li {
  font-size: large;
  font-weight: bold;
  color: lightgray;
  list-style: none;
  padding: 30px;
  cursor: pointer;
}

nav a.router-link-exact-active {
  color: #5cc910;
}

nav a:hover, nav li:hover {
  color: #25500a;
}

main {
  padding: 20px;
}
.logout{
  margin: 20px;
  background-color: #5cc910;
  border: none;
  border-radius: 50px;
}
.logout:hover {
  background-color: #6df10f;
}
</style>

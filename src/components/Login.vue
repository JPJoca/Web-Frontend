<template>
  <div class="login">
    <img alt="logo" src="../assets/logo.png">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="input-group">
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div class="input-group">
        <label for="password">Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit" class="login-button">Login</button>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <div>
      <button type="submit" class="login-button" @click="nastavi()">Continue as guest</button>
    </div>
  </div>

</template>

<script>

import {mapActions} from "vuex";

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    ...mapActions(['guest','fetchDestinations']),
    async login() {
      try {
        const response = await fetch('http://localhost:8081/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });
        const data = await response.json();
        if (!response.ok) {
          this.errorMessage = data.message || 'An error occurred';
          return;
        }

        await this.$store.dispatch('login', data.jwt);
        await this.$router.push('/');
      } catch (error) {
        this.errorMessage = 'An error occurred';
      }
    },
    nastavi(){
      this.fetchDestinations()

      this.guest();
      this.$router.push('/home');
    }
  }
};
</script>

<style scoped>
img{
  width: 400px;
  height: 400px;
  left: -1px;
}
.login {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  align-items: flex-end;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="email"],
input[type="password"] {
  width: calc(100% - 20px);
  padding: 10px;
  margin: 0;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: #5cc910;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #25500a;
}

.error-message {
  color: red;
  margin-top: 15px;
  text-align: center;
}
</style>

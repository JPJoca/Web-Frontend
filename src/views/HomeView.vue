<template>
  <div class="home">
    <h1 >{{ this.$store.state.userType }}</h1>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import Login from "@/components/Login.vue";
import {mapState} from "vuex";

export default {
  name: 'HomeView',
  components: {
    HelloWorld,
    Login
  },
  computed: {
    ...mapState([ 'userType'])
  },
}
</script>

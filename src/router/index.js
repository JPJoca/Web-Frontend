import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from "@/components/Login.vue";
import DestinationView from "@/views/DestinationView.vue";
import UsersView from "@/views/UsersView.vue";
import ArticlesView from "@/views/ArticlesView.vue";
import ArticleForm from '@/components/AtricleForm.vue';
import ArticleList from "@/components/ArticleList.vue";
import AboutView from "@/views/AboutView.vue";
import MostPopular from "@/views/MostPopular.vue";
import ArticleDetails from "@/components/ArticleDetails.vue";
import ArticleDestination from "@/views/ArticleDestination.vue";
import ArticleActivity from "@/views/ArticleActivity.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'a',
    component: HomeView,
    meta: { requiresAuth: true }

  },
  {
    path: '/home',
    name: 'home',
    component: AboutView,

  },
  {
    path: '/most-popular',
    name: 'mostPopular',
    component: MostPopular,

  },
  {
    path: '/destinations',
    name: 'destinations',
    component: DestinationView,
    meta: { requiresAuth: true }

  },
  {
    path: '/articles',
    name: 'Article',
    component: ArticlesView,
    meta: { requiresAuth: true }

  },
  {
    path: '/users',
    name: 'User',
    component: UsersView,
    meta: { requiresAuth: true }

  },
  {
    path: '/destinacija/:id',
    name: 'DestinationArticle',
    component: ArticleDestination
  },
  {
    path: '/activity/:id',
    name: 'ArticleActivity',
    component: ArticleActivity
  },
  { path: '/add-article', component: ArticleForm ,meta: { requiresAuth: true }},
  { path: '/edit-article/:id', component: ArticleForm ,meta: { requiresAuth: true }},
  { path: '/destination-articles/:id', component: ArticleList,meta: { requiresAuth: true } },
  { path: '/article/:id', component: ArticleDetails, props: true },
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('jwt');

  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});
export default router

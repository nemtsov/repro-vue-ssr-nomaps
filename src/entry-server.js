import Vue from 'vue';
// import App from './App.vue';
const App = () => import('./App.vue');

export default function createApp() {
  return new Vue({
    template: '<App />',
    components: {
      App
    }
  });
};

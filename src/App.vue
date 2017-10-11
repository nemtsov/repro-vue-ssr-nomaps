<template>
  <div id="app">
    SSR app
  </div>
</template>

<script>
import bad from './bad';

export default {
  name: 'App',
  data() {
    return {
      a: bad()
    };
  }
};
</script>

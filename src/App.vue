<template>
  <div id="app">
    SSR app
  </div>
</template>

<script>
import first from './first';

export default {
  name: 'App',
  data() {
    return {
      a: first()
    };
  }
};
</script>

<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
/*
 * Root component
 */
export default {}
</script>

<style>
  .layout-padding {
    padding: 1em 1em;
  }

  @media screen and (max-width: 600px) {
    .layout-padding {
      padding: 1.5em .5em;
    }
  }
</style>

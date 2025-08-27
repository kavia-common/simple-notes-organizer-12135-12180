<template>
  <!-- Default layout wrapping the application UI -->
  <div id="app-root">
    <TopNav />
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import TopNav from '@/components/TopNav.vue'
import '@/assets/styles.css'
// This layout ensures our pages render using our app chrome (TopNav, etc.)
</script>

<style scoped>
main {
  display: block;
}
</style>

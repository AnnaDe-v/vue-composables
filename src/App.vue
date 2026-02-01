<script setup lang="ts">
import ValidationDemo from './components/ValidationDemo.vue';
</script>

<template>
  <div class="app">
    <main>
      <div class="container">
        <section class="demo-section">
          <ValidationDemo />
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: rgba(234, 234, 234, 0.491);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.demo-section {
  margin-bottom: 2rem;
}
</style>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ValidationDemo, HttpDemo } from './components';

const STORAGE_KEY = 'active-tab';

const getSavedTab = (): 'validation' | 'http' => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return (saved === 'validation' || saved === 'http') ? saved : 'validation';
};

const activeTab = ref<'validation' | 'http'>(getSavedTab());

watch(activeTab, (newTab) => {
  localStorage.setItem(STORAGE_KEY, newTab);
});
</script>

<template>
  <div class="app">
    <nav class="tabs">
      <button 
        @click="activeTab = 'validation'" 
        :class="['tab', { active: activeTab === 'validation' }]"
      >
        Validation
      </button>
      <button 
        @click="activeTab = 'http'" 
        :class="['tab', { active: activeTab === 'http' }]"
      >
        Http
      </button>
    </nav>

    <main>
      <div class="container">
        <section class="demo-section">
          <keep-alive>
            <component :is="activeTab === 'validation' ? ValidationDemo : HttpDemo" />
          </keep-alive>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import './App.css';
</style>

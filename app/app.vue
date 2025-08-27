<template>
  <UApp>
    <UBanner icon="i-lucide-info" title="Subscribe to follow our latest events!" />
    <AppHeader />
    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter>
      <AppFooter />
    </UFooter>
  </UApp>
</template>

<script setup lang="ts">
  import AppFooter from './components/ui/AppFooter.vue';
  import AppHeader from './components/ui/AppHeader.vue';
</script>

<style>
  .page-enter-active,
  .page-leave-active {
    transition: all 0.4s;
  }
  .page-enter-from,
  .page-leave-to {
    opacity: 0;
    filter: blur(1rem);
  }
</style>

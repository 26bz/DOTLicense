<script setup lang="ts">
  import AppFooter from '~/components/ui/AppFooter.vue';
  import AppHeader from '~/components/ui/AppHeader.vue';
</script>

<template>
  <div>
    <AppHeader />
    <UMain>
      <UPageBody>
        <slot />
      </UPageBody>
    </UMain>

    <UFooter>
      <AppFooter />
    </UFooter>
  </div>
</template>

<template>
  <div>
    <AppHeader />
    <UMain>
      <UPageBody>
        <slot />
      </UPageBody>
    </UMain>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
  import AppFooter from '~/components/ui/AppFooter.vue'
  import AppHeader from '~/components/ui/AppHeader.vue'
</script>

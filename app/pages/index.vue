<script setup lang="ts">
  const links = ref([
    {
      label: 'View Products',
      to: '/products',
      icon: 'i-lucide-square-play',
    },
    {
      label: 'Learn more',
      to: '/about',
      color: 'neutral' as const,
      variant: 'subtle' as const,
      trailingIcon: 'i-lucide-arrow-right',
    },
  ]);
</script>

<template>
  <UPageHero
    title="Own your store. Issue licenses"
    description="A NuxtUI full-stack licensing platform with authentication, user dashboards, and product management."
    headline="DOTLicense"
    orientation="horizontal"
    :links="links"
  >
    <img src="https://placehold.co/600x400" alt="App screenshot" class="rounded-lg shadow-2xl ring ring-default" >
  </UPageHero>
</template>

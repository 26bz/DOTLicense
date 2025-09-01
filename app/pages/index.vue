<template>
  <UPageHero
    title="Own your store, Issue licenses."
    description="A Nuxt licensing platform with authentication, user dashboards, product management, and more!"
    headline="DOTLicense by 26bz"
    orientation="horizontal"
    :links="links"
  >
    <img src="https://placehold.co/600x400" alt="App screenshot" class="rounded-lg shadow-2xl ring ring-default" />
  </UPageHero>
</template>

<script setup lang="ts">
  const links = ref([
    {
      label: 'View Products',
      to: '/products',
      icon: 'i-lucide-file',
      variant: 'outline' as const,
      color: 'neutral' as const,
    },
    {
      label: 'Discover Services',
      to: '/services',
      variant: 'outline' as const,
      color: 'neutral' as const,
      trailingIcon: 'i-lucide-arrow-right',
    },
  ])
</script>

<script setup lang="ts">
  const plans = ref([
    {
      title: 'Website Consolutation',
      description: 'Tailored for indie hackers.',
      price: '$249',
      features: ['One Project', '30+ Tests'],
      button: {
        label: 'Buy now',
      },
    },
  ])
</script>

<template>
  <UContainer>
    <UPageSection title="Discover our Services">
      <UPricingPlans orientation="vertical" :plans="plans" />
    </UPageSection>
  </UContainer>
</template>

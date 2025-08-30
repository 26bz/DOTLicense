<script setup lang="ts">
  type RawService = {
    // I might just organize types
    id: number
    title: string
    shortDescription?: string
    description: string
    price: string
    features: unknown
    buttonLabel: string
    deliveryTimeframe?: string
    includesRevisions: boolean
    maxRevisions?: number
    includesConsultation: boolean
    consultationHours?: number
    isFeatured: boolean
    isActive: boolean
  }

  const { data: services } = await useFetch<RawService[]>('/api/services/public')

  function toFeatures(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.filter((v): v is string => typeof v === 'string')
    }
    return []
  }

  const activeServices = computed(() => services.value?.filter(service => service.isActive) || [])

  const pricingPlans = computed(() =>
    activeServices.value.map(service => ({
      title: service.title,
      description: service.shortDescription || service.description,
      price: service.price,
      features: toFeatures(service.features),
      button: {
        label: service.buttonLabel || 'Get Started',
        color: service.isFeatured ? ('primary' as const) : ('neutral' as const),
        variant: service.isFeatured ? ('solid' as const) : ('outline' as const),
      },
      highlight: service.isFeatured,
      badge: service.isFeatured ? 'Popular' : undefined,
      orientation: 'vertical' as const,
    }))
  )
</script>

<template>
  <UContainer>
    <UPageHeader
      title="Our Services"
      description="Choose the perfect plan for your needs. All plans include our core features with different levels of support and customization."
      class="mb-8"
    />

    <template v-if="pricingPlans && pricingPlans.length">
      <UPricingPlans :plans="pricingPlans" orientation="horizontal" />
    </template>

    <UAlert v-else title="No Services Available" description="We're working on bringing you amazing services. Please check back later." color="warning" variant="soft" />
  </UContainer>
</template>

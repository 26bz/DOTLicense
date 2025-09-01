<template>
  <UContainer>
    <UPageHeader
      title="Our Services"
      description="Choose the perfect plan for your needs. All plans include our core features with different levels of support and customization."
      class="mb-8"
    />

    <div v-if="activeServices.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard v-for="service in activeServices" :key="service.id" variant="outline">
        <template #header>
          <div class="flex justify-between items-center">
            <h5 class="font-semibold">{{ service.title }}</h5>
            <UBadge v-if="service.isFeatured" color="warning" variant="soft">Featured</UBadge>
          </div>
          <p class="text-sm text-neutral-500">{{ service.price }}</p>
        </template>

        <div class="space-y-2">
          <p>{{ service.shortDescription }}</p>
          <p>{{ service.description }}</p>

          <div class="flex flex-wrap gap-1">
            <UBadge v-for="feature in service.features" :key="feature" size="sm" variant="soft" color="info">
              {{ feature }}
            </UBadge>
          </div>
        </div>

        <template #footer>
          <UButton
            :label="service.buttonLabel || 'Get Started'"
            :color="service.isFeatured ? 'primary' : 'neutral'"
            :variant="service.isFeatured ? 'solid' : 'subtle'"
            class="w-full"
          />
        </template>
      </UCard>
    </div>

    <UAlert
      v-else
      title="No Services Available"
      description="We're working on bringing you amazing services. Please check back later."
      icon="i-lucide-frown"
      color="warning"
      orientation="horizontal"
      variant="soft"
    />
  </UContainer>
</template>

<script setup lang="ts">
  import type { Service } from '#shared/schemas/services'

  const { data: services } = await useFetch<Service[]>('/api/services/public')

  const activeServices = computed(() => (services.value || []).filter(s => s.isActive))
</script>

<template>
  <UContainer>
    <UPageHeader title="Our Products" description="Browse our collection of digital products. Each comes with detailed info, features, and pricing." class="mb-8" />

    <template v-if="products && products.length">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard v-for="product in products" :key="product.id" variant="outline">
          <template #header>
            <div class="flex justify-between items-start">
              <div>
                <h5 class="font-semibold">{{ product.name }}</h5>
                <p class="text-sm text-neutral-500">${{ product.price }}</p>
              </div>
              <div class="flex gap-2">
                <UBadge v-if="product.isFeatured" color="warning" variant="soft"> Featured </UBadge>
                <UBadge :color="product.isActive ? 'success' : 'error'" variant="soft">
                  {{ product.isActive ? 'Active' : 'Inactive' }}
                </UBadge>
              </div>
            </div>
          </template>

          <div class="space-y-2">
            <p class="text-sm text-neutral-600 font-medium">{{ product.shortDescription }}</p>
            <p class="text-sm text-neutral-600">{{ product.description }}</p>

            <div>
              <h6 class="text-sm font-medium mb-1">Category:</h6>
              <UBadge color="info" variant="soft">{{ product.category.name }}</UBadge>
            </div>

            <div v-if="product.tags">
              <h6 class="text-sm font-medium mb-1">Tags:</h6>
              <UBadge v-for="tag in toTags(product.tags)" :key="tag" color="primary" variant="soft">
                {{ tag }}
              </UBadge>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-between items-center gap-2">
              <UButton :href="product.fileUrl" target="_blank" color="primary" variant="solid" size="sm"> Download / Buy </UButton>
            </div>
          </template>
        </UCard>
      </div>
    </template>

    <UAlert
      v-else
      title="No Products Available"
      description="We're working on adding new products. Please check back later."
      icon="i-lucide-frown"
      color="warning"
      orientation="horizontal"
      variant="soft"
    />
  </UContainer>
</template>

<script setup lang="ts">
  import type { Product } from '#shared/schemas/product'

  const { data: products } = await useFetch<Product[]>('/api/products/public')

  function toTags(value: string): string[] {
    return value
      .split(',')
      .map(v => v.trim())
      .filter(Boolean)
  }
</script>

<template>
  <UPageSection title="Discover our Resources">
    <UInput color="neutral" variant="subtle" placeholder="Search..." class="max-w-7xl mx-auto" />
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <UCard v-for="item in products" :key="item.id">
        <img :src="item.coverImage" :alt="item.title" class="w-full h-40 object-cover rounded-xl mb-4" >
        <h1 class="text-xl font-bold">{{ item.title }}</h1>
        <UBadge variant="subtle">{{ item.category }}</UBadge>
        <p class="text-gray-700 mb-2">{{ item.description }}</p>
        <template #footer>
          <div class="flex justify-between">
            <p>
              {{ item.price }}
              <span class="text-xs">{{ item.billingCycle }}</span>
            </p>
            <UButton>Purchase</UButton>
          </div>
        </template>
      </UCard>
    </div>
  </UPageSection>
</template>

<script lang="ts" setup>
  const products = [
    {
      id: '1',
      title: 'Product 1',
      coverImage: 'https://placehold.co/50',
      description: 'Desc',
      price: '$10',
      billingCycle: 'One Time',
      version: 'v',
      category: 'Websites',
      releasedOn: 'Date',
      updatedOn: 'date',
      visability: 'public',
    },
  ];
</script>

<style></style>

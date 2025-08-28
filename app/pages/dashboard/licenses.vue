<template>
  <UContainer>
    <div v-if="pending" class="text-gray-500">Loading licenses...</div>

    <div v-else-if="licenses?.length > 0" class="space-y-3">
      <UCard v-for="license in licenses" :key="license.id" class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <p>{{ license.product.name }}</p>
            <p class="text-sm text-gray-500">Code: {{ license.code }} • Issued: {{ new Date(license.issuedAt).toLocaleDateString() }}</p>
          </div>
          <UBadge :color="license.revoked ? 'error' : license.expiresAt && new Date(license.expiresAt) < new Date() ? 'primary' : 'primary'" class="text-xs" />
        </div>
      </UCard>
    </div>

    <div v-else>
      <UCard class="p-3 text-center text-gray-500">
        <UIcon name="i-lucide-key" class="w-8 h-auto mx-auto mb-2 text-gray-400" />
        <p>No licenses found.</p>
      </UCard>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
  const { data, pending } = useFetch('/api/user/licenses')
  const licenses = computed(() => data.value?.licenses || [])

  definePageMeta({
    layout: 'dashboard',
  })
</script>

<style></style>

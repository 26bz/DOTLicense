<template>
  <UContainer>
    <div v-if="pending" class="text-gray-500">Loading licenses...</div>

    <UAlert v-else-if="error" :title="error.name" :description="error.message" variant="outline" color="error" />
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
      <UCard class="p-3 text-center text-gray-500 max-w-2xl mx-auto">
        <UIcon name="i-lucide-key" size="50" class="text-gray-400" />
        <p>No licenses found.</p>
      </UCard>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
  import { userLicensesSchema } from '#shared/schemas/license'

  const { data, pending, error } = await useAsyncData('user-licenses', async () => {
    const res = await $fetch('/api/user/licenses')
    return userLicensesSchema.parse(res)
  })

  const licenses = computed(() => data.value?.licenses || [])

  definePageMeta({ layout: 'dashboard' })
</script>

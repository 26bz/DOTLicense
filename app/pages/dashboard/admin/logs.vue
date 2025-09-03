<template>
  <UContainer>
    <UPageHeader title="Admin Activity Logs" description="View all system and user activities" />

    <UCard class="mb-6">
      <div class="flex flex-wrap gap-4">
        <USelect v-model="selectedTypes" :items="activityTypes" multiple placeholder="Filter by type" />
        <UInput v-model="startDate" type="date" placeholder="Start date" />
        <UInput v-model="endDate" type="date" placeholder="End date" />
        <UButton @click="fetchLogs" icon="i-lucide-search">Filter</UButton>
        <UButton @click="clearFilters" variant="outline">Clear</UButton>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">System Activity Logs</h3>
          <UButton @click="fetchLogs" :loading="pending" icon="i-lucide-refresh-cw" size="sm" variant="outline"> Refresh </UButton>
        </div>
      </template>

      <div v-if="pending" class="space-y-3">
        <USkeleton class="h-16 w-full" v-for="i in 5" :key="i" />
      </div>

      <div v-else-if="logs.length" class="space-y-1">
        <UCard v-for="log in logs" :key="log.id" class="!p-3 hover:bg-gray-50/50 transition-colors">
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <UIcon :name="getActivityIcon(log.type)" :class="`text-${getActivityColor(log.type)}-500`" class="w-4 h-4 flex-shrink-0" />
              <div class="min-w-0">
                <span class="font-medium text-sm">{{ formatActivityTitle(log) }}</span>
              </div>
            </div>

            <div class="text-xs text-gray-600 text-center whitespace-nowrap">
              <div v-if="log.user" class="font-medium">{{ log.user.firstName }} {{ log.user.lastName }}</div>
              <div v-if="log.user" class="text-gray-500">{{ log.user.email }}</div>
            </div>

            <div class="text-right text-xs text-gray-500 flex-shrink-0">
              <div v-if="log.metadata && typeof log.metadata === 'object'" class="mb-1 flex items-center gap-2 justify-end">
                <span v-if="log.metadata.productId" class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{{ log.metadata.productId }}</span>
                <span v-if="log.metadata && log.metadata.amount && typeof log.metadata.amount === 'number'" class="bg-green-50 text-green-600 px-2 py-0.5 rounded font-medium"
                  >${{ (log.metadata.amount / 100).toFixed(2) }}</span
                >
                <span v-if="log.metadata.licenseId" class="bg-purple-50 text-purple-600 px-2 py-0.5 rounded">{{ log.metadata.licenseId }}</span>
              </div>
              <div class="font-medium mb-0.5"><NuxtTime :datetime="log.createdAt" relative /></div>
              <div class="flex items-center gap-1.5 justify-end">
                <span v-if="log.metadata?.ip" class="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-xs">{{ log.metadata.ip }}</span>
                <span v-if="log.metadata?.browser" class="text-xs">{{ log.metadata.browser }}</span>
                <UIcon v-if="log.metadata?.device" name="i-heroicons-device-phone-mobile" class="w-3 h-3" />
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <div v-else class="text-center py-8 text-gray-500">
        <div v-if="error" class="text-red-500">Error loading logs: {{ error }}</div>
        <div v-else>No activity logs found.</div>
      </div>

      <div v-if="hasMore" class="mt-4 text-center">
        <UButton @click="loadMore" :loading="loadingMore" variant="outline">Load More</UButton>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import {
    ActivityLogSchema,
    ActivityType,
    getActivityIcon,
    getActivityColor,
    formatActivityTitle,
    formatActivityDate,
    type ActivityLog,
    type ActivityTypeValue,
  } from '#shared/schemas/activity'

  definePageMeta({
    auth: true,
    layout: 'dashboard',
  })

  const logs = ref<ActivityLog[]>([])
  const hasMore = ref(false)
  const offset = ref(0)
  const selectedTypes = ref<ActivityTypeValue[]>([])
  const startDate = ref('')
  const endDate = ref('')
  const loadingMore = ref(false)

  const activityTypes = Object.values(ActivityType).map(type => ({ label: type, value: type }))

  const {
    pending,
    refresh: fetchLogsLazy,
    error,
  } = await useLazyFetch('/api/admin/activity', {
    query: computed(() => ({
      limit: 20,
      offset: offset.value,
      types: selectedTypes.value.length ? selectedTypes.value : undefined,
      startDate: startDate.value || undefined,
      endDate: endDate.value || undefined,
    })),
    onResponse({ response }) {
      console.log('Admin activity API response:', response._data)
      const data = response._data
      if (!data || !data.activities) {
        console.error('Invalid response format:', data)
        return
      }
      const parsedLogs = data.activities.map((a: any) => ActivityLogSchema.parse(a))
      if (offset.value === 0) logs.value = parsedLogs
      else logs.value.push(...parsedLogs)
      hasMore.value = data.hasMore
    },
    onResponseError({ response }) {
      console.error('Admin activity API error:', response._data)
    },
  })

  const loadMore = async () => {
    if (loadingMore.value) return
    loadingMore.value = true
    offset.value += 20
    await fetchLogsLazy()
    loadingMore.value = false
  }

  const fetchLogs = async () => {
    offset.value = 0
    await fetchLogsLazy()
  }

  const clearFilters = () => {
    selectedTypes.value = []
    startDate.value = ''
    endDate.value = ''
    fetchLogs()
  }

  function getDeviceIcon(device: string): string {
    const deviceIcons: Record<string, string> = {
      mobile: 'i-lucide-smartphone',
      tablet: 'i-lucide-tablet',
      desktop: 'i-lucide-monitor',
    }
    return deviceIcons[device.toLowerCase()] || 'i-lucide-monitor'
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString()
  }
</script>

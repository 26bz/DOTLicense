<template>
  <UContainer>
    <UPageHeader title="Account Activity" description="View your recent account activity and login history" />

    <div class="space-y-6">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Activity Summary (Last 30 Days)</h3>
        </template>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <UCard class="text-center p-4">
            <div class="text-2xl font-bold">{{ stats?.login || 0 }}</div>
            <div class="text-sm text-gray-600">Logins</div>
          </UCard>
          <UCard class="text-center p-4">
            <div class="text-2xl font-bold">{{ stats?.purchase_completed || 0 }}</div>
            <div class="text-sm text-gray-600">Purchases</div>
          </UCard>
          <UCard class="text-center p-4">
            <div class="text-2xl font-bold">{{ stats?.download_product || 0 }}</div>
            <div class="text-sm text-gray-600">Downloads</div>
          </UCard>
          <UCard class="text-center p-4">
            <div class="text-2xl font-bold">{{ stats?.update_profile || 0 }}</div>
            <div class="text-sm text-gray-600">Profile Updates</div>
          </UCard>
        </div>
      </UCard>

      <UCard>
        <div class="flex flex-wrap gap-4 mb-4">
          <USelect v-model="selectedTypes" :items="activityTypes" multiple placeholder="Filter by activity type" />
          <UInput v-model="startDate" type="date" placeholder="Start date" />
          <UInput v-model="endDate" type="date" placeholder="End date" />
          <UButton @click="fetchActivityHandler" icon="i-lucide-search"> Filter </UButton>
          <UButton @click="clearFilters" variant="outline"> Clear </UButton>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Recent Activity</h3>
            <UButton @click="fetchActivityHandler" :loading="pending" icon="i-lucide-refresh-cw" size="sm" variant="outline"> Refresh </UButton>
          </div>
        </template>

        <div v-if="pending" class="space-y-3">
          <USkeleton class="h-16 w-full" v-for="i in 5" :key="i" />
        </div>

        <div v-else-if="activities?.length" class="space-y-1">
          <UCard v-for="activity in activities" :key="activity.id" class="!p-2 hover:bg-gray-50/50 transition-colors">
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <UIcon :name="getActivityIcon(activity.type)" :class="`text-${getActivityColor(activity.type)}-500`" class="w-4 h-4 flex-shrink-0" />
                <div class="min-w-0">
                  <span class="font-medium text-sm">{{ formatActivityTitle(activity) }}</span>
                </div>
              </div>

              <div v-if="activity.metadata && typeof activity.metadata === 'object'" class="text-xs text-gray-500 flex items-center gap-2">
                <span v-if="activity.metadata.productId" class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{{ activity.metadata.productId }}</span>
                <span v-if="activity.metadata.amount && typeof activity.metadata.amount === 'number'" class="bg-green-50 text-green-600 px-2 py-0.5 rounded font-medium"
                  >${{ (activity.metadata.amount / 100).toFixed(2) }}</span
                >
              </div>

              <div class="text-right text-xs text-gray-500 flex-shrink-0">
                <div class="font-medium mb-0.5"><NuxtTime :datetime="activity.createdAt" relative /></div>
                <div class="flex items-center gap-1.5 justify-end">
                  <span v-if="activity.metadata?.ip" class="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-xs">{{ activity.metadata.ip }}</span>
                  <span v-if="activity.metadata?.browser" class="text-xs">{{ activity.metadata.browser }}</span>
                  <UIcon v-if="activity.metadata?.device" name="i-heroicons-device-phone-mobile" class="w-3 h-3" />
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <div v-else class="text-center py-8 text-gray-500">No activity found for the selected criteria.</div>

        <div v-if="hasMore && activities?.length" class="mt-6 text-center">
          <UButton @click="loadMore" :loading="loadingMore" variant="outline"> Load More </UButton>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
  import { ref, computed, watchEffect } from 'vue'
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
    layout: 'dashboard',
    auth: true,
  })

  type Activity = ActivityLog

  const activities = ref<Activity[]>([])
  const stats = ref<any>({})
  const hasMore = ref(false)
  const offset = ref(0)
  const selectedTypes = ref<ActivityTypeValue[]>([])
  const startDate = ref('')
  const endDate = ref('')
  const loadingMore = ref(false)

  const { pending, refresh: fetchActivity } = await useLazyFetch('/api/user/activity', {
    query: computed(() => ({
      limit: 20,
      offset: offset.value,
      types: selectedTypes.value.join(',') || undefined,
      startDate: startDate.value || undefined,
      endDate: endDate.value || undefined,
    })),
    onResponse({ response }) {
      const data = response._data
      const parsedActivities = data.activities.map((activity: any) => ActivityLogSchema.parse(activity))
      if (offset.value === 0) activities.value = parsedActivities
      else activities.value.push(...parsedActivities)
      hasMore.value = data.hasMore
    },
  })

  const { data: statsData } = await useLazyFetch('/api/user/activity/stats')
  watchEffect(() => {
    if (statsData.value) stats.value = statsData.value.stats
  })

  const fetchActivityHandler = () => {
    offset.value = 0
    return fetchActivity()
  }

  const loadMore = async () => {
    loadingMore.value = true
    offset.value += 20
    await fetchActivity()
    loadingMore.value = false
  }

  const clearFilters = () => {
    selectedTypes.value = []
    startDate.value = ''
    endDate.value = ''
    offset.value = 0
    fetchActivityHandler()
  }

  const activityTypes = Object.values(ActivityType).map(type => ({
    label: type,
    value: type,
  }))
</script>

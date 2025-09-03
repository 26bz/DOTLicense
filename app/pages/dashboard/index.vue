<template>
  <div class="max-w-7xl mx-auto">
    <div class="space-y-4">
      <h1 v-if="loggedIn">Welcome Back, {{ user?.userName }}!</h1>
      <p v-else>Not logged in</p>
      <UCard class="mt-3">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <UCard v-for="stats in userStats" :key="stats.title" class="flex flex-col items-center p-3 text-center">
            <UIcon :name="stats.icon" class="w-6 h-auto text-primary text-center" />
            <p class="text-2xl font-bold">{{ stats.value }}</p>
            <p class="text-sm text-gray-600">{{ stats.title }}</p>
          </UCard>
        </div>
      </UCard>

      <UCard class="mt-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <div class="lg:col-span-2 space-y-6">
            <UCard>
              <template #header>
                <div class="flex items-center justify-between">
                  <h3 class="text-base font-semibold leading-6 text-gray-900">Recent Activity</h3>
                  <UButton to="/dashboard/activity" variant="ghost" size="sm" icon="i-lucide-arrow-right"> View All </UButton>
                </div>
              </template>

              <div v-if="recentActivity?.activities?.length" class="space-y-2">
                <div
                  v-for="activity in recentActivity.activities.slice(0, 5)"
                  :key="activity.id"
                  class="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                >
                  <div class="flex items-center gap-2 flex-1 min-w-0">
                    <UIcon :name="getActivityIcon(activity.type)" class="w-4 h-4 flex-shrink-0" :class="getActivityColor(activity.type)" />
                    <span class="text-sm text-gray-900 truncate">
                      {{ formatActivityTitle(ActivityLogSchema.parse(activity)) }}
                    </span>
                  </div>
                  <span class="text-xs text-gray-500 flex-shrink-0">
                    <NuxtTime :datetime="activity.createdAt" relative />
                  </span>
                </div>
              </div>

              <div v-else class="text-center py-8">
                <UIcon name="i-lucide-activity" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p class="text-sm text-gray-500">No recent activity</p>
              </div>
            </UCard>
            <UCard>
              <h1 class="font-semibold text-lg mb-3">Quick Actions</h1>
              <div class="flex flex-wrap gap-2">
                <UButton to="/dashboard/licenses" icon="i-lucide-key" size="sm">View Licenses</UButton>
                <UButton to="/dashboard/settings" icon="i-lucide-cog" size="sm">Account Settings</UButton>
                <UButton to="/dashboard/support" icon="i-lucide-message-circle" size="sm">Open Ticket</UButton>
              </div>
            </UCard>
          </div>

          <div class="space-y-4">
            <UCard>
              <h1 class="font-semibold text-lg mb-3">Announcements</h1>
              <template v-if="announcements?.length">
                <div class="space-y-1">
                  <UAlert v-for="item in announcements" :key="item.id" color="secondary" variant="outline" :title="item.title" :description="item.description" />
                </div>
              </template>

              <template v-else>
                <UAlert color="secondary" variant="outline" title="No announcements yet" />
              </template>
            </UCard>

            <UCard>
              <h1 class="font-semibold text-lg mb-3">Account Security</h1>
              <div v-if="lastLogin" class="text-sm text-gray-600">
                <p>Last Login: <NuxtTime :datetime="lastLogin.createdAt" relative /></p>
                <p v-if="lastLogin.ipAddress" class="text-xs text-gray-500 mt-1">
                  from {{ lastLogin.ipAddress }}
                  <span v-if="lastLogin.browser"> • {{ lastLogin.browser }}</span>
                  <span v-if="lastLogin.os"> • {{ lastLogin.os }}</span>
                </p>
              </div>
              <p v-else class="text-sm text-gray-500">No login history available</p>
            </UCard>

            <UCard>
              <h1 class="font-semibold text-lg mb-3">Support</h1>
              <div v-if="supportStats">
                <p class="text-sm text-gray-600">You have {{ supportStats.openTickets }} open ticket{{ supportStats.openTickets !== 1 ? 's' : '' }}.</p>
                <UButton size="sm" variant="soft" icon="i-lucide-ticket" class="mt-2" to="/dashboard/support">Go to Support</UButton>
              </div>
              <div v-else>
                <p class="text-sm text-gray-600">No support tickets.</p>
                <UButton size="sm" variant="soft" icon="i-lucide-plus" class="mt-2" to="/dashboard/support">Create Ticket</UButton>
              </div>
            </UCard>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { getActivityIcon, getActivityColor, formatActivityTitle, formatActivityDate, ActivityLogSchema, type ActivityLog } from '#shared/schemas/activity'

  definePageMeta({
    layout: 'dashboard',
    auth: true,
  })

  const { user, loggedIn } = useUserSession()

  const { data: stats } = useFetch('/api/user/stats')
  const { data: announcements } = await useFetch('/api/announcements', { lazy: true })
  const { data: recentActivity } = await useFetch('/api/user/activity?limit=5', { lazy: true })
  const { data: lastLogin } = await useFetch('/api/user/last-login', { lazy: true })

  const userStats = computed(() => [
    { title: 'Purchases', value: stats.value?.stats.purchases ?? 0, icon: 'i-lucide-box' },
    { title: 'Licenses', value: stats.value?.stats.licenses ?? 0, icon: 'i-lucide-key' },
    { title: 'Subscriptions', value: stats.value?.stats.subscriptions ?? 0, icon: 'i-lucide-refresh-cw' },
  ])

  const supportStats = computed(() => ({
    openTickets: 0, // TODO: Implement support ticket counting
  }))
</script>

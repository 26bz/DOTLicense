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
              <h1 class="font-semibold text-lg mb-3">Recent Activity</h1>
              <ul class="divide-y divide-gray-200">
                <li class="py-2 flex justify-between bg-neutral-800 p-3 rounded-lg">
                  <span>
                    Purchased
                    <span>Example Product</span>
                  </span>
                  <span class="text-xs text-gray-500">1 Day ago</span>
                </li>
              </ul>
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
              <p class="text-sm text-gray-600">
                Last Login: Aug xx, 2025 from
                <span class="text-gray-300">xx.xx.xx.xx</span>
              </p>
            </UCard>

            <UCard>
              <h1 class="font-semibold text-lg mb-3">Support</h1>
              <p class="text-sm text-gray-600">You have 1 open ticket.</p>
              <UButton size="sm" variant="soft" icon="i-lucide-ticket" class="mt-2">Go to Support</UButton>
            </UCard>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: 'dashboard',
    auth: true,
  })

  const { user, loggedIn } = useUserSession()

  const { data: stats } = useFetch('/api/user/stats')
  const { data: announcements } = await useFetch('/api/announcements', { lazy: true })

  const userStats = computed(() => [
    { title: 'Purchases', value: stats.value?.stats.purchases ?? 0, icon: 'i-lucide-box' },
    { title: 'Licenses', value: stats.value?.stats.licenses ?? 0, icon: 'i-lucide-key' },
    { title: 'Subscriptions', value: stats.value?.stats.subscriptions ?? 0, icon: 'i-lucide-refresh-cw' },
  ])
</script>

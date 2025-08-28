<script setup lang="ts">
  const { user } = useUserSession();

  const userStats = [
    {
      title: 'Purchases',
      value: '12',
      icon: 'i-lucide-box',
    },
    {
      title: 'Licenses',
      value: '12',
      icon: 'i-lucide-box',
    },
    {
      title: 'Tickets',
      value: '12',
      icon: 'i-lucide-box',
    },
  ];
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <div class="space-y-4">
      <h1 class="text-xl font-bold flex-1">Welcome Back, {{ user?.name }}</h1>
      <p class="text-gray-500">{{ user?.email }}</p>

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
                <UButton icon="i-lucide-key" size="sm">View Licenses</UButton>
                <UButton icon="i-lucide-cog" size="sm">Account Settings</UButton>
                <UButton icon="i-lucide-message-circle" size="sm">Open Ticket</UButton>
              </div>
            </UCard>
          </div>

          <div class="space-y-4">
            <UCard>
              <h1 class="font-semibold text-lg mb-3">Announcements</h1>
              <UAlert color="secondary" title="DotLicense in development!" />
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

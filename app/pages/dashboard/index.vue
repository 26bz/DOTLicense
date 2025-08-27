<script setup lang="ts">
  import type { TabsItem } from '@nuxt/ui';

  const { user } = useUserSession();
  const { data, pending } = useFetch('/api/user/licenses');
  const licenses = computed(() => data.value?.licenses || []);
  definePageMeta({
    middleware: ['auth'],
  });

  const items = [
    {
      label: 'Overview',
      icon: 'material-symbols:home',
      slot: 'overview' as const,
    },
    {
      label: 'Licenses',
      icon: 'i-lucide-code',
      slot: 'licenses' as const,
    },
    {
      label: 'Transaction History',
      icon: 'i-lucide-book',
      slot: 'history' as const,
    },
    {
      label: 'Account Settings',
      icon: 'i-lucide-lock',
      slot: 'settings' as const,
    },
  ] satisfies TabsItem[];

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
  const state = reactive({
    name: 'Benjamin Canac',
    username: 'benjamincanac',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <UTabs :items="items" variant="link" :ui="{ trigger: 'grow' }" class="gap-4 w-full">
      <template #overview>
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
      </template>

      <template #licenses>
        <div class="space-y-4 mt-3">
          <h1 class="font-semibold text-lg mb-3">Support</h1>

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
        </div>
      </template>
      <template #settings>
        <UForm :state="state" class="flex flex-col gap-4 mt-6">
          <UFormField label="Current Password" name="current" required>
            <UInput v-model="state.currentPassword" type="password" required class="w-full" />
          </UFormField>
          <UFormField label="New Password" name="new" required>
            <UInput v-model="state.newPassword" type="password" required class="w-full" />
          </UFormField>
          <UFormField label="Confirm Password" name="confirm" required>
            <UInput v-model="state.confirmPassword" type="password" required class="w-full" />
          </UFormField>

          <UButton label="Change password" type="submit" variant="soft" class="self-end" />
        </UForm>
      </template>
    </UTabs>
  </div>
</template>

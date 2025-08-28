<template>
  <div>
    <AppHeader />
    <UDashboardToolbar>
      <div class="flex items-center justify-between w-full max-w-7xl mx-auto">
        <UNavigationMenu :items="items" highlight class="flex-1" />
        <USlideover
          title="Admin Navigation"
          :close="{
            color: 'neutral',
            variant: 'outline',
            class: 'rounded-full',
          }"
        >
          <UButton icon="eos-icons:admin" color="error" size="md" variant="ghost" />
          <template #body>
            <div class="grid grid-cols-2 gap-2 p-4">
              <UButton icon="material-symbols:dashboard" label="Admin Overview" to="/dashboard/admin" color="neutral" variant="subtle" />
              <UButton icon="material-symbols:inventory-2" label="Manage Products" to="/dashboard/admin/products" color="neutral" variant="subtle" />
              <UButton icon="material-symbols:home-repair-service" label="Manage Services" to="/dashboard/admin/services" color="neutral" variant="subtle" />
              <UButton icon="material-symbols:group" label="Manage Users" to="/dashboard/admin/users" color="neutral" variant="subtle" />
              <UButton icon="material-symbols:key" label="Manage Licenses" to="/dashboard/admin/licenses" color="neutral" variant="subtle" />
              <UButton icon="material-symbols:support-agent" label="Support Overview" to="/dashboard/admin/support" color="neutral" variant="subtle" />
              <UButton icon="material-symbols:assignment" label="Logs" to="/dashboard/admin/logs" color="neutral" variant="subtle" />
            </div>
          </template>
        </USlideover>
      </div>
    </UDashboardToolbar>

    <UMain>
      <UPageBody>
        <slot />
      </UPageBody>
    </UMain>

    <UFooter>
      <AppFooter />
    </UFooter>
  </div>
</template>

<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui'
  import AppFooter from '~/components/ui/AppFooter.vue'
  import AppHeader from '~/components/ui/AppHeader.vue'

  definePageMeta({
    layout: 'dashboard',
  })

  const items: NavigationMenuItem[][] = [
    [
      {
        label: 'Overview',
        icon: 'material-symbols:dashboard',
        to: '/dashboard',
      },
      {
        label: 'Licenses',
        icon: 'material-symbols:key-outline',
        to: '/dashboard/licenses',
      },
      {
        label: 'Account History',
        icon: 'material-symbols:history-2',
        to: '/dashboard/history',
      },
    ],
    [
      {
        label: 'Ticket Center',
        icon: 'material-symbols:call',
        to: '/',
      },
      {
        label: 'Account Settings',
        icon: 'material-symbols:account-box',
        to: '/dashboard/settings',
      },
    ],
  ]
</script>

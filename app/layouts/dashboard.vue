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
          <UButton icon="eos-icons:admin" color="warning" size="md" variant="soft" />
          <template #body>
            <div class="grid grid-cols-1 gap-2 p-4">
              <UButton icon="material-symbols:dashboard" label="Admin Overview" to="/dashboard/admin" color="neutral" variant="subtle" block />
              <UButton icon="material-symbols:inventory-2" label="Manage Products" to="/dashboard/admin/products" color="neutral" variant="subtle" block />
              <UButton icon="material-symbols:build-circle" label="Manage Services" to="/dashboard/admin/services" color="neutral" variant="subtle" block />
              <UButton icon="material-symbols:shopping-cart" label="Order Queue" to="/dashboard/admin/orders" color="neutral" variant="subtle" block />
              <UButton icon="material-symbols:group" label="Manage Users" to="/dashboard/admin/users" color="neutral" variant="subtle" block />
              <UButton icon="material-symbols:key" label="Manage Licenses" to="/dashboard/admin/licenses" color="neutral" variant="subtle" block />
              <UButton icon="material-symbols:headset-mic" label="Support Overview" to="/dashboard/admin/support" color="neutral" variant="subtle" block />
              <UButton icon="material-symbols:campaign" label="Announcements" to="/dashboard/admin/announcements" color="neutral" variant="subtle" block />
              <UButton icon="material-symbols:outgoing-mail" label="Email Campaigns" to="/dashboard/admin/email-campaigns" color="neutral" variant="subtle" block />
              <UButton icon="material-symbols:assignment" label="Logs" to="/dashboard/admin/logs" color="neutral" variant="subtle" block />
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

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui'
  import AppFooter from '~/components/ui/AppFooter.vue'
  import AppHeader from '~/components/ui/AppHeader.vue'

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
        label: 'Account Activity',
        icon: 'material-symbols:history-2',
        to: '/dashboard/activity',
      },
    ],
    [
      {
        label: 'Account Settings',
        icon: 'material-symbols:account-box',
        to: '/dashboard/settings',
      },
    ],
  ]
</script>

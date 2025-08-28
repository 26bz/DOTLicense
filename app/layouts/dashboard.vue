<template>
  <div>
    <AppHeader />
    <UDashboardToolbar>
      <UNavigationMenu :items="items" highlight class="flex-1 max-w-7xl mx-auto" />
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
  import type { NavigationMenuItem } from '@nuxt/ui';
  import AppFooter from '~/components/ui/AppFooter.vue';
  import AppHeader from '~/components/ui/AppHeader.vue';

  definePageMeta({
    layout: 'dashboard',
  });

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
  ];
</script>

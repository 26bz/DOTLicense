<script setup lang="ts">
  import type { TabsItem } from '@nuxt/ui';
  const { user } = useUserSession();
  definePageMeta({
    middleware: ['auth'],
  });
  const items = [
    {
      label: 'Overview',
      icon: 'i-lucide-user',
      slot: 'account' as const,
    },
    {
      label: 'Licenses',
      icon: 'i-lucide-lock',
      slot: 'password' as const,
    },
    {
      label: 'History',
      icon: 'i-lucide-lock',
      slot: 'password' as const,
    },
    {
      label: 'Account Settings',
      icon: 'i-lucide-lock',
      slot: 'password' as const,
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
      <template #account="{ item }">
        <h1 class="text-xl font-bold flex-1">Welcome Back, {{ user?.name }}</h1>
        <p>{{ user?.email }}</p>
        <UCard class="mt-3">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <UCard v-for="stats in userStats" :key="stats.title">
              <UIcon :name="stats.icon" class="w-6 h-auto" />
              <h1>{{ stats.title }}</h1>
            </UCard>
          </div>
        </UCard>
      </template>

      <template #password="{ item }">
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

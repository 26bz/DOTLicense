<template>
  <UFooterColumns :columns="columns">
    <template #right>
      <UFormField name="email" label="Subscribe to our newsletter" size="lg">
        <UInput type="email" class="w-full">
          <template #trailing>
            <UButton type="submit" size="xs" color="neutral" label="Subscribe" />
          </template>
        </UInput>
      </UFormField>
    </template>
  </UFooterColumns>
</template>

<script setup lang="ts">
  import type { FooterColumn } from '@nuxt/ui';

  const columns: FooterColumn[] = [
    {
      label: 'DOTLicense',
      children: [
        {
          label: 'Products',
          to: '/products',
        },
        {
          label: 'Services',
          to: '/services',
        },
        {
          label: 'Dashboard',
          to: '/dashboard',
        },
      ],
    },
    {
      label: 'Important',
      children: [
        {
          label: 'Validate License',
          to: 'https://content.nuxt.com/',
        },
      ],
    },
  ];
</script>

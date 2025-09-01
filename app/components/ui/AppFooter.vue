<template>
  <UFooterColumns :columns="columns" class="max-w-7xl mx-auto mb-8">
    <template #right>
      <UFormField name="email" label="Subscribe to our newsletter" size="lg">
        <UInput type="email" class="w-full">
          <template #trailing>
            <UButton type="submit" size="xs" color="neutral" label="Subscribe" />
          </template>
        </UInput>
      </UFormField>
      <div class="mt-4">
        <NuxtLink to="https://github.com/26bz/DOTLicense" target="_blank"><UIcon name="i-lucide-github" size="20" />Source Code <span class="text-xs">(MIT)</span></NuxtLink>
        <p class="text-xs py-2">
          Made by
          <ULink to="https://26bz.online/" target="_blank">26bz</ULink>
        </p>
      </div>
    </template>
  </UFooterColumns>
</template>

<script setup lang="ts">
  import type { FooterColumn } from '@nuxt/ui'

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
      ],
    },
    {
      label: 'Legal',
      children: [
        {
          label: 'Terms of Service',
          to: '/terms-of-service',
        },
        {
          label: 'Privacy Policy',
          to: '/privacy-policy',
        },
        {
          label: 'Refund Policy',
          to: '/refund-policy',
        },
      ],
    },
  ]
</script>

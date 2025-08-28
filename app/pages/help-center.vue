<script setup lang="ts">
  import type { AccordionItem } from '@nuxt/ui'

  const items = ref<AccordionItem[]>([
    {
      label: 'Icons',
      icon: 'i-lucide-smile',
      content: 'You have nothing to do, @nuxt/icon will handle it automatically.',
      trailingIcon: 'i-lucide-plus',
    },
    {
      label: 'Colors',
      icon: 'i-lucide-swatch-book',
      content: 'Choose a primary and a neutral color from your Tailwind CSS theme.',
    },
    {
      label: 'Components',
      icon: 'i-lucide-box',
      content: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.',
    },
  ])

  const features = ref([
    {
      title: 'Ticket Center',
      description: 'Our recommended way of getting in contact with us. If you are not a customer, feel free to register and/or contact us via Email.',
      icon: 'i-lucide-ticket',
      to: '/docs/getting-started/icons',
    },
    {
      title: 'Email',
      description: 'Typically the best route for general questions, propsoals, abuse reports, etc.',
      icon: 'i-lucide-mail',
      to: '/docs/getting-started/fonts',
    },
    {
      title: 'Discord',
      description: 'While we dont offer official support via Discord, you can possibly receive general help from our team or the community.',
      icon: 'i-lucide-sun-moon',
      to: '/docs/getting-started/color-mode',
    },
  ])
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <UPageSection title="Help Center" description="Discover our knowledgebase, and official methods of contact." :features="features" />

    <UPageSection title="Frequently Asked Questions">
      <UAccordion trailing-icon="i-lucide-arrow-down" :items="items" />
    </UPageSection>
  </div>
</template>

<template>
  <div class="max-w-5xl mx-auto">
    <UPageSection title="Help Center" description="Discover our official methods of contact & support." :features="features" />
  </div>
</template>

<script setup lang="ts">
  const features = ref([
    {
      title: 'Ticket Center',
      description: 'Our recommended way to get in contact with us. If you are not a customer, feel free to register or contact us via email.',
      icon: 'i-lucide-ticket',
      to: '/dashboard/support',
    },
    {
      title: 'Email',
      description: 'Typically the best route for general questions, proposals, abuse reports, etc.',
      icon: 'i-lucide-mail',
      to: 'mailto:example@example.com',
    },
    {
      title: 'Discord',
      description: "While we don't offer official support via Discord, you may receive general help from our team or the community.",
      icon: 'i-lucide-sun-moon',
      to: 'https://discord.gg/example',
    },
  ])
</script>

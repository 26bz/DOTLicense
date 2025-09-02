<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <UPageHeader title="Admin Overview" />
    <UCard>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <UCard v-for="stats in overviewStats" :key="stats.title" class="flex flex-col items-center p-4 text-center">
          <UIcon :name="stats.icon" class="w-6 h-auto text-primary mb-2" />
          <p class="text-2xl font-bold">{{ stats.value }}</p>
          <p class="text-sm text-gray-600">{{ stats.title }}</p>
        </UCard>
      </div>
    </UCard>
    <UCard>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UCard>
          <h2 class="font-semibold text-lg mb-3">Users Overview</h2>
          <VChart :option="userChart" style="height: 300px; width: 100%" />
        </UCard>

        <UCard>
          <div class="flex justify-between items-center mb-3">
            <h2 class="font-semibold text-lg">Products Overview</h2>
            <USelect v-model="productFilter" :items="productOptions" size="sm" rounded />
          </div>
          <VChart :option="productChart" style="height: 300px; width: 100%" />
        </UCard>

        <UCard>
          <div class="flex justify-between items-center mb-3">
            <h2 class="font-semibold text-lg">Licenses Overview</h2>
            <USelect v-model="licenseFilter" :items="licenseOptions" size="sm" rounded />
          </div>
          <VChart :option="licensesChart" style="height: 300px; width: 100%" />
        </UCard>

        <UCard>
          <h2 class="font-semibold text-lg mb-3">Revenue Overview</h2>
          <VChart :option="revenueChart" style="height: 300px; width: 100%" />
        </UCard>

        <UCard>
          <h2 class="font-semibold text-lg mb-3">Subscribed Users</h2>
          <VChart :option="subscribedChart" style="height: 300px; width: 100%" />
        </UCard>

        <UCard>
          <h2 class="font-semibold text-lg mb-3">Services Overview</h2>
          <VChart :option="servicesChart" style="height: 300px; width: 100%" />
        </UCard>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  import type { Ref } from 'vue'

  definePageMeta({ layout: 'dashboard' })

  const productFilter = ref<'purchases' | 'creation'>('purchases')
  const productOptions = [
    { label: 'Purchases', value: 'purchases' },
    { label: 'Creation', value: 'creation' },
  ]

  const licenseFilter = ref<'active' | 'expired'>('active')
  const licenseOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Expired', value: 'expired' },
  ]

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const overviewStats = computed(() => [
    { title: 'Users', value: 1200, icon: 'i-lucide-users' },
    { title: 'Products', value: 350, icon: 'i-lucide-box' },
    { title: 'Licenses', value: 220, icon: 'i-lucide-key' },
    { title: 'Revenue', value: '$45,000', icon: 'i-lucide-dollar-sign' },
  ])

  const userChart: Ref<ECOption> = ref({
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: [{ type: 'line', name: 'Users', data: [12, 19, 25, 32, 41, 38, 45, 50, 55, 60, 65, 70], smooth: true }],
    tooltip: { trigger: 'axis' },
  })

  const subscribedChart: Ref<ECOption> = ref({
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: [{ type: 'line', name: 'Subscribed Users', data: [5, 10, 15, 18, 22, 25, 30, 32, 35, 38, 40, 45], smooth: true }],
    tooltip: { trigger: 'axis' },
  })

  const productChart: Ref<ECOption> = ref({
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: [{ type: 'line', name: 'Products', data: [], smooth: true }],
    tooltip: { trigger: 'axis' },
  })

  const licensesChart: Ref<ECOption> = ref({
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: [{ type: 'line', name: 'Licenses', data: [], smooth: true }],
    tooltip: { trigger: 'axis' },
  })

  const servicesChart: Ref<ECOption> = ref({
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: [{ type: 'line', name: 'Services', data: [5, 8, 12, 15, 18, 20, 25, 30, 32, 35, 38, 40], smooth: true }],
    tooltip: { trigger: 'axis' },
  })

  const revenueChart: Ref<ECOption> = ref({
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: [{ type: 'line', name: 'Revenue ($)', data: [1200, 1500, 1800, 2000, 2200, 2500, 2700, 3000, 3200, 3500, 3700, 4000], smooth: true }],
    tooltip: { trigger: 'axis' },
  })

  watch(
    productFilter,
    filter => {
      productChart.value!.series[0].data = filter === 'purchases' ? [3, 5, 8, 10, 12, 15, 18, 20, 25, 28, 30, 35] : [1, 2, 4, 5, 7, 9, 12, 15, 18, 20, 22, 25]
    },
    { immediate: true }
  )

  watch(
    licenseFilter,
    filter => {
      licensesChart.value!.series[0].data = filter === 'active' ? [10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 38] : [2, 3, 5, 6, 7, 8, 10, 12, 14, 15, 16, 18]
    },
    { immediate: true }
  )
</script>

<style scoped>
  .charts-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (min-width: 1024px) {
    .charts-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .chart-card h2 {
    margin-bottom: 0.5rem;
  }
</style>

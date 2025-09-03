<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <UPageHeader title="Store Analytics" description="Comprehensive business intelligence and financial insights" />
      <div class="flex items-center gap-3">
        <USelect v-model="selectedPeriod" :options="periodOptions" size="sm" />
        <USelect v-model="selectedCategory" :options="categoryOptions" size="sm" />
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Revenue</p>
            <p class="text-2xl font-bold text-green-600">${{ formatNumber(analytics?.overview.totalRevenue) }}</p>
            <p class="text-xs text-gray-500">{{ analytics?.overview.totalOrders }} orders</p>
          </div>
          <UIcon name="i-lucide-dollar-sign" class="w-8 h-8 text-green-500" />
        </div>
      </UCard>

      <UCard class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Avg Order Value</p>
            <p class="text-2xl font-bold text-blue-600">${{ formatNumber(analytics?.overview.avgOrderValue) }}</p>
            <p class="text-xs text-gray-500">per transaction</p>
          </div>
          <UIcon name="i-lucide-shopping-cart" class="w-8 h-8 text-blue-500" />
        </div>
      </UCard>

      <UCard class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Active Subscriptions</p>
            <p class="text-2xl font-bold text-purple-600">{{ analytics?.overview.activeSubscriptions }}</p>
            <p class="text-xs text-gray-500">recurring revenue</p>
          </div>
          <UIcon name="i-lucide-repeat" class="w-8 h-8 text-purple-500" />
        </div>
      </UCard>

      <UCard class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Refund Rate</p>
            <p class="text-2xl font-bold" :class="analytics?.overview.refundRate > 5 ? 'text-red-600' : 'text-green-600'">{{ analytics?.overview.refundRate }}%</p>
            <p class="text-xs text-gray-500">${{ formatNumber(analytics?.overview.refundedAmount) }} refunded</p>
          </div>
          <UIcon name="i-lucide-undo-2" class="w-8 h-8" :class="analytics?.overview.refundRate > 5 ? 'text-red-500' : 'text-green-500'" />
        </div>
      </UCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <UCard class="lg:col-span-2">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Revenue & Sales Performance</h3>
            <div class="flex items-center gap-2">
              <UBadge color="success" variant="soft">{{ selectedPeriod.toUpperCase() }}</UBadge>
              <UBadge color="primary" variant="soft">Orders</UBadge>
              <UBadge color="success" variant="soft">Revenue</UBadge>
            </div>
          </div>
        </template>
        <VChart :option="salesPerformanceChart" style="height: 320px; width: 100%" />
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Top Products</h3>
        </template>
        <VChart :option="topProductsChart" style="height: 320px; width: 100%" />
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Growth Metrics</h3>
            <USelect v-model="growthMetric" :options="growthOptions" />
          </div>
        </template>
        <VChart :option="combinedGrowthChart" style="height: 280px; width: 100%" />
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Performance Metrics</h3>
            <USelect v-model="performanceMetric" :options="performanceOptions" />
          </div>
        </template>
        <VChart :option="combinedPerformanceChart" style="height: 280px; width: 100%" />
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Revenue Distribution</h3>
        </template>
        <VChart :option="categoryRevenueChart" style="height: 280px; width: 100%" />
      </UCard>
    </div>

    <UCard class="mt-6">
      <template #header>
        <h3 class="text-lg font-semibold">Top Products Performance</h3>
      </template>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left font-medium text-gray-900">Product</th>
              <th class="px-4 py-3 text-left font-medium text-gray-900">Category</th>
              <th class="px-4 py-3 text-right font-medium text-gray-900">Sales</th>
              <th class="px-4 py-3 text-right font-medium text-gray-900">Revenue</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="product in analytics?.charts.topProducts.slice(0, 8)" :key="product.name" class="hover:bg-gray-50">
              <td class="px-4 py-3 font-medium text-gray-900">{{ product.name }}</td>
              <td class="px-4 py-3 text-gray-600">{{ product.category }}</td>
              <td class="px-4 py-3 text-right text-gray-900">{{ product.sales }}</td>
              <td class="px-4 py-3 text-right font-medium text-green-600">${{ formatNumber(product.revenue) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, computed } from 'vue'

  definePageMeta({ layout: 'dashboard' })

  const selectedPeriod = ref('30d')
  const selectedCategory = ref('')

  const periodOptions = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
    { label: 'Last year', value: '1y' },
  ]

  const categoryOptions = ref([{ label: 'All Categories', value: '' }])

  const { data: analytics, refresh } = await useFetch('/api/admin/analytics', {
    query: computed(() => ({
      period: selectedPeriod.value,
      category: selectedCategory.value || undefined,
    })),
    default: () => ({
      overview: {
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        refundRate: 0,
        activeSubscriptions: 0,
        refundedAmount: 0,
      },
      charts: {
        monthlyRevenue: [],
        topProducts: [],
        categoryRevenue: [],
        userGrowth: [],
      },
    }),
  })

  const { data: categories } = await useFetch('/api/categories')
  if (categories.value) {
    categoryOptions.value = [{ label: 'All Categories', value: '' }, ...categories.value.map((cat: any) => ({ label: cat.name, value: cat.id }))]
  }

  watch([selectedPeriod, selectedCategory], () => {
    refresh()
  })

  function formatNumber(num?: number) {
    if (!num) return '0'
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num)
  }

  const revenueChart = computed(() => ({
    xAxis: {
      type: 'category',
      data: analytics.value?.charts.monthlyRevenue.map((item: any) => item.month) || [],
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '${value}',
      },
    },
    series: [
      {
        type: 'line',
        name: 'Revenue',
        data: analytics.value?.charts.monthlyRevenue.map((item: any) => item.revenue) || [],
        smooth: true,
        itemStyle: { color: '#10b981' },
        areaStyle: { color: 'rgba(16, 185, 129, 0.1)' },
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0]
        return `${data.name}<br/>Revenue: $${formatNumber(data.value)}`
      },
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  }))

  const topProductsChart = computed(() => ({
    xAxis: {
      type: 'value',
    },
    yAxis: {
      type: 'category',
      data: analytics.value?.charts.topProducts.slice(0, 5).map((item: any) => item.name) || [],
    },
    series: [
      {
        type: 'bar',
        name: 'Revenue',
        data: analytics.value?.charts.topProducts.slice(0, 5).map((item: any) => item.revenue) || [],
        itemStyle: { color: '#3b82f6' },
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0]
        return `${data.name}<br/>Revenue: $${formatNumber(data.value)}`
      },
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  }))

  const categoryRevenueChart = computed(() => ({
    series: [
      {
        type: 'pie',
        name: 'Revenue by Category',
        data: analytics.value?.charts.categoryRevenue || [],
        radius: ['40%', '70%'],
        label: {
          formatter: '{b}: ${c}',
        },
      },
    ],
    tooltip: {
      formatter: (params: any) => {
        return `${params.name}<br/>Revenue: $${formatNumber(params.value)}`
      },
    },
  }))

  const userGrowthChart = computed(() => ({
    xAxis: {
      type: 'category',
      data: analytics.value?.charts.userGrowth.map((item: any) => item.date) || [],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        type: 'line',
        name: 'New Users',
        data: analytics.value?.charts.userGrowth.map((item: any) => item.users) || [],
        smooth: true,
        itemStyle: { color: '#8b5cf6' },
        areaStyle: { color: 'rgba(139, 92, 246, 0.1)' },
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0]
        return `${data.name}<br/>New Users: ${data.value}`
      },
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  }))

  const salesPerformanceChart = computed(() => ({
    xAxis: {
      type: 'category',
      data: analytics.value?.charts.monthlyRevenue.map((item: any) => item.month) || [],
    },
    yAxis: [
      {
        type: 'value',
        name: 'Orders',
        position: 'left',
      },
      {
        type: 'value',
        name: 'Revenue ($)',
        position: 'right',
        axisLabel: {
          formatter: '${value}',
        },
      },
    ],
    series: [
      {
        type: 'bar',
        name: 'Orders',
        data: analytics.value?.charts.monthlyRevenue.map((item: any) => item.orders) || [],
        itemStyle: { color: '#3b82f6' },
      },
      {
        type: 'line',
        name: 'Revenue',
        yAxisIndex: 1,
        data: analytics.value?.charts.monthlyRevenue.map((item: any) => item.revenue) || [],
        smooth: true,
        itemStyle: { color: '#10b981' },
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        let result = `${params[0].name}<br/>`
        params.forEach((param: any) => {
          const value = param.seriesName === 'Revenue' ? `$${formatNumber(param.value)}` : param.value
          result += `${param.seriesName}: ${value}<br/>`
        })
        return result
      },
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  }))

  const { data: adminStats } = await useFetch('/api/admin/stats')

  const growthMetric = ref<'users' | 'newsletter'>('users')
  const growthOptions = [
    { label: 'User Growth', value: 'users' },
    { label: 'Newsletter Subscribers', value: 'newsletter' },
  ]

  const performanceMetric = ref<'purchases' | 'downloads' | 'licenses'>('purchases')
  const performanceOptions = [
    { label: 'Purchases', value: 'purchases' },
    { label: 'Downloads', value: 'downloads' },
    { label: 'Licenses', value: 'licenses' },
  ]

  const combinedGrowthChart = computed(() => ({
    xAxis: { type: 'category', data: adminStats.value?.charts.months ?? [] },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'line',
        name: growthMetric.value === 'users' ? 'New Users' : 'Newsletter Subscribers',
        data: growthMetric.value === 'users' ? adminStats.value?.charts.users ?? [] : adminStats.value?.charts.newsletter ?? [],
        smooth: true,
        itemStyle: { color: growthMetric.value === 'users' ? '#3b82f6' : '#8b5cf6' },
        areaStyle: {
          color: growthMetric.value === 'users' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)',
        },
      },
    ],
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  }))

  const combinedPerformanceChart = computed(() => {
    let data: number[], name: string, color: string

    switch (performanceMetric.value) {
      case 'purchases':
        data = adminStats.value?.charts.purchases ?? []
        name = 'Purchases'
        color = '#10b981'
        break
      case 'downloads':
        data = adminStats.value?.charts.downloads ?? []
        name = 'Downloads'
        color = '#f59e0b'
        break
      case 'licenses':
        data = adminStats.value?.charts.licenses ?? []
        name = 'Licenses'
        color = '#ef4444'
        break
      default:
        data = []
        name = 'Performance'
        color = '#6b7280'
    }

    return {
      xAxis: { type: 'category', data: adminStats.value?.charts.months ?? [] },
      yAxis: { type: 'value' },
      series: [
        {
          type: 'line',
          name,
          data,
          smooth: true,
          itemStyle: { color },
          areaStyle: { color: `${color}20` },
        },
      ],
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    }
  })
</script>

<style scoped>
  .charts-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
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

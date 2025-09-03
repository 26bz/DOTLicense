<template>
  <UContainer>
    <UPageHeader title="Manage Users" description="View and manage registered users and their roles" />

    <UCard class="mt-6">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Users</h3>
          <div class="flex items-center gap-3">
            <UInput v-model="searchQuery" placeholder="Search users..." icon="i-lucide-search" size="sm" @input="debouncedSearch" />
            <USelect v-model="selectedRole" :options="roleOptions" placeholder="All Roles" size="sm" @change="fetchUsers" />
          </div>
        </div>
      </template>

      <div v-if="pending" class="flex justify-center py-8">
        <UIcon name="i-lucide-loader-2" class="w-6 h-6 animate-spin" />
      </div>

      <div v-else-if="error" class="text-center py-8">
        <UIcon name="i-lucide-alert-circle" class="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p class="text-red-600">Failed to load users</p>
      </div>

      <div v-else-if="data?.users?.length" class="space-y-3">
        <UCard v-for="user in data.users" :key="user.id" class="hover:bg-gray-50 transition-colors duration-150">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-primary-700"> {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }} </span>
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <h4 class="text-sm font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</h4>
                  <UBadge :color="getRoleColor(user.role) as any" variant="soft" size="xs">
                    {{ user.role }}
                  </UBadge>
                  <UBadge v-if="!user.emailVerified" color="warning" variant="soft" size="xs"> Unverified </UBadge>
                  <UBadge v-if="!user.isPermitted" color="error" variant="soft" size="xs"> Suspended </UBadge>
                </div>
                <div class="flex items-center gap-4 mt-1">
                  <p class="text-sm text-gray-600">{{ user.email }}</p>
                  <p class="text-sm text-gray-500">@{{ user.userName }}</p>
                  <p v-if="user.companyName" class="text-sm text-gray-500">{{ user.companyName }}</p>
                </div>
                <div class="flex items-center gap-4 mt-1 text-xs text-gray-500">
                  <span>{{ user._count.purchases }} purchases</span>
                  <span>{{ user._count.licenses }} licenses</span>
                  <span>Joined <NuxtTime :datetime="user.createdAt" month="short" day="numeric" year="numeric" /></span>
                  <span v-if="user.lastLoginAt">Last login <NuxtTime :datetime="user.lastLoginAt" relative /></span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <UButton icon="i-lucide-eye" size="sm" variant="ghost" @click="viewUser(user.id)"> View </UButton>
              <UDropdown :items="getUserActions(user)">
                <UButton icon="i-lucide-more-horizontal" size="sm" variant="ghost" />
              </UDropdown>
            </div>
          </div>
        </UCard>

        <div v-if="data.pagination.totalPages > 1" class="flex justify-center mt-6">
          <UPagination v-model="currentPage" :page-count="data.pagination.totalPages" :total="data.pagination.totalCount" @update:model-value="fetchUsers" />
        </div>
      </div>

      <div v-else class="text-center py-8">
        <UIcon name="i-lucide-users" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p class="text-gray-500">No users found</p>
      </div>
    </UCard>

    <UModal v-model:open="isUserDetailModalOpen" :title="`User Details - ${selectedUser?.firstName} ${selectedUser?.lastName}`">
      <template #body>
        <div v-if="selectedUser" class="space-y-6">
          <div class="flex items-start gap-4">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <span class="text-lg font-medium text-primary-700"> {{ selectedUser.firstName.charAt(0) }}{{ selectedUser.lastName.charAt(0) }} </span>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold">{{ selectedUser.firstName }} {{ selectedUser.lastName }}</h3>
              <p class="text-gray-600">{{ selectedUser.email }}</p>
              <p class="text-gray-500">@{{ selectedUser.userName }}</p>
              <div class="flex items-center gap-2 mt-2">
                <UBadge :color="getRoleColor(selectedUser.role) as any" variant="soft">
                  {{ selectedUser.role }}
                </UBadge>
                <UBadge v-if="!selectedUser.emailVerified" color="warning" variant="soft"> Unverified Email </UBadge>
                <UBadge v-if="!selectedUser.isPermitted" color="error" variant="soft"> Suspended </UBadge>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UCard>
              <div class="text-center">
                <div class="text-2xl font-bold text-primary-600">{{ selectedUser._count.purchases }}</div>
                <div class="text-sm text-gray-500">Purchases</div>
              </div>
            </UCard>
            <UCard>
              <div class="text-center">
                <div class="text-2xl font-bold text-primary-600">{{ selectedUser._count.licenses }}</div>
                <div class="text-sm text-gray-500">Licenses</div>
              </div>
            </UCard>
          </div>

          <div class="space-y-3">
            <div v-if="selectedUser.companyName">
              <label class="text-sm font-medium text-gray-700">Company</label>
              <p class="text-gray-900">{{ selectedUser.companyName }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Joined</label>
              <p class="text-gray-900"><NuxtTime :datetime="selectedUser.createdAt" month="short" day="numeric" year="numeric" /></p>
            </div>
            <div v-if="selectedUser.lastLoginAt">
              <label class="text-sm font-medium text-gray-700">Last Login</label>
              <p class="text-gray-900"><NuxtTime :datetime="selectedUser.lastLoginAt" relative /></p>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between items-center">
          <UButton color="neutral" variant="outline" icon="i-lucide-activity" :loading="isLoadingActivity" @click="viewUserActivity(selectedUser.id)"> View Activity </UButton>
          <div class="flex gap-3">
            <UButton :color="selectedUser?.isPermitted ? 'error' : 'success'" :loading="isUpdatingUserStatus" @click="toggleUserStatus(selectedUser.id, selectedUser.isPermitted)">
              {{ selectedUser?.isPermitted ? 'Suspend User' : 'Reactivate User' }}
            </UButton>
            <UButton color="neutral" variant="outline" @click="isUserDetailModalOpen = false"> Close </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <UModal v-model:open="isUserActivityModalOpen" :title="`Activity - ${selectedUser?.firstName} ${selectedUser?.lastName}`" size="4xl">
      <template #body>
        <div v-if="isLoadingActivity" class="flex justify-center py-8">
          <UIcon name="i-lucide-loader-2" class="w-6 h-6 animate-spin" />
        </div>

        <div v-else-if="userActivityData" class="space-y-4">
          <div class="grid grid-cols-3 gap-4 mb-6">
            <UCard>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{ userActivityData.stats?.totalActivities || 0 }}</div>
                <div class="text-sm text-gray-500">Total Activities</div>
              </div>
            </UCard>
            <UCard>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">{{ userActivityData.stats?.purchases || 0 }}</div>
                <div class="text-sm text-gray-500">Purchases</div>
              </div>
            </UCard>
            <UCard>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-600">{{ userActivityData.stats?.logins || 0 }}</div>
                <div class="text-sm text-gray-500">Logins</div>
              </div>
            </UCard>
          </div>

          <div class="space-y-3 max-h-96 overflow-y-auto">
            <div v-for="activity in userActivityData.activities" :key="activity.id" class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div class="flex-shrink-0 mt-1">
                <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="getActivityIconClass(activity.type)">
                  <UIcon :name="getActivityIcon(activity.type)" class="w-4 h-4" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-gray-900">{{ activity.type }}</p>
                  <span class="text-xs text-gray-500"><NuxtTime :datetime="activity.createdAt" relative /></span>
                </div>
                <p v-if="activity.description" class="text-sm text-gray-600 mt-1">{{ activity.description }}</p>
                <div class="flex items-center gap-4 mt-1 text-xs text-gray-500">
                  <span v-if="activity.ipAddress">IP: {{ activity.ipAddress }}</span>
                  <span v-if="activity.userAgent">{{ getBrowserFromUserAgent(activity.userAgent) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="userActivityData.hasMore" class="text-center pt-4">
            <UButton variant="outline" @click="loadMoreActivity"> Load More Activities </UButton>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <UButton color="neutral" variant="outline" @click="isUserActivityModalOpen = false"> Close </UButton>
        </div>
      </template>
    </UModal>
  </UContainer>
</template>

<script setup lang="ts">
  function debounce(func: Function, delay: number) {
    let timeoutId: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(null, args), delay)
    }
  }

  definePageMeta({ layout: 'dashboard' })

  const searchQuery = ref('')
  const selectedRole = ref('')
  const currentPage = ref(1)

  const roleOptions = [
    { label: 'All Roles', value: '' },
    { label: 'User', value: 'USER' },
    { label: 'Team', value: 'TEAM' },
    { label: 'Admin', value: 'ADMIN' },
  ]

  const { data, pending, error, refresh } = await useFetch('/api/admin/users', {
    query: computed(() => ({
      page: currentPage.value,
      limit: 20,
      search: searchQuery.value || undefined,
      role: selectedRole.value || undefined,
    })),
    default: () => ({ users: [], pagination: { totalPages: 1, totalCount: 0 } }),
  })

  const debouncedSearch = debounce(() => {
    currentPage.value = 1
    refresh()
  }, 300)

  function fetchUsers() {
    currentPage.value = 1
    refresh()
  }

  function getRoleColor(role: string) {
    const colors = {
      ADMIN: 'error',
      TEAM: 'primary',
      USER: 'neutral',
    }
    return colors[role as keyof typeof colors] || 'neutral'
  }

  const isUserDetailModalOpen = ref(false)
  const selectedUser = ref<any>(null)
  const isUpdatingUserStatus = ref(false)

  const isUserActivityModalOpen = ref(false)
  const userActivityData = ref<any>(null)
  const isLoadingActivity = ref(false)

  function viewUser(userId: number) {
    const user = data.value?.users.find(u => u.id === userId)
    if (user) {
      selectedUser.value = user
      isUserDetailModalOpen.value = true
    }
  }

  function getUserActions(user: any) {
    return [
      [
        {
          label: 'View Details',
          icon: 'i-lucide-eye',
          click: () => viewUser(user.id),
        },
      ],
      [
        {
          label: user.isPermitted ? 'Suspend User' : 'Reactivate User',
          icon: user.isPermitted ? 'i-lucide-user-x' : 'i-lucide-user-check',
          click: () => toggleUserStatus(user.id, user.isPermitted),
        },
      ],
      [
        {
          label: 'View Activity',
          icon: 'i-lucide-activity',
          click: () => viewUserActivity(user.id),
        },
      ],
    ]
  }

  async function toggleUserStatus(userId: number, currentStatus: boolean) {
    try {
      isUpdatingUserStatus.value = true

      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPermitted: !currentStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update user status')
      }

      await refresh()

      const action = currentStatus ? 'suspended' : 'reactivated'
      console.log(`User ${action} successfully`)
    } catch (error: any) {
      console.error('Error updating user status:', error)
    } finally {
      isUpdatingUserStatus.value = false
    }
  }

  async function viewUserActivity(userId: number) {
    try {
      isLoadingActivity.value = true
      const user = data.value?.users.find(u => u.id === userId)

      if (user) {
        selectedUser.value = user

        const activityResponse = await $fetch(`/api/admin/users/${userId}/activity`)
        userActivityData.value = activityResponse

        isUserActivityModalOpen.value = true
      }
    } catch (error) {
      console.error('Error loading user activity:', error)
      navigateTo(`/dashboard/activity?userId=${userId}`)
    } finally {
      isLoadingActivity.value = false
    }
  }

  function getActivityIcon(type: string) {
    const icons: Record<string, string> = {
      LOGIN: 'i-lucide-log-in',
      LOGOUT: 'i-lucide-log-out',
      REGISTRATION: 'i-lucide-user-plus',
      EMAIL_VERIFIED: 'i-lucide-mail-check',
      PASSWORD_CHANGED: 'i-lucide-shield',
      PASSWORD_RESET_REQUESTED: 'i-lucide-key-round',
      PROFILE_UPDATED: 'i-lucide-user-cog',
      NEWSLETTER_SUBSCRIBED: 'i-lucide-mail-plus',
      NEWSLETTER_UNSUBSCRIBED: 'i-lucide-mail-minus',
      PURCHASE_INITIATED: 'i-lucide-shopping-cart',
      PURCHASE_COMPLETED: 'i-lucide-check-circle',
      PURCHASE_FAILED: 'i-lucide-x-circle',
      PURCHASE_REFUNDED: 'i-lucide-undo',
      SUBSCRIPTION_CREATED: 'i-lucide-repeat',
      SUBSCRIPTION_CANCELED: 'i-lucide-x',
      SUBSCRIPTION_RENEWED: 'i-lucide-refresh-cw',
      PRODUCT_VIEWED: 'i-lucide-eye',
      PRODUCT_DOWNLOADED: 'i-lucide-download',
      PRODUCT_REVIEWED: 'i-lucide-star',
      PRODUCT_CREATED: 'i-lucide-plus-circle',
      PRODUCT_UPDATED: 'i-lucide-edit',
      PRODUCT_DELETED: 'i-lucide-trash-2',
      LICENSE_ACTIVATED: 'i-lucide-key',
      LICENSE_REVOKED: 'i-lucide-key-off',
      ACCOUNT_SUSPENDED: 'i-lucide-user-x',
      ACCOUNT_REACTIVATED: 'i-lucide-user-check',
    }
    return icons[type] || 'i-lucide-activity'
  }

  function getActivityIconClass(type: string) {
    const classes: Record<string, string> = {
      LOGIN: 'bg-green-100 text-green-600',
      LOGOUT: 'bg-gray-100 text-gray-600',
      REGISTRATION: 'bg-blue-100 text-blue-600',
      EMAIL_VERIFIED: 'bg-green-100 text-green-600',
      PASSWORD_CHANGED: 'bg-red-100 text-red-600',
      PASSWORD_RESET_REQUESTED: 'bg-yellow-100 text-yellow-600',
      PROFILE_UPDATED: 'bg-yellow-100 text-yellow-600',
      NEWSLETTER_SUBSCRIBED: 'bg-blue-100 text-blue-600',
      NEWSLETTER_UNSUBSCRIBED: 'bg-gray-100 text-gray-600',
      PURCHASE_INITIATED: 'bg-orange-100 text-orange-600',
      PURCHASE_COMPLETED: 'bg-green-100 text-green-600',
      PURCHASE_FAILED: 'bg-red-100 text-red-600',
      PURCHASE_REFUNDED: 'bg-yellow-100 text-yellow-600',
      SUBSCRIPTION_CREATED: 'bg-purple-100 text-purple-600',
      SUBSCRIPTION_CANCELED: 'bg-red-100 text-red-600',
      SUBSCRIPTION_RENEWED: 'bg-green-100 text-green-600',
      PRODUCT_VIEWED: 'bg-blue-100 text-blue-600',
      PRODUCT_DOWNLOADED: 'bg-green-100 text-green-600',
      PRODUCT_REVIEWED: 'bg-yellow-100 text-yellow-600',
      PRODUCT_CREATED: 'bg-blue-100 text-blue-600',
      PRODUCT_UPDATED: 'bg-orange-100 text-orange-600',
      PRODUCT_DELETED: 'bg-red-100 text-red-600',
      LICENSE_ACTIVATED: 'bg-purple-100 text-purple-600',
      LICENSE_REVOKED: 'bg-red-100 text-red-600',
      ACCOUNT_SUSPENDED: 'bg-red-100 text-red-600',
      ACCOUNT_REACTIVATED: 'bg-green-100 text-green-600',
    }
    return classes[type] || 'bg-gray-100 text-gray-600'
  }

  function getBrowserFromUserAgent(userAgent: string) {
    if (!userAgent) return 'Unknown'

    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    if (userAgent.includes('Opera')) return 'Opera'

    return 'Unknown Browser'
  }

  async function loadMoreActivity() {
    if (!selectedUser.value || !userActivityData.value) return

    try {
      const offset = userActivityData.value.activities.length
      const moreData = await $fetch(`/api/admin/users/${selectedUser.value.id}/activity?offset=${offset}`)

      if (moreData.activities) {
        userActivityData.value.activities.push(...moreData.activities)
        userActivityData.value.hasMore = moreData.hasMore
      }
    } catch (error) {
      console.error('Error loading more activities:', error)
    }
  }
</script>

<template>
  <UContainer class="py-6">
    <UForm :schema="updateProfileSchema" :state="profileState" class="flex flex-col gap-4 mt-6" @submit="updateProfile">
      <h1 class="text-lg font-semibold">Profile Settings</h1>
      <USeparator />

      <h2 class="text-md font-semibold">Account Information</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="Username" name="userName" required>
          <UInput v-model="profileState.userName" placeholder="Enter a username" required class="w-full" />
        </UFormField>
        <UFormField label="Email" name="email" required>
          <div>
            <UInput v-model="profileState.email" type="email" required class="w-full mb-1" />
            <span class="text-yellow-500">Email is not verified</span>
          </div>
        </UFormField>
        <UFormField label="Company Name" name="companyName">
          <UInput v-model="profileState.companyName" placeholder="Enter your company name" class="w-full" />
        </UFormField>
        <UFormField label="Job Title" name="jobTitle">
          <UInput v-model="profileState.jobTitle" placeholder="e.g. CTO, Product Manager" class="w-full" />
        </UFormField>
        <UFormField label="Company Website" name="companyWebsite">
          <UInput v-model="profileState.companyWebsite" placeholder="https://company.com" class="w-full" />
        </UFormField>
      </div>

      <USeparator class="my-4" />

      <h2 class="text-md font-semibold">Personal Information</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="First Name" name="firstName" required>
          <UInput v-model="profileState.firstName" required class="w-full" />
        </UFormField>
        <UFormField label="Last Name" name="lastName" required>
          <UInput v-model="profileState.lastName" required class="w-full" />
        </UFormField>
        <UFormField label="Phone Number" name="phone">
          <UInput v-model="profileState.phone" placeholder="+1 555 123 4567" class="w-full" />
        </UFormField>
        <UFormField label="Date of Birth" name="dateOfBirth" required>
          <UInput v-model="profileState.dateOfBirth" type="date" required class="w-full" />
        </UFormField>
      </div>

      <USeparator class="my-4" />

      <h2 class="text-md font-semibold">Address Information</h2>
      <UFormField label="Street Address" name="street">
        <UInput v-model="profileState.street" class="w-full" />
      </UFormField>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="City" name="city">
          <UInput v-model="profileState.city" class="w-full" />
        </UFormField>
        <UFormField label="State/Province" name="state">
          <UInput v-model="profileState.state" class="w-full" />
        </UFormField>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="ZIP/Postal Code" name="zipCode">
          <UInput v-model="profileState.zipCode" class="w-full" />
        </UFormField>
        <UFormField label="Country" name="country">
          <UInput v-model="profileState.country" class="w-full" />
        </UFormField>
      </div>

      <USeparator class="my-4" />

      <h2 class="text-md font-semibold">Preferences</h2>
      <UFormField label="Newsletter Subscription" name="newsletterSubscribed">
        <div class="flex items-center gap-3">
          <UCheckbox v-model="profileState.newsletterSubscribed" />
          <span class="text-sm text-gray-600">Subscribe to our newsletter for updates and news</span>
        </div>
      </UFormField>

      <UButton label="Update Profile" type="submit" variant="soft" class="self-end" />
    </UForm>

    <USeparator class="py-6" />

    <UForm :schema="changePasswordSchema" :state="passwordState" class="flex flex-col gap-4 mt-6" @submit="changePassword">
      <h1 class="text-lg font-semibold">Change Password</h1>
      <USeparator />
      <UFormField label="Current Password" name="currentPassword" required>
        <UInput v-model="passwordState.currentPassword" type="password" required class="w-full" />
      </UFormField>
      <UFormField label="New Password" name="newPassword" required>
        <UInput v-model="passwordState.newPassword" type="password" required class="w-full" />
      </UFormField>
      <UFormField label="Confirm Password" name="confirmPassword" required>
        <UInput v-model="passwordState.confirmPassword" type="password" required class="w-full" />
      </UFormField>
      <UButton label="Change password" type="submit" variant="soft" class="self-end" />
    </UForm>

    <USeparator class="py-6" />

    <h1 class="text-lg font-semibold">Danger Zone</h1>
    <UCard class="mt-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-medium text-red-900">Delete Account</h3>
          <p class="text-sm text-red-700 mt-1">Permanently delete your account and all associated data. This action cannot be undone.</p>
        </div>
        <UButton label="Contact Support" color="error" variant="soft" disabled size="lg" />
      </div>
    </UCard>
  </UContainer>
</template>
<script lang="ts" setup>
  import { updateProfileSchema, changePasswordSchema, type UpdateProfileInput, type ChangePasswordInput } from '#shared/schemas/user'
  import type { FormSubmitEvent } from '@nuxt/ui'

  definePageMeta({ layout: 'dashboard' })

  const { fetch: fetchSession } = useUserSession()
  const { data: userData } = await useFetch('/api/user/me')

  const profileState = reactive<Partial<UpdateProfileInput>>({
    firstName: userData.value?.user?.firstName,
    lastName: userData.value?.user?.lastName,
    userName: userData.value?.user?.userName,
    companyName: userData.value?.user?.companyName || '',
    jobTitle: userData.value?.user?.jobTitle || '',
    companyWebsite: userData.value?.user?.companyWebsite || '',
    email: userData.value?.user?.email,
    phone: userData.value?.user?.phone,
    dateOfBirth: userData.value?.user?.dateOfBirth ? new Date(userData.value.user.dateOfBirth).toISOString().split('T')[0] : ('' as string),
    street: userData.value?.user?.street || '',
    city: userData.value?.user?.city || '',
    state: userData.value?.user?.state || '',
    zipCode: userData.value?.user?.zipCode || '',
    country: userData.value?.user?.country || '',
    newsletterSubscribed: userData.value?.user?.newsletterSubscribed || false,
  })

  const passwordState = reactive<Partial<ChangePasswordInput>>({
    currentPassword: undefined,
    newPassword: undefined,
    confirmPassword: undefined,
  })

  const toast = useToast()

  async function updateProfile(event: FormSubmitEvent<UpdateProfileInput>) {
    try {
      await $fetch('/api/user/update-profile', {
        method: 'POST',
        body: {
          ...event.data,
          dateOfBirth: event.data.dateOfBirth ? new Date(event.data.dateOfBirth) : null,
        },
      })
      await fetchSession()
      toast.add({ title: 'Profile updated', color: 'success' })
    } catch (err) {
      console.error(err)
      toast.add({ title: 'Failed to update profile', color: 'error' })
    }
  }

  async function changePassword(event: FormSubmitEvent<ChangePasswordInput>) {
    try {
      await $fetch('/api/user/update-password', {
        method: 'POST',
        body: {
          currentPassword: event.data.currentPassword,
          newPassword: event.data.newPassword,
        },
      })
      toast.add({ title: 'Password changed', color: 'success' })
      Object.assign(passwordState, { currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      console.error(err)
      toast.add({ title: 'Failed to change password', color: 'error' })
    }
  }
</script>

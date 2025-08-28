<template>
  <UContainer class="py-6">
    <div class="text-lg font-semibold">
      <h1>Profile Settings</h1>
    </div>
    <UForm :schema="profileSchema" :state="profileState" @submit="updateProfile" class="flex flex-col gap-4 mt-6">
      <UFormField label="Name" name="name" required>
        <UInput v-model="profileState.name" required class="w-full" />
      </UFormField>
      <UFormField label="Username" name="userName" required>
        <UInput v-model="profileState.userName" placeholder="Enter a username" required class="w-full" />
      </UFormField>
      <UFormField label="Email" name="email" required>
        <UInput v-model="profileState.email" type="email" required class="w-full mb-1" />
        <span class="text-yellow-500">Email is not verified</span>
      </UFormField>
      <UFormField label="Date of Birth" name="dateOfBirth" required>
        <UPopover>
          <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
            <NuxtTime v-if="profileState.dateOfBirth" :datetime="profileState.dateOfBirth.toDate(getLocalTimeZone())" year="numeric" month="short" day="numeric" />
            <span v-else>Select a date</span>
          </UButton>

          <template #content>
            <UCalendar v-model="profileState.dateOfBirth" class="p-2" />
          </template>
        </UPopover>
      </UFormField>
      <USeparator class="my-4" />
      <div class="text-md font-medium mb-4">Address Information</div>

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
      <div class="text-md font-medium mb-4">Preferences</div>

      <UFormField label="Newsletter Subscription" name="newsletterSubscribed">
        <div class="flex items-center gap-3">
          <UCheckbox v-model="profileState.newsletterSubscribed" />
          <span class="text-sm text-gray-600">Subscribe to our newsletter for updates and news</span>
        </div>
      </UFormField>
      <UButton label="Update Profile" type="submit" variant="soft" class="self-end" />
    </UForm>
    <USeparator class="py-6" />
    <div class="text-lg font-semibold">
      <h1>Change Password</h1>
    </div>
    <UForm :schema="passwordSchema" :state="passwordState" @submit="changePassword" class="flex flex-col gap-4 mt-6">
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
    <div class="text-lg font-semibold">
      <h1>Danger Zone</h1>
    </div>
    <UCard class="mt-6">
      <div class="flex items-start justify-between">
        <div>
          <h3 class="text-lg font-medium text-red-900">Delete Account</h3>
          <p class="text-sm text-red-700 mt-1">Permanently delete your account and all associated data. This action cannot be undone.</p>
        </div>
        <UButton label="Contact Support" color="error" variant="soft" disabled class="ml-4" />
      </div>
    </UCard>
  </UContainer>
</template>

<script lang="ts" setup>
  import * as z from 'zod';
  import type { FormSubmitEvent } from '@nuxt/ui';
  import { CalendarDate, getLocalTimeZone } from '@internationalized/date';

  definePageMeta({
    layout: 'dashboard',
  });

  const { fetch: fetchSession } = useUserSession();

  const { data: userData } = await useFetch('/api/user/me');

  const profileSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    userName: z.string().min(5, 'Username is required'),
    email: z.string().email('Invalid Email'),
    dateOfBirth: z.any().nullable(),
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
    newsletterSubscribed: z.boolean().optional(),
  });

  type ProfileSchema = z.output<typeof profileSchema>;

  const passwordSchema = z
    .object({
      currentPassword: z.string().min(1, 'current password is required'),
      newPassword: z.string().min(8, 'Must be atleast 8 characters'),
      confirmPassword: z.string().min(8),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });
  type PasswordSchema = z.output<typeof passwordSchema>;

  const profileState = reactive<Partial<ProfileSchema>>({
    name: userData.value?.user?.name,
    userName: userData.value?.user?.userName,
    email: userData.value?.user?.email,
    dateOfBirth: userData.value?.user?.dateOfBirth
      ? new CalendarDate(new Date(userData.value.user.dateOfBirth).getFullYear(), new Date(userData.value.user.dateOfBirth).getMonth() + 1, new Date(userData.value.user.dateOfBirth).getDate())
      : null,
    street: userData.value?.user?.street || '',
    city: userData.value?.user?.city || '',
    state: userData.value?.user?.state || '',
    zipCode: userData.value?.user?.zipCode || '',
    country: userData.value?.user?.country || '',
    newsletterSubscribed: userData.value?.user?.newsletterSubscribed || false,
  });
  const passwordState = reactive<Partial<PasswordSchema>>({
    currentPassword: undefined,
    newPassword: undefined,
    confirmPassword: undefined,
  });
  const toast = useToast();

  async function updateProfile(event: FormSubmitEvent<ProfileSchema>) {
    try {
      await $fetch('/api/user/update-profile', {
        method: 'POST',
        body: {
          ...event.data,
          dateOfBirth: event.data.dateOfBirth?.toDate(getLocalTimeZone()).toISOString(),
        },
      });
      await fetchSession();
      toast.add({ title: 'Profile updated', color: 'success' });
    } catch (err) {
      console.error(err);
      toast.add({ title: 'Failed to update profile', color: 'error' });
    }
  }

  async function changePassword(event: FormSubmitEvent<PasswordSchema>) {
    try {
      await $fetch('/api/user/update-password', {
        method: 'POST',
        body: {
          currentPassword: event.data.currentPassword,
          newPassword: event.data.newPassword,
        },
      });
      toast.add({ title: 'Password changed', color: 'success' });
      Object.assign(passwordState, { currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error(err);
      toast.add({ title: 'Failed to change password', color: 'error' });
    }
  }
</script>

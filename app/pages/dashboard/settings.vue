<template>
  <UContainer class="py-6">
    <div class="text-lg font-semibold">
      <h1>Profile Settings</h1>
    </div>
    <UForm :schema="profileSchema" :state="profileState" @submit="updateProfile" class="flex flex-col gap-4 mt-6">
      <UFormField label="Name" name="name" required>
        <UInput v-model="profileState.name" required class="w-full" />
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
      <UButton label="Update Profile" type="submit" variant="soft" class="self-end" />
    </UForm>
    <USeparator class="py-6" />
    <div class="text-lg font-semibold">
      <h1>Change Password</h1>
    </div>
    <UForm :schema="passwordSchema" :state="passwordState" @sumbit="changePassword" class="flex flex-col gap-4 mt-6">
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
    email: z.string().email('Invalid Email'),
    dateOfBirth: z.any().nullable(),
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
    email: userData.value?.user?.email,
    dateOfBirth: userData.value?.user?.dateOfBirth
      ? new CalendarDate(new Date(userData.value.user.dateOfBirth).getFullYear(), new Date(userData.value.user.dateOfBirth).getMonth() + 1, new Date(userData.value.user.dateOfBirth).getDate())
      : null,
  });
  const passwordState = reactive<Partial<PasswordSchema>>({
    currentPassword: undefined,
    newPassword: undefined,
    confirmPassword: undefined,
  });
  const toast = useToast();

  async function updateProfile(event: FormSubmitEvent<ProfileSchema>) {
    try {
      await $fetch('/api/user/update', {
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

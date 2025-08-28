<template>
  <UContainer class="py-6">
    <UForm :state="state" class="flex flex-col gap-4 mt-6">
      <UFormField label="Current Password" name="current" required>
        <UInput v-model="state.currentPassword" type="password" required class="w-full" />
      </UFormField>
      <UFormField label="New Password" name="new" required>
        <UInput v-model="state.newPassword" type="password" required class="w-full" />
      </UFormField>
      <UFormField label="Confirm Password" name="confirm" required>
        <UInput v-model="state.confirmPassword" type="password" required class="w-full" />
      </UFormField>

      <UButton label="Change password" type="submit" variant="soft" class="self-end" />
    </UForm>
  </UContainer>
</template>

<script lang="ts" setup>
  definePageMeta({
    layout: 'dashboard',
  });
  const state = reactive({
    name: 'Benjamin Canac',
    username: 'benjamincanac',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
</script>

<style></style>

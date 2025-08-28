<template>
  <UHeader to="/" title="DOTLicense">
    <UNavigationMenu :items="items" />
    <template #right>
      <AuthState>
        <template #default="{ loggedIn }">
          <UModal>
            <UButton variant="ghost" color="neutral" icon="material-symbols:logout" v-if="loggedIn" @click="logout" />
            <UButton variant="ghost" color="neutral" v-else>Login</UButton>

            <template #content>
              <div class="flex p-4 gap-1">
                <UIcon name="i-lucide-lock" class="w-5 h-auto" />
                <h1 class="text-lg">Authenicate Session</h1>
              </div>
              <UForm :schema="schema" :state="state" class="space-y-4 p-4" @submit="onSubmit">
                <UFormField label="Email" name="email">
                  <UInput v-model="state.email" class="w-full" />
                </UFormField>

                <UFormField label="Password" name="password">
                  <UInput v-model="state.password" type="password" class="w-full" />
                </UFormField>
                <ULink to="/forgot-password" class="flex float-right">Forgot your password?</ULink>
                <UButton type="submit">Submit</UButton>
              </UForm>
            </template>
          </UModal>
        </template>
        <template #placeholder>
          <button disabled>Loading...</button>
        </template>
      </AuthState>
      <UColorModeButton />

      <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
        <UButton color="neutral" variant="ghost" to="https://github.com/26bz/DOTLicense" target="_blank" icon="i-simple-icons-github" aria-label="GitHub" />
      </UTooltip>
    </template>
  </UHeader>
</template>

<script setup lang="ts">
  import type { NavigationMenuItem, FormSubmitEvent } from '@nuxt/ui';
  import * as z from 'zod';
  const schema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Must be at least 8 characters'),
  });

  type Schema = z.output<typeof schema>;

  const state = reactive<Partial<Schema>>({
    email: undefined,
    password: undefined,
  });

  const toast = useToast();
  const route = useRoute();
  const items = computed<NavigationMenuItem[]>(() => [
    {
      label: 'Home',
      to: '/',
      active: route.path.startsWith('/'),
    },
    {
      label: 'Products',
      to: '/products',
      active: route.path.startsWith('/products'),
    },
    {
      label: 'Services',
      to: '/services',
      active: route.path.startsWith('/services'),
    },
    {
      label: 'Help Center',
      to: '/help-center',
      active: route.path.startsWith('/help-center'),
    },
  ]);
  async function logout() {
    const { clear } = useUserSession();
    await clear();
    await navigateTo('/');
  }
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
      const user = await $fetch('/api/auth/login', {
        method: 'POST',
        body: event.data,
      });

      toast.add({ title: 'Success', description: 'Logged in successfully', color: 'success' });

      console.log('Logged in user:', user);

      close();
      await navigateTo('/dashboard');
    } catch (err) {
      toast.add({ title: 'Error', description: 'Login failed. Please try again', color: 'error' });
      console.error(err);
    }
  }
</script>

<template>
  <UHeader to="/" title="DOTLicense">
    <UNavigationMenu :items="items" />
    <template #right>
      <AuthState>
        <template #default="{ loggedIn }">
          <UButton v-if="loggedIn" variant="ghost" color="neutral" icon="material-symbols:dashboard" @click="navigateTo('/dashboard')" />

          <UModal v-model:open="loginModal">
            <UButton v-if="loggedIn" variant="ghost" color="neutral" icon="material-symbols:logout" @click="logout" />
            <UButton v-else variant="ghost" color="neutral">Login</UButton>

            <template #content>
              <div class="flex p-4 gap-1 justify-between">
                <h1 class="text-lg">Authenticate Session</h1>
                <UButton color="neutral" variant="ghost" @click="openRegisterModal">Register</UButton>
              </div>
              <UForm :schema="loginSchema" :state="loginState" class="space-y-4 p-4" @submit="onLoginSubmit">
                <UFormField label="Email" name="email">
                  <UInput v-model="loginState.email" class="w-full" />
                </UFormField>

                <UFormField label="Password" name="password">
                  <UInput v-model="loginState.password" type="password" class="w-full" />
                </UFormField>
                <!-- <NuxtTurnstile v-model="token" /> -->
                <ULink to="/forgot-password" class="flex float-right">Forgot your password?</ULink>
                <UButton type="submit">Submit</UButton>
              </UForm>
            </template>
          </UModal>

          <UModal v-model:open="registerModal">
            <template #content>
              <div class="flex p-4 gap-1 justify-between">
                <h1 class="text-lg">Create Account</h1>
                <UButton color="neutral" variant="ghost" @click="openLoginModal">Login</UButton>
              </div>
              <UForm :schema="registerSchema" :state="registerState" class="space-y-4 p-4" @submit="onRegisterSubmit">
                <UFormField label="First Name" name="firstName">
                  <UInput v-model="registerState.firstName" class="w-full" />
                </UFormField>

                <UFormField label="Last Name" name="lastName">
                  <UInput v-model="registerState.lastName" class="w-full" />
                </UFormField>
                <UFormField label="Username" name="userName">
                  <UInput v-model="registerState.userName" class="w-full" />
                </UFormField>

                <UFormField label="Email" name="email">
                  <UInput v-model="registerState.email" class="w-full" />
                </UFormField>
                <UFormField label="Phone Number" name="phone">
                  <UInput v-model="registerState.phone" class="w-full" />
                </UFormField>
                <UFormField label="Password" name="password">
                  <UInput v-model="registerState.password" type="password" class="w-full" />
                </UFormField>

                <UFormField label="Confirm Password" name="confirmPassword">
                  <UInput v-model="registerState.confirmPassword" type="password" class="w-full" />
                </UFormField>

                <UFormField label="Date of Birth" name="dateOfBirth">
                  <UInput v-model="registerState.dateOfBirth" type="date" class="w-full" />
                </UFormField>

                <UFormField label="Street Address" name="street">
                  <UInput v-model="registerState.street" class="w-full" />
                </UFormField>

                <div class="grid grid-cols-2 gap-4">
                  <UFormField label="City" name="city">
                    <UInput v-model="registerState.city" class="w-full" />
                  </UFormField>

                  <UFormField label="State" name="state">
                    <UInput v-model="registerState.state" class="w-full" />
                  </UFormField>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <UFormField label="ZIP Code" name="zipCode">
                    <UInput v-model="registerState.zipCode" class="w-full" />
                  </UFormField>

                  <UFormField label="Country" name="country">
                    <UInput v-model="registerState.country" class="w-full" />
                  </UFormField>
                </div>

                <UFormField name="newsletterSubscribed">
                  <UCheckbox v-model="registerState.newsletterSubscribed" label="Subscribe to newsletter" />
                </UFormField>
                <NuxtTurnstile v-model="token" />
                <UButton type="submit">Create Account</UButton>
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
  import type { NavigationMenuItem, FormSubmitEvent } from '@nuxt/ui'
  import { useToast } from '#imports'
  import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '#shared/schemas/auth'

  const token = ref('')

  const loginState = reactive<Partial<LoginInput>>({
    email: undefined,
    password: undefined,
  })

  const registerState = reactive<Partial<RegisterInput>>({
    firstName: undefined,
    lastName: undefined,
    userName: undefined,
    email: undefined,
    phone: undefined,
    password: undefined,
    confirmPassword: undefined,
    dateOfBirth: undefined,
    street: undefined,
    city: undefined,
    state: undefined,
    zipCode: undefined,
    country: 'US',
    newsletterSubscribed: false,
  })

  const loginModal = ref(false)
  const registerModal = ref(false)

  const toast = useToast()
  const route = useRoute()

  const items = computed<NavigationMenuItem[]>(() => [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products', active: route.path.startsWith('/products') },
    { label: 'Services', to: '/services', active: route.path.startsWith('/services') },
    { label: 'Help Center', to: '/help-center', active: route.path.startsWith('/help-center') },
  ])

  function openLoginModal() {
    registerModal.value = false
    loginModal.value = true
  }

  function openRegisterModal() {
    loginModal.value = false
    registerModal.value = true
  }

  async function logout() {
    const { clear } = useUserSession()
    await clear()
    await navigateTo('/')
  }

  async function onLoginSubmit(event: FormSubmitEvent<LoginInput>) {
    try {
      const user = await $fetch('/api/auth/login', {
        method: 'POST',
        body: event.data,
      })

      toast.add({ title: 'Success', description: 'Logged in successfully', color: 'success' })
      loginModal.value = false
      await navigateTo('/dashboard')
    } catch (err) {
      toast.add({ title: 'Error', description: 'Login failed. Please try again', color: 'error' })
      console.error(err)
    }
  }

  async function onRegisterSubmit(event: FormSubmitEvent<RegisterInput>) {
    try {
      const user = await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          ...event.data,
          turnstileToken: token.value,
        },
      })

      toast.add({ title: 'Success', description: 'Account created successfully', color: 'success' })
      registerModal.value = false
      await navigateTo('/dashboard')
    } catch (err: any) {
      const errorMessage = err.data?.message || 'Registration failed. Please try again'
      toast.add({ title: 'Error', description: errorMessage, color: 'error' })
      console.error(err)
    }
  }
</script>

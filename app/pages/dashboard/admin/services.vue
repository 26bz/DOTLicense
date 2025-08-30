<script setup lang="ts">
  import { ref } from 'vue'
  import { z } from 'zod'

  definePageMeta({ layout: 'dashboard' })

  const serviceSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    shortDescription: z.string().optional(),
    description: z.string().min(1, 'Description is required'),
    price: z.string().min(1, 'Price is required'),
    currency: z.string().default('USD'),
    isOneTime: z.boolean().default(true),
    isSubscription: z.boolean().default(false),
    subscriptionInterval: z.string().optional(),
    features: z.array(z.string()).default([]),
    buttonLabel: z.string().min(1, 'Button label is required'),
    deliveryTimeframe: z.string().optional(),
    includesRevisions: z.boolean().default(true),
    maxRevisions: z.number().optional(),
    includesConsultation: z.boolean().default(false),
    consultationHours: z.number().optional(),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
  })

  const defaultService = {
    title: '',
    shortDescription: '',
    description: '',
    price: '',
    currency: 'USD',
    isOneTime: true,
    isSubscription: false,
    subscriptionInterval: '',
    features: [] as string[],
    buttonLabel: '',
    deliveryTimeframe: '',
    includesRevisions: true,
    maxRevisions: 3,
    includesConsultation: false,
    consultationHours: 0,
    isActive: true,
    isFeatured: false,
  }

  const serviceForm = ref({ ...defaultService })
  const featuresInput = ref('')
  const isModalOpen = ref(false)
  const isSubmitting = ref(false)
  const editingService = ref<{ id: number; title: string } | null>(null)
  const isEditMode = computed(() => editingService.value !== null)
  const modalTitle = computed(() => (isEditMode.value ? 'Edit Service' : 'Create New Service'))
  const submitButtonText = computed(() => {
    if (isSubmitting.value) {
      return isEditMode.value ? 'Updating...' : 'Creating...'
    }
    return isEditMode.value ? 'Update Service' : 'Create Service'
  })

  const serviceToDelete = ref<{ id: number; title: string } | null>(null)
  const isDeleteModalOpen = ref(false)

  const { data: services, refresh } = await useFetch('/api/services')

  const openCreateModal = () => {
    resetForm()
    isModalOpen.value = true
  }

  const openEditModal = (service: any) => {
    editingService.value = { id: service.id, title: service.title }

    serviceForm.value = {
      title: service.title,
      shortDescription: service.shortDescription || '',
      description: service.description,
      price: service.price,
      currency: service.currency || 'USD',
      isOneTime: service.isOneTime ?? true,
      isSubscription: service.isSubscription ?? false,
      subscriptionInterval: service.subscriptionInterval || '',
      features: Array.isArray(service.features) ? service.features : [],
      buttonLabel: service.buttonLabel,
      deliveryTimeframe: service.deliveryTimeframe || '',
      includesRevisions: service.includesRevisions ?? true,
      maxRevisions: service.maxRevisions ?? 3,
      includesConsultation: service.includesConsultation ?? false,
      consultationHours: service.consultationHours ?? 0,
      isActive: service.isActive ?? true,
      isFeatured: service.isFeatured ?? false,
    }

    featuresInput.value = Array.isArray(service.features) ? service.features.join(', ') : ''
    isModalOpen.value = true
  }

  const handleSubmit = async () => {
    try {
      isSubmitting.value = true

      // Process features input
      serviceForm.value.features = Array.from(
        new Set(
          featuresInput.value
            .split(',')
            .map(f => f.trim())
            .filter(f => f)
        )
      )

      if (isEditMode.value) {
        await $fetch(`/api/services/${editingService.value!.id}`, {
          method: 'PUT',
          body: serviceForm.value,
        })
      } else {
        await $fetch('/api/services', {
          method: 'POST',
          body: serviceForm.value,
        })
      }

      await refresh()
      closeModal()
    } catch (error) {
      console.error(`Error ${isEditMode.value ? 'updating' : 'creating'} service:`, error)
    } finally {
      isSubmitting.value = false
    }
  }

  const resetForm = () => {
    serviceForm.value = { ...defaultService }
    featuresInput.value = ''
    editingService.value = null
  }

  const closeModal = () => {
    resetForm()
    isModalOpen.value = false
  }

  const confirmDeleteService = (service: { id: number; title: string }) => {
    serviceToDelete.value = service
    isDeleteModalOpen.value = true
  }

  const deleteService = async () => {
    if (!serviceToDelete.value) return

    try {
      await $fetch(`/api/services/${serviceToDelete.value.id}`, { method: 'DELETE' })
      await refresh()
    } catch (error) {
      console.error('Error deleting service:', error)
    } finally {
      serviceToDelete.value = null
      isDeleteModalOpen.value = false
    }
  }

  const cancelDelete = () => {
    serviceToDelete.value = null
    isDeleteModalOpen.value = false
  }
</script>

<template>
  <UContainer>
    <UPageHeader title="Services Management" description="Manage service for hire listings with pricing plans." />

    <div class="py-6">
      <UButton label="Create Service" color="primary" variant="solid" class="float-right" @click="openCreateModal" />
    </div>

    <UModal v-model:open="isModalOpen" :title="modalTitle">
      <template #body>
        <UForm :schema="serviceSchema" :state="serviceForm" class="space-y-4" @submit="handleSubmit">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Title" required>
              <UInput v-model="serviceForm.title" placeholder="e.g., Solo Plan" />
            </UFormField>

            <UFormField label="Price" required>
              <UInput v-model="serviceForm.price" placeholder="e.g., $249" />
            </UFormField>
          </div>

          <UFormField label="Short Description">
            <UInput v-model="serviceForm.shortDescription" placeholder="e.g., Tailored for indie hackers" class="w-full" />
          </UFormField>

          <UFormField label="Description" required>
            <UTextarea v-model="serviceForm.description" placeholder="Detailed description of the service" class="w-full" />
          </UFormField>

          <UFormField label="Features (comma separated)" required>
            <UTextarea v-model="featuresInput" placeholder="One developer, Lifetime access, 24/7 support" :rows="3" class="w-full" />
          </UFormField>

          <UFormField label="Button Label" required>
            <UInput v-model="serviceForm.buttonLabel" placeholder="e.g., Buy now" />
          </UFormField>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Delivery Timeframe">
              <UInput v-model="serviceForm.deliveryTimeframe" placeholder="e.g., 7-14 days" />
            </UFormField>

            <UFormField label="Max Revisions">
              <UInput v-model="serviceForm.maxRevisions" type="number" />
            </UFormField>
          </div>

          <UFormField label="Consultation Hours">
            <UInput v-model="serviceForm.consultationHours" type="number" />
          </UFormField>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <UFormField label="Is Featured">
              <UCheckbox v-model="serviceForm.isFeatured" />
            </UFormField>

            <UFormField label="Is Active">
              <UCheckbox v-model="serviceForm.isActive" />
            </UFormField>

            <UFormField label="Includes Revisions">
              <UCheckbox v-model="serviceForm.includesRevisions" />
            </UFormField>

            <UFormField label="Includes Consultation">
              <UCheckbox v-model="serviceForm.includesConsultation" />
            </UFormField>
          </div>

          <button type="submit" class="hidden" />
        </UForm>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton color="neutral" variant="outline" @click="closeModal"> Cancel </UButton>
          <UButton color="primary" :loading="isSubmitting" :disabled="isSubmitting" @click="handleSubmit">
            {{ submitButtonText }}
          </UButton>
        </div>
      </template>
    </UModal>

    <UModal v-model:open="isDeleteModalOpen" :title="`Confirm Delete`">
      <template #body>
        <div class="space-y-4">
          <p>Are you sure you want to delete the service:</p>
          <p class="font-semibold text-red-600">{{ serviceToDelete?.title }}</p>
          <p>This action cannot be undone.</p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton color="neutral" variant="outline" @click="cancelDelete"> Cancel </UButton>
          <UButton color="error" @click="deleteService"> Delete </UButton>
        </div>
      </template>
    </UModal>

    <div class="py-8">
      <template v-if="services && services.length > 0">
        <div class="space-y-4">
          <h3 class="text-xl font-semibold">Manage Services</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UCard v-for="service in services" :key="service.id" variant="outline">
              <template #header>
                <div class="flex justify-between items-start">
                  <div>
                    <h5 class="font-semibold">{{ service.title }}</h5>
                    <p class="text-sm text-neutral-500">{{ service.price }}</p>
                  </div>
                  <div class="flex gap-2">
                    <UBadge v-if="service.isFeatured" color="warning" variant="soft"> Featured </UBadge>
                    <UBadge :color="service.isActive ? 'success' : 'error'" variant="soft">
                      {{ service.isActive ? 'Active' : 'Inactive' }}
                    </UBadge>
                  </div>
                </div>
              </template>

              <div class="space-y-3">
                <p class="text-sm text-neutral-600">{{ service.description }}</p>

                <div>
                  <h6 class="text-sm font-medium mb-1">Features:</h6>
                  <div class="flex flex-wrap gap-1">
                    <UBadge v-for="feature in service.features.slice(0, 3)" :key="feature" size="sm" variant="soft" color="info">
                      {{ feature }}
                    </UBadge>
                    <UBadge v-if="service.features.length > 3" size="sm" variant="soft" color="neutral"> +{{ service.features.length - 3 }} more </UBadge>
                  </div>
                </div>

                <div class="text-xs text-neutral-500 space-y-1">
                  <div v-if="service.deliveryTimeframe"><strong>Delivery:</strong> {{ service.deliveryTimeframe }}</div>
                  <div v-if="service.includesRevisions"><strong>Revisions:</strong> {{ service.maxRevisions || 'Unlimited' }}</div>
                  <div v-if="service.includesConsultation"><strong>Consultation:</strong> {{ service.consultationHours }}h</div>
                </div>
              </div>

              <template #footer>
                <div class="flex justify-between items-center gap-2">
                  <UButton color="info" variant="outline" size="sm" @click="openEditModal(service)"> Edit </UButton>
                  <UButton color="error" variant="outline" size="sm" @click="confirmDeleteService({ id: service.id, title: service.title })"> Delete </UButton>
                </div>
              </template>
            </UCard>
          </div>
        </div>
      </template>
      <UAlert v-else color="warning" variant="soft" title="No Services Created" description="Create your first service to get started with your service offerings." />
    </div>
  </UContainer>
</template>

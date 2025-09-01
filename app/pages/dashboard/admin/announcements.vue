<template>
  <UContainer>
    <UPageHeader title="Announcement Management" description="Manage dashboard announcements" />
    <div class="py-6">
      <UButton label="Create Announcement" color="primary" variant="solid" class="float-right" @click="openCreateModal" />
    </div>

    <UModal v-model:open="isModalOpen" :title="modalTitle">
      <template #body>
        <div class="space-y-4">
          <UFormField label="Title" required>
            <UInput v-model="announcementForm.title" placeholder="Announcement title" class="w-full" />
          </UFormField>
          <UFormField label="Description" required>
            <UTextarea v-model="announcementForm.description" placeholder="Announcement description" class="w-full" :rows="4" />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton color="neutral" variant="outline" @click="closeModal">Cancel</UButton>
          <UButton color="primary" :loading="isSubmitting" :disabled="isSubmitting" @click="handleSubmit">{{ submitButtonText }}</UButton>
        </div>
      </template>
    </UModal>

    <UModal v-model:open="isDeleteModalOpen" :title="'Confirm Delete'">
      <template #body>
        <p>
          Are you sure you want to delete: <strong class="text-red-600">{{ announcementToDelete?.title }}</strong
          >?
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton color="neutral" variant="outline" @click="cancelDelete">Cancel</UButton>
          <UButton color="error" @click="deleteAnnouncement">Delete</UButton>
        </div>
      </template>
    </UModal>

    <div class="py-8">
      <template v-if="announcements && announcements.length > 0">
        <div class="space-y-4">
          <h3 class="text-xl font-semibold">Manage Announcements</h3>
          <div class="space-y-3">
            <UCard v-for="item in announcements" :key="item.id">
              <div class="flex justify-between items-start">
                <div>
                  <h5 class="font-semibold">{{ item.title }}</h5>
                  <p class="text-sm text-neutral-500">{{ item.description }}</p>
                </div>
                <div class="flex gap-2">
                  <UButton color="info" variant="outline" size="sm" @click="openEditModal(item)">Edit</UButton>
                  <UButton color="error" variant="outline" size="sm" @click="confirmDeleteAnnouncement(item)">Delete</UButton>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </template>
      <UAlert v-else color="warning" variant="soft" title="No Announcements" description="Create your first announcement to show updates on dashboards." />
    </div>
  </UContainer>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { ZodError } from 'zod'
  import { announcementSchema, type AnnouncementInput } from '#shared/schemas/announcements'

  definePageMeta({ layout: 'dashboard' })

  const defaultAnnouncement: AnnouncementInput = { title: '', description: '' }
  const announcementForm = ref<AnnouncementInput>({ ...defaultAnnouncement })
  const formErrors = ref<Record<string, string>>({})

  const isModalOpen = ref(false)
  const isSubmitting = ref(false)
  const editingAnnouncement = ref<{ id: string; title: string } | null>(null)

  const isEditMode = computed(() => editingAnnouncement.value !== null)
  const modalTitle = computed(() => (isEditMode.value ? 'Edit Announcement' : 'Create Announcement'))
  const submitButtonText = computed(() =>
    isSubmitting.value ? (isEditMode.value ? 'Updating...' : 'Creating...') : isEditMode.value ? 'Update Announcement' : 'Create Announcement'
  )

  const announcementToDelete = ref<{ id: string; title: string } | null>(null)
  const isDeleteModalOpen = ref(false)

  type Announcement = AnnouncementInput & { id: string }
  const { data: announcements, refresh } = await useFetch<Announcement[]>('/api/announcements')

  const openCreateModal = () => {
    resetForm()
    isModalOpen.value = true
  }

  const openEditModal = (announcement: Announcement) => {
    editingAnnouncement.value = { id: announcement.id, title: announcement.title }
    announcementForm.value = {
      title: announcement.title,
      description: announcement.description,
    }
    isModalOpen.value = true
  }

  const resetForm = () => {
    announcementForm.value = { ...defaultAnnouncement }
    editingAnnouncement.value = null
    formErrors.value = {}
  }

  const closeModal = () => {
    resetForm()
    isModalOpen.value = false
  }
  const handleSubmit = async () => {
    try {
      isSubmitting.value = true
      formErrors.value = {}

      const data = announcementSchema.parse(announcementForm.value)

      if (isEditMode.value) {
        await $fetch(`/api/announcements/${editingAnnouncement.value!.id}`, {
          method: 'PUT',
          body: data,
        })
      } else {
        await $fetch('/api/announcements', {
          method: 'POST',
          body: data,
        })
      }

      await refresh()
      closeModal()
    } catch (err) {
      if (err instanceof ZodError) {
        formErrors.value = Object.fromEntries(
          Object.entries(err.flatten().fieldErrors).map(([key, val]): [string, string] => [key, (val as string[] | undefined)?.[0] || 'Invalid'])
        ) as Partial<Record<keyof AnnouncementInput, string>>
      } else {
        console.error(err)
      }
    } finally {
      isSubmitting.value = false
    }
  }

  const confirmDeleteAnnouncement = (announcement: Announcement) => {
    announcementToDelete.value = announcement
    isDeleteModalOpen.value = true
  }

  const deleteAnnouncement = async () => {
    if (!announcementToDelete.value) return
    await $fetch(`/api/announcements/${announcementToDelete.value.id}`, { method: 'DELETE' })
    await refresh()
    announcementToDelete.value = null
    isDeleteModalOpen.value = false
  }

  const cancelDelete = () => {
    announcementToDelete.value = null
    isDeleteModalOpen.value = false
  }
</script>

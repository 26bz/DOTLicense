<template>
  <UContainer>
    <UPageHeader title="Products Management" description="Manage digital products with comprehensive details, media, files, and pricing." />

    <div v-if="productsError || categoriesError" class="py-4">
      <UAlert color="error" variant="soft" title="Error Loading Data" :description="productsError?.message || categoriesError?.message || 'Failed to load data'" />
    </div>

    <div class="py-6">
      <UButton label="Create Product" color="primary" variant="solid" class="float-right" @click="openCreateModal" />
    </div>

    <UModal v-model:open="isModalOpen" :title="modalTitle" class="w-full max-w-4xl">
      <template #body>
        <div class="space-y-6">
          <UAlert v-if="errorMessage" color="error" variant="soft" :description="errorMessage" />

          <UTabs v-model="activeTab" :items="tabItems" class="w-full">
            <template #overview>
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UFormField label="Product Name" required>
                    <UInput v-model="productForm.name" placeholder="Enter product name" class="w-full" />
                  </UFormField>

                  <UFormField label="Slug" required>
                    <UInput v-model="productForm.slug" placeholder="product-slug" />
                    <template #help> Used in URLs. Only lowercase letters, numbers, and hyphens. </template>
                  </UFormField>
                </div>

                <UFormField label="Version" required>
                  <UInput v-model="productForm.version" placeholder="1.0.0" class="max-w-xs" />
                </UFormField>

                <UFormField label="Tags" required>
                  <UInput v-model="productForm.tags" placeholder="web, mobile, template" />
                  <template #help> Comma-separated tags for categorization and search </template>
                </UFormField>

                <UFormField label="Category" required>
                  <UInputMenu
                    v-model="productForm.categoryId"
                    :items="categoryOptions"
                    value-key="value"
                    create-item
                    placeholder="Select or create a category"
                    class="max-w-xs"
                    @create="onCreateCategory"
                  />

                  <template #help>Select existing or type to create new category</template>
                </UFormField>

                <div class="grid grid-cols-2 gap-4">
                  <UFormField label="Status">
                    <UCheckbox v-model="productForm.isActive" label="Product is Active" />
                  </UFormField>
                  <UFormField label="Featured">
                    <UCheckbox v-model="productForm.isFeatured" label="Feature this product" />
                  </UFormField>
                </div>
              </div>
            </template>

            <template #content>
              <div class="space-y-4">
                <UFormField label="Cover Image URL" required>
                  <UInput v-model="productForm.coverImage" placeholder="https://example.com/image.jpg" class="w-full" />
                  <template #help> Main image displayed on product cards and pages </template>
                </UFormField>

                <UFormField label="Short Description">
                  <UInput v-model="productForm.shortDescription" placeholder="Brief product summary" class="w-full" />
                  <template #help> Displayed on product cards and previews (optional) </template>
                </UFormField>

                <UFormField label="Full Description" required>
                  <UTextarea v-model="productForm.description" placeholder="Detailed product description..." :rows="6" class="w-full" />
                </UFormField>

                <UFormField label="Change Log">
                  <UTextarea v-model="productForm.changeLog" placeholder="Version history and updates..." :rows="4" class="w-full" />
                  <template #hint> Document changes and improvements for this version </template>
                </UFormField>
              </div>
            </template>

            <template #files>
              <div class="space-y-4">
                <UFormField label="File URL" required>
                  <UInput v-model="productForm.fileUrl" placeholder="https://example.com/file.zip" />
                  <template #hint> Direct download link for the product file </template>
                </UFormField>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UFormField label="File Name">
                    <UInput v-model="productForm.fileName" placeholder="product-v1.0.0.zip" class="w-full" />
                  </UFormField>

                  <UFormField label="MIME Type">
                    <UInput v-model="productForm.mimeType" placeholder="application/zip" class="w-full" />
                  </UFormField>
                </div>

                <UFormField label="File Size (bytes)">
                  <UInput v-model.number="productForm.fileSize" type="number" placeholder="1048576" class="max-w-xs w-full" />
                  <template #help> File size in bytes (1 MB = 1,048,576 bytes) </template>
                </UFormField>
              </div>
            </template>

            <template #pricing>
              <div class="space-y-4">
                <UFormField label="Price (USD)" required>
                  <UInput v-model.number="productForm.price" type="number" step="0.01" min="0" placeholder="29.99" class="max-w-xs" />
                </UFormField>

                <div class="space-y-3">
                  <h4 class="text-sm font-medium">Purchase Options</h4>

                  <UFormField>
                    <UCheckbox v-model="productForm.isOneTime" label="One-time Purchase" />
                  </UFormField>

                  <UFormField>
                    <UCheckbox v-model="productForm.isSubscription" label="Subscription Available" />
                  </UFormField>

                  <UFormField v-if="productForm.isSubscription" label="Subscription Interval">
                    <USelect v-model="productForm.subscriptionInterval" :options="subscriptionIntervalOptions" placeholder="Select billing frequency" class="max-w-xs" />
                  </UFormField>
                </div>

                <UCard>
                  <h5 class="text-sm font-medium mb-2">Pricing Summary</h5>
                  <div class="space-y-1 text-sm text-gray-600">
                    <div v-if="productForm.isOneTime">One-time: ${{ productForm.price.toFixed(2) }}</div>
                    <div v-if="productForm.isSubscription && productForm.subscriptionInterval">
                      Subscription: ${{ productForm.price.toFixed(2) }} / {{ productForm.subscriptionInterval }}
                    </div>
                  </div>
                </UCard>
              </div>
            </template>
          </UTabs>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-500">Tab {{ tabItems.findIndex(t => t.value === activeTab) + 1 }} of {{ tabItems.length }}</div>
          <div class="flex gap-3">
            <UButton color="neutral" variant="outline" @click="closeModal"> Cancel </UButton>
            <UButton color="primary" :loading="isSubmitting" @click="handleSubmit">
              {{ submitButtonText }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <UModal v-model:open="isDeleteModalOpen" title="Confirm Delete">
      <template #body>
        <p>
          Are you sure you want to delete: <strong>{{ productToDelete?.name }}</strong
          >?
        </p>
        <p class="text-sm text-gray-600 mt-2">This action cannot be undone.</p>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton color="neutral" variant="outline" @click="isDeleteModalOpen = false"> Cancel </UButton>
          <UButton color="error" @click="deleteProduct"> Delete </UButton>
        </div>
      </template>
    </UModal>

    <div v-if="safeProducts.length" class="py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard v-for="product in safeProducts" :key="product.id" class="hover:shadow-lg transition-shadow">
          <template #header>
            <div class="flex justify-between items-start">
              <div class="flex-1 min-w-0">
                <h5 class="font-semibold text-lg truncate">{{ product.name }}</h5>
                <p class="text-sm text-gray-600 font-medium">
                  {{ formatPrice(product.price) }}
                </p>
                <p class="text-xs text-gray-500 mt-1">v{{ product.version }} • {{ product.slug }}</p>
              </div>
              <div class="flex flex-col gap-1 ml-2">
                <UBadge v-if="product.isFeatured" color="warning" variant="soft" size="xs"> Featured </UBadge>
                <UBadge :color="product.isActive ? 'success' : 'error'" variant="soft" size="xs">
                  {{ product.isActive ? 'Active' : 'Inactive' }}
                </UBadge>
              </div>
            </div>
          </template>

          <div class="space-y-3">
            <div v-if="product.coverImage" class="aspect-video bg-gray-100 rounded-md overflow-hidden">
              <img :src="product.coverImage" :alt="product.name" class="w-full h-full object-cover" />
            </div>

            <div class="space-y-2">
              <p v-if="product.shortDescription" class="text-sm text-gray-700 font-medium">
                {{ product.shortDescription }}
              </p>
              <p class="text-sm text-gray-600 line-clamp-2">
                {{ product.description }}
              </p>
            </div>

            <div class="flex flex-wrap gap-1">
              <UBadge v-for="tag in product.tags.split(',')" :key="tag.trim()" color="neutral" variant="soft" size="xs">
                {{ tag.trim() }}
              </UBadge>
            </div>

            <div class="flex items-center gap-4 text-xs text-gray-500">
              <span>{{ formatFileSize(product.fileSize) }}</span>
              <span>{{ product.downloadCount }} downloads</span>
              <span>{{ product.purchaseCount }} sales</span>
            </div>

            <div class="flex flex-wrap gap-1">
              <UBadge v-if="product.isOneTime" color="info" variant="soft" size="xs"> One-time </UBadge>
              <UBadge v-if="product.isSubscription" color="success" variant="soft" size="xs">
                {{ product.subscriptionInterval || 'Subscription' }}
              </UBadge>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-between items-center gap-2">
              <UButton color="neutral" variant="outline" size="sm" @click="openEditModal(product)"> Edit </UButton>
              <UButton color="error" variant="outline" size="sm" @click="confirmDeleteProduct({ id: product.id, name: product.name })"> Delete </UButton>
            </div>
          </template>
        </UCard>
      </div>
    </div>

    <UAlert
      v-else-if="!productsError"
      color="info"
      variant="outline"
      title="No Products Created"
      description="Create your first product to get started with your comprehensive product catalog."
      class="mt-6"
    />
  </UContainer>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { createProductSchema, type CreateProductInput, type Product } from '#shared/schemas/product'
  import type { Ref } from 'vue'
  import type { TabsItem } from '@nuxt/ui'

  definePageMeta({ layout: 'dashboard' })

  type ProductWithCategory = Product & {
    categoryId: string
  }

  type Category = {
    id: string
    name: string
  }

  type ProductForm = CreateProductInput

  const defaultProduct: ProductForm = {
    name: '',
    slug: '',
    tags: '',
    version: '1.0.0',
    categoryId: '',
    isActive: true,
    isFeatured: false,
    shortDescription: '',
    description: '',
    coverImage: '',
    changeLog: '',
    fileUrl: '',
    fileName: '',
    mimeType: '',
    fileSize: 0,
    price: 0,
    isOneTime: true,
    isSubscription: false,
    subscriptionInterval: '',
  }

  const tabItems: TabsItem[] = [
    {
      label: 'Overview',
      icon: 'i-lucide-info',
      value: 'overview',
      slot: 'overview',
    },
    {
      label: 'Content & Media',
      icon: 'i-lucide-image',
      value: 'content',
      slot: 'content',
    },
    {
      label: 'Files',
      icon: 'i-lucide-file',
      value: 'files',
      slot: 'files',
    },
    {
      label: 'Pricing',
      icon: 'i-lucide-credit-card',
      value: 'pricing',
      slot: 'pricing',
    },
  ]

  const productForm: Ref<ProductForm> = ref({ ...defaultProduct })
  const isModalOpen = ref(false)
  const isSubmitting = ref(false)
  const editingProduct = ref<{ id: string; name: string } | null>(null)
  const isEditMode = computed(() => editingProduct.value !== null)
  const modalTitle = computed(() => (isEditMode.value ? 'Edit Product' : 'Create New Product'))
  const submitButtonText = computed(() => (isSubmitting.value ? (isEditMode.value ? 'Updating...' : 'Creating...') : isEditMode.value ? 'Update Product' : 'Create Product'))
  const productToDelete = ref<{ id: string; name: string } | null>(null)
  const isDeleteModalOpen = ref(false)
  const errorMessage = ref<string>('')
  const activeTab = ref('overview')

  const { data: products, refresh, error: productsError } = await useFetch<ProductWithCategory[]>('/api/products')
  const { data: categories, error: categoriesError } = await useFetch<Category[]>('/api/categories')

  const safeProducts = computed(() => products.value || [])
  const safeCategories = computed(() => categories.value || [])
  const categoryOptions = computed(() => safeCategories.value.map(c => ({ label: c.name, value: c.id })))

  const subscriptionIntervalOptions = [
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Yearly', value: 'yearly' },
  ]

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  watch(
    () => productForm.value.name,
    newName => {
      if (newName && !isEditMode.value) {
        productForm.value.slug = generateSlug(newName)
      }
    }
  )

  const resetForm = () => {
    productForm.value = { ...defaultProduct }
    editingProduct.value = null
    errorMessage.value = ''
    activeTab.value = 'overview'
  }

  const openCreateModal = () => {
    resetForm()
    isModalOpen.value = true
  }

  const onCreateCategory = async (categoryName: string) => {
    try {
      const newCategory = await $fetch<{ id: string; name: string }>('/api/categories', {
        method: 'POST',
        body: { name: categoryName },
      })

      if (categories.value) {
        categories.value.push(newCategory)
      }

      productForm.value.categoryId = newCategory.id
    } catch (error: any) {
      console.error('Error creating category:', error)

      if (error?.data?.statusMessage === 'Category already exists') {
        errorMessage.value = 'A category with that name already exists.'
      } else {
        errorMessage.value = 'Failed to create category. Please try again.'
      }
    }
  }

  const openEditModal = (product: ProductWithCategory) => {
    editingProduct.value = { id: product.id, name: product.name }
    productForm.value = {
      name: product.name,
      slug: product.slug,
      tags: product.tags,
      version: product.version,
      categoryId: product.categoryId,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      shortDescription: product.shortDescription || '',
      description: product.description,
      coverImage: product.coverImage,
      changeLog: product.changeLog || '',
      fileUrl: product.fileUrl,
      fileName: product.fileName || '',
      mimeType: product.mimeType || '',
      fileSize: product.fileSize || 0,
      price: product.price / 100,
      isOneTime: product.isOneTime,
      isSubscription: product.isSubscription,
      subscriptionInterval: product.subscriptionInterval || '',
    }
    errorMessage.value = ''
    activeTab.value = 'overview'
    isModalOpen.value = true
  }

  const closeModal = () => {
    resetForm()
    isModalOpen.value = false
  }

  const validateForm = () => {
    try {
      createProductSchema.parse(productForm.value)
      return true
    } catch (error: any) {
      errorMessage.value = error.issues?.[0]?.message || 'Validation error'
      return false
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    try {
      isSubmitting.value = true
      errorMessage.value = ''

      const submitData = {
        ...productForm.value,
        price: Math.round(productForm.value.price * 100),
      }

      if (isEditMode.value && editingProduct.value) {
        await $fetch(`/api/products/${editingProduct.value.id}`, {
          method: 'PUT',
          body: submitData,
        })
      } else {
        await $fetch('/api/products', {
          method: 'POST',
          body: submitData,
        })
      }

      await refresh()
      closeModal()
    } catch (error: any) {
      console.error(`Error ${isEditMode.value ? 'updating' : 'creating'} product:`, error)
      errorMessage.value = error?.data?.message || `Failed to ${isEditMode.value ? 'update' : 'create'} product. Please try again.`
    } finally {
      isSubmitting.value = false
    }
  }

  const confirmDeleteProduct = (product: { id: string; name: string }) => {
    productToDelete.value = product
    isDeleteModalOpen.value = true
  }

  const deleteProduct = async () => {
    if (!productToDelete.value) return

    try {
      await $fetch(`/api/products/${productToDelete.value.id}`, {
        method: 'DELETE',
      })
      await refresh()
    } catch (error: any) {
      console.error('Error deleting product:', error)
    } finally {
      productToDelete.value = null
      isDeleteModalOpen.value = false
    }
  }

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(priceInCents / 100)
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
  }
</script>

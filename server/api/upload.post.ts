import type { ServerFile } from 'nuxt-file-storage'
import { uploadFiles } from '~~/shared/utils/abilities'
import { logActivity } from '~~/server/utils/activity'

export default defineEventHandler(async event => {
  try {
    const session = await requireUserSession(event)
    await authorize(event, uploadFiles, session.user)

    const { files } = await readBody<{ files: ServerFile[] }>(event)

    if (!files || files.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No files provided',
      })
    }

    const uploadedFiles = []

    for (const file of files) {
      // Store files with unique 8-character IDs
      const storedFilePath = await storeFileLocally(file, 8, '/uploads')

      uploadedFiles.push({
        filename: file.name,
        path: storedFilePath,
        size: file.size,
        type: file.type,
      })

      await logActivity(event, {
        userId: session.user.id,
        type: 'FILE_UPLOADED',
        description: `User uploaded file: ${file.name}`,
        resourceId: file.name,
        resourceType: 'file',
        metadata: {
          originalName: file.name,
          size: file.size,
          type: file.type,
          storedPath: storedFilePath,
        },
      })
    }

    return {
      success: true,
      files: uploadedFiles,
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
    }
  } catch (error: any) {
    console.error('Upload error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'File upload failed',
    })
  }
})

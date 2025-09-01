import { z } from 'zod'

export const announcementSchema = z.object({
  title: z.string().trim().min(1, { message: 'Title is required' }),
  description: z.string().trim().min(1, { message: 'Description is required' }),
})

export const fullAnnouncementSchema = announcementSchema.extend({
  id: z.string(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
})

export type AnnouncementInput = z.infer<typeof announcementSchema>
export type Announcement = z.infer<typeof fullAnnouncementSchema>

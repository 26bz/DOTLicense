import { z } from 'zod'

export const announcementSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
})

export const fullAnnouncementSchema = announcementSchema.extend({
  id: z.string(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
})

export type AnnouncementInput = z.infer<typeof announcementSchema>
export type Announcement = z.infer<typeof fullAnnouncementSchema>

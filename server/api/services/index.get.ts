import prisma from '~~/lib/prisma'
import { z } from 'zod'
import { createService } from '~~/shared/utils/abilities'

const serviceSchema = z.object({
  id: z.number(),
  title: z.string(),
  shortDescription: z.string().optional(),
  description: z.string(),
  price: z.string(),
  currency: z.string(),
  buttonLabel: z.string(),
  features: z.array(z.string()).default([]),
  deliveryTimeframe: z.string().optional(),
  includesRevisions: z.boolean(),
  maxRevisions: z.number().optional(),
  includesConsultation: z.boolean(),
  consultationHours: z.number().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  isOneTime: z.boolean(),
  isSubscription: z.boolean(),
  subscriptionInterval: z.string().optional(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
})

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, createService, session.user)

  const services = await prisma.service.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return services.map(service =>
    serviceSchema.parse({
      ...service,
      features: Array.isArray(service.features) ? service.features : [],
    })
  )
})

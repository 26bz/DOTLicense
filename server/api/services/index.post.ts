import { z } from 'zod'
import prisma from '~~/lib/prisma'
import { createService } from '~~/shared/utils/abilities'

const schema = z.object({
  title: z.string().min(2),
  shortDescription: z.string().optional(),
  description: z.string().min(5),
  price: z.string().min(1),
  currency: z.string().default('USD'),
  features: z.array(z.string()).default([]),
  buttonLabel: z.string().min(1),
  deliveryTimeframe: z.string().optional(),
  includesRevisions: z.boolean().default(true),
  maxRevisions: z.number().optional(),
  includesConsultation: z.boolean().default(false),
  consultationHours: z.number().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isOneTime: z.boolean().default(true),
  isSubscription: z.boolean().default(false),
  subscriptionInterval: z.string().optional(),
})

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  await authorize(event, createService, session.user)

  const body = await readBody(event)
  const data = schema.parse({
    ...body,
    features: Array.isArray(body.features) ? body.features : [],
  })

  const service = await prisma.service.create({
    data: {
      title: data.title,
      shortDescription: data.shortDescription,
      description: data.description,
      price: data.price,
      currency: data.currency,
      features: data.features,
      buttonLabel: data.buttonLabel,
      deliveryTimeframe: data.deliveryTimeframe,
      includesRevisions: data.includesRevisions,
      maxRevisions: data.maxRevisions,
      includesConsultation: data.includesConsultation,
      consultationHours: data.consultationHours,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      isOneTime: data.isOneTime,
      isSubscription: data.isSubscription,
      subscriptionInterval: data.subscriptionInterval,
    },
  })

  return {
    success: true,
    service,
  }
})

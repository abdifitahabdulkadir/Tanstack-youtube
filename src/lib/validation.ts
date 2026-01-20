import { z } from 'zod'
import { ItemStates } from '@/generated/prisma/enums'

export const LoginInSchema = z.object({
  email: z.email('Email is required'),
  password: z
    .string()
    .min(1, 'Password is Required')
    .min(8, 'Password should be 8 characters minimum')
    .max(20, 'Password must be less than 20 characters.'),
})

export const SignUpSchema = LoginInSchema.extend({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(4, 'Name should be 4 characters minimum')
    .max(20, 'Name must be less than 20 characters'),
})

export const SingleUrlSchema = z.object({
  url: z.url(),
})
export const BulkUrlSchema = SingleUrlSchema.extend({
  search: z.union([
    z
      .string()
      .min(1, 'Search is required')
      .max(20, 'Search must be less than 20 characters'),
    z.undefined(),
  ]),
})

export const FirecrawlAuthorSchema = z.object({
  author: z.string().nullable(),
  publishedAt: z.string().nullable(),
})

export const SavedItemsSearchSchema = z.object({
  q: z.string().default(""),
  status:z.union([z.literal("all"), z.enum(ItemStates)]).default("all")
})


// export tall types
export type LoginType = z.infer<typeof LoginInSchema>
export type SignUpType = z.infer<typeof SignUpSchema>
export type SingleUrlType = z.infer<typeof SingleUrlSchema>
export type BulkUrlType = z.infer<typeof BulkUrlSchema>
export type FirecrawlAuthorSchemaType = z.infer<typeof FirecrawlAuthorSchema>

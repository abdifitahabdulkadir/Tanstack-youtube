import { firecrawl } from '@/lib/firecrawl.init'
import { authMiddleware } from '@/lib/middlewares'
import { FirecrawlAuthorSchemaType, SingleUrlSchema } from '@/lib/validation'
import { createServerFn } from '@tanstack/react-start'
import prisma from 'prisma/prisma'

export const scrapeSingleUrlFn = createServerFn({ method: 'POST' })
  .inputValidator(SingleUrlSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { url } = data
    const { user } = context.session
    const createdItem = await prisma.savedItem.create({
      data: {
        url,
        tags: '',
        user: {
          connect: {
            id: user.id!,
          },
        },
      },
    })

    try {
      const result = await firecrawl.scrape(url, {
        formats: [
          'markdown',
          {
            type: 'json',
            prompt:
              'Pleas extract author and publishedAt at in an object {author:nmae, publishedAt:timestap}',
          },
        ],
        onlyMainContent: true,
      })

      const json = result.json as FirecrawlAuthorSchemaType
      let publishedAt = null
      if (json.publishedAt) {
        const parsedTimeStamps = new Date(json.publishedAt)
        if (!isNaN(parsedTimeStamps.getTime())) {
          publishedAt = parsedTimeStamps
        }
      }
      const updatedItem = await prisma.savedItem.update({
        where: {
          id: createdItem.id,
        },
        data: {
          title: result.metadata?.title || null,
          content: result.markdown || null,
          summary: result.summary || null,
          ogImage: result.metadata?.ogImage || null,
          status: 'COMPLETED',
          publishedAt,
          author: json.author || null,
        },
      })
      return updatedItem
    } catch (error) {
      console.log(error)
      return await prisma.savedItem.update({
        where: {
          id: createdItem.id,
        },
        data: {
          status: 'FAILED',
        },
      })
    }
  })

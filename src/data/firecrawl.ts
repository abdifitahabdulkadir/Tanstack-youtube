import { firecrawl } from '@/lib/firecrawl.init'
import { authMiddleware } from '@/lib/middlewares'
import {
  BulkUrlSchema,
  FirecrawlAuthorSchemaType,
  SingleUrlSchema,
} from '@/lib/validation'
import { createServerFn } from '@tanstack/react-start'
import prisma from 'prisma/prisma'
import z from 'zod'

async function scrapeSingleUrl({url, userId}:{
  url:string,
  userId:string
}) {

  const createdItem = await prisma.savedItem.create({
    data: {
      url,
      tags: '',
      user: {
        connect: {
          id: userId,
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
  
}
export const scrapeSingleUrlFn = createServerFn({ method: 'POST' })
  .inputValidator(SingleUrlSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
   return  await scrapeSingleUrl({
      url:data.url,
      userId:context.session.user.id
    })
  })

export const buildImportFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(BulkUrlSchema)
  .handler(async ({ data }) => {


    const { url, search } = data
    try {
      const result = await firecrawl.map(url, {
        search: search,
        limit: 20,
      })
     
      return { success: true, data: result }
    } catch (error) {
      return { success: false }
    }
  })


  export const scrapeBulkImports=createServerFn({method:"POST"}).middleware([authMiddleware]).inputValidator(z.object({
    urls:z.array(z.url())
  })).handler(async({data,context})=>{
  for (const url of data.urls) {
   return  await scrapeSingleUrl({
     url,
      userId:context.session.user.id
    })
  }
  })

export const getSavedItems=createServerFn({method:"GET"}).middleware([authMiddleware]).handler(async({context})=>{
  const user=context.session.user;
  return await   prisma.savedItem.findMany({
    where:{
      userId:user.id
    },
    orderBy:{
      createdAt:"desc"
    }
    
  })
})
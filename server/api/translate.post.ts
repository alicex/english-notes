import { Client } from '@notionhq/client'

type Category = '単語' | '会話'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const japanese = body?.japanese
  const category = body?.category as Category | undefined

  if (typeof japanese !== 'string' || !japanese.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: '日本語が空です'
    })
  }

  if (category !== '単語' && category !== '会話') {
    throw createError({
      statusCode: 400,
      statusMessage: 'カテゴリが不正です'
    })
  }

  const config = useRuntimeConfig()

  const notion = new Client({
    auth: config.notionToken
  })

  const translateResponse = await $fetch<{
    english: string
  }>(config.translateApiUrl, {
    method: 'POST',
    body: {
      japanese
    }
  })

  const english = translateResponse.english

  await notion.pages.create({
    parent: {
      database_id: config.notionDatabaseId
    },
    properties: {
      Japanese: {
        title: [
          {
            text: {
              content: japanese
            }
          }
        ]
      },

      English: {
        rich_text: [
          {
            text: {
              content: english
            }
          }
        ]
      },

      Category: {
        select: {
          name: category
        }
      }
    }
  })

  return {
    japanese,
    english,
    category
  }
})
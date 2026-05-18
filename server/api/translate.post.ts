import { Client } from '@notionhq/client'

// カテゴリの型
type Category = '単語' | '会話'

// 翻訳登録API
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const japanese = body?.japanese
  const category = body?.category as Category | undefined

  // 日本語入力のチェック
  if (typeof japanese !== 'string' || !japanese.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: '日本語が空です'
    })
  }

  // カテゴリのチェック
  if (category !== '単語' && category !== '会話') {
    throw createError({
      statusCode: 400,
      statusMessage: 'カテゴリが不正です'
    })
  }

  const config = useRuntimeConfig()

  // Notionクライアントを作成
  const notion = new Client({
    auth: config.notionToken
  })

  // 翻訳APIで英語に変換
  const translateResponse = await $fetch<{
    english: string
  }>(config.translateApiUrl, {
    method: 'POST',
    body: {
      japanese
    }
  })

  const english = translateResponse.english

  // Notion DBへ保存
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

  // 登録結果を返す
  return {
    japanese,
    english,
    category
  }
})
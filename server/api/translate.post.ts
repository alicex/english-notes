import { Client } from '@notionhq/client'

// カテゴリの型
type Category = '単語' | '会話'

// 翻訳登録API
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const japanese = body?.japanese
  const category = body?.category as Category | undefined
  // Kids版はカテゴリなしでKids用DBへ登録
  const isKids = body?.isKids === true

  // 日本語入力のチェック
  if (typeof japanese !== 'string' || !japanese.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: '日本語が空です'
    })
  }

  // カテゴリのチェック
  if (!isKids && category !== '単語' && category !== '会話') {
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

  // 通常版とKids版で保存先DBを切り替え
  const databaseId = isKids
    ? config.notionKidsDatabaseId
    : config.notionDatabaseId

  // Notionへ保存する共通プロパティ
  const properties: Record<string, any> = {
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
    }
  }

  // 通常版だけカテゴリを保存
  if (!isKids) {
    properties.Category = {
      select: {
        name: category
      }
    }
  }

  // Notion DBへ保存
  await notion.pages.create({
    parent: {
      database_id: databaseId
    },
    properties
  })

  // Kids版はカテゴリなしで返す
  if (isKids) {
    return {
      japanese,
      english
    }
  }

  // 登録結果を返す
  return {
    japanese,
    english,
    category
  }
})

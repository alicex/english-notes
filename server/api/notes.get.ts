import { Client } from '@notionhq/client'

// カテゴリの型
type Category = '単語' | '会話'

// 一覧表示用メモの型
type Note = {
  id: string
  japanese: string
  english: string
  category: Category | ''
  createdAt: string
}

// 登録済みメモ一覧を取得
export default defineEventHandler(async (event): Promise<Note[]> => {
  const query = getQuery(event)
  const isKids = query.kids === 'true'
  const config = useRuntimeConfig()

  const databaseId = isKids
    ? config.notionKidsDatabaseId
    : config.notionDatabaseId

  // Notionクライアントを作成
  const notion = new Client({
    auth: config.notionToken
  })

  // Notion DB情報を取得
  const database = await notion.databases.retrieve({
    database_id: databaseId
  })

  // DBに紐づくdata source IDを取得
  const dataSourceId = (database as any).data_sources?.[0]?.id

  if (!dataSourceId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Notion data source が見つかりません'
    })
  }

  // Notion DBから登録済みデータを取得
  const response = await notion.dataSources.query({
    data_source_id: dataSourceId
  })

  // 画面表示用の形式に変換
  return response.results.map((page: any) => {
    const properties = page.properties

    return {
      id: page.id,
      japanese: properties.Japanese?.title?.[0]?.plain_text ?? '',
      english: properties.English?.rich_text?.[0]?.plain_text ?? '',
      category: isKids
        ? ''
        : properties.Category?.select?.name ?? '',
      createdAt:properties.CreatedAt?.created_time ?? ''
    }
  })
})

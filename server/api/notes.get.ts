import { Client } from '@notionhq/client'

type Category = '単語' | '会話'

type Note = {
  id: string
  japanese: string
  english: string
  category: Category | ''
}

export default defineEventHandler(async (): Promise<Note[]> => {
  const config = useRuntimeConfig()

  const notion = new Client({
    auth: config.notionToken
  })

  const database = await notion.databases.retrieve({
    database_id: config.notionDatabaseId
  })

  const dataSourceId = (database as any).data_sources?.[0]?.id

  if (!dataSourceId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Notion data source が見つかりません'
    })
  }

  const response = await notion.dataSources.query({
    data_source_id: dataSourceId
  })

  return response.results.map((page: any) => {
    const properties = page.properties

    return {
      id: page.id,
      japanese: properties.Japanese?.title?.[0]?.plain_text ?? '',
      english: properties.English?.rich_text?.[0]?.plain_text ?? '',
      category: properties.Category?.select?.name ?? ''
    }
  })
})
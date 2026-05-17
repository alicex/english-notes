export default defineNuxtConfig({
  runtimeConfig: {
    notionToken: process.env.NOTION_TOKEN,
    notionDatabaseId: process.env.NOTION_DATABASE_ID,
    translateApiUrl: process.env.TRANSLATE_API_URL
  }
})
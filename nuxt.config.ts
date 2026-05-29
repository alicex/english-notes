export default defineNuxtConfig({
  runtimeConfig: {
    notionToken: process.env.NOTION_TOKEN,
    notionDatabaseId: process.env.NOTION_DATABASE_ID,
    notionKidsDatabaseId: process.env.NOTION_KIDS_DATABASE_ID,
    translateApiUrl: process.env.TRANSLATE_API_URL,
    loginUser: process.env.LOGIN_USER,
    loginPassword: process.env.LOGIN_PASSWORD
  },

  modules: ["@nuxtjs/tailwindcss"]
})

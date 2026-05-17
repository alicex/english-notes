<script setup lang="ts">
type Note = {
  id: string
  japanese: string
  english: string
  category: '単語' | '会話'
}

const { data: notes } = await useFetch<Note[]>('/api/notes')

useHead({
  title: '登録済み一覧 | English Notes'
})
</script>

<template>
  <main class="mx-auto min-h-screen max-w-xl p-6">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold">
        登録済み一覧
      </h1>

      <NuxtLink
        to="/"
        class="text-sm font-bold text-blue-600 hover:underline"
      >
        登録へ戻る
      </NuxtLink>
    </div>

    <ul class="space-y-4">
      <li
        v-for="note in notes"
        :key="note.id"
        class="rounded-lg border border-gray-200 p-4"
      >
        <p class="text-sm text-gray-500">
          {{ note.category }}
        </p>

        <p class="mt-2 text-lg font-bold">
          {{ note.english }}
        </p>

        <p class="mt-1 text-gray-700">
          {{ note.japanese }}
        </p>
      </li>
    </ul>
  </main>
</template>
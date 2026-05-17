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
  <main class="min-h-screen bg-emerald-50 p-6">
    <div class="mx-auto max-w-3xl">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-emerald-900">
            登録済み一覧
          </h1>

          <p class="mt-1 text-sm text-emerald-700">
            登録した英語メモをざっと確認できます
          </p>
        </div>

        <NuxtLink
          to="/"
          class="rounded-xl bg-white px-4 py-2 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100"
        >
          登録へ戻る
        </NuxtLink>
      </div>

      <div class="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
        <div class="grid grid-cols-[88px_1fr_1fr] bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-900">
          <p>カテゴリ</p>
          <p>英語</p>
          <p>日本語</p>
        </div>

        <ul>
          <li
            v-for="note in notes ?? []"
            :key="note.id"
            class="grid grid-cols-[88px_1fr_1fr] items-center border-t border-emerald-100 px-4 py-3 transition hover:bg-emerald-50"
          >
            <p>
              <span
                class="inline-flex rounded-full px-3 py-1 text-xs font-bold"
                :class="[
                  note.category === '単語'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-cyan-100 text-cyan-700'
                ]"
              >
                {{ note.category }}
              </span>
            </p>

            <p class="font-bold text-gray-900">
              {{ note.english }}
            </p>

            <p class="text-gray-700">
              {{ note.japanese }}
            </p>
          </li>
        </ul>
      </div>

      <p
        v-if="!notes?.length"
        class="mt-6 rounded-xl bg-white p-4 text-center text-sm text-emerald-700 ring-1 ring-emerald-100"
      >
        まだ登録がありません
      </p>
    </div>
  </main>
</template>
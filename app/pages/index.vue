<script setup lang="ts">
type Category = '単語' | '会話'

const japanese = ref('')
const category = ref<Category>('単語')
const result = ref('')
const isLoading = ref(false)

const submit = async () => {
  isLoading.value = true

  try {
    const response = await $fetch<{
      japanese: string
      english: string
      category: Category
    }>('/api/translate', {
      method: 'POST',
      body: {
        japanese: japanese.value,
        category: category.value
      }
    })

    result.value = response.english
  }
  finally {
    isLoading.value = false
  }
}

//タイトル
useHead({
  title: '英語を登録 | English Notes'
})
</script>

<template>
  <main class="min-h-screen bg-emerald-50 p-6">
    <div class="mx-auto flex max-w-xl flex-col gap-4">
      <h1 class="text-3xl font-bold text-emerald-900">
        英語翻訳メモ
      </h1>

      <div class="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
        <div class="flex gap-3">
          <input
            v-model="japanese"
            type="text"
            placeholder="日本語を入力"
            class="flex-1 rounded-xl border border-emerald-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
          >

          <select
            v-model="category"
            class="w-28 rounded-xl border border-emerald-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
          >
            <option value="単語">単語</option>
            <option value="会話">会話</option>
          </select>
        </div>

        <button
          type="button"
          :disabled="isLoading"
          class="mt-4 w-full rounded-xl px-4 py-3 font-bold text-white transition"
          :class="[
            isLoading
              ? 'cursor-not-allowed bg-emerald-300'
              : 'bg-emerald-500 hover:bg-emerald-600'
          ]"
          @click="submit"
        >
          {{ isLoading ? '登録中...' : '登録' }}
        </button>

        <p
          v-if="result"
          class="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-900"
        >
          翻訳: {{ result }}
        </p>
      </div>

      <NuxtLink
        to="/notes"
        class="inline-flex w-fit rounded-xl bg-white px-4 py-2 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100"
      >
        一覧を見る
      </NuxtLink>
    </div>
  </main>
</template>
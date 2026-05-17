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
  <main class="mx-auto flex min-h-screen max-w-xl flex-col gap-4 p-6">
    <h1 class="text-3xl font-bold">
      英語翻訳メモ
    </h1>

    <div class="flex gap-3">
      <input
        v-model="japanese"
        type="text"
        placeholder="日本語を入力"
        class="flex-1 rounded-md border border-gray-300 px-4 py-3"
      >

      <select
        v-model="category"
        class="w-28 rounded-md border border-gray-300 px-4 py-3"
      >
        <option value="単語">単語</option>
        <option value="会話">会話</option>
      </select>
    </div>

    <button
      type="button"
      :disabled="isLoading"
      class="rounded-md px-4 py-3 font-bold text-white transition"
      :class="[
        isLoading
          ? 'cursor-not-allowed bg-gray-400'
          : 'bg-black hover:opacity-80'
      ]"
      @click="submit"
    >
      {{ isLoading ? '登録中...' : '登録' }}
    </button>

    <p
      v-if="result"
      class="rounded-md bg-gray-100 p-4"
    >
      翻訳: {{ result }}
    </p>
    
    <NuxtLink
      to="/notes"
      class="inline-flex w-fit rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
    >
      一覧を見る
    </NuxtLink>
  </main>
</template>
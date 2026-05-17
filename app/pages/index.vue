<script setup lang="ts">
type Category = '単語' | '会話'

const japanese = ref('')
const category = ref<Category>('単語')
const result = ref('')

const submit = async () => {
  console.log({
    japanese: japanese.value,
    category: category.value
  })

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

//タイトル
useHead({
  title: '英語を登録 | English Notes'
})
</script>

<template>
  <main>
    <h1>英語翻訳メモ</h1>

    <input
      v-model="japanese"
      type="text"
      placeholder="日本語を入力"
    >

    <select v-model="category">
      <option value="単語">単語</option>
      <option value="会話">会話</option>
    </select>

    <button type="button" @click="submit">
      登録
    </button>

    <p v-if="result">
      翻訳: {{ result }}
    </p>
  </main>
</template>
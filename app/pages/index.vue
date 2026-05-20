<script setup lang="ts">
// カテゴリの型
type Category = '単語' | '会話'

// 入力値
const japanese = ref('')

// 選択中カテゴリ
const category = ref<Category>('単語')

// 翻訳結果
const result = ref('')

// 登録中状態
const isLoading = ref(false)

// 翻訳登録処理
const submit = async () => {
  isLoading.value = true

  try {
    // 翻訳APIへ送信
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

    // 翻訳結果を表示
    result.value = response.english
  }
  finally {
    // ローディング終了
    isLoading.value = false
  }
}

// 発音
const speak = (text: string) => {
  // 再生中停止
  speechSynthesis.cancel()

  const utterance =
    new SpeechSynthesisUtterance(text)

  // 英語設定
  utterance.lang = 'en-US'

  // スピード
  utterance.rate = 0.9

  // 音の高さ
  utterance.pitch = 1.2

  // 音量
  utterance.volume = 1

  // 利用可能音声
  const voices =
    speechSynthesis.getVoices()

  // 英語音声優先
  const selectedVoice =
    voices.find((voice) =>
      voice.name.includes('Google') &&
      voice.lang.includes('en-US')
    )
    ||
    voices.find((voice) =>
      voice.lang.includes('en-US')
    )

  // 音声設定
  if (selectedVoice) {
    utterance.voice = selectedVoice
  }

  // 再生
  speechSynthesis.speak(utterance)
}

// ページタイトル
useHead({
  title: '英語を登録 | English Notes'
})
//ログイン
definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <main class="min-h-screen bg-emerald-50 p-6">
    <div class="mx-auto flex max-w-xl flex-col gap-4">
      <h1 class="text-3xl font-bold text-emerald-900">
        英語翻訳メモ
      </h1>

      <div class="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
      <!-- 日本語入力 -->
      <input
        v-model="japanese"
        type="text"
        placeholder="日本語を入力"
        class="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
      >

      <!-- カテゴリ選択 -->
      <div class="mt-3 flex items-center gap-4 px-1">
        <!-- 単語 -->
        <label
          class="flex cursor-pointer items-center gap-2 text-sm text-emerald-700"
        >
          <input
            v-model="category"
            type="radio"
            value="単語"
            class="accent-emerald-500"
          >

          <span>
            単語
          </span>
        </label>

        <!-- 会話 -->
        <label
          class="flex cursor-pointer items-center gap-2 text-sm text-emerald-700"
        >
          <input
            v-model="category"
            type="radio"
            value="会話"
            class="accent-emerald-500"
          >

          <span>
            会話
          </span>
        </label>
      </div>

        <!-- 登録ボタン -->
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

        <!-- 翻訳結果 -->
        <div
          v-if="result"
          class="mt-4 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 p-4"
        >
          <!-- 翻訳テキスト -->
          <p class="font-bold text-emerald-900">
            翻訳: {{ result }}
          </p>

          <!-- 発音ボタン -->
          <button
            type="button"
            class="text-sm text-emerald-500 transition hover:text-emerald-700"
            @click="speak(result)"
          >
            🔊
          </button>
        </div>
      </div>

      <!-- 一覧ページへのリンク -->
      <NuxtLink
        to="/notes"
        class="inline-flex w-fit rounded-xl bg-white px-4 py-2 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100"
      >
        一覧を見る
      </NuxtLink>
    </div>
  </main>
</template>
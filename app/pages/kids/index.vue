<script setup lang="ts">
// 入力値
const japanese = ref('')

// 翻訳結果
const result = ref('')

// 登録中状態
const isLoading = ref(false)

// エラーメッセージ
const errorMessage = ref('')

// 翻訳登録処理
const submit = async () => {
  if (!japanese.value.trim()) {
    errorMessage.value = 'にほんごを いれてね'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  result.value = ''

  try {
    // 翻訳APIへ送信
    const response = await $fetch<{
      japanese: string
      english: string
    }>('/api/translate', {
      method: 'POST',
      body: {
        japanese: japanese.value,
        isKids: true
      }
    })

    // 翻訳結果を表示
    result.value = response.english
  }
  catch (error: any) {
    errorMessage.value =
      error?.data?.statusMessage ||
      'もういちど やってみてね'
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

  // 6歳向けにゆっくり
  utterance.rate = 0.72

  // 音の高さ
  utterance.pitch = 1.35

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
  title: 'Kids えいごとうろく | English Notes'
})

// ログイン認証
definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <main class="min-h-screen bg-sky-50 px-4 py-6">
    <div class="mx-auto flex max-w-xl flex-col gap-5">
      <!-- ページ見出し -->
      <div class="rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-sky-100">
        <p class="text-sm font-bold text-sky-600">
          6さいからの English Notes
        </p>

        <h1 class="mt-2 text-3xl font-bold text-sky-950">
          えいごを とうろく
        </h1>

        <p class="mt-2 text-base font-bold text-sky-700">
          にほんごを いれると えいごに なるよ
        </p>
      </div>

      <!-- 登録フォーム -->
      <div class="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
        <label
          for="kids-japanese"
          class="mb-2 block text-lg font-bold text-sky-950"
        >
          にほんご
        </label>

        <!-- 日本語入力 -->
        <input
          id="kids-japanese"
          v-model="japanese"
          type="text"
          placeholder="こんにちは"
          class="w-full rounded-2xl border-2 border-sky-200 bg-white px-4 py-4 text-lg font-bold text-sky-950 outline-none transition placeholder:text-sky-300 focus:border-sky-500"
          @keydown.enter="submit"
        >

        <!-- エラー表示 -->
        <p
          v-if="errorMessage"
          class="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600"
        >
          {{ errorMessage }}
        </p>

        <!-- 登録ボタン -->
        <button
          type="button"
          :disabled="isLoading"
          class="mt-5 w-full rounded-2xl px-4 py-4 text-xl font-bold text-white transition"
          :class="[
            isLoading
              ? 'cursor-not-allowed bg-sky-300'
              : 'bg-sky-500 hover:bg-sky-600'
          ]"
          @click="submit"
        >
          {{ isLoading ? 'とうろくちゅう...' : 'とうろくする' }}
        </button>

        <!-- 翻訳結果 -->
        <div
          v-if="result"
          class="mt-5 rounded-2xl border-2 border-lime-100 bg-lime-50 p-4"
        >
          <p class="text-sm font-bold text-lime-700">
            できたよ
          </p>

          <div class="mt-2 flex items-center justify-between gap-3">
            <p class="min-w-0 break-words text-2xl font-bold text-lime-950">
              {{ result }}
            </p>

            <!-- 発音ボタン -->
            <button
              type="button"
              aria-label="えいごをきく"
              class="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-xl text-lime-700 shadow-sm ring-1 ring-lime-200 transition hover:bg-lime-100"
              @click="speak(result)"
            >
              🔊
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap gap-3">
        <!-- 一覧ページへのリンク -->
        <NuxtLink
          to="/kids/notes"
          class="inline-flex rounded-xl bg-white px-4 py-2 text-sm font-bold text-sky-700 ring-1 ring-sky-200 transition hover:bg-sky-100"
        >
          いちらんを みる
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
// Kidsメモの型
type KidsNote = {
  id: string
  japanese: string
  english: string
  createdAt: string
}

// Kids登録済みメモ一覧を取得
const { data: notes } = await useFetch<KidsNote[]>('/api/notes', {
  query: {
    kids: 'true'
  }
})

// 検索キーワード
const searchKeyword = ref('')

// 検索後のメモ一覧
const filteredNotes = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()

  return (notes.value ?? []).filter((note) =>
    !keyword ||
    note.japanese.toLowerCase().includes(keyword) ||
    note.english.toLowerCase().includes(keyword)
  )
})

// 発音
const speak = (text: string) => {
  // 読み上げ中を停止
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

  // 利用可能音声取得
  const voices =
    speechSynthesis.getVoices()

  // 自然な英語音声を優先
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
  title: 'Kids いちらん | English Notes'
})

// ログイン認証
definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <main class="min-h-screen bg-sky-50 px-4 py-6">
    <div class="mx-auto max-w-3xl">
      <!-- ページ見出し -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-sm font-bold text-sky-600">
            6さいからの English Notes
          </p>

          <h1 class="text-3xl font-bold text-sky-950 mt-2">
            おぼえたえいご
          </h1>
        </div>

        <!-- 登録ページへのリンク -->
        <NuxtLink
          to="/kids"
          class="shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-bold text-sky-700 ring-1 ring-sky-200 transition hover:bg-sky-100"
        >
          とうろくへ
        </NuxtLink>
      </div>

      <!-- 検索入力 -->
      <div class="mb-4 rounded-2xl border border-sky-100 bg-white p-3 shadow-sm">
        <input
          v-model="searchKeyword"
          type="text"
          inputmode="search"
          aria-label="にほんご・えいごでさがす"
          placeholder="にほんご・えいごで さがす"
          class="w-full rounded-xl border-2 border-sky-100 bg-white px-4 py-3 text-base font-bold text-sky-950 outline-none transition placeholder:text-sky-300 focus:border-sky-500"
        >
      </div>

      <!-- 表示件数 -->
      <p class="mb-2 text-right text-xs font-bold text-sky-600">
        {{ filteredNotes.length }}こ
      </p>

      <!-- 一覧 -->
      <ul class="space-y-3">
        <li
          v-for="note in filteredNotes"
          :key="note.id"
          class="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm"
        >
          <p class="break-words text-base font-bold text-sky-700">
            {{ note.japanese }}
          </p>

          <div class="mt-2 flex items-center justify-between gap-3">
            <p class="min-w-0 break-words text-2xl font-bold text-sky-950">
              {{ note.english }}
            </p>

            <!-- 発音ボタン -->
            <button
              type="button"
              aria-label="えいごをきく"
              class="flex size-11 shrink-0 items-center justify-center rounded-full bg-sky-50 text-lg text-sky-700 ring-1 ring-sky-100 transition hover:bg-sky-100"
              @click="speak(note.english)"
            >
              🔊
            </button>
          </div>
        </li>
      </ul>

      <!-- 空状態 -->
      <p
        v-if="!notes?.length"
        class="mt-6 rounded-2xl bg-white p-4 text-center text-sm font-bold text-sky-700 ring-1 ring-sky-100"
      >
        まだ とうろくが ありません
      </p>

      <!-- 検索結果なし -->
      <p
        v-else-if="!filteredNotes.length"
        class="mt-6 rounded-2xl bg-white p-4 text-center text-sm font-bold text-sky-700 ring-1 ring-sky-100"
      >
        みつかりませんでした
      </p>
    </div>
  </main>
</template>

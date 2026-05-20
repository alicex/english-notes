<script setup lang="ts">
// メモの型
type Note = {
  id: string
  japanese: string
  english: string
  category: '単語' | '会話'
  createdAt: string
}

// 登録済みメモ一覧を取得
const { data: notes } = await useFetch<Note[]>('/api/notes')

// 発音
const speak = (text: string) => {
  // 読み上げ中を停止
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
  title: '登録済み一覧 | English Notes'
})

// ログイン認証
definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <main class="min-h-screen bg-emerald-50 p-6">
    <div class="mx-auto max-w-4xl">
      <!-- ページ見出し -->
      <div class="mb-6 flex items-center justify-between gap-x-2">
        <div>
          <h1 class="text-3xl font-bold text-emerald-900">
            登録済み一覧
          </h1>

          <p class="mt-1 text-sm text-emerald-700">
            登録した英語メモをざっと確認できます
          </p>
        </div>

        <!-- 登録ページへのリンク -->
        <NuxtLink
          to="/"
          class="shrink rounded-xl bg-white px-4 py-2 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100"
        >
          登録へ戻る
        </NuxtLink>
      </div>

      <!-- 一覧テーブル -->
      <div
        class="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm"
      >
        <!-- テーブル見出し -->
        <div
          class="grid grid-cols-[1fr_1fr_60px_60px] gap-x-1 bg-emerald-100 px-2 py-3 text-sm font-bold text-emerald-900"
        >
          <p>英語</p>
          <p>日本語</p>
          <p class="text-center">カテゴリ</p>
          <p class="text-center">登録日</p>
        </div>

        <ul>
          <!-- メモ一覧 -->
          <li
            v-for="note in notes ?? []"
            :key="note.id"
            class="grid grid-cols-[1fr_1fr_60px_60px] gap-x-1 items-center border-t border-emerald-100 px-2 py-3 transition hover:bg-emerald-50"
          >

            <!-- 日本語 -->
            <p class="text-gray-700">
              {{ note.japanese }}
            </p>

            <!-- 英語 -->
            <div class="flex items-center gap-2">
              <p class="font-bold text-gray-900">
                {{ note.english }}
              </p>

              <!-- 発音ボタン -->
              <button
                type="button"
                class="text-sm text-emerald-500 transition hover:text-emerald-700"
                @click="speak(note.english)"
              >
                🔊
              </button>
            </div>

            <!-- カテゴリ -->
            <p class="text-center">
              <span
                class="inline-flex rounded-full px-2 py-1 text-xs font-bold"
                :class="[
                  note.category === '単語'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-cyan-100 text-cyan-700'
                ]"
              >
                {{ note.category }}
              </span>
            </p>
            
            <!-- 登録日 -->
            <p class="text-xs text-gray-400">
              {{
                new Date(note.createdAt)
                  .toLocaleDateString('ja-JP')
              }}
            </p>
          </li>
        </ul>
      </div>

      <!-- 空状態 -->
      <p
        v-if="!notes?.length"
        class="mt-6 rounded-xl bg-white p-4 text-center text-sm text-emerald-700 ring-1 ring-emerald-100"
      >
        まだ登録がありません
      </p>
    </div>
  </main>
</template>
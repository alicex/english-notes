<script setup lang="ts">
// メモの型
type Note = {
  id: string
  japanese: string
  english: string
  category: '単語' | '会話' | ''
  createdAt: string
}

// カテゴリ絞り込みの型
type CategoryFilter = 'すべて' | '単語' | '会話'

// 登録済みメモ一覧を取得
const { data: notes } = await useFetch<Note[]>('/api/notes')

// 検索キーワード
const searchKeyword = ref('')

// 選択中カテゴリ
const selectedCategory = ref<CategoryFilter>('すべて')

// 検索・絞り込みパネルの開閉状態
const isFilterOpen = ref(false)

// カテゴリ選択肢
const categoryOptions: Exclude<CategoryFilter, 'すべて'>[] = [
  '会話',
  '単語'
]

// 検索・絞り込み条件が設定されているか
const hasFilter = computed(() =>
  searchKeyword.value.trim() !== '' ||
  selectedCategory.value !== 'すべて'
)

// 検索・カテゴリ絞り込み後のメモ一覧
const filteredNotes = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()

  return (notes.value ?? []).filter((note) => {
    const matchesKeyword =
      !keyword ||
      note.japanese.toLowerCase().includes(keyword) ||
      note.english.toLowerCase().includes(keyword)

    const matchesCategory =
      selectedCategory.value === 'すべて' ||
      note.category === selectedCategory.value

    return matchesKeyword && matchesCategory
  })
})

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
            登録メモ一覧
          </h1>

          <p class="mt-1 text-sm text-emerald-700">
            登録した英語メモを確認できます
          </p>
        </div>

        <!-- 登録ページへのリンク -->
        <NuxtLink
          to="/"
          class="shrink-0 whitespace-nowrap rounded-xl bg-white px-3 py-2 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100 sm:px-4"
        >
          登録へ戻る
        </NuxtLink>
      </div>

      <!-- 検索・絞り込み -->
      <div
        class="mb-4 rounded-xl border border-emerald-100 bg-white px-3 py-1.5 transition-all"
        :class="[
          hasFilter
            ? 'sticky top-3 z-20 shadow-md shadow-emerald-900/10'
            : 'shadow-sm'
        ]"
      >
        <div class="flex items-center justify-between gap-3">
          <!-- 開閉ボタン -->
          <button
            type="button"
            class="flex items-center gap-2 rounded-xl px-3 py-1 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
            @click="isFilterOpen = !isFilterOpen"
          >
            <span>
              検索・絞り込み
            </span>

            <span class="text-xs">
              {{ isFilterOpen ? '▲' : '▼' }}
            </span>
          </button>

          <div class="flex items-center gap-2">
            <!-- カテゴリ選択を解除 -->
            <button
              type="button"
              class="w-24 rounded-lg px-1 py-1 text-[11px] font-semibold transition"
              :class="[
                selectedCategory === 'すべて'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-emerald-500 hover:bg-emerald-50'
              ]"
              @click="selectedCategory = 'すべて'"
            >
              カテゴリ選択なし
            </button>
          </div>
        </div>

        <div
          v-if="isFilterOpen"
          class="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 pb-1"
        >
          <!-- 検索入力 -->
          <div class="relative">
            <input
              v-model="searchKeyword"
              type="text"
              inputmode="search"
              aria-label="日本語・英語で検索"
              placeholder="日本語・英語で検索"
              class="w-full rounded-xl border border-emerald-200 bg-white py-2 pl-4 pr-10 text-base outline-none transition placeholder:text-emerald-300 focus:border-emerald-500 md:text-sm"
            >

            <button
              v-if="searchKeyword"
              type="button"
              aria-label="検索キーワードを消去"
              class="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-base font-bold leading-none text-emerald-400 transition hover:bg-emerald-50 hover:text-emerald-700"
              @click="searchKeyword = ''"
            >
              ×
            </button>
          </div>

          <!-- カテゴリ絞り込み -->
          <div
            class="grid min-w-24 grid-cols-2 rounded-lg bg-emerald-50 p-0.5 ring-1 ring-emerald-100"
          >
            <button
              v-for="option in categoryOptions"
              :key="option"
              type="button"
              class="rounded-md px-2 py-1 text-xs font-semibold transition"
              :class="[
                selectedCategory === option
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-emerald-500 hover:bg-white/70'
              ]"
              @click="selectedCategory = option"
            >
              {{ option }}
            </button>
          </div>
        </div>
      </div>

      <!-- 表示件数 -->
      <p class="mb-2 text-right text-xs font-bold text-emerald-600">
        {{ filteredNotes.length }}件
      </p>

      <!-- 一覧テーブル -->
      <div
        class="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm"
      >
        <!-- テーブル見出し -->
        <div
          class="grid grid-cols-[1fr_1fr_60px] gap-x-1 bg-emerald-100 px-2 py-3 text-sm font-bold text-emerald-900"
        >
          <p>英語</p>
          <p>日本語</p>
          <p class="text-center">カテゴリ</p>
        </div>

        <ul>
          <!-- メモ一覧 -->
          <li
            v-for="note in filteredNotes"
            :key="note.id"
            class="grid grid-cols-[1fr_1fr_60px] gap-x-1 items-center border-t border-emerald-100 px-2 py-3 transition hover:bg-emerald-50"
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

      <!-- 検索結果なし -->
      <p
        v-else-if="!filteredNotes.length"
        class="mt-6 rounded-xl bg-white p-4 text-center text-sm text-emerald-700 ring-1 ring-emerald-100"
      >
        条件に一致するメモがありません
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
// ID入力
const user = ref('')

// パスワード入力
const password = ref('')

// エラーメッセージ
const errorMessage = ref('')

// ログイン中状態
const loading = ref(false)

// ログイン処理
const login = async () => {
  try {
    // ローディング開始
    loading.value = true

    // エラー初期化
    errorMessage.value = ''

    // ログインAPI呼び出し
    await $fetch('/api/login', {
      method: 'POST',
      body: {
        user: user.value,
        password: password.value
      }
    })

    // ログイン成功後トップへ移動
    await navigateTo('/')

  } catch (error: any) {
    // エラーメッセージ表示
    errorMessage.value =
      error?.data?.statusMessage ||
      'ログイン失敗'

  } finally {
    // ローディング終了
    loading.value = false
  }
}

// ページタイトル
useHead({
  title: 'ログイン | English Notes'
})
</script>

<template>
  <!-- 背景 -->
  <main class="min-h-screen bg-emerald-50 px-4">
    <!-- 中央寄せ -->
    <div class="mx-auto flex min-h-screen max-w-md items-center">
      <!-- カード -->
      <div
        class="w-full rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm"
      >
        <!-- タイトル -->
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-bold text-emerald-900">
            English Notes
          </h1>

          <p class="mt-2 text-sm text-emerald-700">
            英語翻訳メモアプリ
          </p>
        </div>

        <!-- 入力フォーム -->
        <div class="space-y-4">
          <!-- ID入力 -->
          <div>
            <label
              class="mb-1 block text-sm font-bold text-emerald-900"
            >
              ID
            </label>

            <input
              v-model="user"
              type="text"
              placeholder="IDを入力"
              class="w-full rounded-xl border border-emerald-200 px-4 py-3 outline-none transition focus:border-emerald-500"
            />
          </div>

          <!-- パスワード入力 -->
          <div>
            <label
              class="mb-1 block text-sm font-bold text-emerald-900"
            >
              Password
            </label>

            <input
              v-model="password"
              type="password"
              placeholder="Passwordを入力"
              class="w-full rounded-xl border border-emerald-200 px-4 py-3 outline-none transition focus:border-emerald-500"
            />
          </div>

          <!-- エラー表示 -->
          <p
            v-if="errorMessage"
            class="text-sm font-bold text-red-500"
          >
            {{ errorMessage }}
          </p>

          <!-- ログインボタン -->
          <button
            @click="login"
            :disabled="loading"
            class="w-full rounded-xl bg-emerald-500 py-3 font-bold text-white transition hover:bg-emerald-600 disabled:opacity-50"
          >
            {{ loading ? 'ログイン中...' : 'ログイン' }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
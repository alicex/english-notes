<script setup lang="ts">
const user = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

const login = async () => {
  try {
    loading.value = true
    errorMessage.value = ''

    await $fetch('/api/login', {
      method: 'POST',
      body: {
        user: user.value,
        password: password.value
      }
    })

    await navigateTo('/')

  } catch (error: any) {
    errorMessage.value =
      error?.data?.statusMessage ||
      'ログイン失敗'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-xl shadow w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">
        ログイン
      </h1>

      <div class="space-y-4">
        <input
          v-model="user"
          type="text"
          placeholder="ID"
          class="w-full border rounded-lg px-4 py-2"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full border rounded-lg px-4 py-2"
        />

        <button
          @click="login"
          :disabled="loading"
          class="w-full bg-blue-500 text-white py-2 rounded-lg"
        >
          {{ loading ? 'Loading...' : 'ログイン' }}
        </button>

        <p
          v-if="errorMessage"
          class="text-red-500 text-sm"
        >
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </div>
</template>
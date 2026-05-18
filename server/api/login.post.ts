export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const config = useRuntimeConfig()

  const { user, password } = body

  // 認証チェック
  if (
    user !== config.loginUser ||
    password !== config.loginPassword
  ) {
    throw createError({
      statusCode: 401,
      statusMessage: 'IDまたはパスワードが違います'
    })
  }

  // Cookie保存
  setCookie(event, 'auth', 'ok', {
    httpOnly: false,
    sameSite: 'lax',
    secure: false,
    maxAge: 60 * 60 * 24 * 90 // 60秒 × 60分 × 24時間 × 90日
  })

  return {
    success: true
  }
})
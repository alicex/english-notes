// Basic認証
export default defineEventHandler((event) => {
  const config = useRuntimeConfig()

  // Authorizationヘッダーを取得
  const auth = getHeader(event, 'authorization')

  // Authorizationヘッダーの存在チェック
  if (!auth || !auth.startsWith('Basic ')) {
    setResponseHeader(event, 'WWW-Authenticate', 'Basic realm="English Notes"')

    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization required'
    })
  }

  // Basic認証文字列を取得
  const encoded = auth.replace('Basic ', '')

  if (!encoded) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization required'
    })
  }

  // Base64をデコード
  const decoded = Buffer.from(encoded, 'base64').toString('utf-8')

  // ユーザー名とパスワードを分割
  const [user, password] = decoded.split(':')

  // 認証チェック
  if (
    user !== config.basicAuthUser ||
    password !== config.basicAuthPassword
  ) {
    setResponseHeader(event, 'WWW-Authenticate', 'Basic realm="English Notes"')

    throw createError({
      statusCode: 401,
      statusMessage: 'Bad credentials'
    })
  }
})
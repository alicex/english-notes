export default defineEventHandler((event) => {
  const config = useRuntimeConfig()

  const auth = getHeader(event, 'authorization')

  if (!auth || !auth.startsWith('Basic ')) {
    setResponseHeader(event, 'WWW-Authenticate', 'Basic realm="English Notes"')

    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization required'
    })
  }

  const encoded = auth.replace('Basic ', '')

  if (!encoded) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization required'
    })
  }

  const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
  const [user, password] = decoded.split(':')

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
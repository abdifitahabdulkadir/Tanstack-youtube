import { getUserSessionFn } from '@/data/auth'
import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from './auth'

export const authMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const session = await getUserSessionFn()
    return next({ context: { session } })
  },
)

// by defualt is request middleware.
export const globalAuthMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const url = new URL(request.url)
    if (!url.pathname.startsWith('/dashboard')) {
      return next()
    }
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) {
      throw redirect({ to: '/login' })
    }
    return next({ context: { session: session.session, user: session.user } })
  },
)

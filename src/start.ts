import { createStart } from '@tanstack/react-start'
import { globalAuthMiddleware } from './lib/middlewares'

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [globalAuthMiddleware],
  }
})

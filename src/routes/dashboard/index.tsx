import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  // preload allows to cehck if user is authenticated, redirect it to
  // another pages and do per-mutch everything you need.
  beforeLoad: () => {
    throw redirect({ to: '/dashboard/import' })
  },
})

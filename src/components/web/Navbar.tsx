import { authClient } from '@/lib/auth-client'
import { Link, useNavigate } from '@tanstack/react-router'
import { useTransition } from 'react'
import toast from 'react-hot-toast'
import { Button, buttonVariants } from '../ui/button'
import { ThemeToggle } from './ThemeToggle'

export default function Navbar() {
  const { data: session } = authClient.useSession()
  const [transition, startTransition] = useTransition()
  const navigate = useNavigate()

  async function handleSignOut() {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess() {
            toast.success('Successfully Signout')
            navigate({ to: '/login' })
          },
          onError() {
            toast.error('Failed to sign In')
          },
        },
      })
    })
  }
  return (
    <nav className="sticky top-0 b supports-backdrop-filter:bg-background/95 z-50 border-b bg-background backdrop-blur-2xl ">
      <div className="mx-auto flex items-center justify-between h-16 max-w-6xl px-4">
        <div className="flex items-center gap-2">
          <img
            src="https://tanstack.com/images/logos/logo-color-banner-600.png"
            alt="tanstack start logo"
            className="size-8"
          />
          <h2 className="font-semibold text-lg">Tanstack Start</h2>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {session?.session ? (
            <>
              <Link
                disabled={transition}
                to="/dashboard"
                className={buttonVariants()}
              >
                Dashboard
              </Link>
              <Button
                disabled={transition}
                onClick={handleSignOut}
                className="bg-red-500 transition ease-linear hover:bg-red-400 text-white"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={buttonVariants({ variant: 'secondary' })}
              >
                Login In
              </Link>
              <Link to="/signup" className={buttonVariants()}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

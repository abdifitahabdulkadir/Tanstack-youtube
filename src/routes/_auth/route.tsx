import { buttonVariants } from '@/components/ui/button'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen relative">
      <div className="absolute top-7 left-7 ">
        <Link to="/" className={buttonVariants({ variant: 'secondary' })}>
          <ArrowLeft />
          Back Home
        </Link>
      </div>
      <div className="flex h-screen w-full  items-center justify-center">
        <Outlet />
      </div>
    </div>
  )
}

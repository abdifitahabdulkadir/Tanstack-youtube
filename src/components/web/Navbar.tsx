import { Button } from '../ui/button'
import { ThemeToggle } from './ThemeToggle'

export default function Navbar() {
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
          <Button className="">Login In</Button>
        </div>
      </div>
    </nav>
  )
}

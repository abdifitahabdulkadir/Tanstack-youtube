import Navbar from '@/components/web/Navbar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="min-h-screen w-full ">
      <Navbar />
    </main>
  )
}

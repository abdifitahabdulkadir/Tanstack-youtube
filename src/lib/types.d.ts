import { type User } from 'better-auth'
import { LucideIcon } from 'lucide-react'
interface PrimaryNavProps {
  items: {
    title: string
    to: string
    icon: LucideIcon
    activeOptions: {
      exact: boolean
    }
  }[]
}

interface NavUserPrope {
  user: User
}

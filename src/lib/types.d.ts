import type { User } from 'better-auth';
import type { LucideIcon } from 'lucide-react';

interface PrimaryNavProps {
  items: Array<{
    title: string
    to: string
    icon: LucideIcon
    activeOptions: {
      exact: boolean
    }
  }>
}

interface NavUserPrope {
  user: User
}

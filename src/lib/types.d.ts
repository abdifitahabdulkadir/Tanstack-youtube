interface PrimaryNavProps {
  items: {
    title: string
    url: string
    icon: LucideIcon
    activeOptions: {
      exact: boolean
    }
  }[]
}

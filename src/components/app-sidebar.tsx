'use client'
import { Bookmark, BookmarkIcon, Compass, Import } from 'lucide-react'
import { Activity } from 'react'

import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { NavUserPrope, PrimaryNavProps } from '@/lib/types'
import { linkOptions } from '@tanstack/react-router'
import { NavPrimary } from './nav-primary'

const navItems: PrimaryNavProps['items'] = linkOptions([
  {
    title: 'Import',
    icon: Import,
    to: '/dashboard/import',
    activeOptions: { exact: false },
  },
  {
    title: 'Items',
    to: '/dashboard/items',
    icon: BookmarkIcon,
    activeOptions: { exact: false },
  },
  {
    title: 'Discover',
    icon: Compass,
    to: '/dashboard/discover',
    activeOptions: { exact: false },
  },
])

export function AppSidebar({ user }: NavUserPrope) {
  const { state } = useSidebar()
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <div className="bg-sidebar-primary aspect-square rounded-full w-fit text-primary-foreground px-2 flex items-center justify-center">
              <Bookmark />
            </div>
            <Activity mode={state === 'expanded' ? 'visible' : 'hidden'}>
              <div className="flex flex-col">
                <span className="font-bold">Recall</span>
                <p>AI Knowledge Base</p>
              </div>
            </Activity>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavPrimary items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

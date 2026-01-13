'use client'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { PrimaryNavProps } from '@/lib/types'
import { Link } from '@tanstack/react-router'

export function NavPrimary({ items }: PrimaryNavProps) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1.5">
          {items.map((item, index) => {
            return (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild size={'sm'}>
                  <Link
                    activeProps={{
                      'data-active': true,
                    }}
                    to={item.to}
                    activeOptions={item.activeOptions}
                  >
                    <item.icon />
                    <span className="text-lg"> {item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

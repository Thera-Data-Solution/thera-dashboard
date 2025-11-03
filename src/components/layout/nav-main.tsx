"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Link, useRouterState } from "@tanstack/react-router"

interface NavMainProps {
  items: {
    title: string
    url: string
    path?: string
    icon: LucideIcon
    items?: {
      title: string
      url: string
    }[]
  }[]
}

export function NavMain({ items }: NavMainProps) {
  const router = useRouterState()
  const currentPath = router.location.pathname

  return (
    <SidebarGroup>
      <SidebarGroupLabel>App</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isOpen = currentPath.includes(item.path ?? "#")
          return (
            <Collapsible key={item.title} asChild defaultOpen={isOpen}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>

                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => {
                          const isActive = currentPath === subItem.url
                          return (
                            <SidebarMenuSubItem
                              key={subItem.title}
                              className={isActive ? "bg-secondary" : ""}
                            >
                              <SidebarMenuSubButton asChild>
                                <Link to={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

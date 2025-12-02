"use client"

import * as React from "react"
import {
  LifeBuoy,
  MoveLeft,
  Send,
} from "lucide-react"

import { NavMain } from ".//nav-main"
import { NavProjects } from "./nav-project"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from ".//nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SUPER_ADMIN_MENU } from "@/constants/menu"
import useAuthStore from "@/store/authStore"
import { useActiveMenu } from "@/lib/activeMenu"
import { Link } from "@tanstack/react-router"

const data = {
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore((state) => state);
  const x = useActiveMenu();
  const parents = x?.parent ? [x.parent] : [];

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <MoveLeft className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Back To Dashboard</span>
                  <span className="truncate text-xs">Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={parents} />
        {user && user.role === 'SU' && (
          <NavProjects projects={SUPER_ADMIN_MENU} />
        )}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}

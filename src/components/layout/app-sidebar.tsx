"use client"

import * as React from "react"
import {
  LifeBuoy,
  MoveLeft,
  Send
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
import { DEFAULT_MENU, SUPER_ADMIN_MENU } from "@/constants/menu"
import useAuthStore from "@/store/authStore"
import { Link, useRouterState } from "@tanstack/react-router"
import { getParentPath } from "@/lib/cuteMenu"

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
  const { user, menu } = useAuthStore((state) => state);
  const state = useRouterState();
  const currentPath = state.location.pathname;
  const parentPath = getParentPath(currentPath);
  const filteredMenu = DEFAULT_MENU.filter((item) =>
    (menu.includes(item.type) || item.type === "all") &&
    item.path === parentPath
  );


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
        {
          parentPath !== "/app/admin" && (
            <NavMain items={filteredMenu} />
          )
        }
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

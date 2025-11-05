"use client";

import {
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";

import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const [showAll, setShowAll] = useState(false);
  const visibleItems = showAll ? projects : projects.slice(0, 3);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Tenant Management</SidebarGroupLabel>
      <SidebarMenu>
        {visibleItems.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        {projects.length > 3 && (
          <div className="px-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? "Show Less" : `Show More (${projects.length - 3})`}
            </Button>
          </div>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

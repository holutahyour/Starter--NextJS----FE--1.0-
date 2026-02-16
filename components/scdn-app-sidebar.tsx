"use client";

import * as React from "react";

import { NavMain } from "@/components/sdcn-nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sdcn-sidebar";
import { sidebarData } from "@/data/sidebar-data";
import AppLogo from "./app/app-logo";
import { useRoleSelection } from "@/app/context/roleSelection-context";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
        const {  selectedRole } = useRoleSelection();
  

        const navigationItems = sidebarData(selectedRole??'');

// console.log("navigationItems", navigationItems,selectedRole);
  return (
    <Sidebar className="" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <AppLogo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationItems}  disableSubMenu={false} />
        {/* <NavProjects projects={sidebarData.projects} /> */}
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

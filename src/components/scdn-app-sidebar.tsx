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
import { IMenu, sidebarData } from "@/data/sidebar-data";
import AppLogo from "./app/app-logo";
import { useRoleSelection } from "@/context/roleSelection-context";
import apiHandler from "@/data/api/ApiHandler";
import { useMenus } from "@/hooks/useMenus";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { selectedRole } = useRoleSelection();
  const { menus, isLoading, error } = useMenus();

  //const navigationItems = sidebarData(selectedRole ?? '');

  const [navigationItems, setNavigationItems] = React.useState<IMenu[]>([])

  React.useEffect(() => {
    apiHandler.menus.my_menus().then(menus => {
      setNavigationItems(menus.content);
    })
  }, [])


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
        {isLoading ? (
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="p-4">
            <p className="text-red-500 text-sm">Error Loading Menus: {error}</p>
          </div>
        ) : (
          <NavMain items={navigationItems} disableSubMenu={false} />
        )}
        {/* <NavProjects projects={sidebarData.projects} /> */}
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

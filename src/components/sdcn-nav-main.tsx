"use client";
import { ChevronRight, type LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/sdcn-collapsible";
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
} from "@/components/ui/sdcn-sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { capitalizeText, text_to_icon } from "@/utils/stringExtensions";

export function NavMain({
  items,
  isSubMenus,
  disableSubMenu,
}: {
  items: {
    label: string;
    route: string;
    icon: string;
    isActive?: boolean;
    children?: {
      label: string;
      route: string;
    }[];
  }[];
  isSubMenus?: boolean;
  disableSubMenu?: boolean;
}) {
  const pathname = usePathname();
  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[text_to_icon(iconName)] || Icons.HelpCircle;
    return <IconComponent size={20} />;
  };

  return (
    <SidebarGroup>
      {/* {!isSubMenus && <SidebarGroupLabel>Platform</SidebarGroupLabel>} */}
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.label} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              {item.children?.length && !disableSubMenu ? (
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <Link
                      href={item.route ?? ""}
                      className={
                        !isSubMenus
                          ? `flex justify-between items-center p-2 py-5 ${pathname === item.route ? "bg-primary text-educ8_white-1 font-bold" : ""}`
                          : `flex justify-between items-center ${pathname === item.route ? "border-r-[3px] text-primary border-primary rounded-none" : ""}`
                      }
                      prefetch
                    >
                      <div className="flex items-center gap-2">
                        {renderIcon(item.icon)}
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="transition-transform data-[state=open]:rotate-90" />
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              ) : (
                <SidebarMenuButton asChild tooltip={item.label}>
                  <Link
                    href={item.route ?? ""}
                    className={
                      !isSubMenus
                        ? `p-2 py-5 ${pathname === item.route ? "bg-primary text-educ8_white-1 font-bold" : ""}`
                        : `${pathname === item.route ? "border-r-[3px] text-primary border-primary rounded-none" : ""}`
                    }
                    prefetch
                  >
                    <div className="flex items-center gap-2">
                      {renderIcon(item.icon)}
                      <span>{item.label}</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              )}

              {item.children?.length && !disableSubMenu ? (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.children.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.label}>
                        <SidebarMenuSubButton
                          className={
                            pathname === subItem.route
                              ? "border-r-[4px] border-primary rounded-r-none"
                              : ""
                          }
                          asChild
                        >
                          <Link href={subItem.route ?? ""} prefetch>
                            {renderIcon(item.icon)}
                            <span>{subItem.label ?? ""}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

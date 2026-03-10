"use client"

import {
  Bell,
  LogOut,
  User,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/sdcn-avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/sdcn-dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sdcn-sidebar"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
import { AzureUser, useAzureAuth } from "@/context/auth-context"
import { getInitials } from "@/lib/utils"
import { useRoleSelection } from "@/context/roleSelection-context"
import { useEffect, useState } from "react"
import { startSignalRConnection } from "@/lib/signalrClient"
import { formatDistanceToNow } from "date-fns"

type Notification = {
  id: number
  title: string
  message: string
  receivedAt: Date
}

export function NavUser({ user }: { user: AzureUser | null }) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const { signOut } = useAzureAuth()
  const { availableRoles, selectedRole, selectRole } = useRoleSelection()
  const [notifications, setNotifications] = useState<Notification[]>([])

  const clearNotifications = () => setNotifications([])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-3 w-full">

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="flex items-center gap-3 flex-1 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(user?.name ?? "")}
                  </AvatarFallback>
                </Avatar>

                <div className="grid text-left text-sm leading-tight overflow-hidden">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                  <span className="truncate text-xs">{selectedRole}</span>
                </div>

                <CaretSortIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side="bottom"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal text-center">
                User Roles
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                {availableRoles.map((role) => (
                  <DropdownMenuItem key={role} onClick={() => selectRole(role)}>
                    <User className="mr-2 h-4 w-4" />
                    {role}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

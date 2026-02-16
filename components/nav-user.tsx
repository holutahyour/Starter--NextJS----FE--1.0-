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
import { AzureUser, useAzureAuth } from "@/app/context/auth-context"
import { getInitials } from "@/lib/utils"
import { useRoleSelection } from "@/app/context/roleSelection-context"
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

  useEffect(() => {
    let connection: any

    const connect = async () => {
      connection = await startSignalRConnection()

      connection.on("ReceiveNotification", (data: Omit<Notification, "receivedAt">) => {
        setNotifications((prev) => [
          { ...data, receivedAt: new Date() },
          ...prev,
        ])
      })

      // Fake test notification (for local testing without server)
      // setTimeout(() => {
      //   setNotifications((prev) => [
      //     {
      //       id: Date.now(),
      //       title: "Students Payment Update",
      //       message: "Students Payment Records has been Updated",
      //       receivedAt: new Date(),
      //     },

      //     {
      //       id: Date.now(),
      //       title: "Your Push Payment Reciept was Successfull",
      //       message: "your action on push payment reciept has been completed",
      //       receivedAt: new Date(),
      //     },
      //     ...prev,
      //   ])
      // }, 5000)
    }

    connect()

    return () => {
      if (connection) {
        connection.off("ReceiveNotification")
      }
    }
  }, [])

  const clearNotifications = () => setNotifications([])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-3 w-full">

          {/* Notifications Dropdown */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="relative rounded-md p-2 hover:bg-muted mr-5"
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white">
                    {notifications.length}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-72 max-w-full rounded-lg w-[28rem] mr-[4rem]"
              side="bottom"
              align="start"
              sideOffset={8}
            >
              <div className="flex justify-between items-center px-4 py-2">
                <span className="font-semibold text-base">Notifications</span>
                <button
                  onClick={clearNotifications}
                  className="text-sm text-red-600 hover:underline"
                >
                  Clear All
                </button>
              </div>

              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {notifications.length === 0 ? (
                  <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
                ) : (
                  notifications.map((notif) => (
    <DropdownMenuItem
  key={notif.id}
  className="flex items-center justify-between space-x-3 mr-5 px-4 py-2 bg-transparent hover:bg-transparent focus:bg-transparent"
>
  <div className="flex items-center space-x-2 min-w-0 max-w-[75%]">
    <Bell className="w-5 h-5 text-green-400 flex-shrink-0" />
    <div className="flex flex-col overflow-hidden min-w-0">
      <span className="text-sm font-medium truncate">{notif.title}</span>
      <span className="text-xs text-muted-foreground truncate">{notif.message}</span>
    </div>
  </div>
  <time
    className="text-xs text-muted-foreground whitespace-nowrap text-right"
    dateTime={notif.receivedAt.toISOString()}
    title={notif.receivedAt.toLocaleString()}
  >
    {formatDistanceToNow(notif.receivedAt, { addSuffix: true })}
  </time>
</DropdownMenuItem>

                  ))
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-center text-sm text-blue-600 hover:underline">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}

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

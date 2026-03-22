"use client";

import AppPageHeader from "@/components/app/app-page-header";
import { NavMain } from "@/components/sdcn-nav-main";
import { SidebarProvider } from "@/components/ui/sdcn-sidebar";
import { sidebarData } from "@/data/sidebar-data";
import { GENERAL_SETUP, NOTIFICATIONS } from "@/lib/routes";
import { Grid, GridItem, HStack, Stack } from "@chakra-ui/react";
import { Bell } from "lucide-react";

interface PageLayoutProps extends React.PropsWithChildren<{}> { }

function ParameterLayout({ children }: PageLayoutProps) {
  // const [user] = useAuth();

  // if (!user) return <AppLoader />;

  return (
    <>
      <AppPageHeader title="Notifications" Icon={Bell} />
      <Stack mx={{ base: "4", lg: "6" }} gap="6" pt="2">
        {children}
      </Stack>
    </>
  );
}

export default ParameterLayout;

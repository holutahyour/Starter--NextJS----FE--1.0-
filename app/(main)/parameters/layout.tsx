"use client";

import AppPageHeader from "@/components/app/app-page-header";
import { NavMain } from "@/components/sdcn-nav-main";
import { SidebarProvider } from "@/components/ui/sdcn-sidebar";
import { sidebarData } from "@/data/sidebar-data";
import { GENERAL_SETUP, SCHOOL_CONFIG } from "@/lib/routes";
import { Grid, GridItem, HStack, Stack } from "@chakra-ui/react";
import { Cog, SlidersHorizontal } from "lucide-react";
import AppLoader from "../_components/app-loader";
import { useAuth } from "@/hooks/use-auth";

interface PageLayoutProps extends React.PropsWithChildren<{}> {}

function ParameterLayout({ children }: PageLayoutProps) {
  // const [user] = useAuth();

  // if (!user) return <AppLoader />;

  return (
    <>
      <AppPageHeader title="Parameter" Icon={SlidersHorizontal} />
      <Stack mx={{ base: "4", lg: "6" }} gap="6" pt="2">
        {children}
      </Stack>
    </>
  );
}

export default ParameterLayout;

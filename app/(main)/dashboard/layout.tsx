'use client'

import AppPageHeader from "@/components/app/app-page-header";
import { Stack } from "@chakra-ui/react";
import { SlidersHorizontal } from "lucide-react";
import PageLayout from "../../_components/page-layout";
import { useRoleSelection } from "@/app/context/roleSelection-context";

interface PageLayoutProps extends React.PropsWithChildren<{}> {}

function DashboardLayout({ children }: PageLayoutProps) {

  const { selectedRole } = useRoleSelection();

  return (
    <>

      {/* <AppPageHeader title={`${selectedRole} Dashboard`} Icon={SlidersHorizontal} /> */}
      <AppPageHeader title={`Dashboard`} Icon={SlidersHorizontal} />
      <Stack mx={{ base: "4", lg: "6" }} gap="6" pt="2">
        {children}
      </Stack>

    </>
  );
}

export default DashboardLayout;

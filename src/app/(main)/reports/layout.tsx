"use client";

import AppPageHeader from "@/components/app/app-page-header";
import { Stack } from "@chakra-ui/react";
import { Notebook } from "lucide-react";

interface PageLayoutProps extends React.PropsWithChildren { }

function ReportsLayout({ children }: PageLayoutProps) {
  return (
    <>
      <AppPageHeader title="Reports" Icon={Notebook} />
      <Stack mx={{ base: "4", lg: "6" }} gap="6" pt="2">
        {children}
      </Stack>
    </>
  );
}

export default ReportsLayout;

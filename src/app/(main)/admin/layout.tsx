"use client";

import AppPageHeader from "@/components/app/app-page-header";
import { Stack } from "@chakra-ui/react";
import { ShieldCheck } from "lucide-react";

interface AdminLayoutProps extends React.PropsWithChildren<{}> {}

function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <>
      <AppPageHeader title="Administration" Icon={ShieldCheck} />
      <Stack mx={{ base: "4", lg: "6" }} gap="6" pt="2">
        {children}
      </Stack>
    </>
  );
}

export default AdminLayout;

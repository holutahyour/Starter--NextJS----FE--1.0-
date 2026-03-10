"use client"

import AppTabs from "@/components/app/app-tabs";
import { PARAMETERS } from "@/lib/routes";
import { LuSettings } from "react-icons/lu";
import ErpSettings from "./_tab-contents/erp-settings/erp-settings";

export default function SchoolSetup() {
  return (
    <>
      <AppTabs tabs={tabs} route={PARAMETERS} defaultValue="erp-settings" />
    </>
  );
}

export const tabs = [
  {
    label: "ERP Settings",
    value: "erp-settings",
    Icon: LuSettings, // Settings/gear icon
    content: <ErpSettings />,
  },
];

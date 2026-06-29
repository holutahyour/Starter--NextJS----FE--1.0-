"use client";

import AppTabs from "@/components/app/app-tabs";
import { ADMIN } from "@/lib/routes";
import { Users, ShieldCheck, Menu as MenuIcon, Boxes, ScrollText } from "lucide-react";
import UserManagementPage from "./users/page";
import Roles from "./_tabs/roles/roles";
import Menus from "./_tabs/menus/menus";
import Modules from "./_tabs/modules/modules";
import AuditLogs from "./_tabs/audit-logs/audit-logs";

export default function AdministrationPage() {
  return <AppTabs tabs={tabs} route={ADMIN} defaultValue="users" />;
}

const tabs = [
  { label: "Users", value: "users", Icon: Users, content: <UserManagementPage /> },
  { label: "Roles & Permissions", value: "roles", Icon: ShieldCheck, content: <Roles /> },
  { label: "Menus", value: "menus", Icon: MenuIcon, content: <Menus /> },
  { label: "Modules", value: "modules", Icon: Boxes, content: <Modules /> },
  { label: "Audit Logs", value: "audit-logs", Icon: ScrollText, content: <AuditLogs /> },
];

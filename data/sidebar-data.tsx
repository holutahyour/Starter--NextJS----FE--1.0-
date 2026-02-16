import { APP_DEFAULT_PAGE, CONFIG, NOTIFICATIONS } from "@/lib/routes";
import { Bell, Cog, Home, SlidersHorizontal } from "lucide-react";

export const routes = [
  { name: "Home", path: "/" },
  { name: "General Setup", path: "/generalsetup" },
  { name: "Parameters", path: "/parameters" },
  { name: "Reports", path: "/reports" },
];

export const sidebarData = (role: string) => {
  switch (role) {
    case "Admin":
      return [
        {
          title: "Home",
          url: APP_DEFAULT_PAGE(),
          icon: Home,
          isActive: true,
        },
        {
          title: "Configuration",
          url: CONFIG,
          icon: Cog,
          items: [],
          isActive: true,
        },
        {
          title: "Parameters",
          url: "/parameters",
          icon: SlidersHorizontal,
        },        
        // {
        //   title: "Reports",
        //   url: "#",
        //   icon: Notebook,
        //   isActive: false,
        //   items: [
        //     {
        //       title: "Billing Report",
        //       url: BILLING_REPORT,
        //       icon: FileText,
        //     },
        //     {
        //       title: "Outstanding Balance",
        //       url: OUTSTANDING_BALANCE,
        //       icon: FileText,
        //     },
        //     {
        //       title: "Student Not Billed",
        //       url: STUDENT_NOT_BILLED,
        //       icon: FileText,
        //     },
        //   ],
        // },
        {
          title: "Notifications",
          url: NOTIFICATIONS,
          icon: Bell,
          items: [],
        },
      ];
    case "Billing-Accountant":
      return [];
    case "Receivable-Accountant":
      return [];
    default:
      return [];
  }
};
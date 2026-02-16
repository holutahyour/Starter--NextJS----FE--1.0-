"use client";

import dynamic from "next/dynamic";

const RolebaseDashboard = dynamic(
  () => import("./RolebaseDashboard"),
  { ssr: false }
);

export default function DashboardPage() {
  // return <RolebaseDashboard />;
  return <h1 className="grid place-items-center text-2xl font-bold">Hello 🙌</h1>;
}



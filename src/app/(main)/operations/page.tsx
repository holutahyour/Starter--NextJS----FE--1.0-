"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { OPERATIONS_SUB_TAB, OPERATIONS_TAB } from "@/lib/routes";
import { SegmentedTabs, TabDef } from "./_components/ui";
import FacilityManagementTab from "./_components/FacilityManagementTab";
import ProcessingTab from "./_components/ProcessingTab";
import LogisticsTab from "./_components/LogisticsTab";

const TABS: TabDef[] = [
  { label: "Facility Management", value: "facility-management" },
  { label: "Processing", value: "processing" },
  { label: "Logistics", value: "logistics" },
];

export default function OperationsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const requested = searchParams.get(OPERATIONS_TAB);
  const active = TABS.some((t) => t.value === requested) ? requested! : TABS[0].value;

  // Switching top-level tab drops the sub-tab so each section opens on its first
  // sub-tab rather than inheriting an unrelated one.
  const setActive = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(OPERATIONS_TAB, value);
      params.delete(OPERATIONS_SUB_TAB);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Operations</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Facility management, processing, and logistics
        </p>
      </div>

      <SegmentedTabs tabs={TABS} active={active} onChange={setActive} />

      {active === "facility-management" && <FacilityManagementTab />}
      {active === "processing" && <ProcessingTab />}
      {active === "logistics" && <LogisticsTab />}
    </div>
  );
}

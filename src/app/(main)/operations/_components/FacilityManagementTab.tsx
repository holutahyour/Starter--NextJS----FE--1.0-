"use client";

import { useCallback, useEffect, useState } from "react";
import { Building2, Home, Loader, Pencil } from "lucide-react";
import apiHandler from "@/data/api/ApiHandler";
import {
  APP_FACILITY_COHORTS_MODAL,
  APP_FACILITY_STAT_MODAL,
  APP_FACILITY_UNIT_MODAL,
} from "@/lib/routes";
import {
  AllocationUnit,
  CohortGreenhouse,
  FacilityOverview,
  FacilityStatKey,
  FACILITY_STAT_LABELS,
  MOCK_FACILITY,
  unallocated,
} from "./types";
import { IconButton, PrimaryButton, SectionHeader } from "./ui";
import { useOperationsModal } from "./use-operations-modal";
import EditFacilityStatModal from "./EditFacilityStatModal";
import EditCohortsModal from "./EditCohortsModal";
import EditAllocationUnitModal from "./EditAllocationUnitModal";

const USE_MOCK = process.env.NEXT_PUBLIC_DISABLE_MOCK_DATA !== "true";

const STAT_ORDER: FacilityStatKey[] = [
  "greenhouses",
  "generators",
  "staffAccommodation",
  "shortletAccommodation",
];

/** One of the four headline counters, with its inline edit button. */
function StatCard({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: number;
  onEdit: () => void;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col gap-4 min-w-0">
      <p className="text-sm text-gray-600">{label}</p>
      <div className="flex items-center justify-between gap-3">
        <p className="text-4xl font-bold text-[#7cc843]">{value}</p>
        <IconButton onClick={onEdit} aria-label={`Edit ${label}`}>
          <Pencil className="w-4 h-4" />
        </IconButton>
      </div>
    </div>
  );
}

/** A staff block or office building row with its allocated / unallocated badges. */
function AllocationRow({
  unit,
  noun,
  Icon,
  onEdit,
}: {
  unit: AllocationUnit;
  noun: string;
  Icon: typeof Home;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-center gap-4 border border-gray-100 rounded-xl p-4">
      <div className="shrink-0 w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#7cc843]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-base font-semibold text-gray-900 truncate">{unit.name}</p>
        <p className="text-sm text-gray-500">
          Total: {unit.total} {noun}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#7cc843] text-white">
          Allocated: {unit.allocated}
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
          Unallocated: {unallocated(unit)}
        </span>
      </div>
      <IconButton onClick={onEdit} aria-label={`Edit ${unit.name}`}>
        <Pencil className="w-4 h-4" />
      </IconButton>
    </div>
  );
}

/** Shown before data arrives, and when the API returns nothing usable. */
const EMPTY_FACILITY: FacilityOverview = {
  stats: { greenhouses: 0, generators: 0, staffAccommodation: 0, shortletAccommodation: 0 },
  cohorts: [],
  staffBlocks: [],
  offices: [],
};

export default function FacilityManagementTab() {
  const [facility, setFacility] = useState<FacilityOverview>(
    USE_MOCK ? MOCK_FACILITY : EMPTY_FACILITY
  );
  const [loading, setLoading] = useState(true);

  const statModal = useOperationsModal(APP_FACILITY_STAT_MODAL);
  const cohortsModal = useOperationsModal(APP_FACILITY_COHORTS_MODAL);
  const unitModal = useOperationsModal(APP_FACILITY_UNIT_MODAL);

  const fetchFacility = useCallback(async () => {
    try {
      if (USE_MOCK) {
        setFacility(MOCK_FACILITY);
        return;
      }
      const res = await apiHandler.operations.getFacility();
      if (res?.isSuccess && res.content) {
        setFacility(res.content);
      }
    } catch (e) {
      console.error("Failed to fetch facility overview", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchFacility();
  }, [fetchFacility]);

  // ── Which record each modal is editing ──────────────────────────────────────
  const activeStatKey = STAT_ORDER.includes(statModal.value as FacilityStatKey)
    ? (statModal.value as FacilityStatKey)
    : null;

  const allUnits = [...facility.staffBlocks, ...facility.offices];
  const activeUnit = allUnits.find((u) => u.id === unitModal.value) ?? null;
  const activeUnitIsOffice = facility.offices.some((o) => o.id === unitModal.value);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const saveStat = async (key: FacilityStatKey, value: number) => {
    const next = { ...facility.stats, [key]: value };
    setFacility((prev) => ({ ...prev, stats: next }));
    statModal.close();
    if (!USE_MOCK) {
      try {
        await apiHandler.operations.updateFacilityStats(next);
      } catch (e) {
        console.error("Failed to update facility stats", e);
      }
    }
  };

  const saveCohorts = async (cohorts: CohortGreenhouse[]) => {
    setFacility((prev) => ({ ...prev, cohorts }));
    cohortsModal.close();
    if (!USE_MOCK) {
      try {
        await apiHandler.operations.updateCohorts(cohorts);
      } catch (e) {
        console.error("Failed to update cohorts", e);
      }
    }
  };

  const saveUnit = async (unit: AllocationUnit) => {
    const swap = (list: AllocationUnit[]) => list.map((u) => (u.id === unit.id ? unit : u));
    setFacility((prev) => ({
      ...prev,
      staffBlocks: swap(prev.staffBlocks),
      offices: swap(prev.offices),
    }));
    unitModal.close();
    if (!USE_MOCK) {
      try {
        await apiHandler.operations.updateAllocationUnit(unit.id, {
          total: unit.total,
          allocated: unit.allocated,
        });
      } catch (e) {
        console.error("Failed to update allocation unit", e);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
        <Loader className="w-6 h-6 text-green-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Modals ───────────────────────────────────────────────────────────── */}
      <EditFacilityStatModal
        statKey={activeStatKey}
        currentValue={activeStatKey ? facility.stats[activeStatKey] : 0}
        onSave={saveStat}
        onClose={statModal.close}
      />
      <EditCohortsModal
        open={cohortsModal.isOpen}
        cohorts={facility.cohorts}
        onSave={saveCohorts}
        onClose={cohortsModal.close}
      />
      <EditAllocationUnitModal
        unit={activeUnit}
        noun={activeUnitIsOffice ? "offices" : "units"}
        onSave={saveUnit}
        onClose={unitModal.close}
      />

      <SectionHeader
        title="Facility Management Details"
        subtitle="Overview and management of all facility resources"
      />

      {/* ── Headline counters ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STAT_ORDER.map((key) => (
          <StatCard
            key={key}
            label={FACILITY_STAT_LABELS[key]}
            value={facility.stats[key]}
            onEdit={() => statModal.open(key)}
          />
        ))}
      </div>

      {/* ── Greenhouses by cohort ────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">
        <SectionHeader
          title="Greenhouses by Cohort"
          subtitle="Distribution of greenhouses across cohorts"
          action={
            <PrimaryButton type="button" onClick={() => cohortsModal.open()}>
              <Pencil className="w-4 h-4" />
              Edit
            </PrimaryButton>
          }
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {facility.cohorts.map((c) => (
            <div key={c.cohort} className="bg-green-50/60 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">Cohort {c.cohort}</p>
              <p className="text-2xl font-bold text-[#7cc843] mt-1">{c.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Staff accommodation ──────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">
        <SectionHeader
          title="Staff Accommodation"
          subtitle="Allocated and unallocated staff accommodation units"
        />
        <div className="space-y-4">
          {facility.staffBlocks.map((u) => (
            <AllocationRow
              key={u.id}
              unit={u}
              noun="units"
              Icon={Home}
              onEdit={() => unitModal.open(u.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Offices ──────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">
        <SectionHeader title="Offices" subtitle="Allocated and unallocated office spaces" />
        <div className="space-y-4">
          {facility.offices.map((u) => (
            <AllocationRow
              key={u.id}
              unit={u}
              noun="offices"
              Icon={Building2}
              onEdit={() => unitModal.open(u.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

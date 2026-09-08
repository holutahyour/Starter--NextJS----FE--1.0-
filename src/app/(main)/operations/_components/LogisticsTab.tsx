"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader, Plus } from "lucide-react";
import apiHandler from "@/data/api/ApiHandler";
import {
  APP_VEHICLE_REFUELING_MODAL,
  APP_VEHICLE_TRACKING_MODAL,
  OPERATIONS_SUB_TAB,
} from "@/lib/routes";
import {
  MOCK_VEHICLE_REFUELING_LOGS,
  MOCK_VEHICLE_TRACKING_LOGS,
  TRIP_STATUS_BADGE,
  VehicleRefuelingLog,
  VehicleTrackingLog,
  fmtDate,
  fmtMoney,
  fmtNumber,
  fmtText,
  totalFuelCost,
} from "./types";
import { Badge, PrimaryButton, SectionHeader, SubTabs, TableShell, TabDef } from "./ui";
import { useOperationsModal, useTabParam } from "./use-operations-modal";
import AddVehicleTrackingLogModal from "./AddVehicleTrackingLogModal";
import AddRefuelingLogModal from "./AddRefuelingLogModal";

const USE_MOCK = process.env.NEXT_PUBLIC_DISABLE_MOCK_DATA !== "true";

const SUB_TABS: TabDef[] = [
  { label: "Vehicle Tracking Logs", value: "vehicle-tracking-logs" },
  { label: "Vehicle Refueling Logs", value: "vehicle-refueling-logs" },
];

const TRACKING_COLUMNS = [
  "Date",
  "Vehicle",
  "Driver",
  "Destination",
  "Departure",
  "Return",
  "Distance (km)",
  "Purpose",
  "Status",
  "Remarks",
];

const REFUELING_COLUMNS = [
  "Date",
  "Vehicle",
  "Driver",
  "Fuel Type",
  "Quantity (L)",
  "Unit Cost",
  "Total Cost",
  "Odometer (km)",
  "Station",
  "Remarks",
];

const cell = "px-4 py-3 whitespace-nowrap text-gray-700";

export default function LogisticsTab() {
  const { active, setActive } = useTabParam(OPERATIONS_SUB_TAB, SUB_TABS[0].value);
  const activeSub = SUB_TABS.some((t) => t.value === active) ? active : SUB_TABS[0].value;

  const [trackingLogs, setTrackingLogs] = useState<VehicleTrackingLog[]>([]);
  const [refuelingLogs, setRefuelingLogs] = useState<VehicleRefuelingLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const trackingModal = useOperationsModal(APP_VEHICLE_TRACKING_MODAL);
  const refuelingModal = useOperationsModal(APP_VEHICLE_REFUELING_MODAL);

  const fetchData = useCallback(async () => {
    try {
      if (USE_MOCK) {
        setTrackingLogs(MOCK_VEHICLE_TRACKING_LOGS);
        setRefuelingLogs(MOCK_VEHICLE_REFUELING_LOGS);
        return;
      }
      const [trackingRes, refuelingRes] = await Promise.all([
        apiHandler.operations.listVehicleTrackingLogs(),
        apiHandler.operations.listVehicleRefuelingLogs(),
      ]);
      if (trackingRes?.isSuccess && Array.isArray(trackingRes.content))
        setTrackingLogs(trackingRes.content);
      if (refuelingRes?.isSuccess && Array.isArray(refuelingRes.content))
        setRefuelingLogs(refuelingRes.content);
    } catch (e) {
      console.error("Failed to fetch logistics data", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  const createTrackingLog = async (log: Omit<VehicleTrackingLog, "id">) => {
    setSubmitting(true);
    try {
      let created: VehicleTrackingLog = { ...log, id: `trip-${Date.now()}` };
      if (!USE_MOCK) {
        const res = await apiHandler.operations.createVehicleTrackingLog(log);
        if (res?.isSuccess && res.content) created = res.content;
      }
      setTrackingLogs((prev) => [created, ...prev]);
      trackingModal.close();
    } catch (e) {
      console.error("Failed to add vehicle tracking log", e);
    } finally {
      setSubmitting(false);
    }
  };

  const createRefuelingLog = async (log: Omit<VehicleRefuelingLog, "id">) => {
    setSubmitting(true);
    try {
      let created: VehicleRefuelingLog = { ...log, id: `refuel-${Date.now()}` };
      if (!USE_MOCK) {
        const res = await apiHandler.operations.createVehicleRefuelingLog(log);
        if (res?.isSuccess && res.content) created = res.content;
      }
      setRefuelingLogs((prev) => [created, ...prev]);
      refuelingModal.close();
    } catch (e) {
      console.error("Failed to add vehicle refueling log", e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <AddVehicleTrackingLogModal
        open={trackingModal.isOpen}
        submitting={submitting}
        onCreate={createTrackingLog}
        onClose={trackingModal.close}
      />
      <AddRefuelingLogModal
        open={refuelingModal.isOpen}
        submitting={submitting}
        onCreate={createRefuelingLog}
        onClose={refuelingModal.close}
      />

      <SubTabs tabs={SUB_TABS} active={activeSub} onChange={setActive} />

      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
          <Loader className="w-6 h-6 text-green-500 animate-spin" />
        </div>
      ) : activeSub === "vehicle-tracking-logs" ? (
        <>
          <SectionHeader
            title="Vehicle Tracking Logs"
            subtitle="Monitor vehicle movements and trips"
            action={
              <PrimaryButton type="button" onClick={() => trackingModal.open()}>
                <Plus className="w-4 h-4" />
                Add Log
              </PrimaryButton>
            }
          />
          <TableShell
            columns={TRACKING_COLUMNS}
            isEmpty={trackingLogs.length === 0}
            emptyMessage="No tracking logs yet."
          >
            {trackingLogs.map((l) => {
              const badge = TRIP_STATUS_BADGE[l.status] ?? {
                label: String(l.status),
                className: "bg-gray-100 text-gray-600",
              };
              return (
                <tr key={l.id} className="border-t border-gray-100">
                  <td className={cell}>{fmtDate(l.date)}</td>
                  <td className={`${cell} font-medium text-gray-900`}>{l.vehicle}</td>
                  <td className={cell}>{l.driver}</td>
                  <td className={cell}>{fmtText(l.destination)}</td>
                  <td className={cell}>{fmtText(l.departureTime)}</td>
                  <td className={cell}>{fmtText(l.returnTime)}</td>
                  <td className={cell}>{fmtNumber(l.distanceKm)}</td>
                  <td className={cell}>{fmtText(l.purpose)}</td>
                  <td className={cell}>
                    <Badge label={badge.label} className={badge.className} />
                  </td>
                  <td className={cell}>{fmtText(l.remarks)}</td>
                </tr>
              );
            })}
          </TableShell>
        </>
      ) : (
        <>
          <SectionHeader
            title="Vehicle Refueling Logs"
            subtitle="Track fuel purchases and consumption"
            action={
              <PrimaryButton type="button" onClick={() => refuelingModal.open()}>
                <Plus className="w-4 h-4" />
                Add Log
              </PrimaryButton>
            }
          />
          <TableShell
            columns={REFUELING_COLUMNS}
            isEmpty={refuelingLogs.length === 0}
            emptyMessage="No refueling logs yet."
          >
            {refuelingLogs.map((l) => (
              <tr key={l.id} className="border-t border-gray-100">
                <td className={cell}>{fmtDate(l.date)}</td>
                <td className={`${cell} font-medium text-gray-900`}>{l.vehicle}</td>
                <td className={cell}>{fmtText(l.driver)}</td>
                <td className={cell}>{l.fuelType}</td>
                <td className={cell}>{fmtNumber(l.quantityLitres)}</td>
                <td className={cell}>{fmtMoney(l.unitCost)}</td>
                <td className={`${cell} font-medium text-gray-900`}>
                  {fmtMoney(totalFuelCost(l))}
                </td>
                <td className={cell}>{fmtNumber(l.odometerKm)}</td>
                <td className={cell}>{fmtText(l.station)}</td>
                <td className={cell}>{fmtText(l.remarks)}</td>
              </tr>
            ))}
          </TableShell>
        </>
      )}
    </div>
  );
}

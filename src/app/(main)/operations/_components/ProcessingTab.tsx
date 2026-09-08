"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader, Plus } from "lucide-react";
import apiHandler from "@/data/api/ApiHandler";
import {
  APP_BATCH_MODAL,
  APP_MACHINE_USAGE_MODAL,
  OPERATIONS_SUB_TAB,
} from "@/lib/routes";
import {
  BATCH_STATUS_BADGE,
  MACHINE_STATUS_BADGE,
  MachineUsageLog,
  MOCK_BATCHES,
  MOCK_MACHINE_USAGE_LOGS,
  ProductionBatch,
  fmtDate,
  fmtDateTime,
  fmtNumber,
  fmtText,
} from "./types";
import { Badge, PrimaryButton, SectionHeader, SubTabs, TableShell, TabDef } from "./ui";
import { useOperationsModal, useTabParam } from "./use-operations-modal";
import AddBatchModal from "./AddBatchModal";
import AddMachineUsageLogModal from "./AddMachineUsageLogModal";

const USE_MOCK = process.env.NEXT_PUBLIC_DISABLE_MOCK_DATA !== "true";

const SUB_TABS: TabDef[] = [
  { label: "Batch Scheduling", value: "batch-scheduling" },
  { label: "Machine Usage Logs", value: "machine-usage-logs" },
];

const BATCH_COLUMNS = [
  "Date",
  "Batch ID",
  "Product",
  "Qty (kg)",
  "Sched. Start",
  "Sched. End",
  "Operator",
  "Status",
  "Notes",
];

const MACHINE_COLUMNS = [
  "Date",
  "Machine",
  "Operator",
  "Start",
  "End",
  "Hours Used",
  "Output (kg)",
  "Downtime (mins)",
  "Status",
  "Remarks",
];

const cell = "px-4 py-3 whitespace-nowrap text-gray-700";

export default function ProcessingTab() {
  const { active, setActive } = useTabParam(OPERATIONS_SUB_TAB, SUB_TABS[0].value);
  const activeSub = SUB_TABS.some((t) => t.value === active) ? active : SUB_TABS[0].value;

  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [machineLogs, setMachineLogs] = useState<MachineUsageLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const batchModal = useOperationsModal(APP_BATCH_MODAL);
  const machineModal = useOperationsModal(APP_MACHINE_USAGE_MODAL);

  const fetchData = useCallback(async () => {
    try {
      if (USE_MOCK) {
        setBatches(MOCK_BATCHES);
        setMachineLogs(MOCK_MACHINE_USAGE_LOGS);
        return;
      }
      const [batchRes, machineRes] = await Promise.all([
        apiHandler.operations.listBatches(),
        apiHandler.operations.listMachineUsageLogs(),
      ]);
      if (batchRes?.isSuccess && Array.isArray(batchRes.content)) setBatches(batchRes.content);
      if (machineRes?.isSuccess && Array.isArray(machineRes.content))
        setMachineLogs(machineRes.content);
    } catch (e) {
      console.error("Failed to fetch processing data", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  const createBatch = async (batch: Omit<ProductionBatch, "id">) => {
    setSubmitting(true);
    try {
      let created: ProductionBatch = { ...batch, id: `batch-${Date.now()}` };
      if (!USE_MOCK) {
        const res = await apiHandler.operations.createBatch(batch);
        if (res?.isSuccess && res.content) created = res.content;
      }
      setBatches((prev) => [created, ...prev]);
      batchModal.close();
    } catch (e) {
      console.error("Failed to schedule batch", e);
    } finally {
      setSubmitting(false);
    }
  };

  const createMachineLog = async (log: Omit<MachineUsageLog, "id">) => {
    setSubmitting(true);
    try {
      let created: MachineUsageLog = { ...log, id: `machine-${Date.now()}` };
      if (!USE_MOCK) {
        const res = await apiHandler.operations.createMachineUsageLog(log);
        if (res?.isSuccess && res.content) created = res.content;
      }
      setMachineLogs((prev) => [created, ...prev]);
      machineModal.close();
    } catch (e) {
      console.error("Failed to add machine usage log", e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <AddBatchModal
        open={batchModal.isOpen}
        submitting={submitting}
        onCreate={createBatch}
        onClose={batchModal.close}
      />
      <AddMachineUsageLogModal
        open={machineModal.isOpen}
        submitting={submitting}
        onCreate={createMachineLog}
        onClose={machineModal.close}
      />

      <SubTabs tabs={SUB_TABS} active={activeSub} onChange={setActive} />

      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
          <Loader className="w-6 h-6 text-green-500 animate-spin" />
        </div>
      ) : activeSub === "batch-scheduling" ? (
        <>
          <SectionHeader
            title="Batch Scheduling"
            subtitle="Plan and track production batches"
            action={
              <PrimaryButton type="button" onClick={() => batchModal.open()}>
                <Plus className="w-4 h-4" />
                Add Batch
              </PrimaryButton>
            }
          />
          <TableShell
            columns={BATCH_COLUMNS}
            isEmpty={batches.length === 0}
            emptyMessage="No batches scheduled yet."
          >
            {batches.map((b) => {
              const badge = BATCH_STATUS_BADGE[b.status] ?? {
                label: String(b.status),
                className: "bg-gray-100 text-gray-600",
              };
              return (
                <tr key={b.id} className="border-t border-gray-100">
                  <td className={cell}>{fmtDate(b.date)}</td>
                  <td className={`${cell} font-medium text-gray-900`}>{b.batchId}</td>
                  <td className={cell}>{b.product}</td>
                  <td className={cell}>{fmtNumber(b.quantityKg)}</td>
                  <td className={cell}>{fmtDateTime(b.scheduledStart)}</td>
                  <td className={cell}>{fmtDateTime(b.scheduledEnd)}</td>
                  <td className={cell}>{fmtText(b.operator)}</td>
                  <td className={cell}>
                    <Badge label={badge.label} className={badge.className} />
                  </td>
                  <td className={cell}>{fmtText(b.notes)}</td>
                </tr>
              );
            })}
          </TableShell>
        </>
      ) : (
        <>
          <SectionHeader
            title="Machine Usage Logs"
            subtitle="Track machine run time, output and downtime"
            action={
              <PrimaryButton type="button" onClick={() => machineModal.open()}>
                <Plus className="w-4 h-4" />
                Add Log
              </PrimaryButton>
            }
          />
          <TableShell
            columns={MACHINE_COLUMNS}
            isEmpty={machineLogs.length === 0}
            emptyMessage="No machine usage logs yet."
          >
            {machineLogs.map((l) => {
              const badge = MACHINE_STATUS_BADGE[l.status] ?? {
                label: String(l.status),
                className: "bg-gray-100 text-gray-600",
              };
              return (
                <tr key={l.id} className="border-t border-gray-100">
                  <td className={cell}>{fmtDate(l.date)}</td>
                  <td className={`${cell} font-medium text-gray-900`}>{l.machine}</td>
                  <td className={cell}>{fmtText(l.operator)}</td>
                  <td className={cell}>{fmtText(l.startTime)}</td>
                  <td className={cell}>{fmtText(l.endTime)}</td>
                  <td className={cell}>{fmtNumber(l.hoursUsed)}</td>
                  <td className={cell}>{fmtNumber(l.outputKg)}</td>
                  <td className={cell}>{fmtNumber(l.downtimeMins)}</td>
                  <td className={cell}>
                    <Badge label={badge.label} className={badge.className} />
                  </td>
                  <td className={cell}>{fmtText(l.remarks)}</td>
                </tr>
              );
            })}
          </TableShell>
        </>
      )}
    </div>
  );
}

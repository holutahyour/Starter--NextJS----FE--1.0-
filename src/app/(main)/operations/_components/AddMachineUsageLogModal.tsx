"use client";

import { useEffect, useState } from "react";
import { MACHINE_STATUS_OPTIONS, MachineUsageLog, MachineUsageStatus } from "./types";
import { Field, OperationsModal, SelectInput, TextInput, TextareaInput } from "./ui";

interface AddMachineUsageLogModalProps {
  open: boolean;
  submitting?: boolean;
  onCreate: (log: Omit<MachineUsageLog, "id">) => void;
  onClose: () => void;
}

const EMPTY = {
  date: "",
  machine: "",
  operator: "",
  startTime: "",
  endTime: "",
  hoursUsed: "0",
  outputKg: "0",
  downtimeMins: "0",
  status: "operational" as MachineUsageStatus,
  remarks: "",
};

export default function AddMachineUsageLogModal({
  open,
  submitting,
  onCreate,
  onClose,
}: AddMachineUsageLogModalProps) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setValues(EMPTY);
      setErrors({});
    }
  }, [open]);

  const set = (key: keyof typeof EMPTY) => (e: { target: { value: string } }) =>
    setValues((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!values.date) next.date = "Date is required";
    if (!values.machine.trim()) next.machine = "Machine is required";

    const hours = Number(values.hoursUsed);
    const output = Number(values.outputKg);
    const downtime = Number(values.downtimeMins);
    if (!Number.isFinite(hours) || hours < 0) next.hoursUsed = "Enter hours of 0 or more";
    if (!Number.isFinite(output) || output < 0) next.outputKg = "Enter an output of 0 or more";
    if (!Number.isFinite(downtime) || downtime < 0)
      next.downtimeMins = "Enter downtime of 0 or more";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onCreate({
      date: values.date,
      machine: values.machine.trim(),
      operator: values.operator.trim() || undefined,
      startTime: values.startTime || undefined,
      endTime: values.endTime || undefined,
      hoursUsed: hours,
      outputKg: output,
      downtimeMins: downtime,
      status: values.status,
      remarks: values.remarks.trim() || undefined,
    });
  };

  return (
    <OperationsModal
      open={open}
      title="Add Machine Usage Log"
      subtitle="Record machine run time and output"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel="Add Log"
      submitting={submitting}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Date" required error={errors.date} htmlFor="machine-date">
          <TextInput id="machine-date" type="date" value={values.date} onChange={set("date")} />
        </Field>
        <Field label="Machine" required error={errors.machine} htmlFor="machine-name">
          <TextInput
            id="machine-name"
            placeholder="Machine name / code"
            value={values.machine}
            onChange={set("machine")}
          />
        </Field>
        <Field label="Operator" htmlFor="machine-operator">
          <TextInput
            id="machine-operator"
            placeholder="Operator name"
            value={values.operator}
            onChange={set("operator")}
          />
        </Field>
        <Field label="Status" htmlFor="machine-status">
          <SelectInput id="machine-status" value={values.status} onChange={set("status")}>
            {MACHINE_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Start Time" htmlFor="machine-start">
          <TextInput
            id="machine-start"
            type="time"
            value={values.startTime}
            onChange={set("startTime")}
          />
        </Field>
        <Field label="End Time" htmlFor="machine-end">
          <TextInput
            id="machine-end"
            type="time"
            value={values.endTime}
            onChange={set("endTime")}
          />
        </Field>
        <Field label="Hours Used" error={errors.hoursUsed} htmlFor="machine-hours">
          <TextInput
            id="machine-hours"
            type="number"
            min={0}
            step="any"
            value={values.hoursUsed}
            onChange={set("hoursUsed")}
          />
        </Field>
        <Field label="Output (kg)" error={errors.outputKg} htmlFor="machine-output">
          <TextInput
            id="machine-output"
            type="number"
            min={0}
            step="any"
            value={values.outputKg}
            onChange={set("outputKg")}
          />
        </Field>
        <Field label="Downtime (mins)" error={errors.downtimeMins} htmlFor="machine-downtime">
          <TextInput
            id="machine-downtime"
            type="number"
            min={0}
            step={1}
            value={values.downtimeMins}
            onChange={set("downtimeMins")}
          />
        </Field>
      </div>

      <Field label="Remarks" htmlFor="machine-remarks">
        <TextareaInput
          id="machine-remarks"
          placeholder="Additional notes"
          value={values.remarks}
          onChange={set("remarks")}
        />
      </Field>
    </OperationsModal>
  );
}

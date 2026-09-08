"use client";

import { useEffect, useState } from "react";
import { BATCH_STATUS_OPTIONS, BatchStatus, ProductionBatch } from "./types";
import { Field, OperationsModal, SelectInput, TextInput, TextareaInput } from "./ui";

interface AddBatchModalProps {
  open: boolean;
  submitting?: boolean;
  onCreate: (batch: Omit<ProductionBatch, "id">) => void;
  onClose: () => void;
}

const EMPTY = {
  date: "",
  batchId: "",
  product: "",
  quantityKg: "0",
  scheduledStart: "",
  scheduledEnd: "",
  operator: "",
  status: "scheduled" as BatchStatus,
  notes: "",
};

export default function AddBatchModal({
  open,
  submitting,
  onCreate,
  onClose,
}: AddBatchModalProps) {
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
    if (!values.batchId.trim()) next.batchId = "Batch ID is required";
    if (!values.product.trim()) next.product = "Product is required";
    const qty = Number(values.quantityKg);
    if (!Number.isFinite(qty) || qty < 0) next.quantityKg = "Enter a quantity of 0 or more";
    if (
      values.scheduledStart &&
      values.scheduledEnd &&
      values.scheduledEnd < values.scheduledStart
    ) {
      next.scheduledEnd = "End must be after start";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onCreate({
      date: values.date,
      batchId: values.batchId.trim(),
      product: values.product.trim(),
      quantityKg: qty,
      scheduledStart: values.scheduledStart || undefined,
      scheduledEnd: values.scheduledEnd || undefined,
      operator: values.operator.trim() || undefined,
      status: values.status,
      notes: values.notes.trim() || undefined,
    });
  };

  return (
    <OperationsModal
      open={open}
      title="Schedule New Batch"
      subtitle="Enter batch production details"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel="Schedule Batch"
      submitting={submitting}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Date" required error={errors.date} htmlFor="batch-date">
          <TextInput id="batch-date" type="date" value={values.date} onChange={set("date")} />
        </Field>
        <Field label="Batch ID" required error={errors.batchId} htmlFor="batch-id">
          <TextInput
            id="batch-id"
            placeholder="e.g. BATCH-001"
            value={values.batchId}
            onChange={set("batchId")}
          />
        </Field>
        <Field label="Product" required error={errors.product} htmlFor="batch-product">
          <TextInput
            id="batch-product"
            placeholder="Product name"
            value={values.product}
            onChange={set("product")}
          />
        </Field>
        <Field label="Quantity (kg)" error={errors.quantityKg} htmlFor="batch-qty">
          <TextInput
            id="batch-qty"
            type="number"
            min={0}
            step="any"
            value={values.quantityKg}
            onChange={set("quantityKg")}
          />
        </Field>
        <Field label="Scheduled Start" htmlFor="batch-start">
          <TextInput
            id="batch-start"
            type="datetime-local"
            value={values.scheduledStart}
            onChange={set("scheduledStart")}
          />
        </Field>
        <Field label="Scheduled End" error={errors.scheduledEnd} htmlFor="batch-end">
          <TextInput
            id="batch-end"
            type="datetime-local"
            value={values.scheduledEnd}
            onChange={set("scheduledEnd")}
          />
        </Field>
        <Field label="Assigned Operator" htmlFor="batch-operator">
          <TextInput
            id="batch-operator"
            placeholder="Operator name"
            value={values.operator}
            onChange={set("operator")}
          />
        </Field>
        <Field label="Status" htmlFor="batch-status">
          <SelectInput id="batch-status" value={values.status} onChange={set("status")}>
            {BATCH_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>

      <Field label="Notes" htmlFor="batch-notes">
        <TextareaInput
          id="batch-notes"
          placeholder="Additional notes"
          value={values.notes}
          onChange={set("notes")}
        />
      </Field>
    </OperationsModal>
  );
}

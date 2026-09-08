"use client";

import { useEffect, useState } from "react";
import { AllocationUnit } from "./types";
import { Field, OperationsModal, TextInput } from "./ui";

interface EditAllocationUnitModalProps {
  /** `null` keeps the modal closed. */
  unit: AllocationUnit | null;
  /** "units" for staff accommodation, "offices" for office buildings. */
  noun: string;
  onSave: (unit: AllocationUnit) => void;
  onClose: () => void;
}

export default function EditAllocationUnitModal({
  unit,
  noun,
  onSave,
  onClose,
}: EditAllocationUnitModalProps) {
  const [total, setTotal] = useState("0");
  const [allocated, setAllocated] = useState("0");
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (unit) {
      setTotal(String(unit.total));
      setAllocated(String(unit.allocated));
      setError(undefined);
    }
  }, [unit]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!unit) return;
    const t = Number(total);
    const a = Number(allocated);
    if (!Number.isFinite(t) || t < 0 || !Number.isFinite(a) || a < 0) {
      setError("Enter numbers of 0 or more");
      return;
    }
    if (a > t) {
      setError(`Allocated cannot be more than the total ${noun}`);
      return;
    }
    onSave({ ...unit, total: Math.round(t), allocated: Math.round(a) });
  };

  const remaining = Math.max(0, Math.round(Number(total) || 0) - Math.round(Number(allocated) || 0));

  return (
    <OperationsModal
      open={unit !== null}
      title={`Edit ${unit?.name ?? ""}`}
      subtitle={`Update the total and allocated ${noun}`}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel="Save"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={`Total ${noun}`} required htmlFor="unit-total">
          <TextInput
            id="unit-total"
            type="number"
            min={0}
            step={1}
            value={total}
            onChange={(e) => setTotal(e.target.value)}
          />
        </Field>
        <Field label="Allocated" required htmlFor="unit-allocated">
          <TextInput
            id="unit-allocated"
            type="number"
            min={0}
            step={1}
            value={allocated}
            onChange={(e) => setAllocated(e.target.value)}
          />
        </Field>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <p className="text-sm text-gray-500">
        Unallocated: <span className="font-semibold text-gray-900">{remaining}</span>
      </p>
    </OperationsModal>
  );
}

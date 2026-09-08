"use client";

import { useEffect, useState } from "react";
import { CohortGreenhouse } from "./types";
import { Field, OperationsModal, TextInput } from "./ui";

interface EditCohortsModalProps {
  open: boolean;
  cohorts: CohortGreenhouse[];
  onSave: (cohorts: CohortGreenhouse[]) => void;
  onClose: () => void;
}

export default function EditCohortsModal({
  open,
  cohorts,
  onSave,
  onClose,
}: EditCohortsModalProps) {
  const [values, setValues] = useState<string[]>(() => cohorts.map((c) => String(c.count)));
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (open) {
      setValues(cohorts.map((c) => String(c.count)));
      setError(undefined);
    }
  }, [open, cohorts]);

  const total = values.reduce((sum, v) => {
    const n = Number(v);
    return sum + (Number.isFinite(n) && n > 0 ? n : 0);
  }, 0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = values.map((v) => Number(v));
    if (parsed.some((n) => !Number.isFinite(n) || n < 0)) {
      setError("Every cohort must have a count of 0 or more");
      return;
    }
    onSave(cohorts.map((c, i) => ({ cohort: c.cohort, count: Math.round(parsed[i]) })));
  };

  return (
    <OperationsModal
      open={open}
      title="Edit Greenhouses by Cohort"
      subtitle="Set the number of greenhouses in each cohort"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel="Save Cohorts"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {cohorts.map((c, i) => (
          <Field key={c.cohort} label={`Cohort ${c.cohort}`} htmlFor={`cohort-${c.cohort}`}>
            <TextInput
              id={`cohort-${c.cohort}`}
              type="number"
              min={0}
              step={1}
              value={values[i] ?? ""}
              onChange={(e) =>
                setValues((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))
              }
            />
          </Field>
        ))}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <p className="text-sm text-gray-500">
        Total greenhouses across all cohorts:{" "}
        <span className="font-semibold text-gray-900">{total}</span>
      </p>
    </OperationsModal>
  );
}

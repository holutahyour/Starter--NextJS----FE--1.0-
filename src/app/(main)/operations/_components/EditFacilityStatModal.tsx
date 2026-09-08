"use client";

import { useEffect, useState } from "react";
import { FacilityStatKey, FACILITY_STAT_LABELS } from "./types";
import { Field, OperationsModal, TextInput } from "./ui";

interface EditFacilityStatModalProps {
  statKey: FacilityStatKey | null;
  currentValue: number;
  onSave: (statKey: FacilityStatKey, value: number) => void;
  onClose: () => void;
}

export default function EditFacilityStatModal({
  statKey,
  currentValue,
  onSave,
  onClose,
}: EditFacilityStatModalProps) {
  const [value, setValue] = useState(String(currentValue));
  const [error, setError] = useState<string>();

  // Re-seed the input each time a different counter is opened.
  useEffect(() => {
    setValue(String(currentValue));
    setError(undefined);
  }, [statKey, currentValue]);

  const label = statKey ? FACILITY_STAT_LABELS[statKey] : "";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!statKey) return;
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 0) {
      setError("Enter a number of 0 or more");
      return;
    }
    onSave(statKey, Math.round(parsed));
  };

  return (
    <OperationsModal
      open={statKey !== null}
      title={`Edit ${label}`}
      subtitle="Update the recorded count for this facility resource"
      size="md"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel="Save"
    >
      <Field label={label} required error={error} htmlFor="facility-stat-value">
        <TextInput
          id="facility-stat-value"
          type="number"
          min={0}
          step={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Field>
    </OperationsModal>
  );
}

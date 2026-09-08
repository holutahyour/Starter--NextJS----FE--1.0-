"use client";

import { useEffect, useState } from "react";
import { FUEL_TYPE_OPTIONS, VehicleRefuelingLog, fmtMoney } from "./types";
import { Field, OperationsModal, SelectInput, TextInput, TextareaInput } from "./ui";

interface AddRefuelingLogModalProps {
  open: boolean;
  submitting?: boolean;
  onCreate: (log: Omit<VehicleRefuelingLog, "id">) => void;
  onClose: () => void;
}

const EMPTY = {
  date: "",
  vehicle: "",
  driver: "",
  fuelType: FUEL_TYPE_OPTIONS[0],
  quantityLitres: "0",
  unitCost: "0",
  odometerKm: "0",
  station: "",
  remarks: "",
};

export default function AddRefuelingLogModal({
  open,
  submitting,
  onCreate,
  onClose,
}: AddRefuelingLogModalProps) {
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

  const litres = Number(values.quantityLitres);
  const unitCost = Number(values.unitCost);
  const total =
    Number.isFinite(litres) && Number.isFinite(unitCost) ? litres * unitCost : 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!values.date) next.date = "Date is required";
    if (!values.vehicle.trim()) next.vehicle = "Vehicle is required";
    if (!Number.isFinite(litres) || litres <= 0) next.quantityLitres = "Enter a quantity above 0";
    if (!Number.isFinite(unitCost) || unitCost < 0) next.unitCost = "Enter a cost of 0 or more";
    const odometer = Number(values.odometerKm);
    if (!Number.isFinite(odometer) || odometer < 0)
      next.odometerKm = "Enter a reading of 0 or more";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onCreate({
      date: values.date,
      vehicle: values.vehicle.trim(),
      driver: values.driver.trim() || undefined,
      fuelType: values.fuelType,
      quantityLitres: litres,
      unitCost,
      odometerKm: odometer,
      station: values.station.trim() || undefined,
      remarks: values.remarks.trim() || undefined,
    });
  };

  return (
    <OperationsModal
      open={open}
      title="Add Vehicle Refueling Log"
      subtitle="Enter refueling details"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel="Add Log"
      submitting={submitting}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Date" required error={errors.date} htmlFor="refuel-date">
          <TextInput id="refuel-date" type="date" value={values.date} onChange={set("date")} />
        </Field>
        <Field label="Vehicle" required error={errors.vehicle} htmlFor="refuel-vehicle">
          <TextInput
            id="refuel-vehicle"
            placeholder="Vehicle name / plate no."
            value={values.vehicle}
            onChange={set("vehicle")}
          />
        </Field>
        <Field label="Driver Name" htmlFor="refuel-driver">
          <TextInput
            id="refuel-driver"
            placeholder="Driver name"
            value={values.driver}
            onChange={set("driver")}
          />
        </Field>
        <Field label="Fuel Type" htmlFor="refuel-fuel-type">
          <SelectInput id="refuel-fuel-type" value={values.fuelType} onChange={set("fuelType")}>
            {FUEL_TYPE_OPTIONS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Quantity (L)" required error={errors.quantityLitres} htmlFor="refuel-qty">
          <TextInput
            id="refuel-qty"
            type="number"
            min={0}
            step="any"
            value={values.quantityLitres}
            onChange={set("quantityLitres")}
          />
        </Field>
        <Field label="Unit Cost" required error={errors.unitCost} htmlFor="refuel-unit-cost">
          <TextInput
            id="refuel-unit-cost"
            type="number"
            min={0}
            step="any"
            value={values.unitCost}
            onChange={set("unitCost")}
          />
        </Field>
        <Field label="Odometer (km)" error={errors.odometerKm} htmlFor="refuel-odometer">
          <TextInput
            id="refuel-odometer"
            type="number"
            min={0}
            step="any"
            value={values.odometerKm}
            onChange={set("odometerKm")}
          />
        </Field>
        <Field label="Station" htmlFor="refuel-station">
          <TextInput
            id="refuel-station"
            placeholder="Filling station"
            value={values.station}
            onChange={set("station")}
          />
        </Field>
      </div>

      <Field label="Remarks" htmlFor="refuel-remarks">
        <TextareaInput
          id="refuel-remarks"
          placeholder="Additional notes"
          value={values.remarks}
          onChange={set("remarks")}
        />
      </Field>

      <p className="text-sm text-gray-500">
        Total cost: <span className="font-semibold text-gray-900">{fmtMoney(total)}</span>
      </p>
    </OperationsModal>
  );
}

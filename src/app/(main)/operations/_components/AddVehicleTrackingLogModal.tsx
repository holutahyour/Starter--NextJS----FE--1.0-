"use client";

import { useEffect, useState } from "react";
import { TRIP_STATUS_OPTIONS, TripStatus, VehicleTrackingLog } from "./types";
import { Field, OperationsModal, SelectInput, TextInput, TextareaInput } from "./ui";

interface AddVehicleTrackingLogModalProps {
  open: boolean;
  submitting?: boolean;
  onCreate: (log: Omit<VehicleTrackingLog, "id">) => void;
  onClose: () => void;
}

const EMPTY = {
  date: "",
  vehicle: "",
  driver: "",
  destination: "",
  departureTime: "",
  returnTime: "",
  distanceKm: "0",
  status: "in_transit" as TripStatus,
  purpose: "",
  remarks: "",
};

export default function AddVehicleTrackingLogModal({
  open,
  submitting,
  onCreate,
  onClose,
}: AddVehicleTrackingLogModalProps) {
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
    if (!values.vehicle.trim()) next.vehicle = "Vehicle is required";
    if (!values.driver.trim()) next.driver = "Driver name is required";
    const distance = Number(values.distanceKm);
    if (!Number.isFinite(distance) || distance < 0)
      next.distanceKm = "Enter a distance of 0 or more";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onCreate({
      date: values.date,
      vehicle: values.vehicle.trim(),
      driver: values.driver.trim(),
      destination: values.destination.trim() || undefined,
      departureTime: values.departureTime || undefined,
      returnTime: values.returnTime || undefined,
      distanceKm: distance,
      purpose: values.purpose.trim() || undefined,
      status: values.status,
      remarks: values.remarks.trim() || undefined,
    });
  };

  return (
    <OperationsModal
      open={open}
      title="Add Vehicle Tracking Log"
      subtitle="Enter trip details"
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel="Add Log"
      submitting={submitting}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Date" required error={errors.date} htmlFor="trip-date">
          <TextInput id="trip-date" type="date" value={values.date} onChange={set("date")} />
        </Field>
        <Field label="Vehicle" required error={errors.vehicle} htmlFor="trip-vehicle">
          <TextInput
            id="trip-vehicle"
            placeholder="Vehicle name / plate no."
            value={values.vehicle}
            onChange={set("vehicle")}
          />
        </Field>
        <Field label="Driver Name" required error={errors.driver} htmlFor="trip-driver">
          <TextInput
            id="trip-driver"
            placeholder="Driver name"
            value={values.driver}
            onChange={set("driver")}
          />
        </Field>
        <Field label="Destination / Route" htmlFor="trip-destination">
          <TextInput
            id="trip-destination"
            placeholder="Destination or route"
            value={values.destination}
            onChange={set("destination")}
          />
        </Field>
        <Field label="Departure Time" htmlFor="trip-departure">
          <TextInput
            id="trip-departure"
            type="time"
            value={values.departureTime}
            onChange={set("departureTime")}
          />
        </Field>
        <Field label="Return Time" htmlFor="trip-return">
          <TextInput
            id="trip-return"
            type="time"
            value={values.returnTime}
            onChange={set("returnTime")}
          />
        </Field>
        <Field label="Distance (km)" error={errors.distanceKm} htmlFor="trip-distance">
          <TextInput
            id="trip-distance"
            type="number"
            min={0}
            step="any"
            value={values.distanceKm}
            onChange={set("distanceKm")}
          />
        </Field>
        <Field label="Status" htmlFor="trip-status">
          <SelectInput id="trip-status" value={values.status} onChange={set("status")}>
            {TRIP_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>

      <Field label="Purpose" htmlFor="trip-purpose">
        <TextInput
          id="trip-purpose"
          placeholder="Purpose of trip"
          value={values.purpose}
          onChange={set("purpose")}
        />
      </Field>

      <Field label="Remarks" htmlFor="trip-remarks">
        <TextareaInput
          id="trip-remarks"
          placeholder="Additional notes"
          value={values.remarks}
          onChange={set("remarks")}
        />
      </Field>
    </OperationsModal>
  );
}

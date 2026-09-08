"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

// ── Segmented tab bars ────────────────────────────────────────────────────────

export interface TabDef {
  label: string;
  value: string;
}

/** Full-width pill tab bar used for the three top-level Operations sections. */
export function SegmentedTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: TabDef[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div role="tablist" className="flex bg-gray-100 rounded-full p-1">
      {tabs.map((t) => {
        const isActive = t.value === active;
        return (
          <button
            key={t.value}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(t.value)}
            className={`flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/** Compact pill tab bar used for the sub-sections inside a tab. */
export function SubTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: TabDef[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div role="tablist" className="inline-flex bg-gray-100 rounded-lg p-1 gap-1">
      {tabs.map((t) => {
        const isActive = t.value === active;
        return (
          <button
            key={t.value}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(t.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Section header & buttons ──────────────────────────────────────────────────

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function PrimaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-2 bg-[#7cc843] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#68a638] disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm ${
        className ?? ""
      }`}
    >
      {children}
    </button>
  );
}

/** Small square pencil/edit button used across the Facility Management tab. */
export function IconButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`shrink-0 w-9 h-9 inline-flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors ${
        className ?? ""
      }`}
    >
      {children}
    </button>
  );
}

// ── Table shell ───────────────────────────────────────────────────────────────

export function TableShell({
  columns,
  isEmpty,
  emptyMessage,
  children,
}: {
  columns: string[];
  isEmpty: boolean;
  emptyMessage: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((c) => (
              <th
                key={c}
                scope="col"
                className="text-left font-semibold text-gray-600 px-4 py-3 whitespace-nowrap"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td colSpan={columns.length} className="text-center text-sm text-gray-400 py-12">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

export function OperationsModal({
  open,
  title,
  subtitle,
  onClose,
  onSubmit,
  submitLabel,
  submitting,
  children,
  size = "lg",
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitLabel: string;
  submitting?: boolean;
  children: React.ReactNode;
  size?: "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`bg-white rounded-2xl shadow-xl w-full ${
          size === "md" ? "max-w-md" : "max-w-2xl"
        } max-h-[90vh] overflow-y-auto`}
      >
        <form onSubmit={onSubmit} className="p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {children}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <PrimaryButton type="submit" disabled={submitting}>
              {submitLabel}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Form fields ───────────────────────────────────────────────────────────────

const FIELD_CLASS =
  "w-full bg-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white";

export function Field({
  label,
  required,
  error,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export const TextInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function TextInput({ className, ...props }, ref) {
  return <input ref={ref} {...props} className={`${FIELD_CLASS} ${className ?? ""}`} />;
});

export const SelectInput = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function SelectInput({ className, children, ...props }, ref) {
  return (
    <select ref={ref} {...props} className={`${FIELD_CLASS} ${className ?? ""}`}>
      {children}
    </select>
  );
});

export const TextareaInput = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function TextareaInput({ className, ...props }, ref) {
  return <textarea ref={ref} rows={3} {...props} className={`${FIELD_CLASS} resize-y ${className ?? ""}`} />;
});

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import apiHandler from "@/data/api/ApiHandler";

interface InventoryItem {
  id: string;
  name: string;
}

interface ItemComboboxProps {
  value: string;
  onChange: (name: string) => void;
  /** Called whenever an item is chosen — passes both the inventory item id and name */
  onSelect?: (id: string, name: string) => void;
  error?: string;
  disabled?: boolean;
}

const UNIT_TYPES = ["piece", "box", "kg", "litre", "carton"];

function generateCode(name: string): string {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 12);
}

export default function ItemCombobox({
  value,
  onChange,
  onSelect,
  error,
  disabled,
}: ItemComboboxProps) {
  const [inputValue, setInputValue] = useState(value ?? "");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // mini-create form state
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newSku, setNewSku] = useState("");
  const [newUnit, setNewUnit] = useState("piece");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // fetch items with debounce
  const fetchItems = useCallback((search: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await apiHandler.items.list(search || undefined);
        const list: InventoryItem[] = Array.isArray(res)
          ? res
          : Array.isArray(res?.items)
          ? res.items
          : Array.isArray(res?.content)
          ? res.content
          : Array.isArray(res?.data)
          ? res.data
          : [];
        setItems(list);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  // keep internal input in sync when parent resets value
  useEffect(() => {
    setInputValue(value ?? "");
  }, [value]);

  // click outside → close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setShowCreateForm(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setInputValue(val);
    onChange(val); // keep react-hook-form in sync with raw typed text
    setOpen(true);
    setShowCreateForm(false);
    fetchItems(val);
  }

  function handleFocus() {
    setOpen(true);
    fetchItems(inputValue);
  }

  function selectItem(item: InventoryItem) {
    setInputValue(item.name);
    onChange(item.name);
    onSelect?.(item.id, item.name);
    setOpen(false);
    setShowCreateForm(false);
  }

  function openCreateForm() {
    setNewName(inputValue);
    setNewCode(generateCode(inputValue));
    setNewSku(generateCode(inputValue));
    setNewUnit("piece");
    setCreateError("");
    setShowCreateForm(true);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || !newCode.trim()) {
      setCreateError("Name and Code are required.");
      return;
    }
    setCreating(true);
    setCreateError("");
    try {
      const res = await apiHandler.items.create({
        name: newName.trim(),
        code: newCode.trim(),
        sku: newSku.trim() || newCode.trim(),
        unitType: newUnit,
      });
      const created: InventoryItem =
        res?.content ?? res?.data ?? res ?? { id: "", name: newName.trim() };
      setInputValue(created.name);
      onChange(created.name);
      onSelect?.(created.id ?? "", created.name);
      setOpen(false);
      setShowCreateForm(false);
    } catch {
      setCreateError("Failed to create item. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  // whether the current typed text exactly matches an existing item
  const exactMatch = items.some(
    (it) => (it.name ?? "").toLowerCase() === (inputValue ?? "").toLowerCase()
  );

  return (
    <div ref={containerRef} className="relative">
      {/* Main input */}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder="Search or type an item name…"
        disabled={disabled}
        autoComplete="off"
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors ${
          error
            ? "border-red-400 focus:ring-red-300"
            : "border-gray-200 focus:ring-green-400 focus:border-green-400"
        }`}
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {/* Item list */}
          {loading && (
            <div className="px-4 py-2 text-xs text-gray-400">Loading…</div>
          )}

          {!loading && items.length === 0 && inputValue && (
            <div className="px-4 py-2 text-xs text-gray-400">
              No items found.
            </div>
          )}

          {!loading && items.length > 0 && (
            <ul className="max-h-48 overflow-y-auto">
              {items.filter((item) => !!item.name).map((item) => (
                <li
                  key={item.id}
                  onClick={() => selectItem(item)}
                  className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-green-50 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Divider + Create new row */}
          {!exactMatch && (
            <>
              {items.length > 0 && (
                <div className="border-t border-gray-100" />
              )}
              {!showCreateForm ? (
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-700 font-medium hover:bg-green-50 transition-colors"
                >
                  <span className="text-lg leading-none">+</span>
                  <span>
                    Create new item
                    {inputValue ? (
                      <span className="font-bold"> &ldquo;{inputValue}&rdquo;</span>
                    ) : null}
                  </span>
                </button>
              ) : (
                /* ── inline mini create form ── */
                <form
                  onSubmit={handleCreate}
                  className="p-3 border-t border-gray-100 bg-green-50 flex flex-col gap-2"
                >
                  <p className="text-xs font-semibold text-green-800 mb-1">
                    Create new inventory item
                  </p>

                  {createError && (
                    <p className="text-xs text-red-500">{createError}</p>
                  )}

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => {
                        setNewName(e.target.value);
                        if (!newCode || newCode === generateCode(newName)) {
                          setNewCode(generateCode(e.target.value));
                          setNewSku(generateCode(e.target.value));
                        }
                      }}
                      className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
                      required
                    />
                  </div>

                  {/* Code & Unit in a row */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-0.5">
                        Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newCode}
                        onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                        className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-400 uppercase"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-0.5">
                        Unit
                      </label>
                      <select
                        value={newUnit}
                        onChange={(e) => setNewUnit(e.target.value)}
                        className="w-full border border-gray-200 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-green-400"
                      >
                        {UNIT_TYPES.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-1">
                    <button
                      type="submit"
                      disabled={creating}
                      className="flex-1 bg-green-600 text-white text-xs rounded px-3 py-1.5 font-medium hover:bg-green-700 disabled:opacity-60 transition-colors"
                    >
                      {creating ? "Saving…" : "Save item"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1 border border-gray-300 text-gray-600 text-xs rounded px-3 py-1.5 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "lucide-react";

interface DatabaseItem {
  id: string;
  name: string;
}

interface DynamicSelectProps {
  apiConfig: {
    list: () => Promise<any>;
    create: (data: { name: string }) => Promise<any>;
  };
  value: string;
  onChange: (id: string, name: string) => void;
  placeholder?: string;
  createLabel?: string;
  error?: string;
  defaultDisplayValue?: string;
}

export default function DynamicSelect({
  apiConfig,
  value,
  onChange,
  placeholder = "Select or search...",
  createLabel = "Create new",
  error,
  defaultDisplayValue,
}: DynamicSelectProps) {
  const [items, setItems] = useState<DatabaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  // Create state
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch items
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await apiConfig.list();
      const list: DatabaseItem[] = Array.isArray(res)
        ? res
        : Array.isArray(res?.items)
        ? res.items
        : Array.isArray(res?.content)
        ? res.content
        : Array.isArray(res?.data)
        ? res.data
        : [];
      setItems(list);
    } catch (e) {
      console.error("Failed to fetch elements", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && items.length === 0) {
      fetchItems();
    }
  }, [open]);

  // Click outside listener
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setShowCreate(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    setCreating(true);
    try {
      const res = await apiConfig.create({ name: newName.trim() });
      const created = res?.content ?? res?.data ?? res;
      if (created && created.id) {
        setItems((prev) => [...prev, created]);
        onChange(created.id, created.name);
        setSearch("");
        setOpen(false);
        setShowCreate(false);
      }
    } catch (err) {
      console.error("Failed to create", err);
    } finally {
      setCreating(false);
    }
  };

  const selectedItem = items.find((i) => i.id === value);
  const displayValue = open ? search : selectedItem?.name ?? (value && defaultDisplayValue ? defaultDisplayValue : "");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const exactMatch = items.some((i) => i.name.toLowerCase() === search.toLowerCase());

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        value={displayValue}
        onChange={(e) => {
          setSearch(e.target.value);
          if (!open) setOpen(true);
          setShowCreate(false);
        }}
        onFocus={() => {
          setOpen(true);
          if (selectedItem) setSearch("");
        }}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors ${
          error ? "border-red-400 focus:ring-red-300" : "border-gray-200 focus:ring-green-400 focus:border-green-400"
        }`}
      />

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {loading && (
            <div className="px-4 py-2 text-xs text-gray-400">Loading...</div>
          )}

          {!loading && filteredItems.length === 0 && search && !showCreate && (
             <div className="px-4 py-2 text-xs text-gray-400">
               No results found.
             </div>
          )}

          {!loading && filteredItems.length > 0 && (
            <ul className="max-h-48 overflow-y-auto">
              {filteredItems.map((item) => (
                <li
                  key={item.id}
                  onClick={() => {
                    onChange(item.id, item.name);
                    setSearch("");
                    setOpen(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-green-50 transition-colors ${
                    item.id === value ? "bg-green-50 font-medium text-green-700" : "text-gray-700"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${item.id === value ? "bg-green-500" : "bg-green-300"}`} />
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Divider + Create new row */}
          {!loading && !exactMatch && (
            <>
              {filteredItems.length > 0 && (
                <div className="border-t border-gray-100" />
              )}
              {!showCreate ? (
                <button
                  type="button"
                  onClick={() => {
                    setNewName(search);
                    setShowCreate(true);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-700 font-medium hover:bg-green-50 transition-colors"
                >
                  <span className="text-lg leading-none">+</span>
                  <span>
                    {createLabel}
                    {search ? (
                      <span className="font-bold"> &ldquo;{search}&rdquo;</span>
                    ) : null}
                  </span>
                </button>
              ) : (
                /* ── inline mini create form ── */
                <form onSubmit={handleCreate} className="p-3 border-t border-gray-100 bg-green-50 flex flex-col gap-2">
                  <p className="text-xs font-semibold text-green-800 mb-1">
                    {createLabel}
                  </p>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      autoFocus
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
                      required
                    />
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button
                      type="submit"
                      disabled={creating}
                      className="flex-1 bg-green-600 text-white text-xs rounded px-3 py-1.5 font-medium hover:bg-green-700 disabled:opacity-60 transition-colors"
                    >
                      {creating ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreate(false)}
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

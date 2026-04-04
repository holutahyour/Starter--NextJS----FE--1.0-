export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  categoryId?: string;
  categoryName?: string;
  vendorId?: string;
  vendorName?: string;
  currentStock: number;
  minStock: number;
  unit: string;
  status: "Low Stock" | "Adequate";
  location: string;
  locationId?: string;
  locationName?: string;
  itemLocation?: string;
  costPrice?: number;
  sellingPrice?: number;
  lastUpdatedDate: string;
  lastUpdatedBy: string;
}

export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: "1",
    name: "A4 Paper",
    category: "Office Supplies",
    currentStock: 15,
    minStock: 50,
    unit: "reams",
    status: "Low Stock",
    location: "Storage Room A",
    locationName: "Storage Room A",
    itemLocation: "Aisle 2, Rack 4",
    lastUpdatedDate: "2026-02-03",
    lastUpdatedBy: "Mike Inventory",
  },
  {
    id: "2",
    name: "Toner Cartridge (Black)",
    category: "Printer Supplies",
    currentStock: 3,
    minStock: 10,
    unit: "units",
    status: "Low Stock",
    location: "Storage Room B",
    locationName: "Storage Room B",
    itemLocation: "Cabinet 3, Shelf Top",
    lastUpdatedDate: "2026-02-04",
    lastUpdatedBy: "Mike Inventory",
  },
  {
    id: "3",
    name: "USB Flash Drives (32GB)",
    category: "IT Equipment",
    currentStock: 8,
    minStock: 20,
    unit: "units",
    status: "Low Stock",
    location: "IT Storage",
    lastUpdatedDate: "2026-02-02",
    lastUpdatedBy: "Mike Inventory",
  },
  {
    id: "4",
    name: "Notebooks",
    category: "Office Supplies",
    currentStock: 25,
    minStock: 100,
    unit: "units",
    status: "Low Stock",
    location: "Storage Room A",
    lastUpdatedDate: "2026-02-01",
    lastUpdatedBy: "Mike Inventory",
  },
  {
    id: "5",
    name: "Pens (Blue)",
    category: "Office Supplies",
    currentStock: 30,
    minStock: 200,
    unit: "units",
    status: "Low Stock",
    location: "Storage Room A",
    lastUpdatedDate: "2026-01-30",
    lastUpdatedBy: "Mike Inventory",
  },
  {
    id: "6",
    name: "HDMI Cables",
    category: "IT Equipment",
    currentStock: 45,
    minStock: 30,
    unit: "units",
    status: "Adequate",
    location: "IT Storage",
    lastUpdatedDate: "2026-02-05",
    lastUpdatedBy: "Mike Inventory",
  },
];

export const mapApiToFrontendItem = (i: any): InventoryItem => ({
  id: i.id,
  name: i.name || "Unknown",
  category: i.categoryName || "Unknown",
  categoryId: i.categoryId,
  categoryName: i.categoryName,
  vendorId: i.vendorId,
  vendorName: i.vendorName,
  currentStock: i.quantityOnHand ?? i.initialStock ?? 0,
  minStock: i.minStockLevel || 0,
  unit: i.unitType || "piece",
  status: (((i.quantityOnHand ?? i.initialStock ?? 0) <= (i.minStockLevel || 0)) ? "Low Stock" : "Adequate"),
  location: i.locationName || i.locationId || "N/A",
  locationId: i.locationId,
  locationName: i.locationName,
  itemLocation: i.itemLocation,
  costPrice: i.costPrice,
  sellingPrice: i.sellingPrice,
  lastUpdatedDate: i.lastModifiedOn ? new Date(i.lastModifiedOn).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
  lastUpdatedBy: i.lastModifiedBy || "System",
});

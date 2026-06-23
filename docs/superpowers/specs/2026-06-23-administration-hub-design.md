# Administration Hub — Design Spec

**Date:** 2026-06-23
**Status:** Approved (brainstorming) — pending spec review
**Scope:** Full-stack (CRM---BE + CRM--FE)

## 1. Goal

Provide a polished, unified **Administration** area so tenant administrators can manage
roles & permissions, view & enable modules, browse menus, and review/export audit logs.
Reuse the existing access-control data model and APIs; fill the two backend gaps
(audit-log read/export, module management).

## 2. Audience & tenancy

- **Primary audience:** a tenant's own administrator (tenant-scoped).
- **Super-admin:** a small set of *global catalog* controls (menu-tree editing, module-catalog
  editing, cross-tenant audit view) are gated to super-admins.
- **Super-admin signal:** users holding the seeded role code **`SUPER_ADMIN`**
  (`Role.IsSystem = true`). Backend adds a `SuperAdminOnly` authorization policy; frontend
  uses the existing `hasRole(['SUPER_ADMIN'])` from `auth-context`.

## 3. Existing system (do not rebuild)

- **Entities:** `Role`, `Permission`, `RolePermission`, `Menu`, `MenuPermission`, `Module`,
  `ModuleCategory`, `TenantModule`, `User`, `UserRole`, `AuditLog`.
- **Controllers (CRUD):** `RolesController` (incl. permission assignment via `PermissionIds`),
  `MenusController` (CRUD + `my-menus` + permission mapping), `PermissionsController` (read),
  `UsersController`, `TenantsController`.
- **Audit:** `AuditLog` is written automatically by `MSSQLBaseService` on every
  Create/Update/Delete (`ActionType`, `EntityName`, `UserId`, `Timestamp`, `OldValues`,
  `NewValues`, `IpAddress`, `AdditionalInfo`).
- **Authorization:** `PermissionAuthorizationHandler`, `CachedPermissionService`, `AdminOnly` policy.
- **Frontend:** only `admin/users` exists; tabbed page pattern at `configurations`/`parameters`;
  shared `app-data-table`, drawer components, Chakra UI; `ApiHandler` (axios + bearer).

## 4. Backend changes

### 4a. Audit logs — read + export (new)

1. **Schema:** add nullable `Guid? TenantId` to `AuditLog`. Populate it at write time in
   `MSSQLBaseService` from `ITenantProvider` (falls back to HttpContext tenant / null for
   system actions). One EF migration.
2. **Service:** new `IAuditLogService` + implementation (dedicated, **not** the Guid generic
   base — `AuditLog` uses `long` Id).
   - `GetAllAsync(filter)` → paginated `Result<IList<AuditLogDTO>>` with `MetaData`.
   - Filters: `entityName`, `actionType`, `userId`, `fromDate`, `toDate`; default sort
     `Timestamp` desc.
   - **Tenant scoping:** `IgnoreQueryFilters()` + explicit `TenantId == currentTenant` predicate
     (per CLAUDE.md pattern). Super-admin may pass `allTenants=true` to bypass.
   - `ExportAsync(filter)` → returns CSV bytes for the same filtered set (no paging; capped at a
     sane max rows, e.g. 50k, to avoid runaway exports).
3. **Controller:** `AuditLogsController`
   - `[Authorize(Policy = "AdminOnly")] GET api/v1/auditlogs` (paged, filtered).
   - `[Authorize(Policy = "AdminOnly")] GET api/v1/auditlogs/export` → `text/csv` file download.
   - `allTenants=true` requires `SuperAdminOnly`.
4. **DTO:** `AuditLogDTO(long Id, string ActionType, string EntityName, string UserId,
   DateTime Timestamp, string? OldValues, string? NewValues, string IpAddress,
   string? AdditionalInfo, Guid? TenantId)`.

### 4b. Modules — management (new)

1. **Service:** new `IModuleService` + implementation.
   - `GetCatalogAsync()` → global modules (with category) as `ModuleDTO`.
   - `GetTenantModulesAsync()` → current tenant's `TenantModule` set.
   - `ToggleAsync(ToggleModuleRequest)` → enable/disable a module for the current tenant
     (create `TenantModule` or set its active flag).
   - Catalog create/edit/delete → `SuperAdminOnly`.
2. **Controller:** `ModulesController`
   - `[Authorize(Policy = "AdminOnly")] GET api/v1/modules` (catalog).
   - `[Authorize(Policy = "AdminOnly")] GET api/v1/modules/tenant` (tenant's enabled set).
   - `[Authorize(Policy = "AdminOnly")] POST api/v1/modules/toggle`.
   - `[Authorize(Policy = "SuperAdminOnly")] POST/PUT/DELETE` for catalog edits.
3. **DTOs:** `ModuleDTO`, `TenantModuleDTO`, `ToggleModuleRequest(Guid ModuleId, bool Enabled)`.

### 4c. Permissions / Roles / Menus (reuse)

- **Permissions:** keep `PermissionsController` read. Add a grouped-by-module projection to the
  read response (group key = `ModuleCode`/category) so the frontend can render the matrix
  without client-side grouping logic duplication.
- **Roles:** reuse existing CRUD + `PermissionIds` assignment unchanged.
- **Menus:** reuse existing CRUD. Optionally a position/reorder update (number field, no DnD lib
  in v1). Menu-tree editing endpoints already exist and are `AdminOnly`; tenant admins get
  read-only treatment in the UI.

### 4d. Authorization

- Register `SuperAdminOnly` policy in `Program.cs` (requires `SUPER_ADMIN` role / `IsSystem`).
- Seed the `SUPER_ADMIN` role (`IsSystem = true`) with all permissions if not present.

## 5. Frontend — `/admin` hub

Unified tabbed area (mirrors `configurations` layout): tabs **Users**, **Roles & Permissions**,
**Menus**, **Modules**, **Audit Logs**.

1. **Roles & Permissions**
   - Roles data table (name, code, description, system badge, active).
   - Per-role editor drawer: **permission matrix grouped by module/category** with checkboxes;
     saves via existing role `PermissionIds` API. System roles are read-only.
2. **Menus**
   - Menu tree view (parent → children, icon, route, mapped permissions).
   - Super-admin: full CRUD (label, icon, route, position, parent, permission mapping).
   - Tenant admin: read-only.
3. **Modules**
   - Catalog list/cards grouped by category with enable/disable toggle for the current tenant
     (`TenantModule`).
   - Super-admin: edit catalog (name, code, description, version, category, active).
4. **Audit Logs**
   - Filterable, paginated table (entity, action, user, date range), `Timestamp` desc.
   - Row expand → old→new value diff (JSON pretty-print).
   - **Export** button → downloads CSV for the current filter (calls `/auditlogs/export`).
   - Super-admin: optional `allTenants` toggle.
5. **Users** — keep existing `admin/users` page within the hub.

**FE plumbing**
- New typed API functions (extend `ApiHandler` or a dedicated `admin` API module) + interfaces:
  `IRole`, `IPermission`, `IMenu` (exists), `IModule`, `ITenantModule`, `IAuditLog`.
- Reuse `app-data-table`, drawer components, Chakra UI, existing pagination/query hooks.
- Gating: super-admin-only controls hidden/disabled via `hasRole`; 403 responses also hide them.

## 6. Data flow & errors

- page → `ApiHandler` (axios + bearer) → controller → service → repository.
- Audit logs are auto-written by `MSSQLBaseService`; the new read/export paths only query.
- Service methods return `Result<T>`; controllers unwrap to HTTP status; the existing axios
  interceptor toasts on mutation errors. 403 → hide/disable gated controls.

## 7. Testing

- **Backend (xUnit):**
  - `AuditLogService`: tenant scoping (tenant admin sees only own tenant; super-admin
    `allTenants` sees all), filter & paging, export row cap.
  - `ModuleService`: toggle creates/updates `TenantModule`; catalog edits blocked without
    super-admin.
- **Frontend:**
  - Component tests for the permission matrix and audit filters where patterns exist.
  - Playwright e2e smoke: open hub, switch tabs, edit a role's permissions, export audit CSV.

## 8. Scope guardrails (YAGNI)

- No change to the RBAC model (stays role → permission).
- No cross-tenant analytics dashboards.
- No drag-and-drop menu ordering in v1 (position via number field).
- Audit export limited to CSV with a row cap; no scheduled/async export in v1.

## 9. Resolved decisions

- **Super-admin signal:** seeded `SUPER_ADMIN` role code (`Role.IsSystem = true`). Chosen over
  SYSTEM-tenant sniffing — explicit, testable, and consistent with the existing RBAC model.
- **Audit export:** CSV (`text/csv`), capped at 50,000 rows per export.
- **Users tab:** existing `admin/users` page reused as-is; no redesign in this effort.

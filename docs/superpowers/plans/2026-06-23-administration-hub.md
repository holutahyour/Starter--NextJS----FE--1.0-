# Administration Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a tenant-scoped Administration hub (roles & permissions, menus, modules, audit logs with CSV export) on the existing access-control model, filling the backend gaps for audit read/export and module management.

**Architecture:** Backend = new `AuditLogService`/`ModuleService` + controllers reusing the `Result<T>` + `MSSQLBaseService` patterns; `AuditLog` gains a nullable `TenantId` populated at write time. Frontend = a unified `/admin` tabbed hub (mirroring the `configurations` layout) consuming existing + new APIs via `ApiHandler`. Super-admin-only catalog controls gated by an `admin.system.manage` permission (held by a seeded `SUPER_ADMIN` role) on the backend and `hasRole(['SUPER_ADMIN'])` on the frontend.

**Tech Stack:** ASP.NET Core 9, EF Core 9, AutoMapper, xUnit/Moq/FluentAssertions; Next.js (App Router), React, Chakra UI, axios, Playwright.

## Global Constraints

- Flat namespaces despite nested folders (see CLAUDE.md): entities `CRM.Domain.Entities`, DTOs `CRM.Domain.DTOs.Core`, service impls `CRM.Services.Implementations.<Area>`, interfaces `CRM.Services.Interfaces`, configs `CRM.Data.Configurations`.
- Always use fully-qualified `CRM.Data.ApplicationDbContext` in service field/ctor declarations.
- Services return `Result<T>`; controllers unwrap to `Ok`/`BadRequest`.
- New permission codes added to `Permissions.cs` are auto-seeded (reflection) and auto-granted to `ADMIN`.
- EF migration command: `dotnet ef migrations add <Name> --project CRM.Data --startup-project CRM.API`.
- Tests use `TestDbContext.Create(...)` / `SqliteTestDb.Create(...)`; seed & query with `.IgnoreQueryFilters()`.

---

## PHASE 1 — Backend foundation

### Task 1: Super-admin permission + policies

**Files:**
- Modify: `CRM.Domain/Constants/Access Control/Permissions.cs`
- Modify: `CRM.API/Program.cs:88-97`
- Create: `CRM.Data/Seeds/Access Control/SuperAdminRoleSeedData.cs`
- Modify: `CRM.Data/ApplicationDbContext.cs` (OnModelCreating seed call, if seeds are invoked there)

**Interfaces:**
- Produces: `Permissions.SystemManage = "admin.system.manage"`; policies `"SuperAdminOnly"`, `"AuditView"`, `"ModulesManage"`, `"MenusManage"`, `"RolesManage"`.

- [ ] **Step 1:** Add to `Permissions.cs` (Administration region): `public const string SystemManage = "admin.system.manage";`
- [ ] **Step 2:** In `Program.cs` authorization builder add policies:
```csharp
    .AddPolicy("SuperAdminOnly", p => p.AddRequirements(new PermissionRequirement(Permissions.SystemManage)))
    .AddPolicy("AuditView", p => p.AddRequirements(new PermissionRequirement(Permissions.AuditView)))
    .AddPolicy("RolesManage", p => p.AddRequirements(new PermissionRequirement(Permissions.RolesManage)))
    .AddPolicy("ModulesManage", p => p.AddRequirements(new PermissionRequirement(Permissions.ModulesManage)))
    .AddPolicy("MenusManage", p => p.AddRequirements(new PermissionRequirement(Permissions.MenusManage)));
```
- [ ] **Step 3:** Create `SuperAdminRoleSeedData` seeding a `Role { Code="SUPER_ADMIN", IsSystem=true, TenantId=Guid.Empty }` with deterministic Id, plus a `RolePermission` granting `admin.system.manage` (deterministic guid via MD5 of code, matching `RolePermissionSeedData`). Wire its `Seed(modelBuilder)` next to the existing seed calls.
- [ ] **Step 4:** Build: `dotnet build CRM.sln` — Expected: success.
- [ ] **Step 5:** Add migration `AddSuperAdminRoleSeed`; commit.

### Task 2: AuditLog.TenantId — schema + write population

**Files:**
- Modify: `CRM.Base/Domain/Entities/AuditLog.cs`
- Modify: `CRM.Base/Services/Implementation/MSSQLBaseService.cs` (3 AuditLog construction sites: ~50, ~191, ~236)
- Test: `CRM.Tests/Services/AuditLogWriteTests.cs`

**Interfaces:**
- Produces: `AuditLog.TenantId` (`Guid?`); audit writes set `TenantId` from `HttpContext.Items["TenantId"]`.

- [ ] **Step 1 (test first):** Write `CRM.Tests/Services/AuditLogWriteTests.cs` asserting that after a `CreateAsync` through a concrete service, the written `AuditLog.TenantId` equals the provider tenant. (Use `TestDbContext.Create(tenantId, userId)` + a concrete service e.g. `GenderService`; read `db.Set<AuditLog>().IgnoreQueryFilters()`.)
- [ ] **Step 2:** Run: `dotnet test --filter AuditLogWriteTests` — Expected: FAIL (TenantId null/missing).
- [ ] **Step 3:** Add `public Guid? TenantId { get; set; }` to `AuditLog`. In `MSSQLBaseService`, at each `new AuditLog { ... }` add `TenantId = _httpContextAccessor.HttpContext?.Items["TenantId"] as Guid?,`.
- [ ] **Step 4:** Run test — Expected: PASS. Build solution.
- [ ] **Step 5:** Add migration `AddAuditLogTenantId`; commit.

### Task 3: AuditLog DTO + read service

**Files:**
- Create: `CRM.Domain/DTOs/Core/Access Control/AuditLogDTO.cs`
- Create: `CRM.Service/Services/Interfaces/Core/Access Control/IAuditLogService.cs`
- Create: `CRM.Service/Services/Implementations/Core/Access Control/AuditLogService.cs`
- Modify: `CRM.Service/DependencyInjection.cs`
- Modify: `CRM.Service/AutoMapperConfig.cs`
- Test: `CRM.Tests/Services/AuditLogServiceTests.cs`

**Interfaces:**
- Produces: `IAuditLogService.GetAllAsync(AuditLogFilter, baseUrl) : Result<IList<AuditLogDTO>>` and `ExportCsvAsync(AuditLogFilter) : Result<byte[]>`.
- `AuditLogFilter(string? EntityName, string? ActionType, string? UserId, DateTime? FromDate, DateTime? ToDate, int Page, int PageSize, bool AllTenants)`.

- [ ] **Step 1 (test first):** `AuditLogServiceTests`: seed 3 `AuditLog` rows across 2 tenants; assert tenant-scoped `GetAllAsync` returns only current tenant's rows; `AllTenants=true` returns all; filter by `ActionType` works; `ExportCsvAsync` returns non-empty bytes whose text contains a header row.
- [ ] **Step 2:** Run — Expected: FAIL (types missing).
- [ ] **Step 3:** Implement DTO record, `AuditLogFilter` record, `IAuditLogService`, and `AuditLogService` using `CRM.Data.ApplicationDbContext` directly (`_db.AuditLogs.IgnoreQueryFilters()` + explicit `TenantId == current` unless `AllTenants`), ordering by `Timestamp desc`, paging, building `MetaData`. CSV: header `Timestamp,ActionType,EntityName,UserId,IpAddress,TenantId` + escaped rows, capped at 50_000. Register in DI; add DTO map in AutoMapper.
- [ ] **Step 4:** Run tests — Expected: PASS. Build.
- [ ] **Step 5:** Commit.

### Task 4: AuditLogsController

**Files:**
- Create: `CRM.API/Controllers/V1/Core/Access Control/AuditLogsController.cs`

**Interfaces:**
- Consumes: `IAuditLogService`. Produces routes `GET api/v1/auditlogs`, `GET api/v1/auditlogs/export`.

- [ ] **Step 1:** Implement controller: `[Authorize(Policy="AuditView")]` on GET list & export; if `allTenants` requested, additionally require super-admin (check the current user's permission set or `[Authorize(Policy="SuperAdminOnly")]` on a dedicated branch — simplest: ignore `allTenants` unless `User` is super-admin, resolved via `HttpContext.Items["CurrentUser"]`/permission). Export returns `File(bytes, "text/csv", "audit-logs.csv")`.
- [ ] **Step 2:** Build — Expected: success.
- [ ] **Step 3:** Commit.

### Task 5: Module DTOs + service

**Files:**
- Create: `CRM.Domain/DTOs/Core/Access Control/ModuleDTO.cs` (`ModuleDTO`, `TenantModuleDTO`, `ToggleModuleRequest`, `ModuleCatalogRequest`)
- Create: `CRM.Service/Services/Interfaces/Core/Access Control/IModuleService.cs`
- Create: `CRM.Service/Services/Implementations/Core/Access Control/ModuleService.cs`
- Modify: `CRM.Service/DependencyInjection.cs`, `CRM.Service/AutoMapperConfig.cs`
- Test: `CRM.Tests/Services/ModuleServiceTests.cs`

**Interfaces:**
- Produces: `IModuleService` extends `IMSSQLBaseService<Module, Guid>` with `GetTenantModulesAsync() : Result<IList<TenantModuleDTO>>` and `ToggleAsync(ToggleModuleRequest) : Result<bool>`.

- [ ] **Step 1 (test first):** `ModuleServiceTests`: `ToggleAsync(enabled:true)` creates an active `TenantModule` for the current tenant; toggling false deactivates it; `GetTenantModulesAsync` returns the tenant's set.
- [ ] **Step 2:** Run — Expected: FAIL.
- [ ] **Step 3:** Implement DTOs, interface, service (inherit `MSSQLBaseService<Module, Guid>` for catalog CRUD; inject `IMSSQLRepository<TenantModule,Guid>` + context for toggle/list). Register + map.
- [ ] **Step 4:** Run — Expected: PASS. Build.
- [ ] **Step 5:** Commit.

### Task 6: ModulesController

**Files:**
- Create: `CRM.API/Controllers/V1/Core/Access Control/ModulesController.cs`

- [ ] **Step 1:** Implement: `GET api/v1/modules` (catalog, `[Authorize(Policy="AdminOnly")]`), `GET api/v1/modules/tenant`, `POST api/v1/modules/toggle` (AdminOnly); catalog `POST/PUT/DELETE` `[Authorize(Policy="SuperAdminOnly")]`.
- [ ] **Step 2:** Build — Expected: success.
- [ ] **Step 3:** Full backend regression: `dotnet test` — Expected: all pass. Commit.

---

## PHASE 2 — Frontend admin hub

### Task 7: Admin API layer + interfaces

**Files:**
- Create: `CRM--FE/src/data/interface/IAdmin.ts` (IRole, IPermission, IModule, ITenantModule, IAuditLog, IAuditLogFilter)
- Create: `CRM--FE/src/data/api/AdminApi.ts` (typed functions: getRoles, createRole, updateRole, deleteRole, getPermissions, getMenus, createMenu, updateMenu, deleteMenu, getModuleCatalog, getTenantModules, toggleModule, getAuditLogs, exportAuditLogs)

- [ ] **Step 1:** Define interfaces mirroring BE DTOs.
- [ ] **Step 2:** Implement API functions using the existing axios instance pattern from `ApiHandler.ts` (bearer via session interceptor); `exportAuditLogs` requests `responseType: 'blob'`.
- [ ] **Step 3:** `npm run build` (or `tsc --noEmit`) — Expected: success. Commit.

### Task 8: Admin hub shell + routing

**Files:**
- Create: `CRM--FE/src/app/(main)/admin/layout.tsx` (tabbed shell: Users, Roles & Permissions, Menus, Modules, Audit Logs — mirror `configurations/layout.tsx`)
- Create: `CRM--FE/src/app/(main)/admin/page.tsx` (redirect/overview)
- Keep: existing `admin/users/page.tsx` as the Users tab.

- [ ] **Step 1:** Build tab layout reusing the configurations tab pattern; gate Menus-edit & Modules-catalog & audit allTenants behind `hasRole(['SUPER_ADMIN'])`.
- [ ] **Step 2:** `npm run build` — Expected: success. Commit.

### Task 9: Roles & Permissions tab

**Files:**
- Create: `CRM--FE/src/app/(main)/admin/roles/page.tsx`
- Create: `CRM--FE/src/app/(main)/admin/roles/_components/RoleTable.tsx`, `RoleEditorDrawer.tsx`, `PermissionMatrix.tsx`

- [ ] **Step 1:** Roles table (reuse `app-data-table`). Editor drawer with `PermissionMatrix` grouped by permission code prefix (module). System roles read-only. Save via `updateRole`/`createRole` with `PermissionIds`.
- [ ] **Step 2:** `npm run build` — Expected: success. Commit.

### Task 10: Menus tab

**Files:**
- Create: `CRM--FE/src/app/(main)/admin/menus/page.tsx` + `_components/MenuTree.tsx`, `MenuEditorDrawer.tsx`

- [ ] **Step 1:** Render menu tree from `getMenus`. Super-admin: CRUD (label, icon, route, position, parentId, PermissionIds). Tenant admin: read-only.
- [ ] **Step 2:** `npm run build` — Expected: success. Commit.

### Task 11: Modules tab

**Files:**
- Create: `CRM--FE/src/app/(main)/admin/modules/page.tsx` + `_components/ModuleList.tsx`

- [ ] **Step 1:** List catalog grouped by category with enable/disable toggle (`toggleModule`) reflecting `getTenantModules`. Super-admin: catalog edit.
- [ ] **Step 2:** `npm run build` — Expected: success. Commit.

### Task 12: Audit Logs tab

**Files:**
- Create: `CRM--FE/src/app/(main)/admin/audit-logs/page.tsx` + `_components/AuditTable.tsx`, `AuditFilters.tsx`, `AuditDetailDrawer.tsx`

- [ ] **Step 1:** Filterable paginated table (entity, action, user, date range). Row expand → old/new JSON diff. Export button downloads CSV blob. Super-admin: allTenants toggle.
- [ ] **Step 2:** `npm run build` — Expected: success. Commit.

### Task 13: E2E smoke

**Files:**
- Create: `CRM--FE/e2e/admin-hub.spec.ts`

- [ ] **Step 1:** Playwright: open `/admin`, switch tabs, open a role editor, trigger audit export download.
- [ ] **Step 2:** Run e2e (if env available) — Expected: pass. Commit.

---

## Self-Review

- **Spec coverage:** §4a audit read/export → Tasks 2–4 + 12; §4b modules → Tasks 5–6 + 11; §4c roles/menus/permissions → Tasks 9–10 (+ existing APIs); §4d auth/super-admin → Task 1; §5 hub/tabs → Tasks 7–12; §7 testing → per-task tests + Task 13. Covered.
- **Type consistency:** `AuditLogFilter`, `AuditLogDTO`, `ToggleModuleRequest`, `TenantModuleDTO` names used consistently across BE tasks and FE interfaces (Task 7).
- **No placeholders:** concrete files, commands, and code shapes specified per task.

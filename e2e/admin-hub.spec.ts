/**
 * E2E smoke tests — Administration hub
 *
 * Strategy:
 *  - All API/auth calls are intercepted via Playwright route stubs so the suite
 *    runs without a live backend or Azure AD account.
 *  - Tabs are query-param driven (?tab=...). We navigate with page.goto() per tab
 *    rather than clicking, to avoid the RSC re-render / portal pitfalls noted in
 *    the approval-workflows spec.
 *
 * Covered:
 *   1. Roles tab renders the roles table with a seeded role + "New Role" action
 *   2. Modules tab renders the catalog grouped by category with a toggle button
 *   3. Audit Logs tab renders rows and an "Export CSV" action
 *   4. Audit Logs export triggers a CSV download
 */

import { test, expect, type Page, type Route } from "@playwright/test";

const MOCK_SESSION = {
  user: { name: "Test Admin", email: "admin@example.com", id: "user-1", roles: ["ADMIN"] },
  accessToken: "mock-token",
  expires: "2099-01-01T00:00:00.000Z",
};

const MOCK_ROLES = [
  { id: "role-1", name: "Administrator", code: "ADMIN", description: "All access", isSystem: true, isActive: true, permissions: [], permissionIds: ["p1", "p2"] },
  { id: "role-2", name: "Warehouse Manager", code: "WH_MGR", description: "Warehouse", isSystem: false, isActive: true, permissions: [], permissionIds: ["p1"] },
];

const MOCK_PERMISSIONS = [
  { id: "p1", name: "View Items", code: "inventory.items.view", moduleCode: "INVENTORY", description: "" },
  { id: "p2", name: "Manage Users", code: "admin.users.manage", moduleCode: "CORE", description: "" },
];

const MOCK_CATALOG = [
  { id: "m1", name: "Inventory Management", code: "INVENTORY", description: "Stock", version: "1.0", categoryId: "c1", categoryName: "Operations", isActive: true },
  { id: "m2", name: "Reporting", code: "REPORTS", description: "Analytics", version: "1.0", categoryId: "c2", categoryName: "Intelligence", isActive: true },
];

const MOCK_TENANT_MODULES = [
  { id: "tm1", moduleId: "m1", moduleName: "Inventory Management", moduleCode: "INVENTORY", categoryName: "Operations", isActive: true, activatedAt: null, expiresAt: null },
];

const MOCK_AUDIT = [
  { id: 1, actionType: "Update", entityName: "Item", userId: "admin@example.com", timestamp: "2026-06-23T10:00:00Z", oldValues: '{"qty":1}', newValues: '{"qty":2}', ipAddress: "127.0.0.1", additionalInfo: null, tenantId: null },
];

async function stubCommon(page: Page) {
  await page.route("**/api/auth/session**", (r) => r.fulfill({ json: MOCK_SESSION }));
  await page.route("**/api/auth/**", (r) => r.fulfill({ json: MOCK_SESSION }));
  await page.route("**/api/v1/menus/**", (r) => r.fulfill({ json: { isSuccess: true, content: [] } }));
  await page.route("**/api/v1/notifications**", (r) => r.fulfill({ json: { isSuccess: true, content: [] } }));
  await page.route("**/api/v1/roles", (r) => r.fulfill({ json: { isSuccess: true, content: MOCK_ROLES } }));
  await page.route("**/api/v1/permissions**", (r) => r.fulfill({ json: { isSuccess: true, content: MOCK_PERMISSIONS } }));
  await page.route("**/api/v1/modules", (r) => r.fulfill({ json: { isSuccess: true, content: MOCK_CATALOG } }));
  await page.route("**/api/v1/modules/tenant", (r) => r.fulfill({ json: { isSuccess: true, content: MOCK_TENANT_MODULES } }));
  await page.route("**/api/v1/auditlogs?**", (r) =>
    r.fulfill({ json: { isSuccess: true, content: MOCK_AUDIT, metaData: { lastPage: 1 } } })
  );
}

test.describe("Administration hub", () => {
  test.beforeEach(async ({ page }) => {
    await stubCommon(page);
  });

  test("Roles tab lists roles and exposes New Role", async ({ page }) => {
    await page.goto("/admin?tab=roles");
    await expect(page.getByText("Warehouse Manager")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole("button", { name: "New Role" })).toBeVisible();
  });

  test("Modules tab renders catalog with toggle", async ({ page }) => {
    await page.goto("/admin?tab=modules");
    await expect(page.getByText("Inventory Management")).toBeVisible({ timeout: 30_000 });
    // m1 is enabled => button shows "Disable"; m2 not enabled => "Enable"
    await expect(page.getByRole("button", { name: "Enable" }).first()).toBeVisible();
  });

  test("Audit Logs tab renders rows and Export CSV", async ({ page }) => {
    await page.goto("/admin?tab=audit-logs");
    await expect(page.getByText("Item").first()).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole("button", { name: "Export CSV" })).toBeVisible();
  });

  test("Audit Logs export downloads a CSV", async ({ page }) => {
    await page.route("**/api/v1/auditlogs/export**", (r: Route) =>
      r.fulfill({
        headers: { "content-type": "text/csv" },
        body: "Timestamp,ActionType,EntityName,UserId,IpAddress,TenantId,AdditionalInfo\n",
      })
    );
    await page.goto("/admin?tab=audit-logs");
    await expect(page.getByRole("button", { name: "Export CSV" })).toBeVisible({ timeout: 30_000 });

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Export CSV" }).click(),
    ]);
    expect(download.suggestedFilename()).toContain("audit-logs");
  });
});

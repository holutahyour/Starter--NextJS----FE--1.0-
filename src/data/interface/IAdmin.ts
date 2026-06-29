// Admin/Access-Control DTOs mirroring the backend (CRM.Domain.DTOs.Core).

export interface IPermission {
  id: string;
  name: string;
  code: string;
  moduleCode?: string | null;
  description?: string | null;
}

export interface IRole {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  isSystem: boolean;
  isActive: boolean;
  permissions: string[];
  permissionIds: string[];
}

export interface ICreateRoleRequest {
  name: string;
  code: string;
  description?: string | null;
  permissionIds: string[];
}

export interface IUpdateRoleRequest {
  name: string;
  description?: string | null;
  isActive: boolean;
  permissionIds: string[];
}

export interface IModule {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  version?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
  isActive: boolean;
}

export interface ITenantModule {
  id: string;
  moduleId: string;
  moduleName: string;
  moduleCode: string;
  categoryName?: string | null;
  isActive: boolean;
  activatedAt?: string | null;
  expiresAt?: string | null;
}

export interface IToggleModuleRequest {
  moduleId: string;
  enabled: boolean;
}

export interface IAuditLog {
  id: number;
  actionType: string;
  entityName: string;
  userId: string;
  timestamp: string;
  oldValues?: string | null;
  newValues?: string | null;
  ipAddress: string;
  additionalInfo?: string | null;
  tenantId?: string | null;
}

export interface IAuditLogFilter {
  entityName?: string;
  actionType?: string;
  userId?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
  allTenants?: boolean;
}

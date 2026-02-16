# Pagination Refactor Plan

## Overview
Refactor the pagination system to use the new metadata structure across all data tables.

## Current State
- Uses TanStack table's `PaginationState` with `pageIndex` and `pageSize`
- Simple API structure with basic pagination parameters
- Generic pagination component with basic navigation

## New Requirements
- Metadata-driven pagination with `total`, `from`, `to`, `perPage`, `lastPage`, `path`, and URL endpoints
- Display format: "Showing 1-50 of 7472 total entries"
- Four navigation buttons: First, Previous, Next, Last
- Button states based on URL availability
- Reusable across all data tables

## Implementation Plan

### 1. Create New Type Definitions
- Create `IPaginationMetaData` interface
- Create generic `IMetaDataResponse<T>` interface
- Update `IStudentResponse` to use new structure

### 2. Update API Handler
- Modify students API to support new metadata structure
- Ensure backward compatibility

### 3. Refactor Data Table Pagination Component
- Update component to accept metadata instead of pagination state
- Implement new navigation controls
- Add entry display format
- Implement button state logic

### 4. Update Students Page
- Modify data fetching logic to work with new metadata
- Update pagination handlers
- Pass metadata to pagination component

### 5. Testing
- Test all navigation scenarios
- Verify button states work correctly
- Ensure page size handling works properly

## New Data Structure
```typescript
interface IPaginationMetaData {
  total: number;
  from: number;
  to: number;
  perPage: number;
  lastPage: number;
  path: string;
  firstPageUrl: string;
  prevPageUrl: string | null;
  nextPageUrl: string | null;
  lastPageUrl: string;
}

interface IMetaDataResponse<T> {
  content: T[];
  metaData: IPaginationMetaData;
}
```

## Migration Strategy
1. Create new interfaces alongside existing ones
2. Update API handler to return new format
3. Modify pagination component to handle both formats during transition
4. Update all table implementations
5. Remove old interfaces once all components are migrated
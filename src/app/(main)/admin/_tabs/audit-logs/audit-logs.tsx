"use client";

import { useCallback, useEffect, useState } from "react";
import { Box, Heading, HStack, Spinner, Stack, Text, Badge } from "@chakra-ui/react";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/sdcn-table";
import { Button } from "@/components/ui/sdcn-button";
import { Input } from "@/components/ui/sdcn-input";
import {
  DialogRoot, DialogContent, DialogHeader, DialogBody, DialogTitle, DialogCloseTrigger,
} from "@/components/ui/chakra-dialog";
import { toaster } from "@/components/ui/chakra-toaster";
import apiHandler from "@/data/api/ApiHandler";
import { IAuditLog, IAuditLogFilter } from "@/data/interface/IAdmin";
import { useAzureAuth } from "@/context/auth-context";

const PAGE_SIZE = 25;

const actionColor: Record<string, string> = {
  Create: "green",
  Update: "blue",
  Delete: "red",
  Read: "gray",
};

function pretty(json?: string | null) {
  if (!json) return "—";
  try {
    return JSON.stringify(JSON.parse(json), null, 2);
  } catch {
    return json;
  }
}

function AuditLogs() {
  const { hasRole } = useAzureAuth();
  const isSuperAdmin = hasRole(["SUPER_ADMIN", "ADMIN", "Administrator"]);

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<IAuditLog[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selected, setSelected] = useState<IAuditLog | null>(null);
  const [exporting, setExporting] = useState(false);

  const [entityName, setEntityName] = useState("");
  const [actionType, setActionType] = useState("");
  const [userId, setUserId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [allTenants, setAllTenants] = useState(false);

  const buildFilter = useCallback(
    (p: number): IAuditLogFilter => ({
      entityName: entityName || undefined,
      actionType: actionType || undefined,
      userId: userId || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      page: p,
      pageSize: PAGE_SIZE,
      allTenants: isSuperAdmin ? allTenants : undefined,
    }),
    [entityName, actionType, userId, fromDate, toDate, allTenants, isSuperAdmin]
  );

  const load = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const res = await apiHandler.auditLogs.list(buildFilter(p));
        setRows(res?.content ?? []);
        setLastPage(res?.metaData?.lastPage ?? 1);
        setPage(p);
      } catch (e) {
        console.error("Failed to load audit logs", e);
      } finally {
        setLoading(false);
      }
    },
    [buildFilter]
  );

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onExport = async () => {
    setExporting(true);
    try {
      const blob = await apiHandler.auditLogs.exportCsv(buildFilter(1));
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toaster.success({ title: "Export started", description: "Your CSV is downloading." });
    } catch (e) {
      console.error(e);
      toaster.error({ title: "Export failed", description: "Could not export audit logs." });
    } finally {
      setExporting(false);
    }
  };

  return (
    <Stack gap="4" pb="6">
      {/* Filters */}
      <Box borderWidth="1px" rounded="md" p="4" bg="bg.panel">
        <Stack gap="3">
          <HStack gap="3" wrap="wrap">
            <Input placeholder="Entity (e.g. Item)" value={entityName} onChange={(e) => setEntityName(e.target.value)} className="max-w-[180px]" />
            <Input placeholder="Action (Create/Update/Delete)" value={actionType} onChange={(e) => setActionType(e.target.value)} className="max-w-[220px]" />
            <Input placeholder="User" value={userId} onChange={(e) => setUserId(e.target.value)} className="max-w-[180px]" />
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="max-w-[170px]" />
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="max-w-[170px]" />
          </HStack>
          <HStack justify="space-between" wrap="wrap">
            <HStack>
              <Button onClick={() => load(1)} disabled={loading}>Apply Filters</Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setEntityName(""); setActionType(""); setUserId(""); setFromDate(""); setToDate("");
                }}
              >
                Clear
              </Button>
              {isSuperAdmin && (
                <Button
                  variant={allTenants ? "default" : "outline"}
                  onClick={() => setAllTenants((v) => !v)}
                >
                  {allTenants ? "All tenants ✓" : "All tenants"}
                </Button>
              )}
            </HStack>
            <Button variant="outline" onClick={onExport} disabled={exporting}>
              {exporting ? "Exporting..." : "Export CSV"}
            </Button>
          </HStack>
        </Stack>
      </Box>

      {/* Table */}
      {loading ? (
        <HStack justify="center" py="10"><Spinner /></HStack>
      ) : (
        <Box borderWidth="1px" rounded="md" overflow="hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>User</TableHead>
                <TableHead>IP</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{new Date(r.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge colorPalette={actionColor[r.actionType] ?? "gray"}>{r.actionType}</Badge>
                  </TableCell>
                  <TableCell>{r.entityName}</TableCell>
                  <TableCell>{r.userId}</TableCell>
                  <TableCell>{r.ipAddress}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelected(r)}>View</Button>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Text textAlign="center" color="fg.muted" py="6">No audit logs found.</Text>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      )}

      {/* Pagination */}
      <HStack justify="flex-end" gap="2">
        <Button variant="outline" size="sm" disabled={page <= 1 || loading} onClick={() => load(page - 1)}>Previous</Button>
        <Text fontSize="sm" color="fg.muted">Page {page} of {lastPage}</Text>
        <Button variant="outline" size="sm" disabled={page >= lastPage || loading} onClick={() => load(page + 1)}>Next</Button>
      </HStack>

      {/* Detail dialog */}
      <DialogRoot open={!!selected} onOpenChange={(e) => { if (!e.open) setSelected(null); }} size="lg">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selected ? `${selected.actionType} · ${selected.entityName}` : "Audit Detail"}
            </DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          <DialogBody>
            {selected && (
              <Stack gap="4">
                <HStack gap="6" wrap="wrap">
                  <Text fontSize="sm"><b>User:</b> {selected.userId}</Text>
                  <Text fontSize="sm"><b>When:</b> {new Date(selected.timestamp).toLocaleString()}</Text>
                  <Text fontSize="sm"><b>IP:</b> {selected.ipAddress}</Text>
                </HStack>
                <Box>
                  <Heading size="xs" mb="1">Old values</Heading>
                  <Box as="pre" fontSize="xs" bg="bg.muted" p="3" rounded="md" overflow="auto" maxH="220px">
                    {pretty(selected.oldValues)}
                  </Box>
                </Box>
                <Box>
                  <Heading size="xs" mb="1">New values</Heading>
                  <Box as="pre" fontSize="xs" bg="bg.muted" p="3" rounded="md" overflow="auto" maxH="220px">
                    {pretty(selected.newValues)}
                  </Box>
                </Box>
              </Stack>
            )}
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </Stack>
  );
}

export default AuditLogs;

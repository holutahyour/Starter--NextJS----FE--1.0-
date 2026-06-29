"use client";

import { useEffect, useState } from "react";
import { Box, Heading, HStack, Spinner, Stack, Text, Badge, Textarea } from "@chakra-ui/react";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/sdcn-table";
import { Button } from "@/components/ui/sdcn-button";
import { Input } from "@/components/ui/sdcn-input";
import {
  DialogRoot, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle, DialogCloseTrigger,
} from "@/components/ui/chakra-dialog";
import { toaster } from "@/components/ui/chakra-toaster";
import apiHandler from "@/data/api/ApiHandler";
import { IRole, IPermission } from "@/data/interface/IAdmin";
import PermissionMatrix from "./PermissionMatrix";

type EditorState = {
  open: boolean;
  role: IRole | null; // null => create
  name: string;
  code: string;
  description: string;
  isActive: boolean;
  selected: Set<string>;
};

const emptyEditor: EditorState = {
  open: false, role: null, name: "", code: "", description: "", isActive: true, selected: new Set(),
};

function Roles() {
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<IRole[]>([]);
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [editor, setEditor] = useState<EditorState>(emptyEditor);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [r, p] = await Promise.all([apiHandler.roles.list(), apiHandler.permissions.list()]);
      setRoles(r?.content ?? []);
      setPermissions(p?.content ?? []);
    } catch (e) {
      console.error("Failed to load roles", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => setEditor({ ...emptyEditor, open: true, selected: new Set() });
  const openEdit = (role: IRole) =>
    setEditor({
      open: true,
      role,
      name: role.name,
      code: role.code,
      description: role.description ?? "",
      isActive: role.isActive,
      selected: new Set(role.permissionIds ?? []),
    });

  const close = () => setEditor(emptyEditor);

  const toggle = (id: string, checked: boolean) =>
    setEditor((prev) => {
      const next = new Set(prev.selected);
      if (checked) next.add(id); else next.delete(id);
      return { ...prev, selected: next };
    });

  const isSystem = editor.role?.isSystem ?? false;

  const save = async () => {
    if (!editor.name.trim() || (!editor.role && !editor.code.trim())) {
      toaster.error({ title: "Missing fields", description: "Name and code are required." });
      return;
    }
    setSaving(true);
    try {
      const permissionIds = Array.from(editor.selected);
      if (editor.role) {
        await apiHandler.roles.update(editor.role.id, {
          name: editor.name,
          description: editor.description,
          isActive: editor.isActive,
          permissionIds,
        });
        toaster.success({ title: "Role updated", description: editor.name });
      } else {
        await apiHandler.roles.create({
          name: editor.name,
          code: editor.code,
          description: editor.description,
          permissionIds,
        });
        toaster.success({ title: "Role created", description: editor.name });
      }
      close();
      await load();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (role: IRole) => {
    if (role.isSystem) return;
    if (!window.confirm(`Delete role "${role.name}"?`)) return;
    try {
      await apiHandler.roles.remove(role.id);
      toaster.success({ title: "Role deleted", description: role.name });
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Stack gap="4" pb="6">
      <HStack justify="space-between">
        <Text color="fg.muted" fontSize="sm">Define roles and assign permissions grouped by module.</Text>
        <Button onClick={openCreate}>New Role</Button>
      </HStack>

      {loading ? (
        <HStack justify="center" py="10"><Spinner /></HStack>
      ) : (
        <Box borderWidth="1px" rounded="md" overflow="hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <HStack>
                      <Text fontWeight="medium">{r.name}</Text>
                      {r.isSystem && <Badge colorPalette="purple">System</Badge>}
                    </HStack>
                  </TableCell>
                  <TableCell>{r.code}</TableCell>
                  <TableCell>{r.permissionIds?.length ?? 0}</TableCell>
                  <TableCell>
                    <Badge colorPalette={r.isActive ? "green" : "gray"}>{r.isActive ? "Active" : "Inactive"}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <HStack justify="flex-end" gap="1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(r)}>Edit</Button>
                      <Button variant="ghost" size="sm" disabled={r.isSystem} onClick={() => remove(r)}>Delete</Button>
                    </HStack>
                  </TableCell>
                </TableRow>
              ))}
              {roles.length === 0 && (
                <TableRow><TableCell colSpan={5}><Text textAlign="center" color="fg.muted" py="6">No roles found.</Text></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      )}

      <DialogRoot open={editor.open} onOpenChange={(e) => { if (!e.open) close(); }} size="xl">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editor.role ? `Edit Role — ${editor.role.name}` : "New Role"}</DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          <DialogBody>
            <Stack gap="4">
              {isSystem && (
                <Badge colorPalette="purple" alignSelf="flex-start">System role — read only</Badge>
              )}
              <HStack gap="3" wrap="wrap">
                <Box flex="1" minW="200px">
                  <Text fontSize="sm" mb="1">Name</Text>
                  <Input value={editor.name} disabled={isSystem} onChange={(e) => setEditor((p) => ({ ...p, name: e.target.value }))} />
                </Box>
                <Box flex="1" minW="200px">
                  <Text fontSize="sm" mb="1">Code</Text>
                  <Input value={editor.code} disabled={!!editor.role} onChange={(e) => setEditor((p) => ({ ...p, code: e.target.value }))} placeholder="e.g. WAREHOUSE_MANAGER" />
                </Box>
              </HStack>
              <Box>
                <Text fontSize="sm" mb="1">Description</Text>
                <Textarea value={editor.description} disabled={isSystem} onChange={(e) => setEditor((p) => ({ ...p, description: e.target.value }))} />
              </Box>
              <Box>
                <Heading size="sm" mb="3">Permissions</Heading>
                <PermissionMatrix permissions={permissions} selected={editor.selected} onToggle={toggle} disabled={isSystem} />
              </Box>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={close}>Cancel</Button>
            <Button onClick={save} disabled={saving || isSystem}>{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </Stack>
  );
}

export default Roles;

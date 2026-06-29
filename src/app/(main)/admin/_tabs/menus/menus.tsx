"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, HStack, Spinner, Stack, Text, Badge } from "@chakra-ui/react";
import apiHandler from "@/data/api/ApiHandler";

interface IAdminMenu {
  id: string;
  name: string;
  label: string;
  icon?: string | null;
  route?: string | null;
  position: number;
  children: IAdminMenu[];
  permissionIds: string[];
}

function MenuNode({ menu, depth }: { menu: IAdminMenu; depth: number }) {
  return (
    <Box>
      <HStack
        justify="space-between"
        py="2.5"
        px="3"
        pl={`${12 + depth * 20}px`}
        borderBottomWidth="1px"
        _hover={{ bg: "bg.muted" }}
      >
        <HStack gap="3">
          <Text fontWeight={depth === 0 ? "semibold" : "normal"}>{menu.label || menu.name}</Text>
          {menu.route && <Text fontSize="xs" color="fg.muted">{menu.route}</Text>}
        </HStack>
        <HStack gap="2">
          {menu.icon && <Badge variant="outline">{menu.icon}</Badge>}
          <Badge colorPalette="blue">{menu.permissionIds?.length ?? 0} perms</Badge>
        </HStack>
      </HStack>
      {menu.children
        ?.slice()
        .sort((a, b) => a.position - b.position)
        .map((c) => (
          <MenuNode key={c.id} menu={c} depth={depth + 1} />
        ))}
    </Box>
  );
}

function Menus() {
  const [loading, setLoading] = useState(true);
  const [menus, setMenus] = useState<IAdminMenu[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiHandler.menus.list();
        setMenus(((res?.content as unknown) as IAdminMenu[]) ?? []);
      } catch (e) {
        console.error("Failed to load menus", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Roots = menus that are not referenced as a child of any other menu.
  const roots = useMemo(() => {
    const childIds = new Set<string>();
    menus.forEach((m) => m.children?.forEach((c) => childIds.add(c.id)));
    return menus
      .filter((m) => !childIds.has(m.id))
      .sort((a, b) => a.position - b.position);
  }, [menus]);

  if (loading) {
    return (
      <HStack justify="center" py="10"><Spinner /></HStack>
    );
  }

  return (
    <Stack gap="4" pb="6">
      <Text color="fg.muted" fontSize="sm">
        Navigation menu structure and the permissions that gate each item. The global menu tree is
        managed by platform administrators.
      </Text>
      <Box borderWidth="1px" rounded="md" overflow="hidden">
        {roots.map((m) => <MenuNode key={m.id} menu={m} depth={0} />)}
        {roots.length === 0 && (
          <Text textAlign="center" color="fg.muted" py="6">No menus found.</Text>
        )}
      </Box>
    </Stack>
  );
}

export default Menus;

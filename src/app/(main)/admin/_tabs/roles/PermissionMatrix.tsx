"use client";

import { useMemo } from "react";
import { Box, Heading, SimpleGrid, Stack, HStack, Text } from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/chakra-checkbox";
import { IPermission } from "@/data/interface/IAdmin";

function groupKey(p: IPermission) {
  if (p.moduleCode) return p.moduleCode;
  const dot = p.code.indexOf(".");
  return dot > 0 ? p.code.slice(0, dot).toUpperCase() : "GENERAL";
}

export default function PermissionMatrix({
  permissions,
  selected,
  onToggle,
  disabled,
}: {
  permissions: IPermission[];
  selected: Set<string>;
  onToggle: (id: string, checked: boolean) => void;
  disabled?: boolean;
}) {
  const groups = useMemo(() => {
    const g: Record<string, IPermission[]> = {};
    permissions.forEach((p) => {
      (g[groupKey(p)] ??= []).push(p);
    });
    return Object.entries(g).sort(([a], [b]) => a.localeCompare(b));
  }, [permissions]);

  return (
    <Stack gap="5">
      {groups.map(([group, perms]) => (
        <Box key={group}>
          <Heading size="xs" mb="2" textTransform="uppercase" color="fg.muted">{group}</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap="2">
            {perms.map((p) => (
              <HStack key={p.id} as="label" gap="2" align="start" cursor={disabled ? "not-allowed" : "pointer"}>
                <Checkbox
                  checked={selected.has(p.id)}
                  disabled={disabled}
                  onChange={(e) => onToggle(p.id, (e.target as HTMLInputElement).checked)}
                />
                <Box>
                  <Text fontSize="sm">{p.name || p.code}</Text>
                  <Text fontSize="xs" color="fg.muted">{p.code}</Text>
                </Box>
              </HStack>
            ))}
          </SimpleGrid>
        </Box>
      ))}
    </Stack>
  );
}

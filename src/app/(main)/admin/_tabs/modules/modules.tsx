"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Heading, HStack, Spinner, Stack, Text, Badge } from "@chakra-ui/react";
import { Button } from "@/components/ui/sdcn-button";
import { toaster } from "@/components/ui/chakra-toaster";
import apiHandler from "@/data/api/ApiHandler";
import { IModule, ITenantModule } from "@/data/interface/IAdmin";

function Modules() {
  const [loading, setLoading] = useState(true);
  const [catalog, setCatalog] = useState<IModule[]>([]);
  const [tenantModules, setTenantModules] = useState<ITenantModule[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [cat, tenant] = await Promise.all([
        apiHandler.modules.catalog(),
        apiHandler.modules.tenant(),
      ]);
      setCatalog(cat?.content ?? []);
      setTenantModules(tenant?.content ?? []);
    } catch (e) {
      console.error("Failed to load modules", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const enabledMap = useMemo(() => {
    const map = new Map<string, boolean>();
    tenantModules.forEach((tm) => map.set(tm.moduleId, tm.isActive));
    return map;
  }, [tenantModules]);

  const grouped = useMemo(() => {
    const groups: Record<string, IModule[]> = {};
    catalog.forEach((m) => {
      const key = m.categoryName || "Uncategorized";
      (groups[key] ??= []).push(m);
    });
    return groups;
  }, [catalog]);

  const toggle = async (module: IModule, enabled: boolean) => {
    setBusyId(module.id);
    try {
      const res = await apiHandler.modules.toggle({ moduleId: module.id, enabled });
      if (res?.isSuccess !== false) {
        toaster.success({ title: enabled ? "Module enabled" : "Module disabled", description: module.name });
        await load();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <HStack justify="center" py="10">
        <Spinner />
      </HStack>
    );
  }

  return (
    <Stack gap="6" pb="6">
      <Text color="fg.muted" fontSize="sm">
        Enable or disable modules for your organization. Changes apply to your tenant only.
      </Text>

      {Object.entries(grouped).map(([category, mods]) => (
        <Box key={category}>
          <Heading size="sm" mb="3">{category}</Heading>
          <Stack gap="3">
            {mods.map((m) => {
              const isEnabled = enabledMap.get(m.id) ?? false;
              return (
                <HStack
                  key={m.id}
                  justify="space-between"
                  p="4"
                  borderWidth="1px"
                  rounded="md"
                  bg="bg.panel"
                >
                  <Box>
                    <HStack>
                      <Text fontWeight="medium">{m.name}</Text>
                      <Badge colorPalette={isEnabled ? "green" : "gray"}>
                        {isEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                      {m.version && <Badge variant="outline">v{m.version}</Badge>}
                    </HStack>
                    {m.description && (
                      <Text fontSize="sm" color="fg.muted">{m.description}</Text>
                    )}
                  </Box>
                  <Button
                    variant={isEnabled ? "outline" : "default"}
                    disabled={busyId === m.id}
                    onClick={() => toggle(m, !isEnabled)}
                  >
                    {busyId === m.id ? "Saving..." : isEnabled ? "Disable" : "Enable"}
                  </Button>
                </HStack>
              );
            })}
          </Stack>
        </Box>
      ))}

      {catalog.length === 0 && (
        <Text color="fg.muted">No modules found.</Text>
      )}
    </Stack>
  );
}

export default Modules;

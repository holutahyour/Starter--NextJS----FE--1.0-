import { useEffect, useState } from "react";
import AppDataTable from "@/components/app/app-data-table";
import apiHandler from "@/data/api/ApiHandler";
import { IErpSettings } from "@/data/interface/IErpSettings";
import { IApiResponse } from "@/data/interface/IApiResponse";
import { IPaginationMetaData } from "@/data/interface/IPagination";
import { useModifyQuery } from "@/hooks/use-modify-query";
import { APP_DRAWER } from "@/lib/routes";
import { columns } from "./_components/column";
import ErpSettingsForm from "./_components/erp-settings-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/sdcn-dropdown-menu";
import { Button, HStack, IconButton } from "@chakra-ui/react";
import { MoreHorizontal } from "lucide-react";
import { useQuery } from "@/hooks/use-query";
import { LuRefreshCw } from "react-icons/lu";
import { PaginationState } from "@tanstack/react-table";

function ErpSettings() {
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const [data, setData] = useState<IErpSettings[]>([]);
  const [metaData, setMetaData] = useState<IPaginationMetaData | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedErpSetting, setSelectedErpSetting] = useState<IErpSettings>();
  const { router, searchParams } = useQuery(APP_DRAWER, "true");

  const redirectUri = useModifyQuery(null, searchParams, [
    { key: APP_DRAWER, value: "true" },
  ]);
  const drawerUrl = useModifyQuery(
    null,
    searchParams,
    [{ key: APP_DRAWER, value: "true" }],
    "set"
  );

  const handleNavigateToUrl = (url: string) => {
    // Extract page number from URL and navigate
    const urlObj = new URL(url);
    const page = parseInt(urlObj.searchParams.get('page') || '1');
    setPagination(prev => ({ ...prev, pageIndex: page - 1 }));
  };

  const handlePageSizeChange = (size: number) => {
    setPagination(prev => ({ ...prev, pageSize: size }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, pageIndex: page }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setTableLoader(true);
      try {
        const response = await getErpSettingsData(pagination.pageIndex + 1, pagination.pageSize);

        // Handle the new response format with content property
        if (response && typeof response === 'object' && 'content' in response) {
          setData(response.content || []);
          setMetaData((response as any).metaData || null);
        } else {
          // Fallback for array response (backward compatibility)
          setData(Array.isArray(response) ? response : []);
          setMetaData(null);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setTableLoader(false);
      }
    };
    fetchData();
  }, [pagination]);

  const reloadData = async () => {
    setTableLoader(true);
    try {
      const response = await getErpSettingsData(pagination.pageIndex + 1, pagination.pageSize);
      console.log('ERP Settings API Response:', response); // Debug the full response

      // Handle the new response format with content property
      if (response && typeof response === 'object' && 'content' in response) {
        setData(response.content || []);
        setMetaData((response as any).metaData || null);
      } else {
        // Fallback for array response (backward compatibility)
        setData(Array.isArray(response) ? response : []);
        setMetaData(null);
      }
    } catch (error) {
      console.error("Failed to reload data:", error);
    } finally {
      setTableLoader(false);
    }
  };

  const handleSetErpSetting = (erpSetting: IErpSettings) => {
    setSelectedErpSetting(erpSetting);
    router.push(`${drawerUrl}`);
    console.log("Selected Erp Setting:", erpSetting);
  };

  const modifiedColumns = columns.map((column) => {
    if (column.id === "actions") {
      return {
        ...column,
        cell: ({ row }: any) => {
          const value = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSetErpSetting(value)}>
                  Edit ERP Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      };
    }
    return column;
  });

  return (
    <>
      <AppDataTable
        loading={tableLoader}
        columns={modifiedColumns}
        data={data}
        title="Erp Settings"
        filter="name"
        filterPlaceholder="Filter erp setting names..."
        metaData={metaData}
        onNavigateToUrl={handleNavigateToUrl}
        fillterElement={
          <HStack>
            <IconButton
              size="xs"
              aria-label="Refresh"
              onClick={reloadData}
              loading={tableLoader}
              variant="ghost"
            >
              <LuRefreshCw />
            </IconButton>
          </HStack>
        }
      />

      <ErpSettingsForm erpSetting={selectedErpSetting} />
    </>
  );
}

export default ErpSettings;

export async function getErpSettingsData(page: number = 1, pageSize: number = 10) {
  // Note: The erpSettings.list() API method doesn't support pagination parameters
  // The page and pageSize parameters are accepted for compatibility but not used
  const Info = await apiHandler.erpSettings.list();
  return Info; // Return the full response object, not just content
}

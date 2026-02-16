import { useEffect, useState } from "react";
import AppDataTable from "@/components/app/app-data-table";
import { columns } from "./_components/column";
import apiHandler from "@/data/api/ApiHandler";
import { IFeeItem } from "@/data/interface/IFeeItem";
import { IApiResponse } from "@/data/interface/IApiResponse";
import { IPaginationMetaData } from "@/data/interface/IPagination";
import { toaster } from "@/components/ui/chakra-toaster";
import { processExcelFile } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { HStack, IconButton } from "@chakra-ui/react";
import { LuRefreshCw } from "react-icons/lu";
import { PaginationState } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/sdcn-dropdown-menu";
import { Button } from "@chakra-ui/react";
import { MoreHorizontal } from "lucide-react";
import FeeItemForm from "./_components/fee-items-form";
import { useQuery } from "@/hooks/use-query";
import { APP_DRAWER } from "@/lib/routes";
import { useModifyQuery } from "@/hooks/use-modify-query";

function FeeItems() {
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const [data, setData] = useState<IFeeItem[]>([]);
  const [metaData, setMetaData] = useState<IPaginationMetaData | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedFeeItem, setSelectedFeeItem] = useState<IFeeItem>();
  const currentTab = useSearchParams().get("tab");
  const { router, searchParams } = useQuery(APP_DRAWER, "true");

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

  const drawerUrl = useModifyQuery(
    null,
    searchParams,
    [{ key: APP_DRAWER, value: "true" }],
    "set"
  );

  useEffect(() => {
if (currentTab === "fee-items") {
  const fetchData = async () => {
    setTableLoader(true);
    try {
      const response = await getFeeItemsData({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      });

          // Handle the new response format with content property
          if (response && typeof response === 'object' && 'content' in response) {
            setData((response.content as IFeeItem[]) || []);
            setMetaData((response as any).metaData || null);
            setPageCount((response as any).metaData?.lastPage || 0);
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
    }
  }, [currentTab, pagination]);

  const reloadData = async () => {
    setTableLoader(true);
    try {
      const response = await getFeeItemsData({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      });

      // Handle the new response format with content property
      if (response && typeof response === 'object' && 'content' in response) {
        setData((response.content as IFeeItem[]) || []);
        setMetaData((response as any).metaData || null);
        setPageCount((response as any).metaData?.lastPage || 0);
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

  const handleSetFeeItem = (feeItem: IFeeItem) => {
    setSelectedFeeItem(feeItem);
    router.push(`${drawerUrl}`);
  };

  const handleImport = (acceptedFiles: File[]) => {
    setTableLoader(true);

    const file = acceptedFiles[0];

    if (file) {
      processExcelFile(file, (data) => {
        const promise = apiHandler.feeItem
          .import(data)
          .then((response: unknown) => {
            const isApiResponse = (obj: unknown): obj is IApiResponse => {
              return (
                obj !== null &&
                typeof obj === "object" &&
                "isSuccess" in obj &&
                "hasError" in obj &&
                "message" in obj
              );
            };

            if (isApiResponse(response)) {
              const { message, isSuccess, hasError, errorMessage } = response;

              if (isSuccess && hasError === false) {
                toaster.success({
                  title: `Successfully Imported`,
                  description: message,
                });
                reloadData();
              }

              if (hasError) {
                toaster.error({
                  title: "Failed to import",
                  description:
                    errorMessage || "Something went wrong with the import",
                });
              }
            }
          })
          .catch((error) => {
            console.error("Import error:", error);
            toaster.error({
              title: "Failed to import",
              description:
                error.message || "Something went wrong with the import",
            });
          })
          .finally(() => {
            setTableLoader(false);
          });

        toaster.promise(promise, {
          loading: { title: "Importing...", description: "Please wait" },
        });
      });
    }
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
                <DropdownMenuItem onClick={() => handleSetFeeItem(value)}>
                  Edit Fee Item
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
        onImport={handleImport}
        title="Fee Items"
        filter=""
        filterPlaceholder="Filter fee items..."
        pageCount={pageCount}
        pagination={pagination}
        onPageSizeChange={handlePageSizeChange}
        onPageChange={handlePageChange}
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
      <FeeItemForm feeItem={selectedFeeItem} />
    </>
  );
}

export default FeeItems;

export async function getFeeItemsData(params: {
  page: number
  pageSize: number
}) {
  const { page, pageSize } = params
  const Info = await apiHandler.feeItem.list({
    page,
    pageSize,
  })
  return Info
}

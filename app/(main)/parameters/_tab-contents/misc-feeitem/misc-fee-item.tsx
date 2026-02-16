import { useEffect, useState } from "react";
import AppDataTable from "@/components/app/app-data-table";
import { columns } from "./_components/column";
import apiHandler from "@/data/api/ApiHandler";
import { IFeeItem } from "@/data/interface/IFeeItem";
import { isApiResponse, processExcelFile } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, HStack, IconButton } from "@chakra-ui/react";
import { LuRefreshCw } from "react-icons/lu";
import { IMiscellaneousFee, IMiscellaneousFeeResponse,  } from "@/data/interface/IMiscellaneousFee";
import { useModifyQuery } from "@/hooks/use-modify-query";
import { APP_IMPORT_DIALOG, APP_MISC_FEES_DIALOG } from "@/lib/routes";
import { toaster } from "components/ui/chakra-toaster";
import MiscellaneousFeeForm from "./miscellaneous-fee-form";
import { IPaginationMetaData } from "@/data/interface/IPagination";
import { PaginationState } from "@tanstack/react-table";

interface IApiResponse {
  isSuccess: boolean;
  hasError: boolean;
  message: string;
  errorMessage?: string;
}

function MiscFeeItems() {
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const [data, setData] = useState<IMiscellaneousFee[]>([]);
  const [metaData, setMetaData] = useState<IPaginationMetaData | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const currentTab = useSearchParams().get("tab");
  const searchParams = useSearchParams();
  const router = useRouter();
  const closeImportDialogUrl = useModifyQuery(null, searchParams, [
    { key: APP_IMPORT_DIALOG },
  ])

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
    if (currentTab === "misc-fee-items") {
      setTableLoader(true);
      getMiscFeeItemsData({ page: pagination.pageIndex + 1, pageSize: pagination.pageSize }).then((response) => {
        // Handle the new response format with content property
        if (response && typeof response === 'object' && 'content' in response) {
          setData((response.content as IMiscellaneousFee[]) || []);
          setMetaData((response as any).metaData || null);
          setPageCount((response as any).metaData?.lastPage || 0);
        } else {
          // Fallback for array response (backward compatibility)
          setData(Array.isArray(response) ? response as IMiscellaneousFee[] : []);
          setMetaData(null);
        }
        setTableLoader(false);
      });
    }
  }, [currentTab, pagination]);

  const reloadData = () => {
    setTableLoader(true);
    getMiscFeeItemsData({ page: pagination.pageIndex + 1, pageSize: pagination.pageSize })
      .then((response) => {
        // Handle the new response format with content property
        if (response && typeof response === 'object' && 'content' in response) {
          setData((response.content as IMiscellaneousFee[]) || []);
          setMetaData((response as any).metaData || null);
          setPageCount((response as any).metaData?.lastPage || 0);
        } else {
          // Fallback for array response (backward compatibility)
          setData(Array.isArray(response) ? response as IMiscellaneousFee[] : []);
          setMetaData(null);
        }
      })
      .finally(() => setTableLoader(false));
  };

  const handleImport = (acceptedFiles: File[]) => {
    setTableLoader(true);
    const file = acceptedFiles[0];

    if (file) {
      processExcelFile(file, (data) => {
        const formattedData = data.map((item: any) => {
          const isCreditNote =
            typeof item.IsCreditNote === "string"
              ? item.IsCreditNote.toLowerCase() === "true"
              : Boolean(item.IsCreditNote);
          return {
            ...item,
            IsCreditNote: isCreditNote,
          };
        });
        const promise = apiHandler.miscellaneousFee
          .import(formattedData)
          .then((response: any) => {
            const apiResponse = response.value || response;
            if (isApiResponse(apiResponse)) {
              const { message, isSuccess, hasError, errorMessage } = apiResponse;
          
              if (isSuccess && hasError === false) {
                toaster.success({
                  title: `Successfully Imported`,
                  description: message,
                });
                router.push(closeImportDialogUrl);
                reloadData();
              }

              if (hasError && isSuccess === false) {
                toaster.error({
                  title: "Failed to import",
                  description:
                    message || "Something went wrong with the import",
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

    const drawerUrl = useModifyQuery(
      null,
      searchParams,
      [{ key: APP_MISC_FEES_DIALOG, value: "true" }],
      "set"
    )

    const handleSyncMiscFee = () => {
      const promise = apiHandler.erp.sync_misc_fee_plans().then(() => {
      });

      toaster.promise(promise, {
        success: {
          title: "Misc. fee schedule synced successfully",
          description: "Looks great",
        },
        error: {
          title: "Failed to sync misc. fee schedule",
          description: "Something went wrong",
        },
        loading: {
          title: "Syncing... do not leave page",
          description: "Please wait",
        },
      });
    };

  return (
    <>
      <AppDataTable
        loading={tableLoader}
        columns={columns}
        data={data}
        title="Miscellaneous Fee Items"
        filter=""
        filterPlaceholder="Filter Misc fee items..."
        pageCount={pageCount}
        pagination={pagination}
        onPageSizeChange={handlePageSizeChange}
        onPageChange={handlePageChange}
        metaData={metaData}
        onNavigateToUrl={handleNavigateToUrl}
        onImport={handleImport}
        syncButton={
          <Button
            size="xs"
            variant="solid"
            colorScheme="primary"
            onClick={handleSyncMiscFee}
          >
            sync misc fee plan
          </Button>
        }
        // customButton={
        //   <Button
        //     size="xs"
        //     variant="solid"
        //     colorScheme="primary"
        //     onClick={() => router.push(drawerUrl)}
        //   >
        //     Add New Fee Item
        //   </Button>
        // }
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
      <MiscellaneousFeeForm />
    </>
  );
}

export default MiscFeeItems;

export async function getMiscFeeItemsData({ page = 1, pageSize = 10 }: { page?: number; pageSize?: number } = {}) {
  const Info = await apiHandler.miscellaneousFee.list({
    page,
    pageSize,
  });
  return Info;
}

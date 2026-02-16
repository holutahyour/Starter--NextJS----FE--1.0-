"use client";

import { useEffect, useState } from "react";
import AppDataTable from "@/components/app/app-data-table";
import apiHandler from "@/data/api/ApiHandler";
import { IFeeSchedule } from "@/data/interface/IFeeSchedule";
import { columns } from "./_components/column";
import { IApiResponse } from "@/data/interface/IApiResponse";
import { IPaginationMetaData } from "@/data/interface/IPagination";
import { isApiResponse, processExcelFile } from "@/lib/utils";
import { Button, HStack, Icon, IconButton, Stack, Text, Circle } from "@chakra-ui/react";
import { LuFolderSync, LuRefreshCw } from "react-icons/lu";
import { FiCheck, FiInfo } from "react-icons/fi";
import { toaster } from "@/components/ui/chakra-toaster";
import { useSearchParams } from "next/navigation";
import { PaginationState } from "@tanstack/react-table";
import { useQuery } from "@/hooks/use-query";
import { useModifyQuery } from "@/hooks/use-modify-query";
import { APP_FETCH_SUCCESS_DIALOG } from "@/lib/routes";
import AppDialog from "@/components/app/app-dialog";

function FeeSchedules() {
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const [data, setData] = useState<IFeeSchedule[]>([]);
  const [fetchCount, setFetchCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [metaData, setMetaData] = useState<IPaginationMetaData | null>(null);
  const currentTab = useSearchParams().get("tab");

  const {
    router,
    searchParams,
    open: isSuccessDialogOpen,
  } = useQuery(APP_FETCH_SUCCESS_DIALOG, "true");
  const openSuccessDialogUrl = useModifyQuery(
    null,
    searchParams,
    [{ key: APP_FETCH_SUCCESS_DIALOG, value: "true" }],
    "set"
  );
  const closeSuccessDialogUrl = useModifyQuery(null, searchParams, [
    { key: APP_FETCH_SUCCESS_DIALOG },
  ]);

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
    if (currentTab === "fee-schedules") {
      setTableLoader(true);
      getFeeSchedulesData({ page: pagination.pageIndex + 1, pageSize: pagination.pageSize }).then((response) => {
        // Handle the new response format with content property
        if (response && typeof response === 'object' && 'content' in response) {
          setData((response.content as IFeeSchedule[]) || []);
          setMetaData((response as any).metaData || null);
          setPageCount((response as any).metaData?.lastPage || 0);
        } else {
          // Fallback for array response (backward compatibility)
          setData(Array.isArray(response) ? response as IFeeSchedule[] : []);
          setMetaData(null);
        }
        setTableLoader(false);
      });
    }
  }, [currentTab, pagination]);

  const reloadData = () => {
    setTableLoader(true);
    getFeeSchedulesData({ page: pagination.pageIndex + 1, pageSize: pagination.pageSize })
      .then((response) => {
        // Handle the new response format with content property
        if (response && typeof response === 'object' && 'content' in response) {
          setData((response.content as IFeeSchedule[]) || []);
          setMetaData((response as any).metaData || null);
          setPageCount((response as any).metaData?.lastPage || 0);
        } else {
          // Fallback for array response (backward compatibility)
          setData(Array.isArray(response) ? response as IFeeSchedule[] : []);
          setMetaData(null);
        }
      })
      .finally(() => setTableLoader(false));
  };

  const handleFetchFeeSchedulesFromApi = async () => {
    setTableLoader(true);
    toaster.promise(
      (async () => {
        try {
          const response = await apiHandler.feeSchedule.fetchFeeScheduleFromApi();
          if (isApiResponse(response)) {
            const { message, isSuccess, hasError, errorMessage, content } = response;
            if (isSuccess && !hasError) {
              setFetchCount(content.count);
              router.push(openSuccessDialogUrl);
              reloadData();
            } else {
              toaster.error({
                title: "Failed to fetch fee schedules",
                description:
                  errorMessage || "An unknown error occurred while fetching fee schedules.",
              });
            }
          } else {
            throw new Error("Invalid API response structure");
          }
        } catch (error: any) {
          console.error("Fetch error:", error);
          toaster.error({
            title: "Failed to fetch fee schedules",
            description:
              error.message || "An unknown error occurred.",
          });
          // Re-throw the error to ensure the promise is rejected
          throw error;
        } finally {
          setTableLoader(false);
        }
      })(),
      {
        loading: { title: "Fetching...", description: "Please wait" },
        success: { title: "Success", description: "Fee schedules fetched successfully" },
        error: { title: "Error", description: "Failed to fetch fee schedules" },
      }
    );
  };

  const handleImport = (acceptedFiles: File[]) => {
    setTableLoader(true);

    const file = acceptedFiles[0];

    if (file) {
      processExcelFile(file, (data) => {
        const promise = apiHandler.feeSchedule
          .import(data)
          .then((response: unknown) => {
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

  const handleSyncFeeSchedules = () => {
    const promise = apiHandler.erp.sync_fee_plans().then(() => {
      // window.location.reload();
    });

    toaster.promise(promise, {
      success: {
        title: "Fee schedule synced successfully",
        description: "Looks great",
      },
      error: {
        title: "Failed to sync fee schedule",
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
      <AppDialog
        title="Fetch Successful"
        open={isSuccessDialogOpen}
        placement="center"
        redirectUri={closeSuccessDialogUrl}
        cancelQueries={[]}
        hasFooter={false}
      >
        <Stack direction="column" gap={4} py={4} w="full" alignItems="center">
          {fetchCount > 0 ? (
            <>
              <Circle size="40px" bg="green.100" color="green.500">
                <Icon as={FiCheck} boxSize="20px" />
              </Circle>
              <Stack direction="column" gap={1} alignItems="center">
                <Text fontSize="2xl" fontWeight="bold">
                  {fetchCount}
                </Text>
                <Text color="gray.500">
                  new fee schedules have been fetched into the system.
                </Text>
              </Stack>
            </>
          ) : (
            <>
              <Circle size="40px" bg="blue.100" color="blue.500">
                <Icon as={FiInfo} boxSize="20px" />
              </Circle>
              <Text color="gray.600" textAlign="center">
                No new fee schedules were fetched to the system.
              </Text>
            </>
          )}
        </Stack>
      </AppDialog>
      <AppDataTable
        loading={tableLoader}
        columns={columns}
        data={data}
        title="Fee Schedules"
        filter="feeItemName"
        filterPlaceholder="Filter fee schedules..."
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
            onClick={handleFetchFeeSchedulesFromApi}
          >
            Fetch Fee Schedules
          </Button>
        }
        fillterElement={
          <HStack>
            <Button size="xs" onClick={handleSyncFeeSchedules}>
              <Icon as={LuFolderSync} mr={1} />
              Sync Schedule
            </Button>
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
    </>
  );
}

export default FeeSchedules;

export async function getFeeSchedulesData({ page = 1, pageSize = 10 }: { page?: number; pageSize?: number } = {}) {
  const Info = await apiHandler.feeSchedule.list({
    page,
    pageSize,
  });
  return Info; // Return the full response object, not just content
}

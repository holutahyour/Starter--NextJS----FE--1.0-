"use client"
import { useEffect, useState } from "react";
import AppDataTable from "@/components/app/app-data-table";
import apiHandler from "@/data/api/ApiHandler";
import { isApiResponse, processExcelFile } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, HStack, IconButton, Stack, Text, Circle, Icon } from "@chakra-ui/react";
import { LuRefreshCw } from "react-icons/lu";
import { FiCheck, FiInfo } from "react-icons/fi";
import { useModifyQuery } from "@/hooks/use-modify-query";
import { APP_FETCH_SUCCESS_DIALOG, APP_IMPORT_DIALOG } from "@/lib/routes";
import { toaster } from "components/ui/chakra-toaster";
import { getCreditNoteColumns } from "./_components/column";
import { ICreditNote, ICreditNoteResponse } from "@/data/interface/ICreditNoteImportPayload";
import { useQuery } from "@/hooks/use-query";
import AppDialog from "@/components/app/app-dialog";
import { IPaginationMetaData } from "@/data/interface/IPagination";
import { PaginationState } from "@tanstack/react-table";

function CreditNoteItems() {
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const [data, setData] = useState<ICreditNote[]>([]);
  const [fetchCount, setFetchCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [metaData, setMetaData] = useState<IPaginationMetaData | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const currentTab = useSearchParams().get("tab");
  const searchParams = useSearchParams();
  const router = useRouter();
  const closeImportDialogUrl = useModifyQuery(null, searchParams, [
    { key: APP_IMPORT_DIALOG },
  ]);

  const {
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
    if (currentTab === "credit-note") {
      setTableLoader(true);
      getCreditNoteItem({ page: pagination.pageIndex + 1, pageSize: pagination.pageSize }).then((response) => {
        // Handle the new response format with content property
        if (response && typeof response === 'object' && 'content' in response) {
          setData((response.content as ICreditNote[]) || []);
          setMetaData((response as any).metaData || null);
          setPageCount((response as any).metaData?.lastPage || 0);
        } else {
          // Fallback for array response (backward compatibility)
          setData(Array.isArray(response) ? response : []);
          setMetaData(null);
        }
        setTableLoader(false);
      });
    }
  }, [currentTab, pagination]);

  const reloadData = () => {
    setTableLoader(true);
    getCreditNoteItem({ page: pagination.pageIndex + 1, pageSize: pagination.pageSize })
      .then((response) => {
        // Handle the new response format with content property
        if (response && typeof response === 'object' && 'content' in response) {
          setData((response.content as ICreditNote[]) || []);
          setMetaData((response as any).metaData || null);
          setPageCount((response as any).metaData?.lastPage || 0);
        } else {
          // Fallback for array response (backward compatibility)
          setData(Array.isArray(response) ? response as ICreditNote[] : []);
          setMetaData(null);
        }
      })
      .finally(() => setTableLoader(false));
  };

  const handleFetchCreditNotesFromApi = async () => {
    setTableLoader(true);
    toaster.promise(
      (async () => {
        try {
          const response = await apiHandler.creditNote.fetchCreditNoteFromApi();
          if (isApiResponse(response)) {
            const { message, isSuccess, hasError, errorMessage, content } = response;
            if (isSuccess && !hasError) {
              setFetchCount(content.count);
              router.push(openSuccessDialogUrl);
              reloadData();
            } else {
              toaster.error({
                title: "Failed to fetch credit notes",
                description:
                  errorMessage || "An unknown error occurred while fetching credit notes.",
              });
            }
          } else {
            throw new Error("Invalid API response structure");
          }
        } catch (error: any) {
          console.error("Fetch error:", error);
          toaster.error({
            title: "Failed to fetch credit notes",
            description:
              error.message || "An unknown error occurred.",
          });
          throw error;
        } finally {
          setTableLoader(false);
        }
      })(),
      {
        loading: { title: "Fetching...", description: "Please wait" },
        success: { title: "Success", description: "Credit notes fetched successfully" },
        error: { title: "Error", description: "Failed to fetch credit notes" },
      }
    );
  };

  const handleImport = (acceptedFiles: File[]) => {
    setTableLoader(true);
    const file = acceptedFiles[0];

    if (file) {
      processExcelFile(file, (data) => {
        const formattedData = data.map((item: any) => {
          const IsPaymentVerified =
            typeof item.IsPaymentVerified === "string"
              ? item.IsPaymentVerified.toLowerCase() === "true"
              : Boolean(item.IsPaymentVerified);
          return {
            ...item,
            IsPaymentVerified: IsPaymentVerified,
            TotalAmount: parseFloat(item.TotalAmount),
          };
        });
        const promise = apiHandler.creditNote
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
                reloadData();
                router.push(closeImportDialogUrl);
              }

              if (hasError) {
                toaster.error({
                  title: "Failed to import",
                  description:
                    errorMessage || "Something went wrong with the import",
                });
              }
            } else {
                toaster.error({
                  title: "Failed to import",
                  description:
                    apiResponse.errorMessage || "Something went wrong with the import",
                });
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
                  new credit notes have been fetched into the system.
                </Text>
              </Stack>
            </>
          ) : (
            <>
              <Circle size="40px" bg="blue.100" color="blue.500">
                <Icon as={FiInfo} boxSize="20px" />
              </Circle>
              <Text color="gray.600" textAlign="center">
                No new credit notes were fetched to the system.
              </Text>
            </>
          )}
        </Stack>
      </AppDialog>
      <AppDataTable
        loading={tableLoader}
        columns={getCreditNoteColumns(reloadData)}
        data={data}
        title="Credit Notes"
        filter=""
        filterPlaceholder="Filter credit notes..."
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
            onClick={handleFetchCreditNotesFromApi}
          >
            Fetch Credit Notes
          </Button>
        }
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
    </>
  );
}

export default CreditNoteItems

export async function getCreditNoteItem({ page = 1, pageSize = 10 }: { page?: number; pageSize?: number } = {}): Promise<ICreditNoteResponse> {
  const Info = await apiHandler.creditNote.list({
    page,
    pageSize,
  });
  return Info as ICreditNoteResponse; // Return the full response object, not just content
}

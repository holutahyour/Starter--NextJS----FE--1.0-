"use client";

import { useLayoutEffect, useState } from "react";
import AppDataTable from "@/components/app/app-data-table";
import { columns } from "./_components/column";
import apiHandler from "@/data/api/ApiHandler";
import { INotification } from "@/data/interface/INotification";
import { IApiResponse } from "@/data/interface/IApiResponse";
import { toaster } from "@/components/ui/chakra-toaster";
import { processExcelFile } from "@/lib/utils";
import { useModifyQuery } from "@/hooks/use-modify-query";
import { APP_IMPORT_DIALOG } from "@/lib/routes";
import { useQuery } from "@/hooks/use-query";
import {
  Button,
  Stack,
  Box,
  useFileUpload,
  FileUpload,
  Icon,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import AppDialog from "@/components/app/app-dialog";
import { LuRefreshCw, LuUpload } from "react-icons/lu";
import { PaginationState } from "@tanstack/react-table";

function Inbox() {
  const [tableLoader, setTableLoader] = useState<boolean>(true);
  const [data, setData] = useState<INotification[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [metaData, setMetaData] = useState<any>(null);

  const fileUpload = useFileUpload({ maxFiles: 1 });

  const handlePageSizeChange = (size: number) => {
    setPagination(prev => ({ ...prev, pageSize: size }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, pageIndex: page }));
  };

  const handleNavigateToUrl = (url: string) => {
    // Extract page number from URL and navigate
    const urlObj = new URL(url);
    const page = parseInt(urlObj.searchParams.get('page') || '1');
    setPagination(prev => ({ ...prev, pageIndex: page - 1 }));
  };

  const {
    router,
    searchParams,
    open: importDialogOpen,
  } = useQuery(APP_IMPORT_DIALOG, "true");

  const openImportDialogUrl = useModifyQuery(null, searchParams, [
    { key: APP_IMPORT_DIALOG, value: "true" },
  ], "set");
  const closeImportDialogUrl = useModifyQuery(null, searchParams, [
    { key: APP_IMPORT_DIALOG },
  ]);

  const reloadData = async () => {
    setTableLoader(true);
    try {
      const inboxData = await getInboxMessages({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize
      }) as any;
      setData(inboxData?.content ?? []);
      if (inboxData?.metaData) {
        setMetaData(inboxData.metaData);
        setPageCount(inboxData.metaData.lastPage);
      } else {
        // Fallback calculation for notifications API
        setPageCount(Math.ceil((inboxData?.totalRecords ?? 0) / pagination.pageSize));
      }
    } finally {
      setTableLoader(false);
    }
  };

  useLayoutEffect(() => {
    reloadData();
  }, [pagination]);

  const handleImport = (acceptedFiles: File[]) => {
    setTableLoader(true);
    const file = acceptedFiles[0];

    if (file) {
      const promise = apiHandler.notification
        .import(file)
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
              router.push(closeImportDialogUrl);
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
    }
  };

  return (
    <>
      <AppDataTable
        key={data.length}
        loading={tableLoader}
        columns={columns}
        data={data}
        initialState={{
          sorting: [{ id: "createdAt", desc: true }], // ✅ sort newest first
        }}
        title="Inbox Messages"
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
        filter=""
        filterPlaceholder="Filter inbox messages..."
        pageCount={pageCount}
        pagination={pagination}
        onPageSizeChange={handlePageSizeChange}
        onPageChange={handlePageChange}
        metaData={metaData}
        onNavigateToUrl={handleNavigateToUrl}
      />
    </>
  );
}

export default Inbox;

async function getInboxMessages(params?: {
  page?: number;
  pageSize?: number;
}) {
  const response = await apiHandler.notification.list({
    page: params?.page,
    pageSize: params?.pageSize
  });
  return response;
}

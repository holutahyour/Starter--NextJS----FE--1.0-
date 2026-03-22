import { useLayoutEffect, useState } from "react";
import AppDataTable from "@/components/app/app-data-table";
import { columns } from "./_components/column";
import apiHandler from "@/data/api/ApiHandler";
import { ICampus } from "@/data/interface/ICampus";
import { IApiResponse } from "@/data/interface/IApiResponse";
import { IPaginationMetaData } from "@/data/interface/IPagination";
import { toaster } from "@/components/ui/chakra-toaster";
import { isApiResponse, processExcelFile, processMasterExcelFile } from "@/lib/utils";
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


function Campuses() {
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const [data, setData] = useState<ICampus[]>([]);
  const [metaData, setMetaData] = useState<IPaginationMetaData | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const fileUpload = useFileUpload({ maxFiles: 1 });

  // Import dialog control
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

  const { open: createDialogOpen } = useQuery("drawer", "true");
  const openCreateDialogUrl = useModifyQuery(null, searchParams, [
    { key: "drawer", value: "true" },
  ], "set");
  const closeCreateDialogUrl = useModifyQuery(null, searchParams, [
    { key: "drawer" },
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

  useLayoutEffect(() => {
    const fetchData = async () => {
      setTableLoader(true);
      try {
        const response = await getCampusesData({
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
        });

        if (response && typeof response === 'object' && 'content' in response) {
          setData((response.content as ICampus[]) || []);
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
  }, [pagination]);

  const reloadData = async () => {
    setTableLoader(true);
    try {
      const response = await getCampusesData({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      });

      if (response && typeof response === 'object' && 'content' in response) {
        setData((response.content as ICampus[]) || []);
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

  const handleImport = (acceptedFiles: File[]) => {
    setTableLoader(true);
    const file = acceptedFiles[0];

    if (file) {
      processExcelFile(file, (parsedData) => {
        apiHandler.campus
          .import(parsedData)
          .then((data) => {
            setData(data);
            router.push(closeImportDialogUrl);
          })
          .catch((error) => console.error(error))
          .finally(() => setTableLoader(false));
      });
    }
  };

  function schoolMasterImport(acceptedFiles: File[]): void {
    setTableLoader(true);
    const file = acceptedFiles[0];
    if (file) {
      processMasterExcelFile(file, (data) => {
        const promise = apiHandler.SchoolInformationData.import(data)
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
            router.push(closeImportDialogUrl);

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
      <AppDataTable
        loading={tableLoader}
        columns={columns}
        data={data}
        title="School Setup File"
        onImport={handleImport}
        filter="name"
        filterPlaceholder="Filter campus names..."
        redirectUri={closeImportDialogUrl}
        drawerUrl={openCreateDialogUrl}
        metaData={metaData}
        pagination={pagination}
        pageCount={pageCount}
        onPageSizeChange={handlePageSizeChange}
        onPageChange={handlePageChange}
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

      {/* Import Dialog */}
      <AppDialog
        title="Import Campus Data"
        open={importDialogOpen}
        placement="center"
        redirectUri={closeImportDialogUrl}
        cancelQueries={[]}
        hasFooter={false}
      >
        <Stack gap={6}>
          <div className="flex flex-col gap-4">
            <FileUpload.RootProvider maxW="xl" alignItems="stretch" value={fileUpload}>
              <FileUpload.HiddenInput />
              <FileUpload.Dropzone>
                <Icon size="md" color="fg.muted">
                  <LuUpload />
                </Icon>
                <FileUpload.DropzoneContent>
                  <Box>Drag and drop files here</Box>
                  <Box color="fg.muted">.xlsx, .csv up to 5MB</Box>
                </FileUpload.DropzoneContent>
              </FileUpload.Dropzone>
              <FileUpload.List />
            </FileUpload.RootProvider>
          </div>
          <Box className="flex justify-center gap-2">
            <Button variant="outline" onClick={() => router.push(closeImportDialogUrl)}>
              Cancel
            </Button>
            <Button variant="solid" colorScheme="primary" onClick={() => handleImport(fileUpload.acceptedFiles)}>
              Import
            </Button>
          </Box>
        </Stack>
      </AppDialog>

      {/* Create Dialog */}
      <AppDialog
        title="Import School Setup"
        open={createDialogOpen}
        placement="center"
        redirectUri={closeCreateDialogUrl}
        cancelQueries={[]}
        hasFooter={false}
      >
        <Stack gap={6}>
          <div className="flex flex-col gap-4">
            <FileUpload.RootProvider
              maxW="xl"
              alignItems="stretch"
              value={fileUpload}
            >
              <FileUpload.HiddenInput
                accept=".xls,.xlsx"
              // If maxFileSize is supported by HiddenInput or Dropzone, add it here
              />
              <FileUpload.Dropzone>
                <Icon size="md" color="fg.muted">
                  <LuUpload />
                </Icon>
                <FileUpload.DropzoneContent>
                  <Box>Drag and drop files here</Box>
                  <Box color="fg.muted">.xlsx, .xls files up to 5MB</Box>
                </FileUpload.DropzoneContent>
              </FileUpload.Dropzone>
              <FileUpload.List />
            </FileUpload.RootProvider>
          </div>
          <Box className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(closeCreateDialogUrl)}
              disabled={tableLoader}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              colorScheme="primary"
              onClick={() => schoolMasterImport(fileUpload.acceptedFiles)}
              loading={tableLoader}
              loadingText="Importing..."
              disabled={tableLoader || fileUpload.acceptedFiles.length === 0}
            >
              Import
            </Button>
          </Box>
        </Stack>
      </AppDialog>
    </>
  );
}
export default Campuses;

export async function getCampusesData(params: { page: number; pageSize: number }) {
  const { page, pageSize } = params;
  const Info = await apiHandler.campus.list({ page, pageSize });
  return Info;
}

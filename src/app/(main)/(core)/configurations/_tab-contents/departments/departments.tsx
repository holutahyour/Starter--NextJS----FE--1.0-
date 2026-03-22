import { useEffect, useState } from "react";
import AppDataTable from "@/components/app/app-data-table";
import { columns } from "./_components/column";
import apiHandler from "@/data/api/ApiHandler";
import { IAcademicDepartment } from "@/data/interface/IAcademicDepartment";
import { IApiResponse } from "@/data/interface/IApiResponse";
import { IPaginationMetaData } from "@/data/interface/IPagination";
import { toaster } from "@/components/ui/chakra-toaster";
import { processExcelFile } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { HStack, IconButton } from "@chakra-ui/react";
import { LuRefreshCw } from "react-icons/lu";
import { PaginationState } from "@tanstack/react-table";

function Departments() {
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const [data, setData] = useState<IAcademicDepartment[]>([]);
  const [metaData, setMetaData] = useState<IPaginationMetaData | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab');

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
    if (currentTab === 'departments') {
      const fetchData = async () => {
        setTableLoader(true);
        try {
          const response = await getDepartmentsData({
            page: pagination.pageIndex + 1,
            pageSize: pagination.pageSize,
          });

          // Handle the new response format with content property
          if (response && typeof response === 'object' && 'content' in response) {
            setData(response.content || []);
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
      const response = await getDepartmentsData({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      });

      // Handle the new response format with content property
      if (response && typeof response === 'object' && 'content' in response) {
        setData(response.content || []);
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
      processExcelFile(file, (data) => {
        const promise = apiHandler.academicDepartments
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

  return (
    <>
      <AppDataTable
        loading={tableLoader}
        columns={columns}
        data={data}
        onImport={handleImport}
        title="Departments"
        filter="name"
        filterPlaceholder="Filter departments..."
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
    </>
  );
}

export default Departments;

export async function getDepartmentsData(params: { page: number; pageSize: number }) {
  const { page, pageSize } = params;
  const Info = await apiHandler.academicDepartments.list({
    page,
    pageSize,
  });
  return Info;
}

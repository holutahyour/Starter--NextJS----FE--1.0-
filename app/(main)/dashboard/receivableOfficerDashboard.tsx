"use client";

import { columns } from "@/app/_components/column";
import { PageDrawer } from "@/app/_components/page-drawer";
import AppDataTable from "@/components/app/app-data-table";
import AppStats from "@/components/app/app-stats";
import apiHandler from "@/data/api/ApiHandler";
import { IStudent } from "@/data/interface/IStudent";
import { IApiResponse } from "@/data/interface/IApiResponse";
import { toaster } from "@/components/ui/chakra-toaster";
import { compactNumber, processExcelFile } from "@/lib/utils";
import { Heading, HStack, Icon, Stack } from "@chakra-ui/react";
import { models } from "powerbi-client";
import { PowerBIEmbed } from "powerbi-client-react";
import { report } from "process";
import React, { useLayoutEffect, useState } from "react";
import {
  FaBook,
  FaBuilding,
  FaChalkboardTeacher,
  FaUserGraduate,
} from "react-icons/fa";
interface IPowerBi {
  embedConfig: {
    embedToken: string;
    embedUrl: string;
    reportId: string;
  };
}

function ReceivableOfficerDashboard({
  embedConfig: { embedUrl, embedToken, reportId },
}: IPowerBi) {
  const [data, setData] = useState<IStudent[]>([]);
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const [stats, setStats] = useState<
    {
      title: string;
      icon: JSX.Element;
      value: string;
    }[]
  >([]);

  useLayoutEffect(() => {
    setTableLoader(true);
    getStudentData().then((data) => {
      setData(data);
      setTableLoader(false);
    });

    getStats().then((stats) => setStats(stats));
  }, []);

  const handleImport = (acceptedFiles: File[]) => {
    setTableLoader(true);

    const file = acceptedFiles[0];

    if (file) {
      processExcelFile(file, (data) => {
        const promise = apiHandler.students
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
                getStudentData().then((data) => setData(data));
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

  // if (!user) return <AppLoader />;
  // console.log("report", reportId);


  return (
    <Stack mx={{ base: "4", lg: "10" }} gap="6">
      <HStack justify="space-between">
        {/* <Heading size="3xl" fontWeight="bolder">
          Receivable Officer Dashboard
        </Heading> */}
        {/* <PageDrawer /> */}
      </HStack>
      {/* <HStack flexWrap="wrap" gap="10" justify="space-between">
        {stats.map((stat, index) => (
          <AppStats
            key={index}
            title={stat.title}
            icon={stat.icon}
            value={stat.value}
          />
        ))}
      </HStack>
      <AppDataTable
        loading={tableLoader}
        columns={columns}
        data={data}
        onImport={handleImport}
        title="Students"
        filter="accountName"
        filterPlaceholder="Filter account names..."
      /> */}

      <PowerBIEmbed
        embedConfig={{
          type: "report", // Supported types: report, dashboard, tile, visual and qna
          id: reportId,
          embedUrl: embedUrl,
          accessToken: embedToken,
          tokenType: models.TokenType.Embed,
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: false,
              },
            },
          },
        }}
        eventHandlers={
          new Map([
            [
              "loaded",
              function () {
                console.log("Report loaded");
              },
            ],
            [
              "rendered",
              function () {
                console.log("Report rendered");
              },
            ],
            [
              "error",
              function (event) {
                console.log(event?.detail);
              },
            ],
          ])
        }
        cssClassName={"Embed-container"}
        getEmbeddedComponent={(embeddedReport) => {
          window.report = embeddedReport;
        }}
      />
    </Stack>
  );
}

export async function getStudentData() {
  const Info = await apiHandler.students.list();
  return Info?.content ?? [];
}

export async function getStats() {
  return [
    {
      title: "Students Enrolled",
      icon: (
        <Icon color="fg.muted">
          <FaUserGraduate />
        </Icon>
      ),
      value: compactNumber(15000),
    },
    {
      title: "Faculties",
      icon: (
        <Icon color="fg.muted">
          <FaChalkboardTeacher />
        </Icon>
      ),
      value: compactNumber(300),
    },
    {
      title: "Department",
      icon: (
        <Icon color="fg.muted">
          <FaBuilding />
        </Icon>
      ),
      value: compactNumber(50),
    },
    {
      title: "Total Programs",
      icon: (
        <Icon color="fg.muted">
          <FaBook />
        </Icon>
      ),
      value: compactNumber(100),
    },
  ];}

export default ReceivableOfficerDashboard;

"use client";

declare global {
  interface Window {
    report: any;
  }
}

import { columns } from "@/app/_components/column";
import { PageDrawer } from "@/app/_components/page-drawer";
import AppDataTable from "@/components/app/app-data-table";
import AppStats from "@/components/app/app-stats";
import apiHandler from "@/data/api/ApiHandler";
import { IStudent } from "@/data/interface/IStudent";
import { compactNumber, processExcelFile } from "@/lib/utils";
import { Heading, HStack, Icon, Stack } from "@chakra-ui/react";
import React, { useLayoutEffect, useState } from "react";

import { PowerBIEmbed } from "powerbi-client-react";
import { models } from "powerbi-client";


import {
  FaBook,
  FaBuilding,
  FaChalkboardTeacher,
  FaUserGraduate,
} from "react-icons/fa";
import { usePaginatedReportConfig } from "@/hooks/fetchEmbedConfig";

interface IPowerBi {
  embedConfig: {
    embedToken: string;
    embedUrl: string;
    reportId: string;
  };
}

function AdminDashboard({ embedConfig: { embedUrl, embedToken, reportId } }: IPowerBi) {
  // const [user] = useAuth();
  const [data, setData] = useState<IStudent[]>([]);
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const [stats, setStats] = useState<
    {
      title: string;
      icon: JSX.Element;
      value: string;
    }[]
  >([]);

  // useLayoutEffect(() => {
  //   setTableLoader(true);
  //   getStudentData().then((data) => {
  //     setData(data);
  //     setTableLoader(false);
  //   });

  //   getStats().then((stats) => setStats(stats));
  // }, []);

  // const handleImport = (acceptedFiles: File[]) => {
  //   setTableLoader(true);

  //   const file = acceptedFiles[0];

  //   if (file) {
  //     processExcelFile(file, (data) => {
  //       console.log(data);
  //       apiHandler.students
  //         .import(data)
  //         .then((data) => {
  //           setData(data);
  //           setTableLoader(false);
  //         })
  //         .catch((error) => {
  //           console.error(error);
  //           setTableLoader(false);
  //         });
  //     });
  //   }
  // };


  // const { config, loading, error } = usePaginatedReportConfig();

  // if (loading) return <div>Loading report...</div>;
  // if (error) return <div>Error: {error}</div>;
  // if (!config) return null;

  // console.log('embed config', embedUrl, reportId);
  
 
  return (
  <PowerBIEmbed
    embedConfig={{
      type: "report",
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
  );
}

// export async function getStudentData() {
//   const Info = await apiHandler.students.list();
//   return Info?.content ?? [];
// }

// export async function getStats() {
//   return [
//     {
//       title: "Students Enrolled",
//       icon: (
//         <Icon color="fg.muted">
//           <FaUserGraduate />
//         </Icon>
//       ),
//       value: compactNumber(15000),
//     },
//     {
//       title: "Faculties",
//       icon: (
//         <Icon color="fg.muted">
//           <FaChalkboardTeacher />
//         </Icon>
//       ),
//       value: compactNumber(300),
//     },
//     {
//       title: "Department",
//       icon: (
//         <Icon color="fg.muted">
//           <FaBuilding />
//         </Icon>
//       ),
//       value: compactNumber(50),
//     },
//     {
//       title: "Total Programs",
//       icon: (
//         <Icon color="fg.muted">
//           <FaBook />
//         </Icon>
//       ),
//       value: compactNumber(100),
//     },
//   ];
// }

export default AdminDashboard;

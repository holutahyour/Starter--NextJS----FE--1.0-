"use client";


import apiHandler from "@/data/api/ApiHandler";
import { Heading, HStack, Icon, Stack } from "@chakra-ui/react";

import AppDataTable from "@/components/app/app-data-table";
import AppStats from "@/components/app/app-stats";
import { compactNumber, processExcelFile } from "@/lib/utils";
import {
  FaBook,
  FaBuilding,
  FaChalkboardTeacher,
  FaUserGraduate,
} from "react-icons/fa";

// import { useAuth } from "@/hooks/use-auth";
import { JSX, useLayoutEffect, useState, useEffect } from "react";
import { IStudent } from "@/data/interface/IStudent";
import { PageDrawer } from "../../_components/page-drawer";
import { columns } from "../../_components/column";
import { useRoleSelection } from "@/app/context/roleSelection-context";
import AdminDashboard from "./adminDashboard";
import ReceivableOfficerDashboard from "./receivableOfficerDashboard";
import BillingOfficerDashboard from "./billingOfficerDashboard";

export default function RolebaseDashboard() {
  const { selectedRole } = useRoleSelection();
  const [embedConfig, setEmbedConfig] = useState({
    embedToken: '',
    embedUrl: '',
    reportId: ''
  });

  const fetchEmbedConfig = async () => {
    const res = await fetch("/api/get-embed-token", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch embed config");
    }

    return res.json();
  };

  useEffect(() => {
    const getEmbedConfig = async () => {
      try {
        const config = await fetchEmbedConfig();
        setEmbedConfig(config);
      } catch (error) {
        console.error("Error fetching embed config:", error);
      }
    };

    getEmbedConfig();
  }, []);
  
  if (!selectedRole) {
    return <div>Please select a role to continue.</div>;
  }
  
  // Render different dashboard based on selected role
  switch (selectedRole) {
    case "Admin":
      return <AdminDashboard embedConfig={embedConfig} />;
    case "Receivable-Accountant":
      return <ReceivableOfficerDashboard embedConfig={embedConfig} />;
    case "Billing-Accountant":
      return <BillingOfficerDashboard embedConfig={embedConfig} />;
    default:
      return <div>Dashboard not available for the selected role.</div>;
  }
}



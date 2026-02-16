import axios from "axios";
import * as msal from "@azure/msal-node";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const tenantId = process.env.AZURE_TENANT_ID!;
const clientId = process.env.AZURE_CLIENT_ID!;
const clientSecret = process.env.AZURE_CLIENT_SECRET!;
const workspaceId = process.env.POWERBI_WORKSPACE_ID!;
// const reportId = process.env.POWERBI_REPORT_ID!;

export const dynamic = "force-dynamic";

const getReportIdByRole = (selectedRole: string | undefined): string | null => {
  if (selectedRole === "Admin") {
    return process.env.BURSAR_POWERBI_REPORT_ID!;
  }
  if (selectedRole === "Receivable-Accountant") {
    return process.env.RECEIVABLE_ACCOUNTANT_POWERBI_REPORT_ID!;
  }
  if (selectedRole === "Billing-Accountant") {
    return process.env.BILLING_ACCOUNTANT_REPORT_ID!;
  }
  return null;
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const cookieStore = cookies();
    const selectedRole = cookieStore.get("selected_azure_role")?.value;

    if (!session?.user?.roles) {
      return NextResponse.json(
        { error: "Unauthorized - No user roles found" },
        { status: 401 }
      );
    }

    const reportId = getReportIdByRole(selectedRole);

    console.log("reportId", reportId);

    if (!reportId) {
      return NextResponse.json(
        { error: "Unauthorized - No user roles found" },
        { status: 403 }
      );
    }

    const msalConfig = {
      auth: {
        clientId,
        authority: `https://login.microsoftonline.com/${tenantId}`,
        clientSecret,
      },
    };

    const cca = new msal.ConfidentialClientApplication(msalConfig);

    const result = await cca.acquireTokenByClientCredential({
      scopes: ["https://analysis.windows.net/powerbi/api/.default"],
    });

    const accessToken = result?.accessToken;

    const embedResponse = await axios.post(
      `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}/GenerateToken`,
      {
        accessLevel: "View",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const embedToken = embedResponse.data.token;

    // Get embed URL
    const reportMetadata = await axios.get(
      `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const embedUrl = reportMetadata.data.embedUrl;

    // console.log("embedUrl", embedUrl);
    // console.log("embedToken", embedToken);

    return NextResponse.json({ embedToken, embedUrl, reportId });
  } catch (error) {
    console.error("server error", error);
    return NextResponse.json(
      { error: "Failed to fetch embed token" },
      { status: 500 }
    );
  }
}

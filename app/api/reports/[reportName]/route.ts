import axios from "axios";
import * as msal from "@azure/msal-node";
import { NextResponse } from "next/server";

const tenantId = process.env.AZURE_TENANT_ID!;
const clientId = process.env.AZURE_CLIENT_ID!;
const clientSecret = process.env.AZURE_CLIENT_SECRET!;
const workspaceId = process.env.POWERBI_WORKSPACE_ID!;

const reportIds: { [key: string]: string } = {
  "billing-report": process.env.BILLING_REPORT!,
  "outstanding-balance": process.env.OUTSTANDING_BALANCE!,
  "student-not-billed": process.env.STUDENT_NOT_BILLED!,
};

export async function GET(
  request: Request,
  { params }: { params: { reportName: string } }
) {
  try {
    const reportName = params.reportName;
    const reportId = reportIds[reportName];

    if (!reportId) {
      return NextResponse.json(
        { error: "Invalid report name" },
        { status: 400 }
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
      { accessLevel: "View" },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const embedToken = embedResponse.data.token;

    const reportMetadata = await axios.get(
      `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const embedUrl = reportMetadata.data.embedUrl;

    return NextResponse.json({ embedToken, embedUrl, reportId });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch embed config" },
      { status: 500 }
    );
  }
}
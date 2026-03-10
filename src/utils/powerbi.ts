import axios from 'axios';

const getReportIdByRole = (role: string): string | null => {
  switch (role) {
    case "Admin":
      return process.env.NEXT_PUBLIC_BURSAR_POWERBI_REPORT_ID!;
    case "Receivable-Accountant":
      return process.env.NEXT_PUBLIC_RECEIVABLE_ACCOUNTANT_POWERBI_REPORT_ID!;
    case "Billing-Accountant":
      return process.env.NEXT_PUBLIC_BILLING_ACCOUNTANT_REPORT_ID!;
    default:
      return null;
  }
};

export const getReportIdByPage = (pageType: string): string | null => {
  if (pageType === "billing-report") {
    return process.env.BILLING_REPORT_ID!;
  }
  if (pageType === "outstanding-balance") {
    return process.env.OUTSTANDING_BALANCE_REPORT_ID!;
  }
  if (pageType === "student-not-billed") {
    return process.env.STUDENT_NOT_BILLED_REPORT_ID!;
  }
  return null;
};

export const getPowerBiToken = async (role: string) => {
  try {
    const reportId = getReportIdByRole(role);
    
    if (!reportId) {
      throw new Error('Invalid role');
    }

    const response = await axios.post(
      'https://YOUR_AZURE_FUNCTION_URL/api/getPowerBiToken',
      { 
        role,
        reportId 
      }
    );

    return {
      embedToken: response.data.embedToken,
      embedUrl: response.data.embedUrl,
      reportId
    };
  } catch (error) {
    console.error('Error getting Power BI token:', error);
    throw error;
  }
};
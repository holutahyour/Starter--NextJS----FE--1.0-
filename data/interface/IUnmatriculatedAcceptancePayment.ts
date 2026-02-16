
export interface IUnmatriculatedAcceptancePayment {
  id: number;
  studentCode: string;
  studentName: string | null;
  paymentDate: string | null;
  amount: number;
  balance: number;
  bankCode: string | null;
  code: string;
  invoiceNumber: string | null;
  isVerified: boolean;
  paid: boolean;
  posted: boolean;
  purpose: string | null;
  transactionCode: string;
  transactionReference: string;
  sessionCode: string | null;
  sessionName: string | null;
  academicDepartmentName: string | null;
  academicProgramName: string | null;
  reOccurrentType: string | null;
  period: string | null;
}


export interface IFeePayment {
  id: number;
  code: string;
  studentCode: string;
  transactionCode: string;
  transactionReference: string;
  invoiceNumber: string;
  amount: number;
  balance: number;
  period: string;
  sessionCode: string;
  session: string;
  paymentDate: Date;
  purpose: string;
  bankCode: string;
  isVerified: boolean;
  paid: boolean;
  posted: boolean;
  reOccurrentType: string;
  academicDepartmentName: string; 
}

export interface IFeePaymentResponse {
  content: IFeePayment[];
}

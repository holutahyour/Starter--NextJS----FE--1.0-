import { IApiResponse } from './IPagination';

export interface IStudentAccount {
  id: number;
  code: string;
  studentCode: string;
  billedAmount: number;
  payedAmount: number;
  balance: number;
  previousBalance: number;
  sessionCode: string;
  sessionName: string;
  isPosted: boolean;
  lastPaymentDate: string | null;
}

export type IStudentAccountResponse = IApiResponse<IStudentAccount>;

export interface IMonthlyJournalBatch {
monthName: string,
paymentMonth: number,
paymentYear: number,
totalExcess: number,
totalAmount: number,
sessionCode: string,
sessionName: string
}

export type IMonthlyJournalBatchResponse = IApiResponse<IMonthlyJournalBatch>;

export interface IGLJournalBatch {
  id: number;
  code: string;
  year: string;
  month: string;
  sessionCode: string;
  totalExcessPayment: number;
  totalEntries: number;
  isCommited: boolean;
  isPosted: boolean;
}

export type IGLJournalBatchResponse = IApiResponse<IGLJournalBatch>;

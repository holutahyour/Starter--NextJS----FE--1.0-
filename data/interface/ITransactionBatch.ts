export interface ITransactionBatch {
  sessionName: string;
  academicFacultyName: string;
  id: number;
  code: string;
  batchName: string;
  academicFacultyCode: string;
  sessionCode: string;
  totalEntries: number;
  totalAmount: number;
  batchDate: string;
  synch: boolean;
  transactionBatchStatus: string;
}
export interface IPostBill {
  academicFacultyName: string;
  sessionName: string;
  id: number;
  code: string;
  batchName: string;
  academicFacultyCode: string;
  sessionCode: string;
  totalEntries: number;
  batchDate: string;
  totalAmount: number;
  synch: boolean;
  transactionBatchStatus: string;
}

export interface IPostBillResponse {
  content: IPostBill[];
}

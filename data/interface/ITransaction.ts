export interface ITransaction {
  sessionName: any;
  academicFacultyName: any;
  transactionBatchName: any;
  studentName: any;
  feeAccountName: any;
  id: number;
  code: string;
  reference: string;
  transactionBatchCode: string;
  type: number;
  date: string;
  studentCode: string;
  feeAccountCode: string;
  academicFacultyCode: string;
  sessionCode: string;
  period: string;
  note: string;
  amount: number;
  synch: boolean;
}

export interface ITransactionResponse {
  content: ITransaction[];
}

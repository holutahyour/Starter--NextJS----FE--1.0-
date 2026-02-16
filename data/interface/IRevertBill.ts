export interface IRevertBill {
  sessionName: string;
  academicFacultyName: string;
  academicDepartmentName: string;
  academicProgramName: string;
  transactionBatchStatus: string;
  code: string;
  batchName: string
  academicFacultyCode: string;
  academicProgramCode: string;
  academicDepartmentCode: string;
  sessionCode: string;
  totalEntries: number;
  totalAmount: number;
  batchDate: string;
  transactionBatchStatusEnum: string;
}

export interface IRevertBillResponse {
  content: IRevertBill[];
}

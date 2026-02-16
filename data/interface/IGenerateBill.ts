export interface IGenerateBill {
  academicFacultyName: string;
  academicDepartmentName: string;
  academicLevelName: string;
  sessionName: string;
  id: number;
  code: string;
  studentCode: string;
  accountCode: string;
  academicFacultyCode: string;
  academicDepartmentCode: string;
  streamCode: string;
  academicLevelCode: string;
  studentType: string;
  sessionCode: string;
  date: string;
  totalAmount: number;
}

export interface IGenerateBillResponse {
  content: IGenerateBill[];
  hasError: boolean;
}

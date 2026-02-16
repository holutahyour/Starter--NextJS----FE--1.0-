export interface IFeeSchedule {
  feeItemName?: string;
  academicLevelName?: string;
  academicFacultyName?: string;
  academicDepartmentName?: string;
  sessionName?: string;
  id?: number;
  code?: string;
  feeItemCode: string;
  academicLevelCode: string;
  academicFacultyCode: string;
  academicDepartmentCode: string;
  streamCode?: string;
  studentType: string;
  amount: number;
  sessionCode: string;
  currency: string;
  revenueAccount: string;
  cogsAccount: string;
}

export interface IFeeScheduleResponse {
  content: IFeeSchedule[];
}

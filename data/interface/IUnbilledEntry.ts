export interface IUnbilledEntry {
  academicProgramName: string;
  sessionName: string;
  totalBill: number;
  totalStudent: number;
  totalBilledStudents: number;
  totalUnbilledStudents: number;
  isCommited: boolean;
  isMiscellaneous: boolean;
  id: number;
  code: string;
  name: string;
  type: string;
  academicFacultyCode: string;
  academicDepartmentCode: string;
  duration: string;
  durationType: string;
  award: string | null;
  description: string;
  programCode: string;
}

export interface IUnbilledEntryResponse {
  content: IUnbilledEntry[];
  hasError: boolean;
}
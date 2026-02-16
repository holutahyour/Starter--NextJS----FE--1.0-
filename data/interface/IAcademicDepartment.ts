export interface IAcademicDepartment {
  facultyName?: string;
  id?: number;
  code?: string;
  name: string;
  facultyCode: string;
  departmentPhone: string;
  departmentEmail: string;
  description: string;
  sessionName: string;
  totalStudent: number;
  totalUnbilledStudents: number;
  totalBilledStudents: number;
  totalBill: number;
  isCommited: boolean;
  managerCode?: string;
}

export interface IAcademicDepartmentResponse {
  content: IAcademicDepartment[];
}

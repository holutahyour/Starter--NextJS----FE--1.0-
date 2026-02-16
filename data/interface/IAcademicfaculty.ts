export interface IAcademicFaculty {
  id?: number;
  campusName?: string;
  code?: string;
  name: string;
  alias: string;
  campusCode?: string;
  description?: string;
  managerCode?: string;
}

export interface IAcademicFacultyResponse {
  content: IAcademicFaculty[];
}

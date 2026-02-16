export interface IAcademicPrograms {
  id?: number;
  code?: string;
  name: string;
  alias: string;
  description: string;
}

export interface IAcademicProgramsResponse {
  content: IAcademicPrograms[];
}

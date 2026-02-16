export interface IAcademicLevel {
  id?: number;
  code?: string;
  name: string;
  description: string;
}

export interface IAcademicLevelResponse {
  content: IAcademicLevel[];
}

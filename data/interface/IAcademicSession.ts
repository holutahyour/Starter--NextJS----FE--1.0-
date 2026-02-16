export interface IAcademicSession {
  id?: number;
  code?: string;
  sessionName: string;
  alias: string;
  sessionStartDate: Date;
  sessionEndDate: Date;
  isCurrent?: boolean;
}

export interface IAcademicSessionResponse {
  content: IAcademicSession[];
}

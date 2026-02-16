export interface IAcademicPosition {
  id?: number;
  code?: string;
  position: string;
  description: string;
}

export interface IAcademicPositionResponse {
  content: IAcademicPosition[];
}

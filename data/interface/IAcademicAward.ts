export interface IAcademicAward {
  id: number;
  code?: string;
  awardName: string;
  description: string;
}

export interface IAcademicAwardResponse {
  content: IAcademicAward[];
}

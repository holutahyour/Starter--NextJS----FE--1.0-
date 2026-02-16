export interface ICourseFormat {
  id?: number;
  code?: string;
  name: string;
  description: string;
}

export interface ICourseFormatResponse {
  content: ICourseFormat[];
}

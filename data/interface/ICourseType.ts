export interface ICourseType {
  id?: number;
  code?: string;
  name: string;
  description: string;
}

export interface ICourseTypeResponse {
  content: ICourseType[];
}

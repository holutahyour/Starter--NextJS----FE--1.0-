export interface IScholarship {
  id?: number;
  code?: string;
  university: string;
  deadline: Date;
  description: string;
  degree: string;
  startingDate: Date;
  numberOfAward: string;
  eligibility: string;
  value: string;
  applicationInstruction: string;
  website: string;
  attachment?: string;
}

export interface IScholarshipResponse {
  content: IScholarship[];
}

export interface IMiscellaneousBill {
  miscellaneousFeeCode: string;
  miscellaneousFeeName: string;
  totalAmount: number;
  totalStudents: number;
  sessionName: string;
  isCommited:boolean
}
export interface IGroupedMiscellaneousBill {
  facultyCode: string;
  facultyName:string;
  miscellaneousFeeCode: string;
  totalAmount: number;
  totalStudents: number;
  sessionName: string;
  totalCommits: number;
  unCommited: number;
  isCommited: boolean;
}

export interface IMiscellaneousBillResponse {
  content: IGroupedMiscellaneousBill[];
}

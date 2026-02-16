export interface ICreditNote {
  code: string;
  creditNoteName: string;
  totalAmount: number;
  totalStudents: number;
  commitableStudents: number;
  sessionName: string;
  paymentDescription: string;
  isCommited: boolean;
}

export interface ICreditNoteResponse {
  content: ICreditNote[];
}
export interface IFeeAccount {
  id?: number;
  code?: string;
  accountName: string;
  accountNumber: string;
  description: string;
  optional1?: any;
  optional2?: any;
}

export interface IFeeAccountResponse {
  content: IFeeAccount[];
}

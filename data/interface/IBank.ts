export interface IBank {
  id?: number;
  code?: string;
  bankName: string;
  accountNumber: string;
  description: string;
}

export interface IBankResponse {
  content: IBank[];
}

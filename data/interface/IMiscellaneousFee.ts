export interface IMiscellaneousFee {
  feeCategoryCode: string | number;
  status: any;
  miscellaneousFeeName: string;
  id: number;
  code: string;
  feeItemCode: string;
  studentType: number;
  amount: number;
  currency: string;
  revenueAccount: string;
  isCreditNote:boolean
}

export interface IMiscellaneousFeeResponse {
  content: IMiscellaneousFee[];
}

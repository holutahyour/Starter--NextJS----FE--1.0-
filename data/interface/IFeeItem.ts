export interface IFeeItem {
  accountNumber: string;
  code: string;
  description: string;
  feeCategoryCode: string;
  feeCategoryName?: string;
  feeItemCode: string;
  feeItemCounter: string;
  feeItemName: string;
  id?: number;
  reOccurrent?: boolean;
  reOccurrentType?: any;
}

export interface IFeeItemResponse {
  content: IFeeItem[];
}

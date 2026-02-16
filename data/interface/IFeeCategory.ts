export interface IFeeCategory {
  id?: number;
  code?: string;
  itemName: string;
  description: string;
  parentCode?: string;
}

export interface IFeeCategoryResponse {
  content: IFeeCategory[];
}

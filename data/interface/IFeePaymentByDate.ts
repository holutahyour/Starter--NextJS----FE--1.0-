import { IFeePayment } from "./IFeePayment";

export interface IFeePaymentByDate {
  paymentDate: Date;
  totalAmount: number;
  payments: IFeePayment[];
}

export interface IFeePaymentResponse {
  content: IFeePayment[];
}

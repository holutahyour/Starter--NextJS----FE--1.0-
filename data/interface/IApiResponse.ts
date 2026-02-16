import { IPaginationMetaData } from './IPagination';

export interface IApiResponse {
  content: any;
  dataCount: number;
  error: any;
  errorMessage: string;
  hasError: boolean;
  isSuccess: boolean;
  message: string;
  requestId: string;
  requestTime: string;
  responseTime: string;
  metaData?: IPaginationMetaData;
}

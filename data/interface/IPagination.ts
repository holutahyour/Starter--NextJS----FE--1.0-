export interface IPaginationMetaData {
  total: number;
  from: number;
  to: number;
  perPage: number;
  lastPage: number;
  path: string;
  firstPageUrl: string;
  prevPageUrl: string | null;
  nextPageUrl: string | null;
  lastPageUrl: string;
}

export interface IApiResponse<T> {
  content: T[];
  error: string | null;
  hasError: boolean;
  errorMessage: string;
  message: string;
  requestId: string;
  metaData: IPaginationMetaData;
  isSuccess: boolean;
  requestTime: string;
  responseTime: string;
}

export interface ILegacyApiResponse<T> {
  content: T[];
  error: string | null;
  hasError: boolean;
  errorMessage: string;
  message: string;
  requestId: string;
  totalPages?: number;
  isSuccess: boolean;
  requestTime: string;
  responseTime: string;
}

// Backward compatibility type for gradual migration
export interface ILegacyPaginationResponse<T> {
  content: T[];
  totalPages?: number;
}
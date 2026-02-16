import axios, { AxiosError, AxiosResponse } from "axios";
import { IData, ISchoolInfo } from "../interface/ISchool";
import { ICountriesResponse, IStateResponse } from "../interface/ICore";
import {
  IAcademicPrograms,
  IAcademicProgramsResponse,
} from "../interface/IAcademicPrograms";
import {
  IAcademicFaculty,
  IAcademicFacultyResponse,
} from "../interface/IAcademicfaculty";
import {
  IAcademicPosition,
  IAcademicPositionResponse,
} from "../interface/IAcademicPosition";
import {
  IAcademicLevel,
  IAcademicLevelResponse,
} from "../interface/IAcademicLevel";
import {
  IAcademicAward,
  IAcademicAwardResponse,
} from "../interface/IAcademicAward";
import {
  IAcademicSession,
  IAcademicSessionResponse,
} from "../interface/IAcademicSession";
import { ISchoolEvent, ISchoolEventResponse } from "../interface/ISchoolEvent";
import { IBank, IBankResponse } from "../interface/IBank";
import { IErpSettings, IErpSettingsResponse } from "../interface/IErpSettings";
import { IFeeCategory, IFeeCategoryResponse } from "../interface/IFeeCategory";
import { IFeeItem, IFeeItemResponse } from "../interface/IFeeItem";
import { IFeeSchedule, IFeeScheduleResponse } from "../interface/IFeeSchedule";
import {
  IGenerateBill,
  IGenerateBillResponse,
} from "../interface/IGenerateBill";
import { IUnbilledEntry } from "../interface/IUnbilledEntry";
import { IRevertBill, IRevertBillResponse } from "../interface/IRevertBill";
import { IPostBill, IPostBillResponse } from "../interface/IPostBill";
import { IFeeAccount, IFeeAccountResponse } from "../interface/IFeeAcount";
import { ICampus } from "../interface/ICampus";
import { INotificationResponse } from "../interface/INotification";
// import { toast } from "sonner";
import {
  IAcademicDepartment,
  IAcademicDepartmentResponse,
} from "../interface/IAcademicDepartment";
import { IStudentResponse } from "../interface/IStudent";
import { ITransaction, ITransactionResponse } from "../interface/ITransaction";
import { IScholarship, IScholarshipResponse } from "../interface/IScholarship";
import {
  ICourseFormat,
  ICourseFormatResponse,
} from "../interface/ICourseFormat";
import { ICourseType, ICourseTypeResponse } from "../interface/ICourseType";
import { IMiscellaneousBillResponse } from "../interface/IMiscellaneousBill";
import { toaster } from "@/components/ui/chakra-toaster";
import { IFeePayment } from "../interface/IFeePayment";
import { IFeePaymentByDate } from "../interface/IFeePaymentByDate";
import moment from "moment";
import { ICreditNoteResponse } from "../interface/ICreditNoteImportPayload";
import { IUnmatriculatedAcceptancePayment } from "../interface/IUnmatriculatedAcceptancePayment";
import { IStudentAccount, IStudentAccountResponse, IMonthlyJournalBatchResponse, IGLJournalBatchResponse } from "../interface/IStudentAccount";
import { IApiResponse } from "../interface/IApiResponse";

// axios.defaults.baseURL = "https://api-fgbmfi.azurewebsites.net/api";
// axios.defaults.baseURL = "http://192.168.1.233:5000/api";

// axios.interceptors.request.use((config) => {
//   const token = "store.commonStore.token";
//   config.headers = config.headers || {};

//   config.headers["Content-Type"] = "application/json; charset=utf-8";

//   if (token) {
//     config.headers["Authorization"] = `Bearer ${token}`;
//   } else {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });
// console.log(process.env.NEXT_PUBLIC_API_URL)

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // baseURL: "https://educ8e-connector-app.azurewebsites.net/api",
  // baseURL: "https://educ8e-connector.azurewebsites.net/api",
  // baseURL: "https://localhost:7082/api",

  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    // Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`, // Add auth token if required
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase();
    // console.log("Response received:", response);
    // if (method === "post" || method === "put" || method === "delete") {
    //   toaster.dismiss();
    //   toaster.success({
    //     title: "Operation completed successfully!",
    //     description: "Looks great",
    //   });
    // }
    return response;
  },
  (error: AxiosError) => {
    const method = error?.config?.method?.toLowerCase();
    if (method === "post" || method === "put" || method === "delete") {
      if (error.response) {
        toaster.dismiss();
        toaster.error({
          title: "Error",
          description:
            error instanceof Error
              ? "Sorry a server error"
              : "An error occurred",
        });
      } else {
        console.error("Error setting up request:", error.message);
        toaster.dismiss();
        toaster.error({
          title: "Error",
          description:
            error instanceof Error ? error.message : "An error occurred",
        });
        //toast.error(`Error setting up request: ${error.message}`);
      }
    }

    return Promise.reject(error);
  }
);

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: async <T = any>(url: string): Promise<T> => {
    try {
      const { data } = await axiosInstance.get<T>(url);
      return data;
    } catch (error) {
      console.error("GET request failed:", error);
      throw error;
    }
  },

  post: async <TResponse = any, TBody = any>(url: string, body?: TBody): Promise<TResponse> => {
    try {
      const response = await axiosInstance.post<TResponse>(url, body);
      return response.data;
    } catch (error) {
      console.error("POST request failed:", error);
      throw error;
    }
  },

  put: async <TResponse = any, TBody = any>(url: string, body: TBody): Promise<TResponse> => {
    try {
      const response = await axiosInstance.put<TResponse>(url, body);
      return response.data;
    } catch (error) {
      console.error("PUT request failed:", error);
      throw error;
    }
  },

  patch: async <TResponse = any>(url: string): Promise<TResponse> => {
    try {
      const response = await axiosInstance.patch<TResponse>(url);
      return response.data;
    } catch (error) {
      console.error("PATCH request failed:", error);
      throw error;
    }
  },

  delete: async <TResponse = any>(url: string): Promise<TResponse> => {
    try {
      const response = await axiosInstance.delete<TResponse>(url);
      return response.data;
    } catch (error) {
      console.error("DELETE request failed:", error);
      throw error;
    }
  },
};

const SchoolInformationData = {
  list: () => requests.get<IData<ISchoolInfo>>("/school_informations"),
  update: (id: number, schoolInfo: ISchoolInfo) =>
    requests.put<ISchoolInfo>(`/school_informations?id=${id}`, schoolInfo),
  import: (schoolInfo: any) =>
    requests.post<any>("/school_informations/import_school_data", schoolInfo),
  // detail: (id: number) => requests.get<IData>(`/school_informations/${id}`),
  // create: (events: IConvention) =>
  //   requests.post<IConvention>("/events", events),
  // delete: (id: number) => requests.delete<string>(`/events/${id}`),
};

const transactions = {
  list: (params?: { filters?: string | string[] }) => {
    const query = new URLSearchParams();
    if (params?.filters) {
      const filters = Array.isArray(params.filters) ? params.filters : [params.filters];
      filters.forEach(f => {
        if (f) query.append("filters", f);
      });
    }
    const queryString = query.toString();
    return requests.get<IData<ITransaction>>(`/transactions${queryString ? `?${queryString}` : ""}`);
  },
  update: (id: number, transaction: ITransaction) =>
    requests.put<ITransaction>(`/transactions?id=${id}`, transaction),
  commitGenerateBill: (transaction: IGenerateBill[]) =>
    requests.post<IGenerateBill[]>(
      "/transactions/commit_generated_bills",
      transaction
    ),
  commitMultipleGeneratedBill: (transaction: string[]) =>
    requests.post<any>(
      "/transactions/generate_and_commit_multiple_bills",
      transaction
    ),
  generate_and_commit_bill: (programCode: string) =>
    requests.post(
      `/transactions/generate_and_commit_bills?programCode=${programCode}`
    ),
  commit_misc_bill: (miscellaneousFeeCode: string, facultyCode: string) =>
    requests.post(
      `/transactions/generate_and_commit_miscellaneous_bills?miscellaneousFeeCode=${miscellaneousFeeCode}&facultyCode=${facultyCode}`
    ),
  commit_credit_note_bill: (code: string) =>
    requests.post(`/transactions/commit_credit_notes?creditNoteCode=${code}`),

  generate_and_post_payment: (paymentDate: string) => {
    const formatedDate = moment(paymentDate).toJSON();
    return requests.post(`/erp/process_reciepts?paymentDate=${formatedDate}`);
  },
};

const countries = {
  list: () => requests.get<ICountriesResponse>("/countries"),
};
const students = {
  list: (params?: {
    page?: number;
    pageSize?: number;
    filter?: string;
    filters?: string | string[];
    search?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.search) {
      query.append("search", params.search);
    }
    query.append("page", params?.page?.toString() ?? "1");
    query.append("pageSize", params?.pageSize?.toString() ?? "50");

    if (params?.filters) {
      const filters = Array.isArray(params.filters)
        ? params.filters
        : [params.filters];
      filters.forEach((f) => {
        if (f) query.append("filters", f);
      });
    }

    if (params?.filter) {
      query.append("filter", params.filter);
    }

    return requests.get<IStudentResponse>(
      `/students?${query.toString()}&select=studentCode,firstName,middleName,lastName,streamName,classCode`
    );
  },
  listAll: (params?: { page?: number; pageSize?: number }) => {
  const query = new URLSearchParams({
    page: params?.page?.toString() ?? "1",
    pageSize: params?.pageSize?.toString() ?? "50",
  });
  return requests.get<IStudentResponse>(`/students`);
},
  postToErp: () => requests.post<any>(`/erp/customers/sync_customers`, null),
  fetchStudentFromApi: () =>
    requests.post<any>(`/students/sync_api_students`, null),
  listBy: (params: string | number) =>
    requests.get<IStudentResponse>(`/students?${params}`),
  import: (studentInfo: any) =>
    requests.post<any>("/students/import_students", studentInfo),


    unmatriculated_students: (params?: { page?: number; pageSize?: number }) => {
    const query = new URLSearchParams({
      page: params?.page?.toString() ?? "1",
      pageSize: params?.pageSize?.toString() ?? "50",
    });
    return requests.get<IData<IStudentResponse>>(
      `/invalid_students?${query.toString()}&select=studentCode,firstName,middleName,lastName,streamName`
    );
  },
};
const studentAccounts = {
  list: () => requests.get<IStudentAccountResponse>(`/student-accounts`),
  create: (studentAccount: IStudentAccount) =>
    requests.post<IStudentAccount>("/student-accounts", studentAccount),
};
const states = {
  getStateByCountryCode: (code: string) =>
    requests.get<IStateResponse>(`/states/get_state_by_country_code/${code}`),
};
const campus = {
  list: (params?: { page?: number; pageSize?: number }) => {
    const query = new URLSearchParams({
      page: params?.page?.toString() ?? "1",
      pageSize: params?.pageSize?.toString() ?? "50",
    });
    return requests.get<IData<ICampus>>(`/school_campuses?${query.toString()}`);
  },
  create: (campus: ICampus) =>
    requests.post<ICampus>("/school_campuses", campus),
  update: (id: number, campus: ICampus) =>
    requests.put<ICampus>(`/school_campuses?id=${id}`, campus),
  import: (campuses: any) =>
    requests.post<any>("/school_campuses/import", campuses),
};
const academicPrograms = {
  list: () => requests.get<IAcademicProgramsResponse>(`/academic_programs`),
  create: (academicProgram: IAcademicPrograms) =>
    requests.post<IAcademicPrograms>("/academic_programs", academicProgram),
  update: (id: number, academicProgram: IAcademicPrograms) =>
    requests.put<IAcademicPrograms>(
      `/academic_programs?id=${id}`,
      academicProgram
    ),
};
const academicFaculty = {
  list: (params?: { page?: number; pageSize?: number }) => {
    const query = new URLSearchParams({
      page: params?.page?.toString() ?? "1",
      pageSize: params?.pageSize?.toString() ?? "50",
    });
    return requests.get<IAcademicFacultyResponse>(
      `/academic_faculties?${query.toString()}`
    );
  },
  create: (academicFaculty: IAcademicFaculty) =>
    requests.post<IAcademicFaculty>("/academic_faculties", academicFaculty),
  update: (id: number, academicFaculty: IAcademicFaculty) =>
    requests.put<IAcademicFaculty>(
      `/academic_faculties?id=${id}`,
      academicFaculty
    ),
  import: (academicFaculties: any) =>
    requests.post<any>("/academic_faculties/import", academicFaculties),
};
const academicDepartments = {
  list: (params?: { page?: number; pageSize?: number }) => {
    const query = new URLSearchParams({
      page: params?.page?.toString() ?? "1",
      pageSize: params?.pageSize?.toString() ?? "50",
    });
    return requests.get<IAcademicDepartmentResponse>(
      `/academic_departments?${query.toString()}`
    );
  },
  create: (academicDepartment: IAcademicDepartment) =>
    requests.post<IAcademicDepartment>(
      "/academic_departments",
      academicDepartment
    ),
  update: (id: number, academicDepartment: IAcademicDepartment) =>
    requests.put<IAcademicDepartment>(
      `/academic_departments?id=${id}`,
      academicDepartment
    ),
  import: (academicDepartments: any) =>
    requests.post<any>("/academic_departments/import", academicDepartments),
};
const academicPosition = {
  list: () => requests.get<IData<IAcademicPosition>>(`/academic_positions`),
  create: (academicProgram: IAcademicPosition) =>
    requests.post<IAcademicPosition>("/academic_positions", academicProgram),
  update: (id: number, academicProgram: IAcademicPosition) =>
    requests.put<IAcademicPosition>(
      `/academic_positions?id=${id}`,
      academicProgram
    ),
  import: (academicPrograms: any) =>
    requests.post<any>("/academic_positions/import", academicPrograms),
};
const academicLevels = {
  list: (params?: { page?: number; pageSize?: number }) => {
    const query = new URLSearchParams({
      page: params?.page?.toString() ?? "1",
      pageSize: params?.pageSize?.toString() ?? "50",
    });
    return requests.get<IAcademicLevelResponse>(
      `/academic_levels?${query.toString()}`
    );
  },
  create: (academicLevel: IAcademicLevel) =>
    requests.post<IAcademicLevel>("/academic_levels", academicLevel),
  update: (id: number, academicLevel: IAcademicLevel) =>
    requests.put<IAcademicLevel>(`/academic_levels?id=${id}`, academicLevel),
  import: (academicLevels: any) =>
    requests.post<any>("/academic_levels/import", academicLevels),
};
const academicAward = {
  list: () => requests.get<IData<IAcademicAward>>(`/academic_awards`),
  create: (academicProgram: IAcademicAward) =>
    requests.post<IAcademicAward>("/academic_awards", academicProgram),
  update: (id: number, academicProgram: IAcademicAward) =>
    requests.put<IAcademicAward>(`/academic_awards?id=${id}`, academicProgram),
  import: (academicFaculties: any) =>
    requests.post<any>("/school_campuses/import", academicFaculties),
};
const academicSession = {
  list: () => requests.get<IAcademicSessionResponse>(`/sessions`),
  create: (academicProgram: IAcademicSession) =>
    requests.post<IAcademicSession>("/sessions", academicProgram),
  update: (id: number, academicProgram: IAcademicSession) =>
    requests.put<IAcademicSession>(`/sessions?id=${id}`, academicProgram),
};
const schoolEvent = {
  list: () => requests.get<ISchoolEventResponse>(`/school_event`),
  create: (academicProgram: ISchoolEvent) =>
    requests.post<ISchoolEvent>("/school_event", academicProgram),
  update: (id: number, academicProgram: ISchoolEvent) =>
    requests.put<ISchoolEvent>(`/school_event?id=${id}`, academicProgram),
};
const banks = {
  list: () => requests.get<IBankResponse>(`/banks`),
  create: (academicProgram: IBank) =>
    requests.post<IBank>("/banks", academicProgram),
  update: (id: number, academicProgram: IBank) =>
    requests.put<IBank>(`/banks?id=${id}`, academicProgram),
};

const erp = {
  sync_fee_plans: () => requests.get<any>(`/erp/ar_items/sync_fee_plan`),
  sync_misc_fee_plans: () => requests.get<any>(`/erp/ar_items/sync_miscellaneous_fees`),
  sync_customers: () =>
    requests.post<IErpSettings>(`/erp/customers/sync_customers`),

  post_invoices: (batchCode: string) =>
    requests.post<IErpSettings>(`/erp/post_invoice/${batchCode}`),

  postMultipleInvoice: (invoices: string[]) =>
    requests.post<any>(`/erp/post_multiple_invoice`, invoices),
  postInvoices: (invoices: string[]) =>
    requests.post<any>(`/erp/post_invoices`, invoices),

  process_receipts: () => requests.post<IErpSettings>(`/erp/process_receipts`),
  revert_invoice: (batchCodes: string[]) =>
    requests.post(`/transactions/revert_bills/`, batchCodes),
};

const erpSettings = {
  list: () => requests.get<IData<IErpSettings>>(`/erp_settings`),
  syncFeePlanToErp: () => requests.get<any>(`/erp/ar_items/sync_fee_plan`),
  defaultSettings: (code: string) =>
    requests.get<IData<any[]>>(
      `/erp_setting_defaults?filter=erpSettingCode=${code}`
    ),
  updateDefaultSettings: (defaultsettings: any) =>
    requests.put<IErpSettings>(
      `/erp_setting_defaults/update_defaults`,
      defaultsettings
    ),
  create: (data: IErpSettings) =>
    requests.post<IErpSettings>("/erp_settings", data),
  update: (id: number, data: IErpSettings) =>
    requests.put<IErpSettings>(`/erp_settings?id=${id}`, data),
  activateErp: (code: string) =>
    requests.patch<IErpSettings>(`/erp_settings/activate/${code}`),
};

const feeCategory = {
  list: (params?: { page?: number; pageSize?: number }) => {
    const query = new URLSearchParams({
      page: params?.page?.toString() ?? "1",
      pageSize: params?.pageSize?.toString() ?? "50",
    });
    return requests.get<IFeeCategoryResponse>(`/fee_categories?${query.toString()}`);
  },
  create: (feeCategory: IFeeCategory) =>
    requests.post<IFeeCategory>("/fee_categories", feeCategory),
  update: (id: number, feeCategory: IFeeCategory) =>
    requests.put<IFeeCategory>(`/fee_categories?id=${id}`, feeCategory),
  import: (feeCategories: any) =>
    requests.post<any>("/fee_categories/import", feeCategories),
};
const feeItem = {
  list: (params?: { page?: number; pageSize?: number }) => {
    const query = new URLSearchParams({
      page: params?.page?.toString() ?? "1",
      pageSize: params?.pageSize?.toString() ?? "50",
    });
    return requests.get<IFeeItemResponse>(`/fee_items?${query.toString()}`);
  },
  create: (feeItem: IFeeItem) => requests.post<IFeeItem>("/fee_items", feeItem),
  update: (id: number, feeItem: IFeeItem) =>
    requests.put<IFeeItem>(`/fee_items?id=${id}`, feeItem),
  import: (feeItems: any) => requests.post<any>("/fee_items/import", feeItems),
};
const feeSchedule = {
  list: (params?: { page?: number; pageSize?: number }) => {
    const query = new URLSearchParams({
      page: params?.page?.toString() ?? "1",
      pageSize: params?.pageSize?.toString() ?? "50",
    });
    return requests.get<IFeeScheduleResponse>(`/fee_plans?${query.toString()}`);
  },
  create: (feeSchedule: IFeeSchedule) =>
    requests.post<IFeeSchedule>("/fee_plans", feeSchedule),
  update: (id: number, feeSchedule: IFeeSchedule) =>
    requests.put<IFeeSchedule>(`/fee_plans?id=${id}`, feeSchedule),
  import: (feeSchedules: any) =>
    requests.post<any>("/fee_plans/import", feeSchedules),
  fetchFeeScheduleFromApi: () =>
    requests.post<any>(`/fee_plans/sync_api_fee_plans`, null),
};
const feePayment = {
  list: (params?: {
    orderBy?: string;
    orderDirection?: "Asc" | "Desc";
    academicDepartmentName?: string;
    pageSize?: number;
    page?: number;
  }) => {
    const query = new URLSearchParams({
      page: params?.page?.toString() ?? "1",
      pageSize: params?.pageSize?.toString() ?? "50",
      orderBy: params?.orderBy ?? "id",
      orderDirection: params?.orderDirection ?? "Desc",
    });

    if (params?.academicDepartmentName) {
      query.append(
        "filter",
        `academicDepartmentName==${params.academicDepartmentName}`
      );
    }

    return requests.get<IData<IFeePayment>>(
      `/fee_payments?${query.toString()}&select=studentCode,transactionReference,academicDepartmentName,academicProgramName,amount,balance,paymentDate,bankCode,posted`
    );
  },
  listByfilters: (params?: { filters?: string | string[] }) => {
    const query = new URLSearchParams();
    if (params?.filters) {
      const filters = Array.isArray(params.filters) ? params.filters : [params.filters];
      filters.forEach(f => {
        if (f) query.append("filters", f);
      });
    }
    const queryString = query.toString();
    return requests.get<IData<IFeePayment>>(`/fee_payments${queryString ? `?${queryString}` : ""}`);
  },
  
  create: (feePayment: IFeePayment) =>
    requests.post<IFeePayment>("/fee_payments", feePayment),
  update: (id: number, feePayment: IFeePayment) =>
    requests.put<IFeePayment>(`/fee_payments?id=${id}`, feePayment),
  import: (feePayments: any) =>
    requests.post<any>("/fee_payments/import", feePayments),
  pending_fee_payments: () =>
    requests.get<IData<IFeePayment>>(`/fee_payments?filter=paid=false`),
  // by_dates: () =>
  //   requests.get<IData<IFeePaymentByDate>>(`/fee_payments/by_dates`),

  by_dates: (params?: {
    orderBy?: string;
    orderDirection?: "Asc" | "Desc";
    academicDepartmentName?: string;
    pageSize?: number;
  }) => {
    const query = new URLSearchParams({
      page: "1",
      pageSize: params?.pageSize?.toString() ?? "50",
      // orderBy: params?.orderBy ?? "id",
      // orderDirection: params?.orderDirection ?? "Desc",
    });
    return requests.get<IData<IFeePaymentByDate>>(
      `/fee_payments/by_dates?${query.toString()}`
    );
  },
  fetchPaymentFromApi: () =>
    requests.post<any>(`/fee_payments/sync_api_student_payments`, null),



    unmatriculated_fee_payments: (params?: { page?: number; pageSize?: number }) => {
    const query = new URLSearchParams({
      page: params?.page?.toString() ?? "1",
      pageSize: params?.pageSize?.toString() ?? "50",
    });
    return requests.get<IData<IUnmatriculatedAcceptancePayment>>(
      `/invalid_fee_payments?${query.toString()}&select=studentCode,transactionReference,academicDepartmentName,academicProgramName,amount,balance,paymentDate,bankCode,posted`
    );
  },

};
const generateBill = {
  list: (params?: { page?: number; pageSize?: number }) => {
    const query = new URLSearchParams({
      page: params?.page?.toString() ?? "1",
      pageSize: params?.pageSize?.toString() ?? "50",
    });
    return requests.get<IGenerateBillResponse>(`/generate_bills?${query.toString()}`);
  },
  newList: (params?: { page?: number; pageSize?: number }) => {
      const query = new URLSearchParams({
        page: params?.page?.toString() ?? "1",
        pageSize: params?.pageSize?.toString() ?? "50",
      });
      return requests.get<IGenerateBillResponse>(`/academic_programs/billed_entries?${query.toString()}`);
  },
  listByFilter: (param: string) =>
    requests.get<IGenerateBillResponse>(`/generate_bills?${param}`),
  create: (Bearerill: IGenerateBill) =>
    requests.post<IGenerateBill>("/generate_bills", Bearerill),
  update: (id: number, Bearerill: IGenerateBill) =>
    requests.put<IGenerateBill>(`/generate_bills?id=${id}`, Bearerill),
};

const unbilledEntry = {
  list: (params?: { page?: number; pageSize?: number }) => {
    const query = new URLSearchParams({
      page: params?.page?.toString() ?? "1",
      pageSize: params?.pageSize?.toString() ?? "50",
    });
    return requests.get<{ content: IUnbilledEntry[]; hasError: boolean }>(
      `/academic_programs/unbilled_entries?${query.toString()}`
    );
  },
};

const miscellaneousFee = {
  list: (params?: { page?: number; pageSize?: number }) => {
    const query = new URLSearchParams({
      page: params?.page?.toString() ?? "1",
      pageSize: params?.pageSize?.toString() ?? "50",
    });
    return requests.get(
      `/miscellaneous_fees?${query.toString()}&select=miscellaneousFeeName,feeCategoryCode,amount,revenueAccount`
    );
  },
  create: (data: any) => requests.post("/miscellaneous_fees", data),
  update: (data: any) => requests.put("/miscellaneous_fees", data),
  getById: (id: string) => requests.get(`/miscellaneous_fees/${id}`),
  import: (fees: any) => requests.post<any>("/miscellaneous_fees/import", fees),
};

const miscellaneousBill = {
  list: (params?: { page?: number; pageSize?: number; filters?: string | string[] }) => {
    const query = new URLSearchParams({
      page: params?.page?.toString() ?? "1",
      pageSize: params?.pageSize?.toString() ?? "50",
    });

    if (params?.filters) {
      const filters = Array.isArray(params.filters) ? params.filters : [params.filters];
      filters.forEach(f => {
        if (f) query.append("filters", f);
      });
    }

    return requests.get<IMiscellaneousBillResponse>(
      `/miscellaneous_bills?${query.toString()}`
    );
  },
  grupedList: (params?: { page?: number; pageSize?: number }) => {
    const query = new URLSearchParams({
      page: params?.page?.toString() ?? "1",
      pageSize: params?.pageSize?.toString() ?? "50",
    });
    return requests.get<IMiscellaneousBillResponse>(
      `/miscellaneous_bills/grouped_miscellaneous_bills?${query.toString()}`
    );
  },
  // grupedList: () =>
  //   requests.get<IMiscellaneousBillResponse>(
  //     `/miscellaneous_bills/grouped_miscellaneous_bills`
  //   ),
  import: (bills: any) =>
    requests.post<any>("/miscellaneous_bills/import", bills),
  fetchMiscBillsFromApi: () =>
    requests.post<any>(
      `/miscellaneous_bills/sync_api_miscellaneous_bills`,
      null
    ),
};

const creditNote = {
  list: (params?: { page?: number; pageSize?: number; filters?: string | string[] }) => {
    const query = new URLSearchParams({
      page: params?.page?.toString() ?? "1",
      pageSize: params?.pageSize?.toString() ?? "50",
    });

    if (params?.filters) {
      const filters = Array.isArray(params.filters) ? params.filters : [params.filters];
      filters.forEach(f => {
        if (f) query.append("filters", f);
      });
    }

    return requests.get(`/credit_notes?${query.toString()}`);
  },
  grupedList: (params?: { page?: number; pageSize?: number }) => {
    const query = new URLSearchParams({
      page: params?.page?.toString() ?? "1",
      pageSize: params?.pageSize?.toString() ?? "50",
    });
    return requests.get(
      `/credit_notes/grouped_credit_notes?${query.toString()}`
    );
  },
  // grupedList: () => requests.get("/credit_notes/grouped_credit_notes"),
  import: (data: any) => requests.post("/credit_notes/import", data),
  fetchCreditNoteFromApi: () =>
    requests.post<any>(`/credit_notes/sync_api_credit_notes`, null),
};

export const notification = {
  list: (params?: { page?: number; pageSize?: number; isRead?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.pageSize) query.append("pageSize", params.pageSize.toString());
    if (params?.isRead !== undefined)
      query.append("isRead", params.isRead.toString());

    return requests.get<INotificationResponse>(
      `/notifications?${query.toString()}`
    );
  },
  markAsRead: (id: number) =>
    requests.put(`/notifications/${id}/mark-as-read`, {}),
  markAllAsRead: () => requests.put("/notifications/mark-all-as-read", {}),
  import: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return requests.post("/notifications/import", formData);
  },
};

const revertBill = {
  list: (params?: { page?: number; pageSize?: number }) => {
    const query = new URLSearchParams({
      page: params?.page?.toString() ?? "1",
      pageSize: params?.pageSize?.toString() ?? "50",
    });
    return requests.get<IRevertBillResponse>(`/transaction_batches?${query.toString()}`);
  },
  create: (academicProgram: IRevertBill) =>
    requests.post<IRevertBill>("/revert_bills", academicProgram),
  update: (id: number, academicProgram: IRevertBill) =>
    requests.put<IRevertBill>(`/revert_bills?id=${id}`, academicProgram),
};
const postBill = {
  list: (params?: { page?: number; pageSize?: number }) => {
    const query = new URLSearchParams({
      page: params?.page?.toString() ?? "1",
      pageSize: params?.pageSize?.toString() ?? "50",
    });
    return requests.get<IPostBillResponse>(`/transaction_batches?${query.toString()}`);
  },
  create: (batchCode: string) =>
    requests.post<null>(`/erp/post_invoice/${batchCode}`, null),

  // postInvoices: (batchCode: string) =>
  //   requests.post<null>(`/erp/post_invoices/${batchCode}`, null),

  update: (id: number, academicProgram: IPostBill) =>
    requests.put<IPostBill>(`/post_bills?id=${id}`, academicProgram),
};
const feeAccount = {
  list: () => requests.get<IData<IFeeAccount>>(`/fee_accounts`),
  create: (academicProgram: IFeeAccount) =>
    requests.post<IFeeAccount>("/fee_accounts", academicProgram),
  update: (id: number, academicProgram: IFeeAccount) =>
    requests.put<IFeeAccount>(`/fee_accounts?id=${id}`, academicProgram),
};
const scholarship = {
  list: () => requests.get<IScholarshipResponse>(`/application_scholarships`),
  create: (scholarship: IScholarship) =>
    requests.post<IScholarship>("/application_scholarships", scholarship),
  update: (id: number, scholarship: IScholarship) =>
    requests.put<IScholarship>(
      `/application_scholarships?id=${id}`,
      scholarship
    ),
};
const courseFormat = {
  list: () => requests.get<ICourseFormatResponse>(`/academic_course_formats`),
  create: (courseFormat: ICourseFormat) =>
    requests.post<ICourseFormat>("/academic_course_formats", courseFormat),
  update: (id: number, courseFormat: ICourseFormat) =>
    requests.put<ICourseFormat>(
      `/academic_course_formats?id=${id}`,
      courseFormat
    ),
};
const courseType = {
  list: () =>
    requests.get<ICourseTypeResponse>(`/academic_course_requirement_types`),
  create: (courseType: ICourseType) =>
    requests.post<ICourseType>(
      "/academic_course_requirement_types",
      courseType
    ),
  update: (id: number, courseType: ICourseType) =>
    requests.put<ICourseType>(
      `/academic_course_requirement_types?id=${id}`,
      courseType
    ),
};
const studentAccount = {
  list: () =>
    requests.get<IStudentAccountResponse>(`/student-accounts`),
  overPayment: () =>
    requests.get<IStudentAccountResponse>(`/student-accounts/excess-payments`),
  monthlyJournalBatch: () =>
    requests.get<IMonthlyJournalBatchResponse>(`/student-accounts/excess-payments/grouped`),
  commitMonthlyJournalBatch: (month: number, year: number,sessionCode: string) =>
    requests.post(
      `/student-accounts/create-and-commit-gl-journal-batch?month=${month}&year=${year}&sessionCode=${sessionCode}`
    ),    
    revertMonthlyJournalBatch: (batchCode:string) =>
    requests.delete<IApiResponse>(
      `/student-accounts/revert-gl-journal-batch/${batchCode}`
    ),
  create: (studentAccount: IStudentAccount) =>
    requests.post<IStudentAccount>(
      "/student-accounts",
      studentAccount
    ),
  update: (id: number, studentAccount: IStudentAccount) =>
    requests.put<IStudentAccount>(
      `/student-accounts?id=${id}`,
      studentAccount
    ),
};
const glJournalBatch = {
  list: () =>
    requests.get<IGLJournalBatchResponse>(`/gl-journal-batches`),
  postglBatches: (batchCodes: string[]) => requests.post<IApiResponse, string[]>(`/erp/post_gl_journal_batches`, batchCodes),
};

const apiHandler = {
  students,
  studentAccount,
  glJournalBatch,
  SchoolInformationData,
  transactions,
  countries,
  states,
  campus,
  academicPrograms,
  academicFaculty,
  academicDepartments,
  academicPosition,
  academicLevels,
  academicAward,
  academicSession,
  schoolEvent,
  banks,
  erp,
  erpSettings,
  feeCategory,
  feeItem,
  feeSchedule,
  feePayment,
  generateBill,
  unbilledEntry,
  revertBill,
  postBill,
  feeAccount,
  scholarship,
  courseFormat,
  courseType,
  miscellaneousBill,
  miscellaneousFee,
  creditNote,
  notification,
};

export default apiHandler;

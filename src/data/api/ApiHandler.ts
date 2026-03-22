import axios, { AxiosError, AxiosResponse } from "axios";
import { IErpSettings, IErpSettingsResponse } from "../interface/IErpSettings";
import { INotificationResponse } from "../interface/INotification";
import { toaster } from "@/components/ui/chakra-toaster";
import { IApiResponse } from "../interface/IApiResponse";
import { IMenu } from "../sidebar-data";
import { getSession } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session && (session as any).accessToken) {
    config.headers.Authorization = `Bearer ${(session as any).accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase();
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

const users = {
  list: () => requests.get<IApiResponse<IUser>>(`/users`),
  get_by_id: (id: string) => requests.get<IApiResponse<IUser>>(`/users?id=${id}`),
  create: (data: IUser) =>
    requests.post<IUser>("/users", data),
  update: (id: string, data: IUser) =>
    requests.put<IUser>(`/users?id=${id}`, data),
};

// const countries = {
//   list: () => requests.get<ICountriesResponse>("/countries"),
// };

// const states = {
//   getStateByCountryCode: (code: string) =>
//     requests.get<IStateResponse>(`/states/get_state_by_country_code/${code}`),
// };

const erpSettings = {
  list: () => requests.get<IApiResponse<IErpSettings>>(`/erp_settings`),
  syncFeePlanToErp: () => requests.get<any>(`/erp/ar_items/sync_fee_plan`),
  defaultSettings: (code: string) =>
    requests.get<IApiResponse<any[]>>(
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

const menus = {
  list: () => requests.get<IApiResponse<IMenu[]>>(`/menus`),
  create: (data: IMenu) =>
    requests.post<IMenu>("/menus", data),
  my_menus: () =>
    requests.get<IApiResponse<IMenu[]>>(`/menus/my-menus`),
};

const notification = {
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

const dashboard = {
  getSummary: () => requests.get<any>(`/dashboardsummaries`),
  getActivities: (params?: { page?: number; pageSize?: number; orderBy?: string; orderDirection?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.pageSize) query.append("pageSize", params.pageSize.toString());
    if (params?.orderBy) query.append("orderBy", params.orderBy);
    if (params?.orderDirection !== undefined) query.append("orderDirection", params.orderDirection);
    return requests.get<any>(`/activities?${query.toString()}`);
  },
  getLowStockItems: (params?: { page?: number; pageSize?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.pageSize) query.append("pageSize", params.pageSize.toString());
    query.append("lowStock", "true");
    return requests.get<any>(`/items?${query.toString()}`);
  }
};

const apiHandler = {
  users,
  menus,
  // countries,
  // states,
  erpSettings,
  notification,
  dashboard,
};

export default apiHandler;

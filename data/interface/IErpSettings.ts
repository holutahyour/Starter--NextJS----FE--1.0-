export interface IErpSettings {
  id?: number;
  code?: string;
  name: string;
  erpType?: string;
  baseUrl?: string;
  isActivated?: boolean;
  description: string;
}

export interface IErpSettingsResponse {
  content: IErpSettings[];
}

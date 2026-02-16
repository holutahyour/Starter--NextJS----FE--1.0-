export interface ICampus {
  stateName?: string;
  countryName?: string;
  id: number;
  code?: string;
  name: string;
  logo?: string;
  address: string;
  address2?: string;
  city: string;
  stateCode: string;
  countryCode: string;
  email: string;
  facebook?: string;
  twitter?: string;
  skype?: string;
  website?: string;
  postalCode?: string;
  phoneNumber: string;
  briefDescription: string;
}

export interface IData {
  content: ICampus[];
}

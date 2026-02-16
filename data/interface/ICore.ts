export interface ICountries {
  id: number;
  code: string;
  name: string;
  capital: string;
  currency: string;
  flag: string;
  phoneCode: string;
  timeZone: string;
  continent: string;
  latitude: string;
  longitude: string;
  googleMaps: string;
}

export interface ICountriesResponse {
  content: ICountries[];
}

export interface IState {
  countryName: string;
  id: number;
  code: string;
  name: string;
  capital: string;
  countryCode: string;
  abbreviation: string;
  area: string;
  population: string;
}

export interface IStateResponse {
  content: IState[];
}

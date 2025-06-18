export interface Country {
  id: number;
  name: string;
}

export interface Province {
  id: number;
  name: string;
  country: Country;
}

export interface City {
  id: number;
  name: string;
  province: Province;
}

export interface Person {
  id: number;
  name: string;
  email: string;
  birthDate: Date;
  city: City;
}
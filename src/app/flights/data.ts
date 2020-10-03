import * as moment from 'moment';

export enum CityEnum {
  Berlin = 'Berlin',
  Paris = 'Paris',
  Dortmund = 'Dortmund'
}

export interface Flight {
  id: number;
  direct: boolean;
  origin: CityEnum;
  destination: CityEnum;
  price: number;
  parts?: any[];
  stations: number;
  length: number;
  date: string;
}

export interface City {
  id: CityEnum;
  name: string;
}

export const cities: City[] = [
  {id: CityEnum.Berlin, name: 'Berlin'},
  {id: CityEnum.Paris, name: 'Paris'},
  {id: CityEnum.Dortmund, name: 'Dortmund'}
];

export interface FlightsFilterRequestDto {
  origin: CityEnum;
  destination: CityEnum;
  startDate: any;
  endDate: any;
  priceFrom: number;
  priceTo: number;
  direct: boolean;
  connections: number;
}

export const flights: Flight[] = [
  {
    id: 1,
    direct: true,
    origin: CityEnum.Berlin,
    destination: CityEnum.Paris,
    price: 100,
    stations: 0,
    length: 3,
    date: moment().add(4, 'hours').toISOString()
  },
  {
    id: 2,
    direct: false,
    origin: CityEnum.Berlin,
    destination: CityEnum.Paris,
    price: 150,
    parts: [3, 4],
    stations: 1,
    length: 6,
    date: moment().add(6, 'hours').toISOString()
  },
  {
    id: 3,
    direct: true,
    origin: CityEnum.Berlin,
    destination: CityEnum.Dortmund,
    price: 75,
    stations: 0,
    length: 2,
    date: moment().add(6, 'hours').toISOString()
  },
  {
    id: 4,
    direct: true,
    origin: CityEnum.Dortmund,
    destination: CityEnum.Paris,
    price: 75,
    stations: 0,
    length: 2,
    date: moment().add(9, 'hours').toISOString()
  },
  {
    id: 5,
    direct: true,
    origin: CityEnum.Berlin,
    destination: CityEnum.Paris,
    price: 50,
    stations: 0,
    length: 3,
    date: moment().add(1, 'days').toISOString()
  },
  {
    id: 6,
    direct: true,
    origin: CityEnum.Berlin,
    destination: CityEnum.Paris,
    price: 80,
    stations: 0,
    length: 2.5,
    date: moment().add(2, 'days').toISOString()
  },
];
